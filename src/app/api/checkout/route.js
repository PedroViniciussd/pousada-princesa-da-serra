import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const { nome, email, cpf, valorTotal, formaPagamento, referenceId } = body;

    // Por enquanto, só tratamos o PIX
    if (formaPagamento !== "pix") {
      return NextResponse.json(
        { error: "Apenas pagamento via PIX está disponível no momento." },
        { status: 400 }
      );
    }

    const response = await fetch("https://sandbox.api.pagseguro.com/checkouts", {
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
        items: [
          {
            name: "Reserva na pousada",
            quantity: 1,
            unit_amount: Math.round(valorTotal * 100),
          },
        ],
        payment_methods: [
          {
            type: "PIX",
          },
        ],
        notification_urls: [
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`
        ],
        payment_notification_urls: [
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`
        ],
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reserva?success=true`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro na resposta do PagSeguro", detalhes: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      url: data.checkout_url,
      reference_id: referenceId,
    });
  } catch (err) {
    console.error("Erro ao criar pagamento:", err);
    return NextResponse.json(
      { error: "Erro ao criar pagamento", detalhes: err.message },
      { status: 500 }
    );
  }
}
