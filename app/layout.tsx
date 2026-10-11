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
  title: 'Life So Far — turn your chapters into a card worth sharing',
  description:
    'Build a personal timeline of your milestones and share it as a beautiful card. Private by design: everything stays in your browser.',
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
