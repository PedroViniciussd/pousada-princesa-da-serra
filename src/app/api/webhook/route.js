import { NextResponse } from "next/server";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Webhook recebido:", JSON.stringify(body));

    const event = body?.event;
    const data = body?.data || {};
    const referenceId = data.reference_id;

    if (!event || !referenceId) {
      console.error("Payload inválido no webhook:", body);
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    // Buscar reservas com esse referenceId
    const reservasRef = collection(db, "reservas");
    const q = query(reservasRef, where("referenceId", "==", referenceId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
    }

    // Define novo status baseado no evento
    let novoStatus = null;
   if (event === "CHECKOUT.ORDER.PAID" || event === "ORDER.PAID") {
      novoStatus = "confirmado";
    } else if (event === "ORDER.CANCELED") {
      novoStatus = "cancelado";
    } else {
      // Pode ignorar ou tratar outros eventos
      return NextResponse.json({ message: "Evento não tratado" });
    }

    // Atualiza todas as reservas encontradas (normalmente só uma)
    for (const docSnap of querySnapshot.docs) {
      await updateDoc(doc(db, "reservas", docSnap.id), {
        status: novoStatus,
        atualizadoEm: Timestamp.now(),
      });
    }

    console.log(`Reserva(s) com referenceId ${referenceId} atualizada(s) para status: ${novoStatus}`);

    return NextResponse.json({ message: "Status atualizado com sucesso" });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
