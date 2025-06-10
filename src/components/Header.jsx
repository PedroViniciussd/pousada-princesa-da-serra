'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import logo from '../image/logo/logo-princesa-da-serra.png'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => setMenuOpen(!menuOpen)
    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="bg-[#0F0A0B] shadow-md relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link href="/">
                    <Image
                        src={logo}
                        alt="Logo Pousada Princesa da Serra"
                        width={100}
                        height={40}
                        priority
                        className="object-contain"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6 text-white text-sm sm:text-base font-medium">
                    <Link href="/" className="hover:text-[#FFD675] transition-colors duration-300">Home</Link>
                    <Link href="#sobre" className="hover:text-[#FFD675] transition-colors duration-300">Sobre</Link>
                    <Link href="/quartos" className="hover:text-[#FFD675] transition-colors duration-300">Quartos</Link>
                    <Link href="/contato" className="hover:text-[#FFD675] transition-colors duration-300">Contato</Link>
                </nav>

                {/* Mobile Hamburger */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white focus:outline-none"
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu com animação */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'
                    } bg-[#0F0A0B] px-4 text-white text-sm font-medium`}
            >
                <Link href="/" onClick={closeMenu} className="block py-2 hover:text-[#FFD675]">Home</Link>
                <Link href="#sobre" onClick={closeMenu} className="block py-2 hover:text-[#FFD675]">Sobre</Link>
                <Link href="/quartos" onClick={closeMenu} className="block py-2 hover:text-[#FFD675]">Quartos</Link>
                <Link href="/contato" onClick={closeMenu} className="block py-2 hover:text-[#FFD675]">Contato</Link>
            </div>

        </header>
    )
}
