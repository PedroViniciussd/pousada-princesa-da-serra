'use client'
import React from 'react'
import Image from 'next/image'
import logo from '../image/logo/logo-princesa-da-serra.png'
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="bg-[#0f0a0b] pt-15 pb-6 px-4">
            <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-3 text-sm">

                {/* Logo + Descrição */}
                <div className="flex flex-col items-start space-y-4">
                    <Image
                        src={logo}
                        alt="Logo Pousada Princesa da Serra"
                        width={100}
                        height={40}
                        priority
                        className="object-contain"
                    />
                    <p className="leading-relaxed max-w-xs">
                        Um refúgio de tranquilidade e conforto para você e sua família desfrutarem da natureza com aconchego.
                    </p>
                </div>

                {/* Navegação */}
                <nav aria-label="Links principais" className="flex flex-col space-y-4 md:ml-5 font-medium">
                    <span className="text-pousadaYellow text-base font-semibold mb-4">Navegue</span>
                    <a href="/" className="hover:text-[#FFD675] transition-colors">Home</a>
                    <a href="#sobre" className="hover:text-[#FFD675] transition-colors">Sobre</a>
                    <a href="/quartos" className="hover:text-[#FFD675] transition-colors">Quartos</a>
                    <a href="/contato" className="hover:text-[#FFD675] transition-colors">Contato</a>
                </nav>

                {/* Contato */}
                <div className="space-y-4">
                    <span className="text-pousadaYellow text-base font-semibold block">Entre em Contato:</span>

                    <div className="flex items-center space-x-3 text-sm">
                        <FaEnvelope className="text-xl" aria-hidden="true" />
                        <a
                            href="mailto:pousadaprincesadaserra@contato.com"
                            className="hover:text-[#FFD675] transition-colors"
                            aria-label="Enviar e-mail para pousadaprincesadaserra@contato.com"
                        >
                            pousadaprincesadaserra@contato.com
                        </a>
                    </div>

                    <div className="flex items-center space-x-3 text-sm">
                        <FaWhatsapp className="text-xl" aria-hidden="true" />
                        <a
                            href="https://wa.me/5531984573455"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#FFD675] transition-colors"
                            aria-label="Entrar em contato via WhatsApp"
                        >
                            (31) 9 8457-3455
                        </a>
                    </div>

                    <div className="flex items-center space-x-3 text-sm">
                        <FaInstagram className="text-xl" aria-hidden="true" />
                        <a
                            href="https://www.instagram.com/pousadaprincesadaserra"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#FFD675] transition-colors"
                            aria-label="Instagram da pousada"
                        >
                            @pousadaprincesadaserra
                        </a>
                    </div>
                </div>
            </div>
            
{/* Linha inferior */}
<div className="mt-10 border-t border-pousadaYellow/30 pt-6 text-xs text-pousadaYellow relative max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0">
  
  <span className="md:absolute md:left-1/2 md:-translate-x-1/2 whitespace-nowrap text-center md:text-left w-full md:w-auto">
    &copy; {new Date().getFullYear()} Pousada Princesa da Serra. Todos os direitos reservados.
  </span>
  
  <span className="text-pousadaYellow/70 whitespace-nowrap md:ml-auto text-center w-full md:w-auto">
    Desenvolvido por <a href="https://pedroviniciussd.github.io/portfolio-pv/" target="_blank" rel="noopener noreferrer" className="underline hover:text-pousadaYellow">Pedro Vinícius</a>
  </span>
  
</div>


            
        </footer>
    )
}
