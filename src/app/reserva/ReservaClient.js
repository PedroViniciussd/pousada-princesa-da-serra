"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ReCAPTCHA from "react-google-recaptcha";

function usePagamentoConfirmado(referenceId) {
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    if (!referenceId) return;

    const pagamentosRef = collection(db, "pagamentosConfirmados");
    const q = query(pagamentosRef, where("referenceId", "==", referenceId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setConfirmado(!snapshot.empty);
    });

    return () => unsubscribe();
  }, [referenceId]);

  return confirmado;
}

export default function ReservaClient() {
  const searchParams = useSearchParams();

  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");
  const quantidadePessoas = searchParams.get("pessoas");
  const quartosParam = searchParams.get("quartos");

  const [captchaValido, setCaptchaValido] = useState(false);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  const quartosSelecionados = useMemo(() => {
    try {
      const data = JSON.parse(quartosParam);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }, [quartosParam]);

  const dias = useMemo(() => {
    const start = new Date(checkin || "");
    const end = new Date(checkout || "");
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, diff);
  }, [checkin, checkout]);

  const valorTotal = useMemo(() => {
    return quartosSelecionados.reduce((total, quarto) => {
      const preco = parseFloat(quarto.preco) || 0;
      const quantidade = parseInt(quarto.quantidade) || 0;
      return total + preco * quantidade * dias;
    }, 0);
  }, [quartosSelecionados, dias]);

  const [referenceId] = useState(() => Date.now().toString());

  const pagamentoConfirmado = usePagamentoConfirmado(referenceId);

  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [parcelas, setParcelas] = useState(1);
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePagamento = async () => {
        if (!captchaValido) {
      alert("Por favor, verifique o reCAPTCHA.");
      return;
    }

    if (!form.nome || !form.email || !form.cpf || !form.telefone) {
      alert("Por favor, preencha todos os dados.");
      return;
    }

    setLoadingPagamento(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          cpf: form.cpf,
          formaPagamento,
          parcelas: formaPagamento === "credito" ? parcelas : 1,
          referenceId,
          quartosSelecionados,
          dias,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao iniciar pagamento.");
        console.error("Resposta do backend:", data);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else if (data.qr_code) {
        window.open(data.qr_code, "_blank");
      } else {
        alert("Resposta inesperada do backend.");
        console.error("Resposta inesperada:", data);
      }
    } catch (error) {
      alert("Erro ao processar pagamento.");
      console.error("Erro no handlePagamento:", error);
    } finally {
      setLoadingPagamento(false);
    }
  };

  const handleReservar = async () => {
    if (!pagamentoConfirmado) {
      alert(
        "Aguarde a confirmação do pagamento para prosseguir com a reserva."
      );
      return;
    }

    try {
      const [anoCheckin, mesCheckin, diaCheckin] = checkin.split("-").map(Number);
      const [anoCheckout, mesCheckout, diaCheckout] = checkout
        .split("-")
        .map(Number);

      const checkinDate = new Date(anoCheckin, mesCheckin - 1, diaCheckin, 12);
      const checkoutDate = new Date(anoCheckout, mesCheckout - 1, diaCheckout, 12);

      await addDoc(collection(db, "reservas"), {
        checkin: Timestamp.fromDate(checkinDate),
        checkout: Timestamp.fromDate(checkoutDate),
        quantidadePessoas: Number(quantidadePessoas),
        quartos: quartosSelecionados,
        status: "confirmado",
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        cpf: form.cpf,
        valorTotal,
        criadoEm: Timestamp.now(),
        referenceId,
      });

      const listaQuartosTexto = quartosSelecionados
        .map((q) => `- ${q.quantidade}x ${q.nome}`)
        .join("\n");

      const mensagem = `
🔔 *Nova Reserva de Quarto*

👤 Nome: ${form.nome}
📞 Telefone/WhatsApp: ${form.telefone}
📧 E-mail: ${form.email}
🆔 CPF: ${form.cpf}

🏨 Quartos:
${listaQuartosTexto}
👥 Pessoas: ${quantidadePessoas}
📆 Check-in: ${checkin}
📆 Check-out: ${checkout}
📅 Diárias: ${dias}
💰 Valor Total: R$ ${valorTotal.toFixed(2).replace(".", ",")}
      `.trim();

      const telDestino = "5531984573455";
      const url = `https://wa.me/${telDestino}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    } catch (error) {
      alert("Erro ao registrar reserva. Tente novamente.");
      console.error("Erro ao salvar reserva:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-12 text-[#0f0a0b]">
        <h2 className="text-4xl font-bold mb-4">Finalizar Reserva</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Resumo da Reserva */}
          <div className="bg-[#fdfaf6] p-8 rounded-2xl shadow-md border border-[#e8e5df]">
            <h2 className="text-2xl font-semibold text-[#3a3a3a] mb-6 border-b pb-3 border-[#e6e6e6]">
              Resumo da Reserva
            </h2>
            <ul className="space-y-3 text-gray-700 text-lg leading-relaxed">
              <li>
                <strong>🏨 Quartos:</strong>
                <ul className="ml-4 list-disc">
                  {quartosSelecionados.map((q, i) => (
                    <li key={i}>
                      {q.quantidade}x {q.nome}
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <strong>📆 Check-in:</strong> {checkin}
              </li>
              <li>
                <strong>📆 Check-out:</strong> {checkout}
              </li>
              <li>
                <strong>👥 Adultos:</strong> {quantidadePessoas}
              </li>
              <li>
                <strong>🛏️ Diárias:</strong> {dias}
              </li>
              <li>
                <strong>💰 Valor Total:</strong>
                <span className="text-green-700 font-semibold">
                  {" "}
                  R$ {valorTotal.toFixed(2).replace(".", ",")}
                </span>
              </li>
            </ul>
          </div>

          {/* Formulário */}
          <div className="bg-[#fdfaf6] p-8 rounded-2xl shadow-md border border-[#e8e5df]">
            <h2 className="text-2xl font-semibold text-[#3a3a3a] mb-6 border-b pb-3 border-[#e6e6e6]">
              Dados do Cliente
            </h2>
            <form
              className="space-y-5"
              onSubmit={(e) => e.preventDefault()}
              autoComplete="off"
            >
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                onChange={handleChange}
                value={form.nome}
                required
              />
              <input
                type="tel"
                name="telefone"
                placeholder="Telefone / WhatsApp"
                className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                onChange={handleChange}
                value={form.telefone}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                onChange={handleChange}
                value={form.email}
                required
              />
              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                onChange={handleChange}
                value={form.cpf}
                required
              />

              <div>
                <label className="font-semibold mb-2 block">
                  Forma de Pagamento:
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  value={formaPagamento}
                  onChange={(e) => {
                    setFormaPagamento(e.target.value);
                    if (e.target.value !== "credito") setParcelas(1);
                  }}
                >
                  <option value="pix">PIX</option>
                  <option value="credito">Cartão de Crédito</option>
                  <option value="debito">Cartão de Débito</option>
                </select>
              </div>

                <ReCAPTCHA
                    sitekey={recaptchaSiteKey}
                    onChange={() => setCaptchaValido(true)}
                />

              {/* Parcelas só para cartão de crédito */}
              {formaPagamento === "credito" && (
                <div className="mt-4">
                  <label className="font-semibold mb-2 block">
                    Parcelas (máx {dias}x):
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    value={parcelas}
                    onChange={(e) => setParcelas(Number(e.target.value))}
                  >
                    {Array.from({ length: dias }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}x
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={handlePagamento}
                disabled={loadingPagamento}
                className="btn-pagar cursor-pointer w-full py-4 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600 transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              >
                {loadingPagamento ? "Processando..." : "Gerar Pagamento"}
              </button>

              <button
                type="button"
                onClick={handleReservar}
                disabled={!pagamentoConfirmado}
                className={`mt-4 w-full py-4 rounded-xl font-bold text-white ${
                  pagamentoConfirmado
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                } transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400`}
              >
                Finalizar Reserva
              </button>
              {!pagamentoConfirmado && (
                <p className="mt-2 text-sm text-red-600">
                  Aguarde a confirmação do pagamento para finalizar.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
