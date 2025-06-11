'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../image/logo/logo-princesa-da-serra.png';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  // Se o usuário já está logado, redireciona direto pro admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/admin');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push('/admin'); // Redireciona após login
    } catch (err) {
      setErro('Email ou senha inválidos.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0a0b] text-white px-4">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a0b] text-white px-4">
      <form onSubmit={handleLogin} className="bg-black p-6 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex items-center justify-center pb-3">
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
        </div>
        <h1 className="text-2xl font-bold mb-4 text-[#FFD675] text-center">Área do Admin</h1>

        {erro && <p className="text-red-400 mb-4 text-center">{erro}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white outline-none"
        />

        <button type="submit" className="bg-[#FFD675] cursor-pointer text-black font-bold w-full py-2 rounded hover:brightness-110">
          Entrar
        </button>
      </form>
    </div>
  );
}
