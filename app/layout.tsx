import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Revenue Systems, Rebuilt | Teravictus',
  description: 'One correct revenue number across your CRM, billing, and finance systems. Hands-on revenue operations for mid-market B2B SaaS.',
  openGraph: {
    title: 'Revenue Systems, Rebuilt | Teravictus',
    description: 'One correct revenue number across your CRM, billing, and finance systems. Hands-on revenue operations for mid-market B2B SaaS.',
    url: 'https://rev.teravictus.com',
    siteName: 'Teravictus RevOps',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revenue Systems, Rebuilt | Teravictus',
    description: 'One correct revenue number across your CRM, billing, and finance systems. Hands-on revenue operations for mid-market B2B SaaS.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does Teravictus do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We fix the disconnect between CRM, billing, and finance systems so revenue teams operate from one correct number.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Teravictus pilot program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A hands-on, 4 to 5 month engagement where we overhaul your revenue systems end to end. Discounted pricing for pilot partners with a money-back guarantee.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is Teravictus built for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'RevOps, Sales Ops, and Finance/Accounting teams at mid-market B2B SaaS companies.',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {/* RB2B Tracking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(key) {if (window.reb2b) return;window.reb2b = {loaded: true};var s = document.createElement("script");s.async = true;s.src = "https://b2bjsstore.s3.us-west-2.amazonaws.com/b/" + key + "/" + key + ".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);}("GOYPYHQV8EOX");`,
          }}
        />
        {/* Umami Analytics */}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="986a7c31-10bd-4019-ad6c-b41779621d68" />
      </head>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
