'use client'
import React, { useRef, useEffect, useState } from 'react'

export default function Localizacao() {
    const textRef = useRef(null) // ✅ Correção principal
    const [textHeight, setTextHeight] = useState('auto')

    // Ajusta altura do mapa para igualar à do texto (em telas maiores)
    useEffect(() => {
        function updateHeight() {
            if (window.innerWidth >= 768 && textRef.current) {
                setTextHeight(textRef.current.clientHeight + 'px')
            } else {
                setTextHeight('auto')
            }
        }

        updateHeight()
        window.addEventListener('resize', updateHeight)
        return () => window.removeEventListener('resize', updateHeight)
    }, [])

    return (
        <section className="max-w-7xl mx-auto px-4 py-24 pt-[15px] pb-[110px]">
            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
                {/* Texto */}
                <div
                    className="w-full md:w-1/2 flex flex-col justify-start text-[#0f0a0b]"
                    ref={textRef}
                >
                    <h2 className="text-4xl font-bold mb-4 text-primary">
                        Localização e Estrutura
                    </h2>
                    <p className="mb-6 text-lg leading-relaxed text-gray-700">
                        Situada no centro da Serra do Cipó, a Pousada Princesa da Serra proporciona uma experiência única em meio à natureza. Cercada por jardins e vegetação nativa, nosso espaço garante silêncio absoluto, interrompido apenas pelo suave canto dos pássaros.
                    </p>
                    <p className="mb-6 text-lg leading-relaxed text-gray-700">
                        Além da beleza natural, oferecemos área de lazer com piscina e sauna, e toda a privacidade e segurança que você precisa para uma estadia tranquila.
                    </p>
                    <p className="mb-0 text-lg leading-relaxed text-gray-700">
                        Seja para um final de semana de descanso ou uma temporada revigorante, estamos prontos para receber você com todo o carinho e conforto.
                    </p>
                </div>

                {/* Mapa */}
                <div
                    className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 flex flex-col"
                    style={{ height: textHeight, minHeight: 360 }}
                >
                    <iframe
                        title="Mapa da Pousada Princesa da Serra"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.401451825294!2d-43.65137538466307!3d-19.38858108684168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa7a3d7bf3858c6%3A0xf5ee0bf52397176e!2sR.%20Um%2C%2041%20-%20Centro%2C%20Santana%20do%20Riacho%20-%20MG%2C%2035845-000!5e0!3m2!1spt-BR!2sbr!4v1686576200000!5m2!1spt-BR!2sbr"
                        className="border-0 flex-grow"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        style={{ display: 'block', width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </section>
    )
}
