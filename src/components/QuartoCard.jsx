'use client'
import React, { useState } from 'react'

function IconPeople() {
    return (
        <svg className="w-5 h-5 inline-block mr-1 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a4.5 4.5 0 0 1 13 0" />
        </svg>
    )
}

function IconBed() {
    return (
        <svg className="w-5 h-5 inline-block mr-1 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="7" width="18" height="10" rx="2" ry="2" />
            <path d="M7 7v10M17 7v10" />
        </svg>
    )
}

export default function QuartoCard({ quarto, onSelect }) {
    const [quantidade, setQuantidade] = useState(0)
    const [modalAberto, setModalAberto] = useState(false)
    const [modalImagemAberto, setModalImagemAberto] = useState(false)
    const [imagemAtual, setImagemAtual] = useState(0)

    const handleChange = (e) => {
        const val = Math.min(quarto.disponibilidade, Math.max(0, Number(e.target.value)))
        setQuantidade(val)
        onSelect(val)
    }

    const imagemDestaque = quarto.imagens?.[0] || quarto.destaque || '/imagem-placeholder.jpg'
    const imagens = quarto.imagens || []

    const abrirLightbox = (index) => {
        setImagemAtual(index)
        setModalImagemAberto(true)
    }

    const fecharLightbox = () => setModalImagemAberto(false)
    const proximaImagem = () => setImagemAtual((prev) => (prev + 1) % imagens.length)
    const imagemAnterior = () => setImagemAtual((prev) => (prev - 1 + imagens.length) % imagens.length)

    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const checkin = params.get('checkin') || ''
    const checkout = params.get('checkout') || ''
    const pessoas = params.get('pessoas') || ''
    const criancas = params.get('criancas') || ''

    return (
        <>
            <div
                className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white cursor-pointer"
                onClick={() => setModalAberto(true)}
            >
                <div
                    className={`absolute top-2 left-2 z-20 text-sm font-semibold px-2 py-1 rounded ${
                        quarto.disponibilidade > 0 ? 'bg-black/60 text-white' : 'bg-red-500 text-black'
                    }`}
                >
                    {quarto.disponibilidade > 0
                        ? `${quarto.disponibilidade} disponíveis`
                        : 'ESGOTADO'}
                </div>

                <div className="relative w-full h-48">
                    <img src={imagemDestaque} alt={quarto.nome} className="w-full h-full object-cover" />
                    {quarto.precoNoite && (
                        <div className="absolute top-2 right-2 bg-white/90 text-primary text-sm font-semibold px-3 py-1 rounded shadow">
                            R$ {quarto.precoNoite},00 / noite
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{quarto.nome}</h2>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <IconPeople />
                        <span className="mr-4">{quarto.capacidade} hóspedes</span>
                        <IconBed />
                        <span>
                            {quarto.cama} {quarto.cama === 1 ? 'cama' : 'camas'}
                        </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                        {quarto.descricao?.length > 145
                            ? quarto.descricao.slice(0, 145) + '...'
                            : quarto.descricao || 'Descrição indisponível'}
                    </p>

                    {/* Aqui está o input com os botões de - e + */}
                    <div className="flex items-center gap-2 mt-3">
                        <label htmlFor={`quantidade-${quarto.id}`} className="text-sm font-medium">
                            Selecionar:
                        </label>
                        <div className="flex items-center border rounded">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setQuantidade((q) => {
                                        const nova = Math.max(0, q - 1)
                                        onSelect(nova)
                                        return nova
                                    })
                                }}
                                disabled={quantidade <= 0}
                                className="px-2 py-1 bg-[#FFD675] text-black rounded-l hover:bg-[#d4b85a] disabled:opacity-50"
                            >
                                –
                            </button>
                            <input
                                id={`quantidade-${quarto.id}`}
                                type="number"
                                min={0}
                                max={quarto.disponibilidade}
                                value={quantidade}
                                onChange={(e) => {
                                    e.stopPropagation()
                                    const val = Math.min(quarto.disponibilidade, Math.max(0, Number(e.target.value)))
                                    setQuantidade(val)
                                    onSelect(val)
                                }}
                                className="w-16 text-center border-x px-2 py-1"
                                disabled={quarto.disponibilidade === 0}
                                onClick={(e) => e.stopPropagation()} // impede abertura do modal
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setQuantidade((q) => {
                                        const nova = Math.min(quarto.disponibilidade, q + 1)
                                        onSelect(nova)
                                        return nova
                                    })
                                }}
                                disabled={quantidade >= quarto.disponibilidade}
                                className="px-2 py-1 bg-[#FFD675] text-black rounded-r hover:bg-[#d4b85a] disabled:opacity-50"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detalhes */}
            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
                    <div className="bg-white rounded-xl max-w-3xl w-full overflow-auto max-h-[90vh] relative shadow-lg">
                        <button
                            onClick={() => setModalAberto(false)}
                            className="absolute top-3 right-3 text-gray-700 hover:text-red-500 text-2xl"
                        >
                            &times;
                        </button>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">{quarto.nome}</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                {imagens.length > 0 ? (
                                    imagens.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`Imagem ${i + 1}`}
                                            className="rounded-md object-cover w-full h-48 cursor-pointer"
                                            onClick={() => abrirLightbox(i)}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500">Imagens indisponíveis</p>
                                )}
                            </div>

                            <p className="text-gray-700 mb-6 whitespace-pre-line">
                                {quarto.descricao || 'Descrição indisponível'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Lightbox */}
            {modalImagemAberto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
                    onClick={fecharLightbox}
                >
                    <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={imagemAnterior}
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-r-lg hover:bg-black/70 focus:outline-none"
                        >
                            ‹
                        </button>
                        <img src={imagens[imagemAtual]} alt="" className="max-w-screen max-h-[80vh] rounded-lg" />
                        <button
                            onClick={proximaImagem}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-l-lg hover:bg-black/70 focus:outline-none"
                        >
                            ›
                        </button>
                        <button
                            onClick={fecharLightbox}
                            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
