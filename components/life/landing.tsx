'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Feather,
  ImageIcon,
  Lock,
  Share2,
} from 'lucide-react'
import { useLife } from '@/lib/life-store'
import { LangSwitch } from './lang-switch'
import { SampleCard } from './sample-card'

export function Landing() {
  const { t, loadSample } = useLife()
  const isBn = t.appName === 'আমার জীবন এতদূর'

  const steps = [
    {
      n: '01',
      roman: 'I',
      icon: <BookOpen className="size-5 text-gold-deep" />,
      title: t.how1,
      body: t.how1d,
    },
    {
      n: '02',
      roman: 'II',
      icon: <ImageIcon className="size-5 text-gold-deep" />,
      title: t.how2,
      body: t.how2d,
    },
    {
      n: '03',
      roman: 'III',
      icon: <Share2 className="size-5 text-gold-deep" />,
      title: t.how3,
      body: t.how3d,
    },
  ]

  const occasions = [
    { icon: '🎒', label: isBn ? 'শৈশব ও স্কুল' : 'Early Years & School' },
    { icon: '🎓', label: isBn ? 'গ্র্যাজুয়েশন' : 'University & Degrees' },
    { icon: '💼', label: isBn ? 'ক্যারিয়ারের শুরু' : 'First Jobs & Career' },
    { icon: '✈️', label: isBn ? 'ভ্রমণের স্মৃতি' : 'Solo Trips & Travels' },
    { icon: '💍', label: isBn ? 'নতুন অধ্যায়' : 'Love & Milestones' },
    { icon: '🌟', label: isBn ? 'জীবনের অর্জন' : 'Turning Points' },
  ]

  return (
    <div className="min-h-dvh bg-paper-grain selection:bg-gold/30 selection:text-ink">
      {/* Artisanal Header */}
      <header className="sticky top-0 z-30 border-b border-gold/25 bg-ivory/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full border border-gold/40 bg-white text-gold-deep shadow-2xs group-hover:border-gold-deep group-hover:bg-cream transition-all">
              <span className="font-display font-bold italic text-sm">LS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-semibold italic text-ink tracking-tight group-hover:text-gold-deep transition-colors">
                Life So Far
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-gold-deep font-semibold">
                Timeless Story Cards
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <LangSwitch />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-8 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16 lg:pt-16">
          <div className="text-center lg:text-left space-y-6">
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-deep shadow-2xs">
              <BookMarked className="size-3.5 text-gold-deep" />
              <span>{isBn ? 'ব্যক্তিগত স্মৃতি কার্ড' : '✦ Timeless Memoir Cards ✦'}</span>
            </div>

            <h1 className="font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {t.heroTitle}
            </h1>

            <p className="mx-auto max-w-lg text-pretty text-base leading-relaxed text-ink-soft sm:text-lg lg:mx-0">
              {t.heroText}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/create"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-ink px-8 text-base font-semibold text-ivory shadow-md transition-all hover:bg-ink/90 hover:shadow-lg btn-tactile focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
              >
                <span>{t.ctaCreate}</span>
                <ArrowRight className="size-4 text-gold-light transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/create"
                onClick={loadSample}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/60 bg-white/80 px-6 text-sm font-semibold text-ink shadow-2xs hover:bg-cream hover:border-gold-deep transition-all btn-tactile"
              >
                <BookMarked className="size-4 text-gold-deep" />
                <span>{t.trySample}</span>
              </Link>
            </div>

            <p className="flex items-center justify-center gap-2 text-xs sm:text-sm text-ink-soft lg:justify-start pt-1">
              <Lock className="size-3.5 text-gold-deep" aria-hidden="true" />
              {t.privacyShort}
            </p>
          </div>

          {/* Exhibition Showcase Easel */}
          <div id="example" className="relative">
            {/* Ambient warm glow halo */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-gold/15 via-gold-light/20 to-cream opacity-70 blur-xl pointer-events-none" />

            <div className="relative grid grid-cols-2 gap-3.5 sm:gap-6">
              {/* Card 1: With Photo */}
              <figure className="group flex flex-col gap-2.5">
                <div className="overflow-hidden rounded-xl bg-ivory shadow-xl ring-1 ring-gold/40 border-filigree transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl sm:translate-y-4">
                  <SampleCard withPhoto />
                </div>
                <figcaption className="mt-2 text-center text-xs font-semibold uppercase tracking-wider text-gold-deep sm:mt-6 flex items-center justify-center gap-1">
                  <span>✦</span>
                  <span>{t.withPhoto}</span>
                  <span>✦</span>
                </figcaption>
              </figure>

              {/* Card 2: Minimalist Typographic */}
              <figure className="group flex flex-col gap-2.5">
                <div className="overflow-hidden rounded-xl bg-ivory shadow-xl ring-1 ring-gold/40 border-filigree transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl">
                  <SampleCard withPhoto={false} />
                </div>
                <figcaption className="mt-2 text-center text-xs font-semibold uppercase tracking-wider text-gold-deep flex items-center justify-center gap-1">
                  <span>✦</span>
                  <span>{t.withoutPhoto}</span>
                  <span>✦</span>
                </figcaption>
              </figure>

              <div className="col-span-2 text-center rounded-xl bg-cream/50 p-2.5 border border-gold/20">
                <p className="text-xs text-ink-soft italic">{t.photoOptionalNote}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Occasions Banner */}
        <section className="border-y border-gold/25 bg-cream/40 py-6">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-deep mr-2">
                {isBn ? 'যেকোনো স্মৃতির জন্য:' : 'For Every Milestone:'}
              </span>
              {occasions.map((occ, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white/80 px-3 py-1 text-xs font-medium text-ink shadow-2xs"
                >
                  <span>{occ.icon}</span>
                  <span>{occ.label}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Three Simple Steps Section */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
              {isBn ? 'সহজ প্রক্রিয়া' : 'The Archival Process'}
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              {t.howTitle}
            </h2>
          </div>

          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.n}
                className="group relative rounded-2xl border border-gold/30 bg-white/70 p-6 shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gold-deep/60"
              >
                <div className="flex items-center justify-between border-b border-gold/15 pb-4">
                  <span className="font-display text-2xl font-semibold italic text-gold-deep">
                    {s.roman}
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-full bg-cream ring-1 ring-gold/30">
                    {s.icon}
                  </div>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Poetic Closing Invitation */}
        <section className="relative mx-auto max-w-3xl px-5 py-20 text-center space-y-6">
          <div className="flex justify-center text-gold-deep">
            <Feather className="size-6 text-gold-deep opacity-75" />
          </div>
          <p className="font-display text-balance text-2xl italic leading-snug sm:text-3xl text-ink">
            {t.closing}
          </p>
          <div className="pt-2">
            <Link
              href="/create"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-ink px-8 text-base font-semibold text-ivory shadow-md transition-all hover:bg-ink/90 hover:shadow-lg btn-tactile focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
            >
              <span>{t.ctaCreate}</span>
              <ArrowRight className="size-4 text-gold-light" />
            </Link>
          </div>
        </section>
      </main>

      {/* Artisanal Colophon Footer */}
      <footer className="border-t border-gold/30 bg-ivory/95 px-5 py-8 text-center text-xs text-ink-soft">
        <div className="mx-auto max-w-3xl space-y-2">
          <p className="font-display text-sm italic text-ink">
            ✦ Life So Far · Preserving the chapters that shape us ✦
          </p>
          <p className="leading-relaxed">
            <span className="font-semibold text-ink">{t.privacyTitle}.</span> {t.privacyBody}
          </p>
        </div>
      </footer>
    </div>
  )
}
