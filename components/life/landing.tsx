'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useLife } from '@/lib/life-store'
import { LangSwitch } from './lang-switch'
import { SampleCard } from './sample-card'

export function Landing() {
  const { t } = useLife()
  const steps = [
    { n: '01', title: t.how1, body: t.how1d },
    { n: '02', title: t.how2, body: t.how2d },
    { n: '03', title: t.how3, body: t.how3d },
  ]
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <span className="font-display text-xl font-semibold italic">Life So Far</span>
        <LangSwitch />
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16 lg:pt-14">
          <div className="text-center lg:text-left">
            <h1 className="font-display text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-ink-soft sm:text-lg lg:mx-0">{t.heroText}</p>
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/create"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-7 text-base font-medium text-ivory transition-colors hover:bg-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
              >
                {t.ctaCreate}
              </Link>
            </div>
            <p className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-soft lg:justify-start">
              <Lock className="size-4 text-gold-deep" aria-hidden="true" />
              {t.privacyShort}
            </p>
          </div>

          <div id="example" className="grid scroll-mt-6 grid-cols-2 gap-3 sm:gap-6">
            <figure className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-md shadow-xl ring-1 ring-gold/30 sm:translate-y-4">
                <SampleCard withPhoto />
              </div>
              <figcaption className="mt-1 text-center text-xs font-medium uppercase tracking-widest text-gold-deep sm:mt-5">{t.withPhoto}</figcaption>
            </figure>
            <figure className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-md shadow-xl ring-1 ring-gold/30">
                <SampleCard withPhoto={false} />
              </div>
              <figcaption className="text-center text-xs font-medium uppercase tracking-widest text-gold-deep">{t.withoutPhoto}</figcaption>
            </figure>
            <p className="col-span-2 text-center text-sm text-ink-soft">{t.photoOptionalNote}</p>
          </div>
        </section>

        <section className="border-y border-gold/30 bg-cream/60">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <h2 className="font-display text-center text-3xl font-semibold">{t.howTitle}</h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="border-t border-gold pt-4">
                  <span className="font-display text-3xl italic text-gold-deep">{s.n}</span>
                  <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-pretty leading-relaxed text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="font-display text-balance text-2xl italic leading-snug sm:text-3xl">{t.closing}</p>
          <Link
            href="/create"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-7 text-base font-medium text-ivory transition-colors hover:bg-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
          >
            {t.ctaCreate}
          </Link>
        </section>
      </main>

      <footer className="border-t border-gold/30 px-5 py-6 text-center text-sm text-ink-soft">
        <span className="font-semibold text-ink">{t.privacyTitle}.</span> {t.privacyBody}
      </footer>
    </div>
  )
}
