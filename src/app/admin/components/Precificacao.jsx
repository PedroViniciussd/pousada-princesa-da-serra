'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase';  // Corrigido: importe o Firestore como 'db'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function Precificacao() {
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPreco, setEditPreco] = useState({}); // { id_quarto: novoPreco }

  useEffect(() => {
    async function fetchQuartos() {
      setLoading(true);
      try {
        const quartosCol = collection(db, 'quartos');
        const quartosSnapshot = await getDocs(quartosCol);
        const quartosList = quartosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuartos(quartosList);
      } catch (error) {
        console.error('Erro ao buscar quartos:', error);
        alert('Erro ao carregar quartos.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuartos();
  }, []);

  async function handleSalvar(id) {
    if (editPreco[id] === undefined || isNaN(Number(editPreco[id]))) {
      alert('Digite um preço válido');
      return;
    }
    try {
      const docRef = doc(db, 'quartos', id);
      await updateDoc(docRef, {
        precoNoite: Number(editPreco[id])
      });
      setQuartos(quartos.map(q => q.id === id ? { ...q, precoNoite: Number(editPreco[id]) } : q));
      alert('Preço atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar preço:', error);
      alert('Erro ao salvar preço.');
    }
  }

  if (loading) return <p>Carregando quartos...</p>;

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-[#FFD675]">Precificação dos Quartos</h2>
      {quartos.map((quarto) => (
        <div key={quarto.id} className="flex items-center justify-between mb-4 p-4 bg-gray-800 rounded">
          <div>
            <p className="font-bold text-white">{quarto.nome}</p>
            <p className="text-sm text-gray-300">Capacidade: {quarto.capacidade} | Camas: {quarto.cama}</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              step="any"
              className="w-24 p-1 rounded bg-gray-700 text-white outline-none text-right"
              defaultValue={quarto.precoNoite}
              onChange={(e) => setEditPreco(prev => ({ ...prev, [quarto.id]: e.target.value }))}
            />
            <button
              onClick={() => handleSalvar(quarto.id)}
              className="cursor-pointer bg-[#FFD675] text-black px-3 py-1 rounded hover:brightness-110"
            >
              Salvar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
