'use client'

import { useLife } from '@/lib/life-store'

export function LangSwitch() {
  const { state, setLang, t } = useLife()
  const opts = [
    { id: 'en', label: 'EN' },
    { id: 'bn', label: 'বাং' },
  ] as const
  return (
    <div role="group" aria-label={t.langSwitch} className="inline-flex rounded-full border border-gold/50 bg-ivory p-0.5 text-sm">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={state.lang === o.id}
          onClick={() => setLang(o.id)}
          className={`min-w-11 rounded-full px-3 py-1.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
            state.lang === o.id ? 'bg-ink text-ivory' : 'text-ink hover:bg-cream'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
