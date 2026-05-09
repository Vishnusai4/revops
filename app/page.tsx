import Header from '@/components/Header'
import Hero from '@/components/Hero'
import WhyNotAgencyDiy from '@/components/WhyNotAgencyDiy'
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
      <WhyNotAgencyDiy />
      <BetaProgram />
      <WhoItsFor />
      <About />
      <ContactSection />
      <Footer />
    </main>
  )
}
