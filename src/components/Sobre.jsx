'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'

export default function Sobre() {
    const totalImages = 23

    // Estado para definir imagesPerSlide dinamicamente
    const [imagesPerSlide, setImagesPerSlide] = useState(4)
    const [activeSlide, setActiveSlide] = useState(0)
    const [lightboxIndex, setLightboxIndex] = useState(null)

    // Atualiza imagesPerSlide conforme largura da tela (mobile: 1, desktop: 4)
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setImagesPerSlide(1)
            } else {
                setImagesPerSlide(4)
            }
        }
        handleResize() // chama na montagem
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const totalSlides = Math.ceil(totalImages / imagesPerSlide)

    const handleDotClick = (index) => setActiveSlide(index)
    const handlePrevSlide = () => setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
    const handleNextSlide = () => setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))

    const openLightbox = (index) => setLightboxIndex(index)
    const closeLightbox = useCallback(() => setLightboxIndex(null), [])
    const nextLightbox = () => setLightboxIndex((prev) => (prev + 1) % totalImages)
    const prevLightbox = () => setLightboxIndex((prev) => (prev - 1 + totalImages) % totalImages)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox()
            if (e.key === 'ArrowRight') nextLightbox()
            if (e.key === 'ArrowLeft') prevLightbox()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [closeLightbox])

    const getImagesForSlide = (slideIndex) => {
        const start = slideIndex * imagesPerSlide
        return Array.from({ length: imagesPerSlide }, (_, i) => start + i).filter(i => i < totalImages)
    }

    return (
        <section id='sobre' className="bg-white py-20 text-[#0f0a0b] pb-[70px]">
            <div className="max-w-7xl mx-auto px-4 py-4 ">
                {/* Texto */}
                <div className="mb-14 text-left">
                    <h2 className="text-4xl font-bold mb-4">Sobre a Pousada</h2>
                    <p className="text-lg text-gray-700 leading-relaxed w-full">
                        A Pousada Princesa da Serra é um refúgio perfeito para quem busca descanso, lazer e conexão com a natureza. Localizada no coração da Serra do Cipó, nossa pousada combina conforto e tranquilidade em um ambiente acolhedor. Com uma estrutura charmosa e envolta por paisagens exuberantes, oferecemos a estadia ideal para casais, famílias e amigos que desejam momentos inesquecíveis. Venha desfrutar do melhor da hospitalidade em um cenário de pura serenidade!
                    </p>
                </div>

                {/* Carrossel */}
                <div className="relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div
                                    key={slideIndex}
                                    className={`flex-shrink-0 w-full px-2
                                        ${imagesPerSlide === 1 
                                            ? 'grid grid-cols-1 gap-6' 
                                            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'}`}
                                >
                                    {getImagesForSlide(slideIndex).map((i) => (
                                        <div
                                            key={i}
                                            className="w-full aspect-video relative rounded-xl overflow-hidden shadow-md cursor-pointer"
                                            onClick={() => openLightbox(i)}
                                        >
                                            <Image
                                                src={`/images/galeria/${i + 1}.jpg`}
                                                alt={`Foto da pousada número ${i + 1}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                                sizes={imagesPerSlide === 1 ? '100vw' : '(max-width: 768px) 50vw, 25vw'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botões laterais */}
<button
  onClick={handlePrevSlide}
  className=" cursor-pointer absolute top-1/2 -translate-y-1/2 left-2 md:left-4 bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-100 transition"
  aria-label="Anterior"
>
  <FaChevronLeft />
</button>

                    <button
                        onClick={handleNextSlide}
                        className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-2 md:right-4 bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-100 transition"
                        aria-label="Próximo"
                    >
                        <FaChevronRight />
                    </button>

                    {/* Dots */}
                    <div className="hidden sm:flex justify-center mt-8 space-x-2">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`w-3 h-3 rounded-full ${activeSlide === index ? 'bg-[#0f0a0b]' : 'bg-gray-300'} transition-all duration-300`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: '#000000c4' }}
                    onClick={closeLightbox}
                >

                    <button
                        className=" z-[9] absolute top-4 right-4 text-white bg-black bg-opacity-70 p-2 rounded-full hover:bg-opacity-90"
                        onClick={closeLightbox}
                    >
                        <FaTimes size={20} />
                    </button>
                    <button
                        className="z-[9] absolute left-4 text-white bg-black bg-opacity-70 p-2 rounded-full hover:bg-opacity-90"
                        onClick={(e) => { e.stopPropagation(); prevLightbox() }}
                    >
                        <FaChevronLeft size={24} />
                    </button>

                    <div
                        className="relative w-[90vw] h-[90vh] rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={`/images/galeria/${lightboxIndex + 1}.jpg`}
                            alt={`Foto da pousada número ${lightboxIndex + 1}`}
                            fill
                            className="object-contain rounded-xl"
                            sizes="90vw"
                            priority={lightboxIndex < 4}
                        />
                    </div>

                    <button
                        className="absolute right-4 text-white bg-black bg-opacity-70 p-2 rounded-full hover:bg-opacity-90"
                        onClick={(e) => { e.stopPropagation(); nextLightbox() }}
                    >
                        <FaChevronRight size={24} />
                    </button>
                </div>
            )}
        </section>
    )
}
