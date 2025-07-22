"use client";

import { useState } from "react";

export default function ConfirmarPagamentoClient() {
  const [nomeDigitado, setNomeDigitado] = useState("");

  // Número do WhatsApp da pousada (com DDD, sem símbolos)
  const telefonePousada = "5531984573455";

  // Mensagem que vai para o WhatsApp, usando o nome digitado
  const gerarMensagemWhatsApp = () => {
    return `Olá, meu nome é ${nomeDigitado.trim()} e gostaria de confirmar a minha reserva na Pousada Princesa da Serra.`;
  };

  // Link do WhatsApp com a mensagem
  const gerarLinkWhatsApp = () => {
    const mensagem = gerarMensagemWhatsApp();
    return `https://wa.me/${telefonePousada}?text=${encodeURIComponent(mensagem)}`;
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
        <h1 className="text-2xl font-bold mb-6">Confirmação de Reserva</h1>

        <p className="mb-4">Digite seu nome completo para confirmar a reserva:</p>
        <input
          type="text"
          value={nomeDigitado}
          onChange={(e) => setNomeDigitado(e.target.value)}
          placeholder="Seu nome completo"
          className="w-full p-2 rounded border border-[#FFD675] bg-[#1a1416] text-white mb-6"
        />

        <a
          href={nomeDigitado.trim() ? gerarLinkWhatsApp() : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full px-3 py-3 rounded font-semibold block text-center ${
            nomeDigitado.trim()
              ? "bg-[#FFD675] text-black cursor-pointer"
              : "bg-gray-600 text-gray-400 cursor-not-allowed pointer-events-none"
          }`}
          aria-disabled={!nomeDigitado.trim()}
        >
          Confirmar Reserva via WhatsApp
        </a>
      </div>
    </div>
  );
}
