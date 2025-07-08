import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  const body = await req.json();

  // Confirmar evento do PagSeguro (exemplo com "ORDER.PAID")
  if (body?.event === "ORDER.PAID") {
    const referenceId = body.data?.reference_id;

    if (referenceId) {
      await addDoc(collection(db, "pagamentosConfirmados"), {
        referenceId,
        status: "pago",
        recebidoEm: new Date(),
      });
      console.log("Pagamento confirmado:", referenceId);
    }
  }

  return NextResponse.json({ ok: true });
}
