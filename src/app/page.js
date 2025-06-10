import Header from '../components/Header'
import Banner from '../components/Banner'
import Footer from '../components/Footer'
import Sobre from '../components/Sobre.jsx'
import Localizacao from '../components/Localizacao'
import Depoimentos from '../components/Depoimentos'

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <Header />
      <Banner />
      <Sobre />
      <Localizacao />
      <Depoimentos />
      <Footer />
    </main>
  )
}
