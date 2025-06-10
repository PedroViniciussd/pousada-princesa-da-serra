// hooks/useQuartosDisponiveis.js
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase'

const imagensLocais = {
  'Quarto Duplo Econômico': {
    imagens: [
      '/images/quarto-duplo-economico/1.jpg',
      '/images/quarto-duplo-economico/2.jpg',
      '/images/quarto-duplo-economico/3.jpg',
    ],
    destaque: '/images/quarto-duplo-economico/1.jpg',
  },
  'Suíte com Varanda': {
    imagens: [
      '/images/suite-com-varanda/1.jpg',
      '/images/suite-com-varanda/2.jpg',
      '/images/suite-com-varanda/3.jpg',
    ],
    destaque: '/images/suite-com-varanda/1.jpg',
  },
  'Quarto Tríplo': {
    imagens: [
      '/images/quarto-triplo/1.jpg',
      '/images/quarto-triplo/2.jpg',
      '/images/quarto-triplo/3.jpg',
    ],
    destaque: '/images/quarto-triplo/1.jpg',
  },
}

export default function useQuartosDisponiveis(checkinParam, checkoutParam) {
  const [quartos, setQuartos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchQuartos() {
      setLoading(true)
      try {
        const [quartosSnap, reservasSnap] = await Promise.all([
          getDocs(collection(db, 'quartos')),
          getDocs(collection(db, 'reservas')),
        ])

        const checkin = new Date(checkinParam)
        checkin.setHours(12, 0, 0, 0)
        const checkout = new Date(checkoutParam)
        checkout.setHours(12, 0, 0, 0)

        const quartosList = quartosSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          ...(imagensLocais[d.data().nome] || {}),
          disponibilidadeOriginal: Number(d.data().disponibilidade || 0),
          disponibilidade: Number(d.data().disponibilidade || 0),
          capacidade: Number(d.data().capacidade || 0),
          cama: Number(d.data().cama || 0),
          precoNoite: Number(d.data().precoNoite || 0),
        }))

        const reservasConflitantes = {}
        reservasSnap.docs.forEach(doc => {
          const data = doc.data()
          const entrada = new Date(data.checkin?.seconds * 1000)
          const saida = new Date(data.checkout?.seconds * 1000)
          const status = (data.status || '').toLowerCase()
          const conflita = checkin < saida && checkout > entrada
          if (!conflita || status !== 'confirmado') return
          if (Array.isArray(data.quartos)) {
            data.quartos.forEach(q => {
              const id = q.id
              const qtd = Number(q.quantidade || 0)
              if (!id) return
              reservasConflitantes[id] = (reservasConflitantes[id] || 0) + qtd
            })
          }
        })

        const quartosAtualizados = quartosList.map(q => {
          const reservados = reservasConflitantes[q.id] || 0
          const disponivel = q.disponibilidadeOriginal - reservados
          return {
            ...q,
            disponibilidade: disponivel > 0 ? disponivel : 0,
          }
        })

        setQuartos(quartosAtualizados)
        setError(null)
      } catch (err) {
        setError('Erro ao buscar quartos. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    if (checkinParam && checkoutParam) {
      fetchQuartos()
    }
  }, [checkinParam, checkoutParam])

  return { quartos, loading, error }
}
