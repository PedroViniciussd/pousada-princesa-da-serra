import { Suspense } from 'react'
import ReservaClient from './ReservaClient'

export default function PageReserva() {
  return (
    <Suspense fallback={<p>Carregando reserva...</p>}>
      <ReservaClient />
    </Suspense>
  )
}
