import React, { Suspense } from 'react'
import Header from '@/src/components/Header'
import Footer from '@/src/components/Footer'

const QuartosDisponiveisClient = React.lazy(() => import('./QuartosDisponiveisClient'))

export default function QuartosDisponiveisPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<p className="p-4">Carregando quartos...</p>}>
        <QuartosDisponiveisClient />
      </Suspense>
      <Footer />
    </>
  )
}
