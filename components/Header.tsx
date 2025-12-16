export default function Header() {
  return (
    <header className="bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              {/* Teravictus Logo */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-slate-900"
              >
                <path
                  d="M50 5L95 27.5V72.5L50 95L5 72.5V27.5L50 5Z"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M50 20L80 35V65L50 80L20 65V35L50 20Z"
                  fill="currentColor"
                />
                <path
                  d="M35 45L50 35L65 45L50 55L35 45Z"
                  fill="white"
                />
              </svg>
              <span className="text-xl font-bold text-slate-900">Teravictus</span>
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#who-its-for" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Who It&apos;s For
            </a>
          </nav>
          <div className="flex items-center">
            <a
              href="https://calendar.app.google/RFAVCBpXK7AWYxt67"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 transition-colors"
            >
              Book a Call
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
