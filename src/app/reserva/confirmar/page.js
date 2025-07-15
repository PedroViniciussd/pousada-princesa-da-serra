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
import { db } from "@/firebase";

export default function ConfirmarPagamentoPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-[#0F0A0B] px-4 py-10">
      <div className="w-full max-w-md bg-[#0F0A0B] border border-[#FDD678] p-6 sm:p-8 rounded-2xl shadow-md text-white text-center">
        {/* Logo da pousada */}
        <div className="flex justify-center mb-6">
          <img
            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-princesa-da-serra.06ebfeab.png&w=256&q=75"
            alt="Logo Pousada Princesa da Serra"
            width={120}
            height={50}
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold mb-6">Confirmação de Pagamento</h1>

        {!confirmado ? (
          <>
            <p className="mb-6">Clique abaixo para confirmar seu pagamento no sistema.</p>
            <button
              onClick={confirmarPagamento}
              disabled={loading}
              className="w-full px-3 py-3 rounded text-black font-bold bg-[#FFD675] hover:bg-[#f1c85f] transition"
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
              rel="noopener noreferrer"
              className="block mt-4 w-full px-3 py-3 rounded text-black font-bold bg-[#FFD675] hover:bg-[#f1c85f] transition"
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
