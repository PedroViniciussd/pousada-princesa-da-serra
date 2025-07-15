"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../../firebase";

export default function ConfirmarPagamentoClient() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [loading, setLoading] = useState(false);
  const [reserva, setReserva] = useState(null);
  const [confirmado, setConfirmado] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const confirmarPagamento = async () => {
    if (!ref) {
      setMensagem("Código de referência não encontrado.");
      return;
    }

    setLoading(true);
    try {
      const reservasRef = collection(db, "reservas");
      const q = query(reservasRef, where("referenceId", "==", ref));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMensagem("Reserva não encontrada.");
        setLoading(false);
        return;
      }

      const reservaDoc = snapshot.docs[0];
      const dados = reservaDoc.data();
      setReserva(dados);

      await updateDoc(doc(db, "reservas", reservaDoc.id), {
        status: "confirmado",
        atualizadoEm: Timestamp.now(),
      });

      setConfirmado(true);
      setMensagem("✅ Pagamento confirmado com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      setMensagem("Erro ao confirmar o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const gerarLinkWhatsApp = () => {
    if (!reserva) return "#";

    const { nome, telefone, email, cpf, checkin, checkout, quantidadePessoas, quartos, valorTotal } = reserva;

    const checkinStr = new Date(checkin.seconds * 1000).toLocaleDateString("pt-BR");
    const checkoutStr = new Date(checkout.seconds * 1000).toLocaleDateString("pt-BR");

    const dias = Math.max(
      1,
      (new Date(checkout.seconds * 1000) - new Date(checkin.seconds * 1000)) / (1000 * 60 * 60 * 24)
    );

    const listaQuartos = quartos
      .map((q) => `- ${q.quantidade}x ${q.nome}`)
      .join("\n");

    const msg = `
🔔 *Nova Reserva de Quarto*

👤 Nome: ${nome}
📞 Telefone/WhatsApp: ${telefone}
📧 E-mail: ${email}
🆔 CPF: ${cpf}

🏨 Quartos:
${listaQuartos}
👥 Pessoas: ${quantidadePessoas}
📆 Check-in: ${checkinStr}
📆 Check-out: ${checkoutStr}
📅 Diárias: ${dias}
💰 Valor Total: R$ ${valorTotal.toFixed(2).replace(".", ",")}
    `.trim();

    const telDestino = "5531984573455";
    return `https://wa.me/${telDestino}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0A0B] px-4 py-12">
      <img
        src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-princesa-da-serra.06ebfeab.png&w=256&q=75"
        alt="Logo Pousada Princesa da Serra"
        className="object-contain mb-8"
        style={{ width: 140, height: "auto" }}
      />

      <div className="max-w-md w-full bg-[#0F0A0B] p-8 rounded-2xl shadow-md border border-[#FDD678] text-center text-white">
        <h1 className="text-2xl font-bold mb-6">Confirmação de Pagamento</h1>

        {!confirmado ? (
          <>
            <p className="mb-6">Clique abaixo para confirmar seu pagamento no sistema.</p>
            <button
              onClick={confirmarPagamento}
              disabled={loading}
              className="w-full bg-[#FFD675] text-black px-3 py-3 rounded font-semibold"
            >
              {loading ? "Confirmando..." : "Confirmar Pagamento"}
            </button>
          </>
        ) : (
          <>
            <p className="text-green-400 font-semibold mb-6">{mensagem}</p>
            <a
              href={gerarLinkWhatsApp()}
              target="_blank"
              className="block mt-4 w-full bg-[#FFD675] text-black px-3 py-3 rounded font-semibold"
            >
              Enviar dados via WhatsApp
            </a>
          </>
        )}

        {mensagem && !confirmado && (
          <p className="mt-4 text-red-500 font-medium">{mensagem}</p>
        )}
      </div>
    </div>
  );
}
