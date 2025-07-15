import { NextResponse } from "next/server";

// Função para validar CPF de verdade (cálculo dos dígitos verificadores)
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigito = (pos) => {
    let soma = 0;
    for (let i = 0; i < pos - 1; i++) {
      soma += parseInt(cpf.charAt(i)) * (pos - i);
    }
    let res = (soma * 10) % 11;
    return res === 10 ? 0 : res;
  };

  const digito1 = calcDigito(10);
  const digito2 = calcDigito(11);

  return digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10));
}

export async function POST(req) {
  try {
    const body = await req.json();
    let {
      nome,
      email,
      cpf,
      formaPagamento,
      parcelas = 1,
      referenceId,
      quartosSelecionados,
      dias,
    } = body;

    if (!["pix", "credito", "debito"].includes(formaPagamento)) {
      return NextResponse.json(
        { error: "Forma de pagamento inválida." },
        { status: 400 }
      );
    }

    if (!Array.isArray(quartosSelecionados) || quartosSelecionados.length === 0) {
      return NextResponse.json(
        { error: "Nenhum quarto selecionado para pagamento." },
        { status: 400 }
      );
    }

    if (!dias || isNaN(dias) || dias < 1) {
      return NextResponse.json(
        { error: "Número de diárias inválido." },
        { status: 400 }
      );
    }

    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11 || !validarCPF(cpfLimpo)) {
      return NextResponse.json(
        { error: "CPF inválido." },
        { status: 400 }
      );
    }

    if (!referenceId) {
      referenceId = Date.now().toString();
    }

    const parcelasValidas = formaPagamento === "credito" ? Math.min(parcelas, dias) : 1;

    const items = quartosSelecionados.map((quarto) => ({
      name: quarto.nome,
      quantity: quarto.quantidade,
      unit_amount: Math.round(quarto.preco * dias * 100),
    }));

    let payment_method = {};
    if (formaPagamento === "pix") {
      payment_method = { type: "PIX" };
    } else if (formaPagamento === "credito") {
      payment_method = { type: "CREDIT_CARD", installments: parcelasValidas, capture: true };
    } else if (formaPagamento === "debito") {
      payment_method = { type: "DEBIT_CARD", capture: true };
    }

    // Corpo do pedido para o PagSeguro
    const payload = {
      reference_id: referenceId,
      customer: {
        name: nome,
        email: email,
        tax_id: cpfLimpo,
      },
      customer_modifiable: true,
      items,
      payment_methods: [payment_method],
      notification_urls: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`],
      payment_notification_urls: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`],
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reserva/confirmar?ref=${referenceId}`,
    };

    // Log para documentação (request)
    console.log("📤 [PagSeguro] REQUEST Payload:\n", JSON.stringify(payload, null, 2));

    const response = await fetch("https://sandbox.api.pagseguro.com/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAGSEGURO_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    // Log para documentação (response)
    console.log("📥 [PagSeguro] RESPONSE:\n", responseText);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro na resposta do PagSeguro", detalhes: responseText },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);

    const payLinkObj = data.links?.find((link) => link.rel === "PAY");
    const payLink = payLinkObj ? payLinkObj.href : null;

    return NextResponse.json({ url: payLink, reference_id: referenceId });
  } catch (err) {
    console.error("Erro ao criar pagamento:", err);
    return NextResponse.json(
      { error: "Erro ao criar pagamento", detalhes: err.message },
      { status: 500 }
    );
  }
}
