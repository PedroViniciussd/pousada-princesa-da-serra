'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Mail, Phone, Instagram } from 'lucide-react'

export default function Contato() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    alert('Mensagem enviada com sucesso! Em breve entraremos em contato.')
    setForm({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    })
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <section className="max-w-7xl w-full mx-auto px-4 py-16 text-[#1f1f1f] flex-1">
        <h1 className="text-4xl font-bold mb-10 text-left">Fale Conosco</h1>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Lado esquerdo: Texto + Contato */}
          <div className="w-full lg:w-1/2 space-y-8">
            <p className="text-lg text-gray-700">
              Ficou com alguma dúvida, deseja tratar sobre reservas especiais ou outros assuntos?
              Nossa equipe está pronta para te atender com toda cordialidade e atenção que você merece.
            </p>

            <div className="space-y-4 text-lg text-gray-800">
              <h2 className="text-xl font-semibold">Entre em Contato</h2>

              <div className="flex items-center gap-2">
                <Mail className="text-black" size={20} />
                <a href="mailto:pousadaprincesadaserra@gmail.com" className="hover:underline text-black">
                  pousadaprincesadaserra@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="text-black" size={20} />
                <a
                  href="https://wa.me/5531984573455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-black"
                >
                  (31) 9 8457-3455
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Instagram className="text-black" size={20} />
                <a
                  href="https://www.instagram.com/pousadaprincesadaserra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-black"
                >
                  @pousadaprincesadaserra
                </a>
              </div>
            </div>
          </div>

          {/* Lado direito: Formulário */}
          <form
            className="w-full lg:w-1/2 space-y-6 bg-black text-white p-6 rounded-2xl shadow-lg border border-yellow-400"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block mb-1 font-medium" htmlFor="nome">Nome:</label>
              <input
                type="text"
                name="nome"
                id="nome"
                className="w-full p-2 bg-black text-white border border-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                onChange={handleChange}
                value={form.nome}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="email">E-mail:</label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-2 bg-black text-white border border-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                onChange={handleChange}
                value={form.email}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="telefone">Telefone:</label>
              <input
                type="tel"
                name="telefone"
                id="telefone"
                className="w-full p-2 bg-black text-white border border-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                onChange={handleChange}
                value={form.telefone}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="assunto">Assunto:</label>
              <input
                type="text"
                name="assunto"
                id="assunto"
                className="w-full p-2 bg-black text-white border border-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                onChange={handleChange}
                value={form.assunto}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="mensagem">Mensagem:</label>
              <textarea
                name="mensagem"
                id="mensagem"
                rows="5"
                className="w-full p-2 bg-black text-white border border-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                required
                onChange={handleChange}
                value={form.mensagem}
              ></textarea>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-3 rounded-xl font-bold text-black bg-yellow-400 hover:bg-yellow-500 transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
