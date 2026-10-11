'use client'

import { useLife } from '@/lib/life-store'

const inputCls =
  'min-h-11 w-full rounded-lg border border-gold/40 bg-white px-3 text-base text-ink placeholder:text-ink-soft/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold-deep'

export function CardSettings() {
  const { state, update, t } = useLife()
  const toggles = [
    { key: 'showAge', label: t.showAge, value: state.showAge },
    { key: 'showDates', label: t.showDates, value: state.showDates },
    { key: 'showDescriptions', label: t.showDescriptions, value: state.showDescriptions },
  ] as const

  return (
    <section aria-labelledby="cs-h" className="rounded-xl border border-gold/30 bg-white/50 p-5">
      <h2 id="cs-h" className="font-display text-xl font-semibold">
        {t.cardSettings}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-ink-soft">{t.cardTitleLabel}</span>
          <input value={state.cardTitle} onChange={(e) => update({ cardTitle: e.target.value })} placeholder={t.defaultCardTitle} maxLength={40} className={inputCls} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-ink-soft">{t.nicknameLabel}</span>
          <input value={state.nickname} onChange={(e) => update({ nickname: e.target.value })} placeholder={t.nicknamePlaceholder} maxLength={24} className={inputCls} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-ink-soft">{t.ageLabel}</span>
          <input
            inputMode="numeric"
            value={state.age}
            onChange={(e) => update({ age: e.target.value.replace(/\D/g, '').slice(0, 3) })}
            placeholder={t.agePlaceholder}
            className={inputCls}
          />
        </label>
      </div>
      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-ink">{t.privacyControls}</legend>
        <div className="mt-1 divide-y divide-gold/20">
          {toggles.map((x) => (
            <label key={x.key} className="flex min-h-12 cursor-pointer items-center justify-between gap-4 text-sm">
              {x.label}
              <input type="checkbox" role="switch" checked={x.value} onChange={(e) => update({ [x.key]: e.target.checked })} className="size-5 accent-gold-deep" />
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
