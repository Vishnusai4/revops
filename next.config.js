/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Keep @react-pdf/renderer as a Node.js external so Next.js does not
  // bundle it for the browser. Required because it uses Node.js internals.
  // (Next.js 14.2.x uses the experimental namespace; 14.3+ promotes this
  //  to top-level `serverExternalPackages`.)
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
}

module.exports = nextConfig
