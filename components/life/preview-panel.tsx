'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Copy, Download, Loader2, Share2 } from 'lucide-react'
import { exportCard, isInAppBrowser, triggerDownload, type ExportFormat } from '@/lib/export'
import { useLife } from '@/lib/life-store'
import { Modal } from './modal'
import { ScaledCard } from './scaled-card'

const btn =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep disabled:opacity-60'

export function PreviewPanel() {
  const { state, photo, t } = useLife()
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState<ExportFormat | 'share' | null>(null)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [saveUrl, setSaveUrl] = useState<string | null>(null)
  const [inApp, setInApp] = useState(false)
  const [brand, setBrand] = useState<string | undefined>()
  const [shareUrl, setShareUrl] = useState('')
  const [hasShare, setHasShare] = useState(false)

  useEffect(() => {
    setInApp(isInAppBrowser())
    setBrand(window.location.host)
    setShareUrl(window.location.origin)
    setHasShare(typeof navigator.share === 'function')
  }, [])

  useEffect(() => {
    return () => {
      if (saveUrl) URL.revokeObjectURL(saveUrl)
    }
  }, [saveUrl])

  const milestones = useMemo(() => state.milestones.filter((m) => m.included && m.title.trim()), [state.milestones])

  function notify(text: string, error = false) {
    setMessage(text)
    setIsError(error)
  }

  async function makeBlob(format: ExportFormat) {
    if (!cardRef.current) throw new Error('no card')
    return exportCard(cardRef.current, format)
  }

  async function download(format: ExportFormat, forceSaveScreen = false) {
    setBusy(format)
    notify('')
    try {
      const blob = await makeBlob(format)
      const ext = format === 'png' ? 'png' : 'jpg'
      if (forceSaveScreen || inApp) {
        setSaveUrl(URL.createObjectURL(blob))
      } else {
        triggerDownload(blob, `life-so-far.${ext}`)
      }
    } catch {
      notify(t.exportFailed, true)
    } finally {
      setBusy(null)
    }
  }

  async function nativeShare() {
    setBusy('share')
    notify('')
    try {
      const blob = await makeBlob('png')
      const file = new File([blob], 'life-so-far.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: t.shareText, url: shareUrl })
      } else {
        notify(t.shareFallback)
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) notify(t.exportFailed, true)
    } finally {
      setBusy(null)
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      notify(t.linkCopied)
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = shareUrl
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        ta.remove()
        notify(ok ? t.linkCopied : t.copyFailed, !ok)
      } catch {
        notify(t.copyFailed, true)
      }
    }
  }

  function openInBrowser() {
    window.open(window.location.href, '_blank', 'noopener')
  }

  const loading = busy !== null

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md shadow-xl ring-1 ring-gold/30">
        <ScaledCard
          ref={cardRef}
          lang={state.lang}
          cardTitle={state.cardTitle}
          nickname={state.nickname}
          age={state.age}
          showAge={state.showAge}
          showDates={state.showDates}
          showDescriptions={state.showDescriptions}
          milestones={milestones}
          photo={photo}
          photoZoom={state.photoZoom}
          photoX={state.photoX}
          photoY={state.photoY}
          brand={brand}
        />
      </div>
      <p className="text-center text-xs text-ink-soft">
        {photo ? t.layoutWithPhoto : t.layoutNoPhoto} · {t.previewNote}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" disabled={loading} onClick={() => download('png')} className={`${btn} bg-ink text-ivory hover:bg-ink/90`}>
          {busy === 'png' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Download className="size-4" aria-hidden="true" />}
          {t.downloadPng}
        </button>
        <button type="button" disabled={loading} onClick={() => download('jpg')} className={`${btn} border border-ink text-ink hover:bg-cream`}>
          {busy === 'jpg' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Download className="size-4" aria-hidden="true" />}
          {t.downloadJpg}
        </button>
      </div>

      <div className="rounded-xl border border-gold/30 bg-white/50 p-4">
        <h3 className="font-display text-lg font-semibold">{t.share}</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {hasShare && (
            <button type="button" disabled={loading} onClick={nativeShare} className={`${btn} col-span-2 border border-gold text-ink hover:bg-cream`}>
              {busy === 'share' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}
              {t.shareNative}
            </button>
          )}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} border border-gold text-ink hover:bg-cream`}
          >
            {t.shareFacebook}
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${t.shareText} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} border border-gold text-ink hover:bg-cream`}
          >
            {t.shareWhatsapp}
          </a>
          <button type="button" onClick={copyLink} className={`${btn} col-span-2 border border-gold text-ink hover:bg-cream`}>
            <Copy className="size-4" aria-hidden="true" />
            {t.copyLink}
          </button>
        </div>
        <button type="button" disabled={loading} onClick={() => download('png', true)} className="mt-3 min-h-11 w-full text-sm font-medium text-gold-deep underline underline-offset-4">
          {t.saveScreen}
        </button>
      </div>

      <div aria-live="polite" role="status" className={`min-h-5 text-center text-sm ${isError ? 'text-red-800' : 'text-ink-soft'}`}>
        {loading && busy !== 'share' ? t.generating : message}
      </div>

      <p className="text-balance rounded-xl bg-cream/70 p-4 text-center font-display text-lg italic leading-snug">{t.invite}</p>

      <Modal open={!!saveUrl} onClose={() => setSaveUrl(null)} title={t.saveScreenTitle}>
        <p className="text-sm leading-relaxed text-ink-soft">{t.saveScreenBody}</p>
        {inApp && <p className="mt-2 text-sm leading-relaxed text-gold-deep">{t.inAppNote}</p>}
        {saveUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={saveUrl} alt={t.saveScreenTitle} className="mx-auto mt-4 w-full max-w-xs rounded-md ring-1 ring-gold/40" />
        )}
        <div className="mt-4 grid gap-2">
          <button type="button" onClick={openInBrowser} className={`${btn} border border-gold text-ink hover:bg-cream`}>
            {t.openInBrowser}
          </button>
          <button type="button" onClick={() => setSaveUrl(null)} className={`${btn} bg-ink text-ivory hover:bg-ink/90`}>
            {t.close}
          </button>
        </div>
      </Modal>
    </div>
  )
}
