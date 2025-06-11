'use client';

import { FaCalendarAlt, FaQuoteRight } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import logo from '../../../image/logo/logo-princesa-da-serra.png';

export default function Sidebar({ aba, setAba, menuAberto, setMenuAberto }) {
    // Efetua logout
    const logout = async () => {
        await signOut(auth);
        setMenuAberto(false);
    };

    return (
        <>
            {/* Overlay apenas no mobile quando aberto */}
            {menuAberto && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setMenuAberto(false)}
                />
            )}

            <aside className={`
        bg-black text-white border-r border-[#FFD675] h-full md:h-auto fixed top-0 left-0 z-40 transition-transform duration-300 ease-in-out
        ${menuAberto ? 'translate-x-0 w-full' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex md:w-64
      `}>
                <div className="flex flex-col items-center py-6 h-full w-full md:h-screen md:py-8 md:w-64 ">
                    {/* Fechar no mobile */}
                    <div className="md:hidden self-end px-4">
                        <button
                            onClick={() => setMenuAberto(false)}
                            className="text-white text-2xl"
                        >
                            <IoMdClose />
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="mb-10 mt-2">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={100}
                            height={100}
                            className="rounded-full border border-[#FFD675] shadow-md"
                        />
                    </div>

                    {/* Navegação */}
                    <nav className="space-y-4 w-full px-6 flex-1">
                        <button
                            onClick={() => { setAba('reservas'); setMenuAberto(false); }}
                            className={`
                flex items-center cursor-pointer gap-3 w-full px-4 py-2 rounded transition-colors
                ${aba === 'reservas' ? 'bg-[#FFD675] text-black font-semibold' : 'hover:bg-gray-800'}
              `}
                        >
                            <FaCalendarAlt /> Reservas
                        </button>

                        <button
                            onClick={() => { setAba('depoimentos'); setMenuAberto(false); }}
                            className={`
                flex items-center gap-3 cursor-pointer w-full px-4 py-2 rounded transition-colors
                ${aba === 'depoimentos' ? 'bg-[#FFD675] text-black font-semibold' : 'hover:bg-gray-800'}
              `}
                        >
                            <FaQuoteRight /> Depoimentos
                        </button>
                        <button
  onClick={() => { setAba('precificacao'); setMenuAberto(false); }}
  className={`
    flex items-center gap-3 cursor-pointer w-full px-4 py-2 rounded transition-colors
    ${aba === 'precificacao' ? 'bg-[#FFD675] text-black font-semibold' : 'hover:bg-gray-800'}
  `}
>
  Precificação
</button>

                        <button
                            onClick={logout}
                            className={`
                flex items-center gap-3 cursor-pointer w-full px-4 py-2 rounded transition-colors
                ${aba === 'logout' ? 'bg-[#FFD675] text-black font-semibold' : 'hover:bg-gray-800'}
              `}
                        >
                            Sair
                        </button>
                    </nav>

                    {/* Logout */}


                </div>
            </aside>
        </>
    );
}
