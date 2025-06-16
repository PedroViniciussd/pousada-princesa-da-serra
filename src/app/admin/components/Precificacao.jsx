'use client'

import { useEffect, useState } from 'react'
import { db } from '@/firebase'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'


export default function Precificacao() {
  const [quartos, setQuartos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editPreco, setEditPreco] = useState({})
  const [agendado, setAgendado] = useState({})
  const [historico, setHistorico] = useState([])
  const [loadingHistorico, setLoadingHistorico] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [ultimoDoc, setUltimoDoc] = useState(null)
  const [totalHistorico, setTotalHistorico] = useState(0)

  // Aplicar agendamentos conforme a data atual
  useEffect(() => {
    async function aplicarAgendamentos() {
      try {
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)

        const snapshot = await getDocs(collection(db, 'quartos'))
        for (const docSnap of snapshot.docs) {
          const quartoId = docSnap.id
          const quartoData = docSnap.data()
          const precoOriginal = quartoData.precoOriginal || quartoData.precoNoite
          const quartoRef = doc(db, 'quartos', quartoId)

          const agendamentosRef = collection(db, 'quartos', quartoId, 'precosAgendados')
          const agendamentosSnap = await getDocs(agendamentosRef)

          let alterado = false

          for (const agendamento of agendamentosSnap.docs) {
            const { preco, dataInicio, dataFim } = agendamento.data()
            const inicio = dataInicio.toDate()
            inicio.setHours(0, 0, 0, 0)
            const fim = dataFim?.toDate()
            if (fim) fim.setHours(0, 0, 0, 0)

            const estaNoPeriodo =
              (!fim && hoje.getTime() === inicio.getTime()) ||
              (fim && hoje >= inicio && hoje <= fim)

            const passouPeriodo = fim && hoje > fim

            if (estaNoPeriodo) {
              await updateDoc(quartoRef, { precoNoite: preco })
              alterado = true
            }

            if (passouPeriodo) {
              await updateDoc(quartoRef, { precoNoite: precoOriginal })
              alterado = true
            }
          }

          if (!quartoData.precoOriginal) {
            await updateDoc(quartoRef, { precoOriginal })
          }

          if (alterado) {
            console.log(`Preço atualizado para o quarto ${quartoId}`)
          }
        }
      } catch (error) {
        console.error('Erro ao aplicar agendamentos:', error)
      }
    }

    aplicarAgendamentos()
  }, [])

  // Buscar histórico paginado corretamente
  async function buscarHistorico(pagina = 1, cursor = null) {
    setLoadingHistorico(true)
    try {
      const quartosSnap = await getDocs(collection(db, 'quartos'))
      let agendamentosTodos = []

      for (const quartoDoc of quartosSnap.docs) {
        const quartoId = quartoDoc.id
        const nomeQuarto = quartoDoc.data().nome

        let agendamentosRef = collection(db, 'quartos', quartoId, 'precosAgendados')
        const agendamentosSnap = await getDocs(query(agendamentosRef, orderBy('dataInicio', 'desc')))

        const agendamentos = agendamentosSnap.docs.map(doc => ({
          id: doc.id,
          quartoId,
          nomeQuarto,
          ...doc.data(),
        }))

        agendamentosTodos = agendamentosTodos.concat(agendamentos)
      }

      agendamentosTodos.sort((a, b) => b.dataInicio.toDate() - a.dataInicio.toDate())

      const paginaDados = agendamentosTodos.slice((pagina - 1) * 10, pagina * 10)
      setHistorico(paginaDados)
      setPaginaAtual(pagina)

      if (paginaDados.length > 0) {
        setUltimoDoc(paginaDados[paginaDados.length - 1].dataInicio)
      }

      setTotalHistorico(agendamentosTodos.length)
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      alert('Erro ao carregar histórico de agendamentos.')
    } finally {
      setLoadingHistorico(false)
    }
  }

  useEffect(() => {
    async function fetchQuartos() {
      setLoading(true)
      try {
        const snapshot = await getDocs(collection(db, 'quartos'))
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setQuartos(list)
      } catch (error) {
        console.error('Erro ao buscar quartos:', error)
        alert('Erro ao carregar quartos.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuartos()
  }, [])

  useEffect(() => {
    buscarHistorico()
  }, [])

  function handleProximaPagina() {
    if (paginaAtual * 10 < totalHistorico) {
      buscarHistorico(paginaAtual + 1, ultimoDoc)
    }
  }

  function handlePaginaAnterior() {
    if (paginaAtual > 1) {
      buscarHistorico(paginaAtual - 1)
    }
  }

  async function handleSalvar(id) {
    if (editPreco[id] === undefined || isNaN(Number(editPreco[id]))) {
      alert('Digite um preço válido')
      return
    }

    try {
      const docRef = doc(db, 'quartos', id)
      await updateDoc(docRef, {
        precoNoite: Number(editPreco[id]),
      })

      setQuartos(prev =>
        prev.map(q =>
          q.id === id ? { ...q, precoNoite: Number(editPreco[id]) } : q
        )
      )
      alert('Preço atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar preço:', error)
      alert('Erro ao salvar preço.')
    }
  }

  async function handleAgendar(id) {
    const dados = agendado[id]
    if (!dados?.preco || !dados?.data) {
      alert('Informe o novo preço e a data de início.')
      return
    }

    try {
      const agendamentosRef = collection(db, 'quartos', id, 'precosAgendados')

      const payload = {
        preco: Number(dados.preco),
        dataInicio: Timestamp.fromDate(new Date(dados.data + 'T00:00:00')),
      }

      if (dados.dataFim) {
        payload.dataFim = Timestamp.fromDate(new Date(dados.dataFim + 'T00:00:00'))
      }

      await addDoc(agendamentosRef, payload)

      alert('Preço agendado com sucesso!')
      setAgendado(prev => ({ ...prev, [id]: { preco: '', data: '', dataFim: '' } }))
      buscarHistorico(paginaAtual)
    } catch (error) {
      console.error('Erro ao agendar preço:', error)
      alert('Erro ao agendar preço.')
    }
  }

  async function handleCancelarAgendamento(quartoId, agendamentoId) {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    try {
      const agendamentoRef = doc(db, 'quartos', quartoId, 'precosAgendados', agendamentoId);
      await deleteDoc(agendamentoRef);
      alert('Agendamento cancelado com sucesso!');
      buscarHistorico(paginaAtual); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Erro ao cancelar agendamento.');
    }
  }


  if (loading) return <p>Carregando quartos...</p>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 text-[#FFD675]">Preço dos Quartos</h2>

      {quartos.map((quarto) => (
        <div
          key={quarto.id}
          className="bg-gray-800 p-4 rounded mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-8"
        >
          {/* Informações do quarto */}
          <div className="text-white flex flex-col min-w-full sm:min-w-[220px] mb-4 sm:mb-0">
            <p className="font-bold">{quarto.nome}</p>
            <p className="text-gray-300 text-sm">
              Capacidade: {quarto.capacidade} | Camas: {quarto.cama}
            </p>
            <p className="text-gray-400 text-sm">Preço atual: R$ {quarto.precoNoite}</p>
          </div>

          {/* Novo preço */}
          <div className="flex flex-col items-start space-y-1 min-w-full sm:min-w-[160px] mb-4 sm:mb-0">
            <label className="text-sm text-white">Preço atual</label>
            <div className="flex space-x-2 w-full max-w-xs">
              <input
                type="number"
                className="bg-gray-700 text-white rounded px-2 py-1 w-20"
                onChange={(e) =>
                  setEditPreco((prev) => ({ ...prev, [quarto.id]: e.target.value }))
                }
              />
              <button
                onClick={() => handleSalvar(quarto.id)}
                className="bg-[#FFD675] text-black px-3 py-1 rounded whitespace-nowrap"
              >
                Atualizar
              </button>
            </div>
          </div>

          {/* Preço agendado */}
          <div className="flex flex-col items-start space-y-1 min-w-full sm:min-w-[120px] mb-4 sm:mb-0">
            <label className="text-sm text-white">Preço agendado</label>
            <input
              type="number"
              className="bg-gray-700 text-white rounded px-2 py-1 w-full max-w-xs"
              value={agendado[quarto.id]?.preco || ""}
              onChange={(e) =>
                setAgendado((prev) => ({
                  ...prev,
                  [quarto.id]: { ...prev[quarto.id], preco: e.target.value },
                }))
              }
            />
          </div>

          {/* Início */}
          <div className="flex flex-col items-start space-y-1 min-w-full sm:min-w-[140px] mb-4 sm:mb-0">
            <label className="text-sm text-white">Início</label>
            <input
              type="date"
              className="bg-gray-700 text-white rounded px-2 py-1 w-full max-w-xs"
              value={agendado[quarto.id]?.data || ""}
              onChange={(e) =>
                setAgendado((prev) => ({
                  ...prev,
                  [quarto.id]: { ...prev[quarto.id], data: e.target.value },
                }))
              }
            />
          </div>

          {/* Fim */}
          <div className="flex flex-col items-start space-y-1 min-w-full sm:min-w-[140px] mb-4 sm:mb-0">
            <label className="text-sm text-white">Fim</label>
            <input
              type="date"
              className="bg-gray-700 text-white rounded px-2 py-1 w-full max-w-xs"
              value={agendado[quarto.id]?.dataFim || ""}
              onChange={(e) =>
                setAgendado((prev) => ({
                  ...prev,
                  [quarto.id]: { ...prev[quarto.id], dataFim: e.target.value },
                }))
              }
            />
          </div>

          {/* Botão Agendar */}
          <div className="flex flex-col items-start space-y-1 min-w-full sm:min-w-[100px]">
            <div className="invisible text-sm">placeholder</div> {/* alinhamento */}
            <button
              onClick={() => handleAgendar(quarto.id)}
              className="bg-[#FFD675] text-black px-3 py-1 rounded w-full max-w-xs"
            >
              Agendar
            </button>
          </div>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-10 mb-4 text-[#FFD675]">Histórico de Agendamentos</h2>

      {loadingHistorico && <p className="text-gray-300">Carregando histórico...</p>}

      {!loadingHistorico && historico.length === 0 && (
        <p className="text-gray-300">Nenhum agendamento encontrado.</p>
      )}

      {!loadingHistorico && historico.length > 0 && (
        <>
          {/* Tabela para sm e acima */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-gray-300 border border-gray-700 rounded overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Quarto</th>
                  <th className="px-4 py-2">Preço Agendado (R$)</th>
                  <th className="px-4 py-2">Data Início</th>
                  <th className="px-4 py-2">Data Fim</th>
                  <th className="px-4 py-2">Ações</th> 
                </tr>
              </thead>
              <tbody>
                {historico.map(item => (
                  <tr key={`${item.quartoId}-${item.id}`} className="border-t border-gray-700 hover:bg-gray-800">
                    <td className="px-4 py-2">{item.nomeQuarto}</td>
                    <td className="px-4 py-2">{item.preco.toFixed(2)}</td>
                    <td className="px-4 py-2">{item.dataInicio.toDate().toLocaleDateString()}</td>
                    <td className="px-4 py-2">{item.dataFim ? item.dataFim.toDate().toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleCancelarAgendamento(item.quartoId, item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Layout para telas menores */}
          <div className="sm:hidden space-y-2">
            {historico.map(item => (
              <div key={`${item.quartoId}-${item.id}`} className="bg-gray-900 p-4 rounded text-sm text-white space-y-1">
                <p><strong>Quarto:</strong> {item.nomeQuarto}</p>
                <p><strong>Preço Agendado:</strong> R$ {item.preco.toFixed(2)}</p>
                <p><strong>Data Início:</strong> {item.dataInicio.toDate().toLocaleDateString()}</p>
                <p><strong>Data Fim:</strong> {item.dataFim ? item.dataFim.toDate().toLocaleDateString() : 'Indeterminado'}</p>
                <button
                  onClick={() => handleCancelarAgendamento(item.quartoId, item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mt-2"
                >
                  Cancelar
                </button>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handlePaginaAnterior}
              disabled={paginaAtual === 1}
              className="bg-[#FFD675] text-black px-4 py-2 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={handleProximaPagina}
              disabled={paginaAtual * 10 >= totalHistorico}
              className="bg-[#FFD675] text-black px-4 py-2 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  )
}
