'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight, Sparkles, Download } from 'lucide-react'
import { ScaledCard } from './scaled-card'
import type { Lang } from '@/lib/i18n'

export type SharedCardData = {
  lang: Lang
  cardTitle: string
  nickname: string
  age: string
  showAge: boolean
  showDates: boolean
  showDescriptions: boolean
  milestones: Array<{
    id: string
    title: string
    when: string
    description: string
    emoji: string
  }>
  photo?: string | null
}

export function SharedCardView({ card }: { card: SharedCardData }) {
  const [copied, setCopied] = useState(false)

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  const downloadCard = () => {
    const url = new URL('/api/download', window.location.origin)
    const currentParams = new URLSearchParams(window.location.search)
    const id = currentParams.get('id')
    const d = currentParams.get('d')
    if (id) url.searchParams.set('id', id)
    if (d) url.searchParams.set('d', d)
    window.location.href = url.toString()
  }

  const isBn = card.lang === 'bn'

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 border-b border-gold/30">
        <Link href="/" className="font-display text-xl font-semibold italic text-ink hover:text-gold-deep transition-colors">
          Life So Far
        </Link>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-medium text-ivory hover:bg-ink/90 transition-colors shadow-sm"
        >
          <Sparkles className="size-4 text-gold" />
          <span>{isBn ? 'নিজের কার্ড তৈরি করুন' : 'Create Your Story'}</span>
        </Link>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8 sm:py-12">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-deep border border-gold/30">
            {isBn ? 'শেয়ার করা টাইমলাইন' : 'Shared Timeline'}
          </span>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold">
            {card.nickname ? (isBn ? `${card.nickname}-এর জীবনের গল্প` : `${card.nickname}'s Story`) : (card.cardTitle || 'Life So Far')}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {isBn
              ? 'নিচে জীবনের স্মরণীয় মুহূর্তগুলোর কার্ডটি দেখুন।'
              : 'Explore the milestones and chapters in this journey below.'}
          </p>
        </div>

        {/* The Card */}
        <div className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-gold/40 bg-white">
          <ScaledCard
            lang={card.lang}
            cardTitle={card.cardTitle}
            nickname={card.nickname}
            age={card.age}
            showAge={card.showAge}
            showDates={card.showDates}
            showDescriptions={card.showDescriptions}
            milestones={card.milestones}
            photo={card.photo || null}
            photoZoom={1}
            photoX={50}
            photoY={40}
            brand="life-so-far.vercel.app"
          />
        </div>

        {/* CTAs */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={downloadCard}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 px-6 text-base font-medium text-ivory hover:bg-ink/90 transition-colors shadow-md"
          >
            <Download className="size-4" />
            <span>{isBn ? 'কার্ড ডাউনলোড করুন' : 'Download Card Image'}</span>
          </button>

          <button
            type="button"
            onClick={copyUrl}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gold bg-white/70 py-3 px-6 text-sm font-medium text-ink hover:bg-cream transition-colors"
          >
            {copied ? <Check className="size-4 text-emerald-700" /> : <Copy className="size-4 text-gold-deep" />}
            <span>{copied ? (isBn ? 'লিংক কপি হয়েছে!' : 'Link copied to clipboard!') : (isBn ? 'এই কার্ডের লিংক কপি করুন' : 'Copy link to this card')}</span>
          </button>

          <Link
            href="/create"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 bg-cream/40 py-3 px-6 text-sm font-medium text-ink hover:bg-cream transition-colors"
          >
            <span>{isBn ? 'আপনার নিজের জীবনের গল্প তৈরি করুন' : 'Create Your Own Life Story'}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 rounded-xl border border-gold/30 bg-cream/70 p-5 text-center">
          <h3 className="font-display text-lg font-semibold">
            {isBn ? 'আপনার জীবন এতদূর কেমন কাটল?' : 'What does your life look like so far?'}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {isBn
              ? 'স্কুলের প্রথম দিন থেকে শুরু করে জীবনের সেরা মুহূর্তগুলো নিয়ে নিজের কার্ড বানান মাত্র ২ মিনিটে।'
              : 'Turn your milestones, memories, and big moments into an elegant card you can share with loved ones.'}
          </p>
          <div className="mt-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:underline"
            >
              <span>{isBn ? 'বিনামূল্যে শুরু করুন' : 'Get started for free'}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gold/30 py-6 text-center text-xs text-ink-soft">
        <p>Life So Far · 100% Private · Processed in your browser</p>
      </footer>
    </div>
  )
}
