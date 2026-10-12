'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Lock, Pencil } from 'lucide-react'
import { useLife } from '@/lib/life-store'
import { CardSettings } from './card-settings'
import { LangSwitch } from './lang-switch'
import { MilestoneBuilder } from './milestone-builder'
import { Modal } from './modal'
import { PhotoSection } from './photo-section'
import { PreviewPanel } from './preview-panel'

type View = 'edit' | 'preview'
const VIEW_KEY = 'lsf:view'

export function Editor() {
  const { state, t, storage, resetAll } = useLife()
  const isBn = state.lang === 'bn'
  const [view, setView] = useState<View>('edit')
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(VIEW_KEY) === 'preview') setView('preview')
    } catch {
      /* session storage unavailable */
    }
  }, [])

  function changeView(next: View) {
    setView(next)
    window.scrollTo({ top: 0 })
    try {
      window.sessionStorage.setItem(VIEW_KEY, next)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-h-dvh bg-paper-grain pb-28 lg:pb-12">
      <header className="sticky top-0 z-30 border-b border-gold/30 bg-ivory/90 backdrop-blur-md shadow-2xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2.5 text-sm font-medium transition-colors"
            aria-label={t.back}
          >
            <div className="flex size-8 items-center justify-center rounded-full border border-gold/40 bg-white text-ink shadow-2xs group-hover:border-gold-deep group-hover:bg-cream transition-all">
              <ArrowLeft className="size-4" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold italic text-ink tracking-tight group-hover:text-gold-deep transition-colors">
                Life So Far
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-gold-deep font-semibold">
                {isBn ? 'স্মৃতি স্টুডিও' : 'Story Studio'}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-700/20 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              <span>{t.clientPrivate}</span>
            </div>
            <LangSwitch />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="inline-block rounded-full bg-cream/80 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold-deep border border-gold/30 mb-2">
            {isBn ? '✦ জীবন স্মৃতি কার্ড ✦' : '✦ Your Story Card ✦'}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            {t.editorTitle}
          </h1>
          <p className="mt-2 flex items-start gap-2 text-xs sm:text-sm text-ink-soft max-w-2xl">
            <Lock className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
            {t.privacyBody}
          </p>
        </div>

        {storage === 'unavailable' && (
          <p role="alert" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 shadow-2xs">
            {t.storageUnavailable}
          </p>
        )}
        {storage === 'full' && (
          <p role="alert" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 shadow-2xs">
            {t.storageFull}
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_450px] lg:items-start">
          <div className={`${view === 'edit' ? 'block' : 'hidden'} space-y-6 lg:block`}>
            <PhotoSection />
            <MilestoneBuilder />
            <CardSettings />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="text-xs font-medium text-red-800/80 hover:text-red-900 hover:underline underline-offset-4 cursor-pointer transition-colors"
              >
                {t.deleteSaved}
              </button>
            </div>
          </div>

          <div
            className={`${
              view === 'preview' ? 'block' : 'hidden'
            } lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:pr-2 custom-scrollbar`}
          >
            <PreviewPanel />
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/30 bg-ivory/95 p-3.5 backdrop-blur-md lg:hidden shadow-lg">
        <button
          type="button"
          onClick={() => changeView(view === 'edit' ? 'preview' : 'edit')}
          className="mx-auto flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-ivory shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep btn-tactile"
        >
          {view === 'edit' ? <Eye className="size-4 text-gold-light" aria-hidden="true" /> : <Pencil className="size-4 text-gold-light" aria-hidden="true" />}
          {view === 'edit' ? t.showPreview : t.showEditor}
        </button>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title={t.resetTitle}>
        <p className="text-sm leading-relaxed text-ink-soft">{t.resetBody}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setConfirmReset(false)}
            className="min-h-11 rounded-full border border-gold/40 bg-white text-sm font-medium text-ink hover:bg-cream transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              resetAll()
              setConfirmReset(false)
            }}
            className="min-h-11 rounded-full bg-red-800 text-sm font-medium text-white hover:bg-red-900 transition-colors shadow-xs cursor-pointer"
          >
            {t.resetConfirm}
          </button>
        </div>
      </Modal>
    </div>
  )
}
