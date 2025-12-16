export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">Teravictus</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-400">rev.teravictus.com</span>
          </div>

          <a
            href="mailto:vishnu@teravictus.com"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            vishnu@teravictus.com
          </a>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8">
          <p className="text-center text-sm text-slate-500">
            &copy; {currentYear} Teravictus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
