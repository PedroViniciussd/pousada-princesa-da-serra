import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const { nome, email, cpf, valorTotal, formaPagamento, referenceId } = body;

  try {
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

    if (data?.charges?.[0]?.payment_method?.type === "PIX") {
      return NextResponse.json({
        qr_code: data.charges[0].payment_method.qr_code_url,
        reference_id: referenceId,
      });
    }

    const redirectUrl =
      data?.checkout_url || data?.charges?.[0]?.payment_method?.redirect_url;

    return NextResponse.json({ url: redirectUrl, reference_id: referenceId });
  } catch (err) {
    console.error("Erro ao criar pagamento:", err);
    return NextResponse.json(
      { error: "Erro ao criar pagamento" },
      { status: 500 }
    );
  }
}
