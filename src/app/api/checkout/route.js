import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const { nome, email, cpf, valorTotal, formaPagamento, referenceId } = body;

    const response = await fetch("https://sandbox.api.pagseguro.com/orders", {
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
        items: [
          {
            name: "Reserva na pousada",
            quantity: 1,
            unit_amount: Math.round(valorTotal * 100),
          },
        ],
        charges: [
          {
            payment_method: {
              type:
                formaPagamento === "pix"
                  ? "PIX"
                  : formaPagamento === "credito"
                  ? "CREDIT_CARD"
                  : "DEBIT_CARD",
            },
          },
        ],
        notification_urls: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`],
      }),
    });

    const data = await response.json();
    console.log("Resposta PagSeguro:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || "Erro na resposta do PagSeguro" },
        { status: response.status }
      );
    }

    // Se for PIX, retorna o QR code
    if (data?.charges?.[0]?.payment_method?.type === "PIX") {
      return NextResponse.json({
        qr_code: data.charges[0].payment_method.qr_code_url,
        reference_id: referenceId,
      });
    }

    // Para outros métodos, tenta pegar a URL de checkout para redirecionar
    const redirectUrl =
      data?.checkout_url || data?.charges?.[0]?.payment_method?.redirect_url;

    if (redirectUrl) {
      return NextResponse.json({ url: redirectUrl, reference_id: referenceId });
    }

    // Caso nenhum dos casos anteriores ocorra, retorno erro
    console.error("Resposta inesperada do PagSeguro:", data);
    return NextResponse.json(
      { error: "Resposta inesperada do PagSeguro" },
      { status: 500 }
    );
  } catch (err) {
    console.error("Erro ao criar pagamento:", err);
    return NextResponse.json(
      { error: "Erro ao criar pagamento" },
      { status: 500 }
    );
  }
}
