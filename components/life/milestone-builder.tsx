'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { categories, suggestions, type Category } from '@/lib/i18n'
import { useLife, type Milestone } from '@/lib/life-store'

const inputCls =
  'min-h-11 w-full rounded-lg border border-gold/40 bg-white px-3 text-base text-ink placeholder:text-ink-soft/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold-deep'

function MilestoneRow({ m, index, total }: { m: Milestone; index: number; total: number }) {
  const { t, updateMilestone, removeMilestone, moveMilestone } = useLife()
  const [open, setOpen] = useState(false)
  const iconBtn =
    'inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-cream disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-gold-deep'

  return (
    <li className="rounded-xl border border-gold/30 bg-white/70 p-3">
      <div className="flex items-center gap-2">
        <span className="w-6 shrink-0 text-center font-display text-lg italic text-gold-deep">{index + 1}</span>
        <input
          aria-label={t.titleLabel}
          value={m.title}
          onChange={(e) => updateMilestone(m.id, { title: e.target.value })}
          className={inputCls}
          maxLength={80}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-1">
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={m.included} onChange={(e) => updateMilestone(m.id, { included: e.target.checked })} className="size-5 accent-gold-deep" />
          {t.includeLabel}
        </label>
        <div className="flex items-center">
          <button type="button" className={iconBtn} disabled={index === 0} onClick={() => moveMilestone(m.id, -1)} aria-label={`${t.moveUp}: ${m.title}`}>
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={iconBtn} disabled={index === total - 1} onClick={() => moveMilestone(m.id, 1)} aria-label={`${t.moveDown}: ${m.title}`}>
            <ArrowDown className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={iconBtn} onClick={() => removeMilestone(m.id)} aria-label={`${t.delete}: ${m.title}`}>
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mt-1 inline-flex min-h-9 items-center gap-1 text-sm font-medium text-gold-deep"
      >
        <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        {open ? t.lessDetails : t.moreDetails}
      </button>
      {open && (
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">{t.categoryLabel}</span>
            <select value={m.category} onChange={(e) => updateMilestone(m.id, { category: e.target.value as Category })} className={inputCls}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {t[`cat_${c}` as const]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">{t.whenLabel}</span>
            <input value={m.when} onChange={(e) => updateMilestone(m.id, { when: e.target.value })} placeholder={t.whenPlaceholder} maxLength={24} className={inputCls} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">{t.emojiLabel}</span>
            <input value={m.emoji} onChange={(e) => updateMilestone(m.id, { emoji: Array.from(e.target.value).slice(0, 2).join('') })} className={inputCls} />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block text-ink-soft">{t.descLabel}</span>
            <textarea
              value={m.description}
              onChange={(e) => updateMilestone(m.id, { description: e.target.value })}
              maxLength={120}
              rows={2}
              className={`${inputCls} py-2`}
            />
          </label>
        </div>
      )}
    </li>
  )
}

export function MilestoneBuilder() {
  const { state, t, addMilestone } = useLife()
  const [custom, setCustom] = useState('')
  const lang = state.lang
  const selected = state.milestones.filter((m) => m.included).length

  function submitCustom(e: React.FormEvent) {
    e.preventDefault()
    const title = custom.trim()
    if (!title) return
    addMilestone({ title })
    setCustom('')
  }

  return (
    <section aria-labelledby="ms-h" className="rounded-xl border border-gold/30 bg-white/50 p-5">
      <h2 id="ms-h" className="font-display text-xl font-semibold">
        {t.milestonesTitle}
      </h2>

      <p className="mt-3 text-sm text-ink-soft">{t.suggestions}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => addMilestone({ title: s[lang], category: s.category, emoji: s.emoji })}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-gold/60 bg-ivory px-4 text-sm transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-gold-deep"
          >
            <Plus className="size-4 text-gold-deep" aria-hidden="true" />
            {s[lang]}
          </button>
        ))}
      </div>

      <form onSubmit={submitCustom} className="mt-4 flex gap-2">
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={t.addCustomPlaceholder} aria-label={t.addCustomPlaceholder} maxLength={80} className={inputCls} />
        <button type="submit" className="min-h-11 shrink-0 rounded-full bg-ink px-5 text-sm font-medium text-ivory hover:bg-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep">
          {t.add}
        </button>
      </form>

      {state.milestones.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-gold/50 p-4 text-center text-sm text-ink-soft">{t.emptyMilestones}</p>
      ) : (
        <>
          <ol className="mt-5 space-y-3">
            {state.milestones.map((m, i) => (
              <MilestoneRow key={m.id} m={m} index={i} total={state.milestones.length} />
            ))}
          </ol>
          {selected > 15 && <p className="mt-3 text-sm text-gold-deep">{t.tooMany}</p>}
          {selected < 3 && <p className="mt-3 text-sm text-ink-soft">{t.fewHint}</p>}
        </>
      )}
    </section>
  )
}
