'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { query, where, getDocs, collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from '../../../firebase'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ReCAPTCHA from 'react-google-recaptcha'

export default function ReservaClient() {
  const searchParams = useSearchParams()

  const checkin = searchParams.get("checkin")
  const checkout = searchParams.get("checkout")
  const quantidadePessoas = searchParams.get("pessoas")
  const quartosParam = searchParams.get("quartos")

  const [captchaValido, setCaptchaValido] = useState(false)
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

  const quartosSelecionados = useMemo(() => {
    try {
      const data = JSON.parse(quartosParam)
      return Array.isArray(data) ? data : []
    } catch {
      return []
    }
  }, [quartosParam])

  const dias = useMemo(() => {
    const start = new Date(checkin || "")
    const end = new Date(checkout || "")
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    return Math.max(1, diff)
  }, [checkin, checkout])

  const valorTotal = useMemo(() => {
    return quartosSelecionados.reduce((total, quarto) => {
      const preco = parseFloat(quarto.preco) || 0
      const quantidade = parseInt(quarto.quantidade) || 0
      return total + preco * quantidade * dias
    }, 0)
  }, [quartosSelecionados, dias])

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleReservar = async () => {
    if (!captchaValido) {
      alert("Por favor, verifique o reCAPTCHA.")
      return
    }

    try {
      const [anoCheckin, mesCheckin, diaCheckin] = checkin.split('-').map(Number)
      const [anoCheckout, mesCheckout, diaCheckout] = checkout.split('-').map(Number)

      const checkinDate = new Date(anoCheckin, mesCheckin - 1, diaCheckin, 12)
      const checkoutDate = new Date(anoCheckout, mesCheckout - 1, diaCheckout, 12)

      // Verificação de conflito (pode ser expandida se necessário)
      const reservasRef = collection(db, "reservas")
      const q = query(reservasRef, where("status", "==", "confirmado"))
      await getDocs(q)

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
      })

      const listaQuartosTexto = quartosSelecionados
        .map(q => `- ${q.quantidade}x ${q.nome}`)
        .join('\n')

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
      `.trim()

      const telDestino = "5531984573455"
      const url = `https://wa.me/${telDestino}?text=${encodeURIComponent(mensagem)}`
      window.open(url, "_blank")
    } catch (error) {
      alert("Erro ao registrar reserva. Tente novamente.")
      console.error("Erro ao salvar reserva:", error)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-12 text-[#0f0a0b]">
        <h2 className="text-4xl font-bold mb-4">Finalizar Reserva</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Resumo da Reserva */}
          <div className="bg-[#fdfaf6] p-8 rounded-2xl shadow-md border border-[#e8e5df]">
            <h2 className="text-2xl font-semibold text-[#3a3a3a] mb-6 border-b pb-3 border-[#e6e6e6]">Resumo da Reserva</h2>
            <ul className="space-y-3 text-gray-700 text-lg leading-relaxed">
              <li>
                <strong>🏨 Quartos:</strong>
                <ul className="ml-4 list-disc">
                  {quartosSelecionados.map((q, i) => (
                    <li key={i}>{q.quantidade}x {q.nome}</li>
                  ))}
                </ul>
              </li>
              <li><strong>📆 Check-in:</strong> {checkin}</li>
              <li><strong>📆 Check-out:</strong> {checkout}</li>
              <li><strong>👥 Adultos:</strong> {quantidadePessoas}</li>
              <li><strong>🛏️ Diárias:</strong> {dias}</li>
              <li>
                <strong>💰 Valor Total:</strong>
                <span className="text-green-700 font-semibold"> R$ {valorTotal.toFixed(2).replace(".", ",")}</span>
              </li>
            </ul>
          </div>

          {/* Formulário */}
          <div className="bg-[#fdfaf6] p-8 rounded-2xl shadow-md border border-[#e8e5df]">
            <h2 className="text-2xl font-semibold text-[#3a3a3a] mb-6 border-b pb-3 border-[#e6e6e6]">Dados do Cliente</h2>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                onChange={handleChange}
                value={form.nome}
              />
              <input
                type="tel"
                name="telefone"
                placeholder="Telefone / WhatsApp"
                className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                onChange={handleChange}
                value={form.telefone}
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                onChange={handleChange}
                value={form.email}
              />
              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                onChange={handleChange}
                value={form.cpf}
              />

              <ReCAPTCHA
                sitekey={recaptchaSiteKey}
                onChange={() => setCaptchaValido(true)}
              />

              <button
                type="button"
                onClick={handleReservar}
                className="btn-reservar cursor-pointer w-full py-4 rounded-xl font-bold text-black transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              >
                Confirmar Reserva via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
