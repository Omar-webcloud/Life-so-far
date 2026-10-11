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
  const { t, storage, resetAll } = useLife()
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
    <div className="min-h-dvh pb-24 lg:pb-0">
      <header className="sticky top-0 z-30 border-b border-gold/30 bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium" aria-label={t.back}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="font-display text-lg italic">{t.appName}</span>
          </Link>
          <LangSwitch />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="font-display text-3xl font-semibold">{t.editorTitle}</h1>
        <p className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
          <Lock className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
          {t.privacyBody}
        </p>
        {storage === 'unavailable' && <p role="alert" className="mt-3 rounded-lg bg-cream p-3 text-sm text-gold-deep">{t.storageUnavailable}</p>}
        {storage === 'full' && <p role="alert" className="mt-3 rounded-lg bg-cream p-3 text-sm text-gold-deep">{t.storageFull}</p>}

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_440px] lg:items-start">
          <div className={`${view === 'edit' ? 'block' : 'hidden'} space-y-5 lg:block`}>
            <PhotoSection />
            <MilestoneBuilder />
            <CardSettings />
            <button type="button" onClick={() => setConfirmReset(true)} className="min-h-11 text-sm font-medium text-red-800 underline underline-offset-4">
              {t.deleteSaved}
            </button>
          </div>

          <div className={`${view === 'preview' ? 'block' : 'hidden'} lg:sticky lg:top-20 lg:block lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pr-1`}>
            <PreviewPanel />
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/30 bg-ivory/95 p-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => changeView(view === 'edit' ? 'preview' : 'edit')}
          className="mx-auto flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
        >
          {view === 'edit' ? <Eye className="size-4" aria-hidden="true" /> : <Pencil className="size-4" aria-hidden="true" />}
          {view === 'edit' ? t.showPreview : t.showEditor}
        </button>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title={t.resetTitle}>
        <p className="text-sm leading-relaxed text-ink-soft">{t.resetBody}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setConfirmReset(false)} className="min-h-12 rounded-full border border-ink text-sm font-medium hover:bg-cream">
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              resetAll()
              setConfirmReset(false)
            }}
            className="min-h-12 rounded-full bg-red-800 text-sm font-medium text-white hover:bg-red-900"
          >
            {t.resetConfirm}
          </button>
        </div>
      </Modal>
    </div>
  )
}
