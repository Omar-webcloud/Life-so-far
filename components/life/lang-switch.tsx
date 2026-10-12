'use client'

import { useLife } from '@/lib/life-store'

export function LangSwitch() {
  const { state, setLang, t } = useLife()
  const opts = [
    { id: 'en', label: 'English', short: 'EN' },
    { id: 'bn', label: 'বাংলা', short: 'বাং' },
  ] as const

  return (
    <div
      role="group"
      aria-label={t.langSwitch}
      className="inline-flex items-center rounded-full border border-gold/40 bg-cream/70 p-1 shadow-xs backdrop-blur-xs ring-1 ring-gold/15"
    >
      {opts.map((o) => {
        const active = state.lang === o.id
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(o.id)}
            className={`relative min-h-8 min-w-10 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold-deep ${
              active
                ? 'bg-ink text-ivory shadow-xs ring-1 ring-gold/40'
                : 'text-ink-soft hover:text-ink hover:bg-cream/80'
            }`}
          >
            <span>{o.short}</span>
          </button>
        )
      })}
    </div>
  )
}
