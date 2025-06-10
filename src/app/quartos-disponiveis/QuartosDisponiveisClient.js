'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import QuartoCard from '@/src/components/QuartoCard'
import useQuartosDisponiveis from '../hooks/useQuartosDisponiveis'

export default function QuartosDisponiveisClient() {
  const params = useSearchParams()
  const router = useRouter()

  // Pegando os parâmetros da URL
  const checkinParam = params.get('checkin') || ''
  const checkoutParam = params.get('checkout') || ''
  const pessoasParam = Number(params.get('pessoas')) || 1
  const camasParam = Number(params.get('camas')) || 1

  // Hook customizado para buscar quartos disponíveis
  const { quartos, loading, error } = useQuartosDisponiveis(checkinParam, checkoutParam)
  const [selecionado, setSelecionado] = useState({})

  const handleSelect = (id, count) => {
    setSelecionado(prev => ({ ...prev, [id]: count }))
  }

  // Total de pessoas e camas calculados a partir da seleção
  const totalPessoas = quartos.reduce(
    (sum, q) => sum + (selecionado[q.id] || 0) * q.capacidade,
    0
  )
  const totalCamas = quartos.reduce(
    (sum, q) => sum + (selecionado[q.id] || 0) * q.cama,
    0
  )

  // Pode reservar se pelo menos 1 pessoa e o total de camas atender ao pedido
  const podeReservar = totalPessoas >= pessoasParam && totalCamas >= camasParam

  const reservarAgora = () => {
    const quartosSelecionados = Object.entries(selecionado)
      .filter(([_, c]) => c > 0)
      .map(([id, quantidade]) => {
        const quarto = quartos.find(q => q.id === id)
        return {
          id: quarto.id,
          nome: quarto.nome,
          preco: quarto.precoNoite,
          quantidade,
        }
      })

    const qs = new URLSearchParams({
      checkin: checkinParam,
      checkout: checkoutParam,
      pessoas: String(pessoasParam),
      camas: String(camasParam),
      quartos: JSON.stringify(quartosSelecionados),
    }).toString()

    router.push(`/reserva?${qs}`)
  }

  if (loading) return <p className="p-4">Carregando quartos...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>
  if (quartos.length === 0) return <p className="p-4">Nenhum quarto disponível para esta data.</p>

  return (
    <main className="bg-white min-h-screen text-[#0f0a0b]">
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-2">Quartos Disponíveis</h1>
        <p className="text-gray-700 mb-6">
          Exibindo quartos disponíveis para <strong>{pessoasParam}</strong> hóspede(s) e{' '}
          <strong>{camasParam}</strong> cama(s), de <strong>{checkinParam}</strong> até{' '}
          <strong>{checkoutParam}</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quartos.map(quarto => (
            <QuartoCard
              key={quarto.id}
              quarto={quarto}
              onSelect={count => handleSelect(quarto.id, count)}
              selecionado={selecionado[quarto.id] || 0}
            />
          ))}
        </div>

        {podeReservar && (
          <button
            onClick={reservarAgora}
            className="cursor-pointer mt-5 bottom-8 right-8 bg-[#FFD675] text-black px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-600 transition"
          >
            Reservar agora
          </button>
        )}
      </section>
    </main>
  )
}
