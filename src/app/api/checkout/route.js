import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
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

    // Limita parcelas máximas ao número de diárias para crédito
    const parcelasValidas =
      formaPagamento === "credito"
        ? Math.min(parcelas, dias)
        : 1;

    // Monta items com preço * quantidade * diárias (em centavos)
    const items = quartosSelecionados.map((quarto) => ({
      name: quarto.nome,
      quantity: quarto.quantidade,
      unit_amount: Math.round(quarto.preco * dias * 100),
    }));

    // Define o método de pagamento
    let payment_method = {};
    if (formaPagamento === "pix") {
      payment_method = { type: "PIX" };
    } else if (formaPagamento === "credito") {
      payment_method = {
        type: "CREDIT_CARD",
        installments: parcelasValidas,
        capture: true,
      };
    } else if (formaPagamento === "debito") {
      payment_method = {
        type: "DEBIT_CARD",
        capture: true,
      };
    }

    const response = await fetch("https://api.pagseguro.com/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAGSEGURO_TOKEN}`,
      },
      body: JSON.stringify({
        reference_id: referenceId,
        customer: {
          name: nome,
          email: email,
          tax_id: cpf.replace(/\D/g, ""),
        },
        customer_modifiable: true,
        items,
        payment_methods: [payment_method],
        notification_urls: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`],
        payment_notification_urls: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`],
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reserva?success=true`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erro no PagSeguro:", data);
      return NextResponse.json(
        { error: "Erro na resposta do PagSeguro", detalhes: data },
        { status: response.status }
      );
    }

    const payLinkObj = data.links?.find((link) => link.rel === "PAY");
    const payLink = payLinkObj ? payLinkObj.href : null;

    if (payLink) {
      return NextResponse.json({
        url: payLink,
        reference_id: referenceId,
      });
    }

    return NextResponse.json(
      { error: "Resposta inesperada do PagSeguro", detalhes: data },
      { status: 500 }
    );
  } catch (err) {
    console.error("Erro ao criar pagamento:", err);
    return NextResponse.json(
      { error: "Erro ao criar pagamento", detalhes: err.message },
      { status: 500 }
    );
  }
}
