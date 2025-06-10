'use client'
import React from 'react'
import BuscarQuartosDisponiveis from './BuscarQuartosDisponiveis'

export default function Banner() {
    return (
        <section
            className="relative w-full bg-cover bg-center py-12 sm:py-20"
            style={{
                backgroundImage: "url('/images/princesadaserra.jpg')",
                // Removi a altura fixa para ajustar ao conteúdo
            }}
        >
            {/* Overlay escuro com transparência */}
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
                {/* Texto */}
                <div className="w-full md:w-1/2 text-center md:text-left text-pousadaYellow">
                    <h1
                        className="font-bold leading-tight mb-4"
                        style={{
                            fontSize: '2.5rem', // base para mobile
                            color: '#FFD675',
                            textShadow: '2px 2px 8px rgba(0,0,0,0.85)',
                        }}
                    >
                        Pousada<br />Princesa da <br />Serra
                    </h1>
                    <p
                        className="paragraph-banner text-base sm:text-lg max-w-lg mx-auto md:mx-0"
                        style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.7)' }}
                    >
                        Descanso e lazer para sua família no centro da Serra do Cipó.
                    </p>
                </div>

                {/* Componente de busca */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                    <div className="w-full max-w-md">
                        <BuscarQuartosDisponiveis />
                    </div>
                </div>
            </div>

            {/* Ajuste do tamanho do título para telas maiores */}
            <style jsx>{`
        @media(min-width: 640px) {
          h1 {
            font-size: 3.5rem !important;
          }
        }
        @media(min-width: 768px) {
          h1 {
            font-size: 4rem !important;
          }
        }
      `}</style>
        </section>
    )
}
