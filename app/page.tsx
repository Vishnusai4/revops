import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BetaProgram from '@/components/BetaProgram'
import WhoItsFor from '@/components/WhoItsFor'
import About from '@/components/About'
import ContactSection from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <BetaProgram />
      <WhoItsFor />
      <About />
      <ContactSection />
      <Footer />
    </main>
  )
}
