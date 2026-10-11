import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Bengali, Noto_Serif_Bengali, Playfair_Display } from 'next/font/google'
import { LifeProvider } from '@/lib/life-store'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const notoSerifBn = Noto_Serif_Bengali({ subsets: ['bengali'], variable: '--font-noto-serif-bn', display: 'swap' })
const notoSansBn = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-noto-sans-bn', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://life-so-far.vercel.app'),
  title: {
    default: 'Life So Far: Turn Your Chapters into a Story Card Worth Sharing',
    template: '%s | Life So Far',
  },
  description:
    'Create an elegant, shareable timeline of your milestones. 100% private by design: everything stays right in your browser.',
  keywords: [
    'Life So Far',
    'life timeline',
    'milestones card',
    'life story card',
    'personal timeline generator',
    'shareable story card',
    'আমার জীবন এতদূর',
  ],
  authors: [{ name: 'Life So Far' }],
  creator: 'Life So Far',
  publisher: 'Life So Far',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/life-so-far-logo.png', sizes: 'any' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/life-so-far-logo.png',
    apple: '/life-so-far-logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['bn_BD'],
    url: 'https://life-so-far.vercel.app',
    siteName: 'Life So Far',
    title: 'Life So Far: Turn Your Chapters into a Story Card Worth Sharing',
    description:
      'Create an elegant, shareable timeline of your milestones. 100% private by design: everything stays right in your browser.',
    images: [
      {
        url: '/life-so-far-logo.png',
        width: 1200,
        height: 630,
        alt: 'Life So Far',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life So Far: Turn Your Chapters into a Story Card Worth Sharing',
    description:
      'Create an elegant, shareable timeline of your milestones. 100% private by design: everything stays right in your browser.',
    images: ['/life-so-far-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#faf6ec',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light ${playfair.variable} ${inter.variable} ${notoSerifBn.variable} ${notoSansBn.variable}`}>
      <body className="bg-ivory font-sans text-ink antialiased">
        <LifeProvider>{children}</LifeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
