const sections = [
  { label: 'Beta Program', href: '#beta' },
  { label: 'What We Do', href: '#what-we-do' },
  { label: 'Who It\u2019s For', href: '#built-for' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ink py-12">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="text-lg font-semibold text-white">Teravictus</span>
            <span className="ml-3 text-white/40">rev.teravictus.com</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Free Tools</p>
            <a
              href="/stress-test"
              className="inline-block text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Revenue Plan Stress Test →
            </a>
          </div>
          <p className="text-sm text-white/30">
            &copy; {currentYear} Teravictus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
