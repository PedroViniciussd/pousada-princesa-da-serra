'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../../custom-datepicker.css' // seu CSS personalizado para datepicker

export default function BuscarQuartosDisponiveis() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    checkin: '',
    checkout: '',
    pessoas: 1,
    criancas: 1,
    camas: 0,
  })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 640)

      // Opcional: atualizar on resize
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640)
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const buscarQuartos = (e) => {
    e.preventDefault()
    const { checkin, checkout, pessoas, criancas } = formData

    if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
      alert('Data de checkout deve ser posterior à data de checkin.')
      return
    }

    const query = new URLSearchParams({
      checkin,
      checkout,
      pessoas: String(pessoas),
      criancas: String(criancas),
    }).toString()

    router.push(`/quartos-disponiveis?${query}`)
  }

  // Função para quando selecionar checkin, ir para checkout
  const handleCheckinChange = (e) => {
    handleChange(e)
    // Foca no checkout após selecionar checkin
    const checkoutInput = document.getElementById('checkout')
    if (checkoutInput) {
      checkoutInput.focus()
    }
  }

  return (
    <div
      className="form-busca rounded-xl p-8 w-full max-w-md text-white shadow-lg border border-[#FFD675]"
      style={{ backgroundColor: '#0f0a0be0' }}
    >
      <h2 className="text-2xl font-bold mb-6">Pesquisar Quarto:</h2>

      <form
        onSubmit={buscarQuartos}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-6"
      >
        {/* Check-in */}
        <div className="flex flex-col col-span-1">
          <label
            htmlFor="checkin"
            className="mb-2 font-semibold capitalize"
          >
            Check-in:
          </label>
          <input
            type="date"
            id="checkin"
            name="checkin"
            required
            value={formData.checkin}
            onChange={handleCheckinChange}
            className="date-white-icon bg-transparent border border-[#FFD675] rounded-md px-4 py-2 text-pousadaYellow placeholder-pousadaYellow/70 focus:outline-none focus:ring-2 focus:ring-[#FFD675] focus:border-[#FFD675] transition"
          />
        </div>

        {/* Check-out */}
        <div className="flex flex-col col-span-1">
          <label
            htmlFor="checkout"
            className="mb-2 font-semibold capitalize"
          >
            Check-out:
          </label>
          <input
            type="date"
            id="checkout"
            name="checkout"
            required
            value={formData.checkout}
            onChange={handleChange}
            className="date-white-icon bg-transparent border border-[#FFD675] rounded-md px-4 py-2 text-pousadaYellow placeholder-pousadaYellow/70 focus:outline-none focus:ring-2 focus:ring-[#FFD675] focus:border-[#FFD675] transition"
          />
        </div>

        {/* Pessoas */}
        <div className="flex flex-col col-span-1 sm:col-span-1">
          <label
            htmlFor="pessoas"
            className="mb-2 font-semibold capitalize"
          >
            Hóspedes
          </label>
          <input
            type="number"
            id="pessoas"
            name="pessoas"
            min="1"
            inputMode="numeric"
            pattern="[0-9]*"
            required
            value={isMobile ? '' : formData.pessoas}
            placeholder="Ex: 2"
            onChange={handleChange}
            className="bg-transparent border border-[#FFD675] rounded-md px-4 py-2 text-pousadaYellow placeholder-pousadaYellow/70 focus:outline-none focus:ring-2 focus:ring-[#FFD675] focus:border-[#FFD675] transition"
          />
        </div>

        {/* Camas */}
        <div className="flex flex-col col-span-1 sm:col-span-1">
          <label
            htmlFor="camas"
            className="mb-2 font-semibold capitalize"
          >
            Camas
          </label>
          <input
            type="number"
            id="camas"
            name="camas"
            min="0"
            required
            value={isMobile ? '' : formData.camas}
            placeholder="Ex: 1"
            onChange={handleChange}
            className="bg-transparent border border-[#FFD675] rounded-md px-4 py-2 text-pousadaYellow placeholder-pousadaYellow/70 focus:outline-none focus:ring-2 focus:ring-[#FFD675] focus:border-[#FFD675] transition"
          />
        </div>

        {/* Botão */}
        <div className="col-span-1 sm:col-span-2">
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold shadow-md text-black transition duration-300"
            style={{ backgroundColor: '#FFD675', cursor: 'pointer' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#d4b85a')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#FFD675')
            }
          >
            Verificar Disponibilidade
          </button>
        </div>
      </form>
    </div>
  )
}
