'use client'
import React, { useState } from 'react'
import Header from '@/src/components/Header'
import Localizacao from '@/src/components/Localizacao'
import Footer from '@/src/components/Footer'

const quartos = [
  {
    id: 'duplo',
    nome: 'Quarto Duplo Econômico',
    capacidade: 2,
    camas: 2,
    preco: 'R$ 240.00',
    descricao: `O quarto duplo oferece um minibar, uma área de estar, uma varanda com vista para o jardim, bem como uma casa de banho privativa com duche. A unidade oferece 2 camas. Camas confortáveis, 8.9 – Com base em 11 comentários.`,
    infoCompleta: [
      'Capacidade: 2 hóspedes',
      'Camas: 2 camas individuais',
      'Produtos de higiene pessoal gratuitos',
      'Varanda',
      'Vista jardim',
      'Vista local de interesse',
      'Vista do pátio interior',
      'Pátio',
      'Mesa de jantar',
      'Televisão de led',
      'Mobiliário de exterior',
      'Ferro de passar',
      'Ventilador',
      'Toalhas',
      'Área de estar',
      'Tomada perto da cama',
      'Churrasqueira',
      'Micro-ondas',
      'Televisão',
      'Roupa de cama',
      'Frigobar',
      'Utensílios de cozinha',
      'Área de refeições exterior',
      'Cadeira alta para bebês',
      'Área de refeições',
      'Não é permitido fumar',
    ],
    imagens: [
      '/images/quarto-duplo-economico/1.jpg',
      '/images/quarto-duplo-economico/2.jpg',
      '/images/quarto-duplo-economico/3.jpg',
    ],
    destaque: '/images/quarto-duplo-economico/1.jpg',
  },
  {
    id: 'suite',
    nome: 'Suíte com Varanda',
    capacidade: 2,
    camas: 1,
    preco: 'R$ 270.00',
    descricao: `A suíte dispõe de 1 quarto e 1 banheiro com chuveiro elétrico e produtos de higiene pessoal gratuitos. Apresentando uma varanda com vista para o jardim, esta suíte também oferece frigobar, TV de led e cama confortável`,
    infoCompleta: [
      'Capacidade: 2 hóspedes',
      'Camas: 1 cama de casal',
      'Produtos de higiene pessoal gratuitos',
      'Varanda',
      'Vista jardim',
      'Vista piscina',
      'Vista local de interesse',
      'Vista do pátio interior',
      'Pátio',
      'Mesa de jantar',
      'Televisão de led',
      'Ferro de passar',
      'Ventilador',
      'Toalhas',
      'Área de estar',
      'Tomada perto da cama',
      'Churrasqueira',
      'Micro-ondas',
      'Televisão',
      'Roupa de cama',
      'Frigobar',
      'Utensílios de cozinha',
      'Área de refeições externa',
      'Cadeira alta para bebês',
      'Área de refeições',
      'Não é permitido fumar',
    ],
    imagens: [
      '/images/suite-com-varanda/1.jpg',
      '/images/suite-com-varanda/2.jpg',
      '/images/suite-com-varanda/3.jpg',
    ],
    destaque: '/images/suite-com-varanda/1.jpg',
  },
  {
    id: 'triplo',
    nome: 'Quarto Triplo',
    capacidade: 3,
    camas: 2,
    preco: 'R$ 650.00',
    descricao: `O quarto triplo oferece frigobar, área de estar, varanda com vista jardim, além de banheiro privativa com chuveiro elétrico. A unidade dispõe de 2 camas.`,
    infoCompleta: [
      'Capacidade: 3 hóspedes',
      'Camas: 1 cama individual e 1 cama de casal grande',
      'Produtos de higiene pessoal gratuitos',
      'Varanda',
      'Vista jardim',
      'Vista piscina',
      'Vista local de interesse',
      'Vista do pátio interior',
      'Pátio',
      'Mesa de jantar',
      'Televisão de led',
      'Ferro de passar',
      'Ventilador',
      'Toalhas',
      'Área de estar',
      'Tomada perto da cama',
      'Churrasqueira',
      'Micro-ondas',
      'Televisão',
      'Roupa de cama',
      'Frigobar',
      'Utensílios de cozinha',
      'Área de refeições exterior',
      'Cadeira alta para bebês',
      'Área de refeições',
      'Não é permitido fumar',
    ],
    imagens: [
      '/images/quarto-triplo/1.jpg',
      '/images/quarto-triplo/2.jpg',
      '/images/quarto-triplo/3.jpg',
    ],
    destaque: '/images/quarto-triplo/1.jpg',
  },
]

// Ícones simples para capacidade e camas (SVG)
function IconPeople() {
  return (
    <svg
      className="w-5 h-5 inline-block mr-1 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a4.5 4.5 0 0 1 13 0" />
    </svg>
  )
}
function IconBed() {
  return (
    <svg
      className="w-5 h-5 inline-block mr-1 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="10" rx="2" ry="2" />
      <path d="M7 7v10M17 7v10" />
    </svg>
  )
}

export default function Quartos() {
  const [quartoSelecionado, setQuartoSelecionado] = useState(null)
  const [imagemAberta, setImagemAberta] = useState(null) // para controlar imagem em tamanho original

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen text-[#0f0a0b]">
        <section className="max-w-7xl mx-auto px-4 py-16 ">
          <h2 className="text-4xl font-bold mb-4">Nossos Quartos</h2>
             <p className="mt-5 mb-10 text-lg text-gray-700 leading-relaxed w-full">Na Pousada Princesa da Serra, você encontra quartos aconchegantes e cuidadosamente preparados para garantir o máximo de conforto durante sua estadia em Serra do Cipó. Alguns quartos selecionados possuem uma charmosa varanda térrea com vista para a piscina, proporcionando uma experiência ainda mais especial.

Seja viajando em família, com amigos ou a dois, nossos quartos foram pensados para atender suas necessidades e tornar sua hospedagem inesquecível. Venha desfrutar de um ambiente tranquilo, cercado pela beleza natural da Serra do Cipó.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quartos.map((q) => (
  <div
    key={q.id}
    onClick={() => setQuartoSelecionado(q)}
    className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') setQuartoSelecionado(q)
    }}
  >
    <img
      src={q.destaque}
      alt={q.nome}
      className="w-full h-48 object-cover"
      loading="lazy"
    />
    <div className="p-4 bg-white">
      <h2 className="text-xl font-semibold mb-2">{q.nome}</h2>
      <div className="flex items-center text-gray-600 text-sm">
        <IconPeople />
        <span className="mr-4">{q.capacidade} hóspedes</span>
        <IconBed />
        <span>{q.camas} camas</span>
      </div>
      {/* Aqui o trecho do texto descritivo */}
      <p className="mt-2 text-gray-700 text-sm">
        {q.descricao.length > 130 ? q.descricao.slice(0, 155) + '...' : q.descricao}
      </p>
    </div>
  </div>
))}

          </div>

          {/* Modal de detalhes */}
          {quartoSelecionado && (
<div
  className="fixed inset-0 flex items-center justify-center z-50 p-6"
  style={{ backgroundColor: "#000000a3" }}
  onClick={() => setQuartoSelecionado(null)}
  aria-modal="true"
  role="dialog"
  aria-labelledby="modal-title"
>

              <div
                className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black ring-opacity-5"
                onClick={(e) => e.stopPropagation()}
              >
                <header className="flex justify-between items-center border-b border-gray-200 p-6">
                  <h3 id="modal-title" className="text-3xl font-extrabold text-gray-900">
                    {quartoSelecionado.nome}
                  </h3>
                  <button
                    onClick={() => {
                      setQuartoSelecionado(null)
                      setImagemAberta(null)
                    }}
                    className="text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition"
                    aria-label="Fechar modal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </header>

                <div className="p-8 space-y-6 text-gray-700 leading-relaxed">
                  {/* Galeria de imagens */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {quartoSelecionado.imagens.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${quartoSelecionado.nome} imagem ${i + 1}`}
                        className="w-full h-36 sm:h-40 object-cover rounded-xl shadow-lg hover:scale-105 transform transition duration-300 cursor-pointer"
                        loading="lazy"
                        onClick={() => setImagemAberta(img)} // abre imagem em tamanho original
                      />
                    ))}
                  </div>
                  <p className="text-lg">{quartoSelecionado.descricao}</p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-disc list-inside text-gray-600">
                    {quartoSelecionado.infoCompleta.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <svg
                          className="flex-shrink-0 w-5 h-5 text-primary mt-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal para imagem em tamanho original */}
              {imagemAberta && (
  <div
    className="fixed inset-0 flex items-center justify-center z-60 p-4"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.73)' }}
    onClick={() => setImagemAberta(null)}
    aria-modal="true"
    role="dialog"
    aria-label="Visualização da imagem em tamanho original"
  >
    <div
      className="relative max-w-full max-h-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Botão seta esquerda */}
      <button
        onClick={() => {
          const idx = quartoSelecionado.imagens.indexOf(imagemAberta)
          const prevIdx = (idx - 1 + quartoSelecionado.imagens.length) % quartoSelecionado.imagens.length
          setImagemAberta(quartoSelecionado.imagens[prevIdx])
        }}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-r-lg hover:bg-opacity-75 focus:outline-none"
        aria-label="Imagem anterior"
      >
        ‹
      </button>

      {/* Imagem */}
      <img
        src={imagemAberta}
        alt={`${quartoSelecionado.nome} imagem ampliada`}
        className="max-w-screen max-h-[80vh] rounded-lg"
      />

      {/* Botão seta direita */}
      <button
        onClick={() => {
          const idx = quartoSelecionado.imagens.indexOf(imagemAberta)
          const nextIdx = (idx + 1) % quartoSelecionado.imagens.length
          setImagemAberta(quartoSelecionado.imagens[nextIdx])
        }}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-l-lg hover:bg-opacity-75 focus:outline-none"
        aria-label="Próxima imagem"
      >
        ›
      </button>

      {/* Botão fechar */}
      <button
        onClick={() => setImagemAberta(null)}
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
        aria-label="Fechar visualização da imagem"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}
            </div>
          )}
        </section>
        <Localizacao />
      </div>
      <Footer />
    </>
  )
}