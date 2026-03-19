import Image from 'next/image'
import AnimateIn from './AnimateIn'

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Photo: 2/5 */}
          <AnimateIn className="lg:col-span-2">
            <div className="max-w-sm mx-auto lg:mx-0">
              <Image
                src="/vishnu-photo.png"
                alt="Vishnu, Founder at Teravictus"
                width={880}
                height={1120}
                className="rounded-2xl w-full h-auto"
                priority={false}
              />
            </div>
          </AnimateIn>

          {/* Bio: 3/5 */}
          <AnimateIn delay={0.15} className="lg:col-span-3">
            <div>
              <h2 className="font-heading text-4xl tracking-tight text-ink sm:text-5xl">
                About
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink-body">
                I&apos;m Vishnu, founder at Teravictus.
              </p>
              <a
                href="https://www.linkedin.com/in/vishnusaiy/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                See my LinkedIn to learn more about me
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </a>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
