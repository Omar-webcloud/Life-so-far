'use client'

import { SlidersHorizontal, Type, User, Calendar } from 'lucide-react'
import { useLife } from '@/lib/life-store'

const inputCls =
  'min-h-11 w-full rounded-lg border border-gold/35 bg-white/90 px-3.5 text-base text-ink shadow-inner/5 placeholder:text-ink-soft/60 transition-all focus:border-gold-deep focus:bg-white focus:ring-2 focus:ring-gold/30 focus-visible:outline-none'

export function CardSettings() {
  const { state, update, t } = useLife()
  const toggles = [
    { key: 'showAge', label: t.showAge, desc: 'Display age alongside chapter count', value: state.showAge },
    { key: 'showDates', label: t.showDates, desc: 'Show year badges for each milestone', value: state.showDates },
    { key: 'showDescriptions', label: t.showDescriptions, desc: 'Include personal notes under chapter titles', value: state.showDescriptions },
  ] as const

  return (
    <section aria-labelledby="cs-h" className="rounded-2xl border border-gold/30 bg-white/70 p-5 shadow-xs backdrop-blur-xs">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-md bg-cream text-gold-deep ring-1 ring-gold/30">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </div>
        <h2 id="cs-h" className="font-display text-xl font-semibold tracking-tight text-ink">
          {t.cardSettings}
        </h2>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 flex items-center gap-1.5 font-medium text-ink-soft">
            <Type className="size-3.5 text-gold-deep" aria-hidden="true" />
            {t.cardTitleLabel}
          </span>
          <input
            value={state.cardTitle}
            onChange={(e) => update({ cardTitle: e.target.value })}
            placeholder={t.defaultCardTitle}
            maxLength={40}
            className={inputCls}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 flex items-center gap-1.5 font-medium text-ink-soft">
            <User className="size-3.5 text-gold-deep" aria-hidden="true" />
            {t.nicknameLabel}
          </span>
          <input
            value={state.nickname}
            onChange={(e) => update({ nickname: e.target.value })}
            placeholder={t.nicknamePlaceholder}
            maxLength={24}
            className={inputCls}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 flex items-center gap-1.5 font-medium text-ink-soft">
            <Calendar className="size-3.5 text-gold-deep" aria-hidden="true" />
            {t.ageLabel}
          </span>
          <input
            inputMode="numeric"
            value={state.age}
            onChange={(e) => update({ age: e.target.value.replace(/\D/g, '').slice(0, 3) })}
            placeholder={t.agePlaceholder}
            className={inputCls}
          />
        </label>
      </div>

      <fieldset className="mt-6 border-t border-gold/25 pt-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-gold-deep">{t.privacyControls}</legend>
        <div className="mt-2 divide-y divide-gold/15">
          {toggles.map((x) => (
            <div key={x.key} className="flex min-h-13 items-center justify-between gap-4 py-2">
              <div className="pr-2">
                <span className="block text-sm font-medium text-ink">{x.label}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={x.value}
                onClick={() => update({ [x.key]: !x.value })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-gold/40 p-0.5 transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
                  x.value ? 'bg-ink' : 'bg-cream'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block size-4.5 transform rounded-full bg-ivory shadow-xs ring-1 ring-gold/30 transition-transform duration-200 ease-in-out ${
                    x.value ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </fieldset>
    </section>
  )
}

