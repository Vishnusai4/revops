import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/teravictus-logo.png"
                alt="Teravictus"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-slate-900">Teravictus</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
