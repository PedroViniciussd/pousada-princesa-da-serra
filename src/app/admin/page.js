'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import ReservaCard from './components/ReservaCard';
import DepoimentoCard from './components/DepoimentoCard';

export default function AdminPage() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [aba, setAba] = useState('reservas');
  const [tipoReserva, setTipoReserva] = useState('atuais'); // novo state
  const [reservas, setReservas] = useState([]);
  const [reservasCanceladas, setReservasCanceladas] = useState([]);
  const [depoimentos, setDepoimentos] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace('/admin/login');
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      const resSnap = await getDocs(collection(db, 'reservas'));
      setReservas(resSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const cancelSnap = await getDocs(collection(db, 'reservasCanceladas'));
      setReservasCanceladas(cancelSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const depSnap = await getDocs(query(collection(db, 'depoimentos'), where('status', '==', 'pendente')));
      setDepoimentos(depSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchData();
  }, []);

  const aceitar = async (id) => {
    await updateDoc(doc(db, 'depoimentos', id), { status: 'aceito' });
    setDepoimentos(depoimentos.filter(d => d.id !== id));
  };

  const rejeitar = async (id) => {
    await updateDoc(doc(db, 'depoimentos', id), { status: 'rejeitado' });
    setDepoimentos(depoimentos.filter(d => d.id !== id));
  };

  const hoje = Timestamp.now().toDate();
  const atuais = reservas.filter(r => {
    const inDate = r.checkin?.toDate?.(), outDate = r.checkout?.toDate?.();
    return inDate && outDate && hoje >= inDate && hoje <= outDate;
  });
  const futuras = reservas.filter(r => {
    const inDate = r.checkin?.toDate?.();
    return inDate && inDate > hoje;
  });
  const passadas = reservas.filter(r => {
    const outDate = r.checkout?.toDate?.();
    return outDate && outDate < hoje;
  });

  const renderReservas = () => {
    switch (tipoReserva) {
      case 'atuais':
        return <ReservaCard titulo="Reservas Atuais" reservas={atuais} />;
      case 'futuras':
        return <ReservaCard titulo="Reservas Futuras" reservas={futuras} />;
      case 'encerradas':
        return <ReservaCard titulo="Reservas Encerradas" reservas={passadas} />;
      case 'canceladas':
        return <ReservaCard titulo="Reservas Canceladas" reservas={reservasCanceladas} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0a0b] text-white">
      <Sidebar
        aba={aba}
        setAba={setAba}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />

      <main className="flex-1 md:ml-full px-4 sm:px-6 py-10 relative z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 text-white bg-black p-2 rounded shadow-md"
          onClick={() => setMenuAberto(true)}
        >
          ☰
        </button>

        <h1 className="text-3xl font-bold text-[#FFD675] mt-5 mb-4">Painel Administrativo</h1>

        {aba === 'reservas' && (
          <>
            {/* Barra de Filtro (desktop e mobile) */}
            <div className="bg-[#FFD675] rounded-lg p-2 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Desktop: botões */}
              <div className="hidden sm:flex gap-2 flex-wrap">
                {[
                  { id: 'atuais', label: 'Reservas Atuais' },
                  { id: 'futuras', label: 'Reservas Futuras' },
                  { id: 'encerradas', label: 'Reservas Encerradas' },
                  { id: 'canceladas', label: 'Reservas Canceladas' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setTipoReserva(item.id)}
                    className={` cursor-pointer px-4 py-2 rounded font-semibold ${
                      tipoReserva === item.id ? 'bg-black text-[#FFD675]' : 'bg-white text-black'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Mobile: dropdown */}
              <div className="sm:hidden">
                <select
                  value={tipoReserva}
                  onChange={(e) => setTipoReserva(e.target.value)}
                  className="w-full p-2 rounded text-black font-semibold"
                >
                  <option  value="atuais">Reservas Atuais</option>
                  <option  value="futuras">Reservas Futuras</option>
                  <option  value="encerradas">Reservas Encerradas</option>
                  <option  value="canceladas">Reservas Canceladas</option>
                </select>
              </div>
            </div>

            {/* Conteúdo da Reserva */}
            {renderReservas()}
          </>
        )}

        {aba === 'depoimentos' && (
          <div className="mt-6 space-y-4">
            {depoimentos.length === 0
              ? <p className="text-gray-400 text-center">Nenhum depoimento pendente.</p>
              : depoimentos.map(dep => (
                <DepoimentoCard
                  key={dep.id}
                  depoimento={dep}
                  aceitar={() => aceitar(dep.id)}
                  rejeitar={() => rejeitar(dep.id)}
                />
              ))
            }
          </div>
        )}
      </main>
    </div>
  );
}
