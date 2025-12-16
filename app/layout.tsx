import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'RevOps Workflow Engine — Deal & Routing Intelligence',
  description: 'Workflow engine for RevOps teams. Fix lead routing, stitch deal context, stop forecast slippage. Built for AI / DevTools / Data teams. Book 12 minutes with founder.',
  openGraph: {
    title: 'RevOps Workflow Engine — Deal & Routing Intelligence',
    description: 'Workflow engine for RevOps teams. Fix lead routing, stitch deal context, stop forecast slippage. Built for AI / DevTools / Data teams. Book 12 minutes with founder.',
    url: 'https://rev.teravictus.com',
    siteName: 'Teravictus RevOps',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RevOps Workflow Engine — Deal & Routing Intelligence',
    description: 'Workflow engine for RevOps teams. Fix lead routing, stitch deal context, stop forecast slippage.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* RB2B Tracking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function () {
                var reb2b = window.reb2b = window.reb2b || [];
                if (reb2b.invoked) return;
                reb2b.invoked = true;
                reb2b.methods = ["identify", "collect"];
                reb2b.factory = function (method) {
                  return function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(method);
                    reb2b.push(args);
                    return reb2b;
                  };
                };
                for (var i = 0; i < reb2b.methods.length; i++) {
                  var key = reb2b.methods[i];
                  reb2b[key] = reb2b.factory(key);
                }
                reb2b.load = function (key) {
                  var script = document.createElement("script");
                  script.type = "text/javascript";
                  script.async = true;
                  script.src = "https://s3-us-west-2.amazonaws.com/b2bjsstore/b/" + key + "/CLRHS.js";
                  var first = document.getElementsByTagName("script")[0];
                  first.parentNode.insertBefore(script, first);
                };
                reb2b.SNIPPET_VERSION = "1.0.1";
                reb2b.load("CLRHS3LKH2RHLLGHREOG");
              }();
            `,
          }}
        />
        {/* Google Analytics - uncomment and add GA_ID when ready */}
        {/*
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
        */}
      </head>
      <body className="font-sans text-slate-900 bg-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
