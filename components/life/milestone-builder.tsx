'use client'

import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  BookMarked,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Compass,
  GraduationCap,
  Heart,
  Layers,
  Plus,
  Trophy,
  Briefcase,
  Trash2,
} from 'lucide-react'
import { categories, suggestions, type Category } from '@/lib/i18n'
import { useLife, type Milestone } from '@/lib/life-store'

const inputCls =
  'min-h-11 w-full rounded-lg border border-gold/35 bg-white/95 px-3.5 text-base text-ink shadow-inner/5 placeholder:text-ink-soft/60 transition-all focus:border-gold-deep focus:bg-white focus:ring-2 focus:ring-gold/30 focus-visible:outline-none'

function MilestoneRow({ m, index, total }: { m: Milestone; index: number; total: number }) {
  const { t, updateMilestone, removeMilestone, moveMilestone } = useLife()
  const [open, setOpen] = useState(false)
  const iconBtn =
    'inline-flex size-9 items-center justify-center rounded-full text-ink-soft hover:text-ink hover:bg-cream/90 disabled:opacity-20 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-gold-deep'

  return (
    <li
      className={`rounded-xl border transition-all duration-200 ${
        m.included
          ? 'border-gold/40 bg-white/90 shadow-2xs'
          : 'border-gold/20 bg-cream/30 opacity-70'
      } p-3.5`}
    >
      <div className="flex items-center gap-2.5">
        {/* Chapter seal index */}
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cream text-xs font-display font-semibold italic text-gold-deep ring-1 ring-gold/30">
          {index + 1}
        </span>

        {/* Title input */}
        <div className="relative flex-1">
          <input
            aria-label={t.titleLabel}
            value={m.title}
            onChange={(e) => updateMilestone(m.id, { title: e.target.value })}
            className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-base font-medium text-ink hover:border-gold/30 focus:border-gold-deep focus:bg-white focus:ring-2 focus:ring-gold/20 focus-visible:outline-none transition-all"
            maxLength={80}
            placeholder={t.titleLabel}
          />
        </div>

        {/* When badge if present */}
        {m.when.trim() && (
          <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-cream/80 px-2 py-0.5 text-xs font-medium text-gold-deep border border-gold/30">
            <Calendar className="size-3" />
            {m.when}
          </span>
        )}

        {/* Reorder and Delete controls */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className={iconBtn}
            disabled={index === 0}
            onClick={() => moveMilestone(m.id, -1)}
            aria-label={`${t.moveUp}: ${m.title}`}
            title={t.moveUp}
          >
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={iconBtn}
            disabled={index === total - 1}
            onClick={() => moveMilestone(m.id, 1)}
            aria-label={`${t.moveDown}: ${m.title}`}
            title={t.moveDown}
          >
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${iconBtn} hover:text-red-700 hover:bg-red-50`}
            onClick={() => removeMilestone(m.id)}
            aria-label={`${t.delete}: ${m.title}`}
            title={t.delete}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-gold/15 pt-2 text-xs">
        {/* Bespoke included toggle button */}
        <button
          type="button"
          onClick={() => updateMilestone(m.id, { included: !m.included })}
          className="inline-flex items-center gap-2 cursor-pointer font-medium text-ink-soft hover:text-ink transition-colors"
        >
          <span
            className={`flex size-4.5 items-center justify-center rounded-sm border transition-colors ${
              m.included
                ? 'border-gold-deep bg-ink text-ivory'
                : 'border-gold/40 bg-white text-transparent'
            }`}
          >
            <Check className="size-3 stroke-[3]" />
          </span>
          <span>{t.includeLabel}</span>
        </button>

        {/* Details accordion trigger */}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1 font-medium text-gold-deep hover:text-ink transition-colors cursor-pointer"
        >
          <span>{open ? t.lessDetails : t.moreDetails}</span>
          <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="mt-3 grid gap-3 rounded-lg border border-gold/20 bg-cream/30 p-3 sm:grid-cols-2 animate-in fade-in-50 duration-200">
          <label className="text-xs">
            <span className="mb-1 block font-medium text-ink-soft">{t.categoryLabel}</span>
            <select
              value={m.category}
              onChange={(e) => updateMilestone(m.id, { category: e.target.value as Category })}
              className={`${inputCls} min-h-10 text-sm`}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {t[`cat_${c}` as const]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="mb-1 block font-medium text-ink-soft">{t.whenLabel}</span>
            <input
              value={m.when}
              onChange={(e) => updateMilestone(m.id, { when: e.target.value })}
              placeholder={t.whenPlaceholder}
              maxLength={24}
              className={`${inputCls} min-h-10 text-sm`}
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block font-medium text-ink-soft">{t.emojiLabel}</span>
            <input
              value={m.emoji}
              onChange={(e) => updateMilestone(m.id, { emoji: Array.from(e.target.value).slice(0, 2).join('') })}
              className={`${inputCls} min-h-10 text-sm`}
              placeholder="e.g. 🎓 or ✨"
            />
          </label>
          <label className="text-xs sm:col-span-2">
            <span className="mb-1 block font-medium text-ink-soft">{t.descLabel}</span>
            <textarea
              value={m.description}
              onChange={(e) => updateMilestone(m.id, { description: e.target.value })}
              maxLength={120}
              rows={2}
              className={`${inputCls} py-2 text-sm`}
              placeholder="A short memorable memory or quote..."
            />
          </label>
        </div>
      )}
    </li>
  )
}

export function MilestoneBuilder() {
  const { state, t, addMilestone, loadSample } = useLife()
  const [custom, setCustom] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const lang = state.lang
  const selected = state.milestones.filter((m) => m.included).length

  function submitCustom(e: React.FormEvent) {
    e.preventDefault()
    const title = custom.trim()
    if (!title) return
    addMilestone({ title })
    setCustom('')
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    all: <Layers className="size-3.5" />,
    education: <GraduationCap className="size-3.5" />,
    career: <Briefcase className="size-3.5" />,
    travel: <Compass className="size-3.5" />,
    achievement: <Trophy className="size-3.5" />,
    personal: <Heart className="size-3.5" />,
  }

  const filteredSuggestions = activeCategory === 'all'
    ? suggestions
    : suggestions.filter((s) => s.category === activeCategory)

  return (
    <section aria-labelledby="ms-h" className="rounded-2xl border border-gold/30 bg-white/70 p-5 shadow-xs backdrop-blur-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-cream text-gold-deep ring-1 ring-gold/30">
            <BookOpen className="size-4" aria-hidden="true" />
          </div>
          <h2 id="ms-h" className="font-display text-xl font-semibold tracking-tight text-ink">
            {t.milestonesTitle}
          </h2>
        </div>

        {/* Story Balance pill */}
        <div className="inline-flex items-center gap-2 rounded-full bg-cream/70 px-3 py-1 text-xs border border-gold/25">
          <span className="font-medium text-ink-soft">
            {t.storyProgress}: <strong className="text-ink font-semibold">{selected}</strong> {t.chaptersAdded}
          </span>
          <span
            className={`size-2 rounded-full ${
              selected >= 4 && selected <= 12
                ? 'bg-emerald-600'
                : selected > 12
                ? 'bg-amber-500'
                : 'bg-gold-deep'
            }`}
          />
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-gold/20 pb-3">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-ink text-ivory shadow-2xs'
              : 'bg-cream/50 text-ink-soft hover:bg-cream hover:text-ink'
          }`}
        >
          {categoryIcons.all}
          {t.allCategories}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-ink text-ivory shadow-2xs'
                : 'bg-cream/50 text-ink-soft hover:bg-cream hover:text-ink'
            }`}
          >
            {categoryIcons[cat]}
            {t[`cat_${cat}` as const]}
          </button>
        ))}
      </div>

      {/* Filtered suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {filteredSuggestions.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => addMilestone({ title: s[lang], category: s.category, emoji: s.emoji })}
            className="group inline-flex min-h-9 items-center gap-1.5 rounded-full border border-gold/40 bg-white/90 px-3.5 py-1 text-xs font-medium text-ink shadow-2xs transition-all hover:-translate-y-0.5 hover:border-gold-deep hover:bg-cream/80 focus-visible:outline-2 focus-visible:outline-gold-deep cursor-pointer"
          >
            <span className="text-sm">{s.emoji}</span>
            <span>{s[lang]}</span>
            <Plus className="size-3 text-gold-deep transition-transform group-hover:rotate-90" aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Add custom milestone form */}
      <form onSubmit={submitCustom} className="mt-4 flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder={t.addCustomPlaceholder}
          aria-label={t.addCustomPlaceholder}
          maxLength={80}
          className={inputCls}
        />
        <button
          type="submit"
          className="min-h-11 shrink-0 rounded-lg bg-ink px-5 text-sm font-medium text-ivory hover:bg-ink/90 transition-all btn-tactile cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
        >
          {t.add}
        </button>
      </form>

      {/* Empty state with Load Sample Story button */}
      {state.milestones.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-gold/40 bg-cream/20 p-6 text-center space-y-3">
          <p className="text-sm text-ink-soft leading-relaxed">{t.emptyMilestones}</p>
          <button
            type="button"
            onClick={loadSample}
            className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-white px-4 py-2 text-xs font-semibold text-gold-deep shadow-2xs hover:bg-cream hover:border-gold-deep transition-all cursor-pointer"
          >
            <BookMarked className="size-3.5" />
            {t.loadSample}
          </button>
        </div>
      ) : (
        <>
          <ol className="mt-5 space-y-2.5">
            {state.milestones.map((m, i) => (
              <MilestoneRow key={m.id} m={m} index={i} total={state.milestones.length} />
            ))}
          </ol>

          {selected > 15 && (
            <p className="mt-3 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              {t.tooMany}
            </p>
          )}
          {selected < 3 && (
            <p className="mt-3 text-xs text-ink-soft bg-cream/50 p-2.5 rounded-lg border border-gold/20">
              {t.fewHint}
            </p>
          )}
        </>
      )}
    </section>
  )
}
