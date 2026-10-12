'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Copy, Download, Loader2, Maximize2, Share2 } from 'lucide-react'
import { exportCard, isInAppBrowser, triggerDownload, type ExportFormat } from '@/lib/export'
import { encodeShareData } from '@/lib/share-codec'
import { useLife } from '@/lib/life-store'
import { Modal } from './modal'
import { ScaledCard } from './scaled-card'

const btn =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep disabled:opacity-60 cursor-pointer'

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

  const serverShareUrlRef = useRef<string | null>(null)
  const isSyncingRef = useRef(false)

  const milestones = useMemo(() => state.milestones.filter((m) => m.included && m.title.trim()), [state.milestones])
  const encodedData = useMemo(() => encodeShareData(state), [state])

  const getBaseUrl = useCallback(() => {
    if (typeof window === 'undefined') return 'https://life-so-far.vercel.app'
    if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
      return 'https://life-so-far.vercel.app'
    }
    return window.location.origin
  }, [])

  const defaultShareUrl = useMemo(() => {
    const base = getBaseUrl()
    return encodedData ? `${base}/share?d=${encodedData}` : `${base}/share`
  }, [encodedData, getBaseUrl])

  useEffect(() => {
    setInApp(isInAppBrowser())
    const host = window.location.host
    setBrand(host.startsWith('localhost') || host.startsWith('127.') ? undefined : host)
    setShareUrl(serverShareUrlRef.current || defaultShareUrl)
    setHasShare(typeof navigator.share === 'function')
  }, [defaultShareUrl])

  useEffect(() => {
    // Delay revocation so any in-progress download from the modal's anchor
    // has time to complete before the object URL is torn down.
    const prev = saveUrl
    return () => {
      if (prev) setTimeout(() => URL.revokeObjectURL(prev), 10_000)
    }
  }, [saveUrl])

  function notify(text: string, error = false) {
    setMessage(text)
    setIsError(error)
  }

  async function makeBlob(format: ExportFormat) {
    if (!cardRef.current) throw new Error('no card')
    return exportCard(cardRef.current, format)
  }

  // Synchronizes the card with the server cache so Facebook crawler gets the exact image
  const ensureServerCard = useCallback(async (): Promise<string> => {
    if (serverShareUrlRef.current) return serverShareUrlRef.current
    if (!cardRef.current) return defaultShareUrl

    try {
      const blob = await makeBlob('png')
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
      const imageBase64 = await base64Promise

      const base = getBaseUrl()
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageBase64,
          data: {
            lang: state.lang,
            cardTitle: state.cardTitle,
            nickname: state.nickname,
            age: state.age,
            showAge: state.showAge,
            showDates: state.showDates,
            showDescriptions: state.showDescriptions,
            milestones,
          },
          d: encodedData,
        }),
      })
      const json = await res.json()
      if (json?.id) {
        const fullUrl = `${base}/share?id=${json.id}&d=${encodedData}`
        serverShareUrlRef.current = fullUrl
        setShareUrl(fullUrl)
        return fullUrl
      }
    } catch {
      // Fallback to URL-encoded share
    }

    return defaultShareUrl
  }, [defaultShareUrl, encodedData, getBaseUrl, milestones, state])

  // Debounced background sync whenever card changes
  useEffect(() => {
    serverShareUrlRef.current = null
    let active = true

    const timer = setTimeout(async () => {
      if (!cardRef.current || isSyncingRef.current) return
      isSyncingRef.current = true
      try {
        const url = await ensureServerCard()
        if (active) setShareUrl(url)
      } finally {
        isSyncingRef.current = false
      }
    }, 1500)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [state, photo, milestones, encodedData, ensureServerCard])

  async function download(format: ExportFormat, openSaveScreen = false) {
    setBusy(format)
    notify('')
    try {
      const ext = format === 'png' ? 'png' : 'jpg'
      const filename = `life-so-far.${ext}`

      if (openSaveScreen) {
        // Fallback save screen modal for manual long-press saving
        const blob = await makeBlob(format)
        const objUrl = URL.createObjectURL(blob)
        setSaveUrl(objUrl)
        return
      }

      // Method 2: Server-Side Download Route (In-App Browsers / WebViews)
      if (isInAppBrowser()) {
        let cardId: string | null = null
        try {
          const serverUrl = await ensureServerCard()
          if (serverUrl) {
            const parsed = new URL(serverUrl, window.location.origin)
            cardId = parsed.searchParams.get('id')
          }
        } catch {
          // Fallback to URL-encoded timeline payload
        }

        const url = new URL('/api/download', window.location.origin)
        if (cardId) url.searchParams.set('id', cardId)
        if (encodedData) url.searchParams.set('d', encodedData)
        url.searchParams.set('format', format)

        // Trigger navigation
        window.location.href = url.toString()

        // Keep busy indicator briefly to avoid repeated clicks
        setTimeout(() => setBusy(null), 2500)
        return
      }

      // Method 1: Client-Side Download (<a download>) for standard browsers
      const blob = await makeBlob(format)
      await triggerDownload(blob, filename)
      notify(format === 'png' ? 'PNG saved to your downloads folder.' : 'JPG saved to your downloads folder.')
      setTimeout(() => notify(''), 4000)
    } catch {
      notify(t.exportFailed, true)
    } finally {
      setBusy(null)
    }
  }

  async function handleFacebookShare() {
    setBusy('share')
    try {
      const url = await ensureServerCard()
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank',
        'noopener,noreferrer',
      )
    } finally {
      setBusy(null)
    }
  }

  async function handleWhatsAppShare() {
    setBusy('share')
    try {
      const url = await ensureServerCard()
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${t.shareText} ${url}`)}`,
        '_blank',
        'noopener,noreferrer',
      )
    } finally {
      setBusy(null)
    }
  }

  async function nativeShare() {
    setBusy('share')
    notify('')
    try {
      const url = await ensureServerCard()
      const blob = await makeBlob('png')
      const file = new File([blob], 'life-so-far.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: t.shareText, url })
      } else {
        await navigator.share({ text: t.shareText, url })
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) notify(t.exportFailed, true)
    } finally {
      setBusy(null)
    }
  }

  async function copyLink() {
    setBusy('share')
    try {
      const url = await ensureServerCard()
      await navigator.clipboard.writeText(url)
      notify(t.linkCopied)
    } catch {
      try {
        const url = await ensureServerCard()
        const ta = document.createElement('textarea')
        ta.value = url
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        ta.remove()
        notify(ok ? t.linkCopied : t.copyFailed, !ok)
      } catch {
        notify(t.copyFailed, true)
      }
    } finally {
      setBusy(null)
    }
  }

  function openInBrowser() {
    window.open(window.location.href, '_blank', 'noopener')
  }

  const [inspectOpen, setInspectOpen] = useState(false)
  const loading = busy !== null

  return (
    <div className="space-y-4">
      {/* Studio Showcase Header */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
          </span>
          <span className="font-semibold uppercase tracking-wider text-gold-deep text-[11px]">
            {t.previewTab}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-medium text-ink-soft border border-gold/25">
            {photo ? t.layoutWithPhoto : t.layoutNoPhoto}
          </span>
          <button
            type="button"
            onClick={() => setInspectOpen(true)}
            title={t.fullPreview}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-gold-deep hover:bg-cream/80 transition-colors cursor-pointer"
          >
            <Maximize2 className="size-3" />
            <span>{t.fullPreview}</span>
          </button>
        </div>
      </div>

      {/* Gallery Easel Card Frame */}
      <div className="relative group">
        <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-gold/20 via-gold-deep/20 to-gold/20 blur-sm opacity-60 transition duration-500 group-hover:opacity-100" />
        <div className="relative overflow-hidden rounded-xl bg-ivory shadow-xl ring-1 ring-gold/40 border-filigree transition-all duration-300">
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
      </div>

      <p className="text-center text-xs text-ink-soft/90 italic">
        ✦ {t.previewNote} · 1080 × 1350 px
      </p>

      {/* Primary & Secondary Download Actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          disabled={loading}
          onClick={() => download('png')}
          className={`${btn} bg-ink text-ivory border border-gold/30 hover:bg-ink/90 shadow-xs btn-tactile font-medium`}
        >
          {busy === 'png' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Download className="size-4 text-gold-light" aria-hidden="true" />}
          <span>{t.downloadPng}</span>
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => download('jpg')}
          className={`${btn} border border-gold/50 bg-white/80 text-ink hover:bg-cream shadow-2xs btn-tactile`}
        >
          {busy === 'jpg' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Download className="size-4 text-gold-deep" aria-hidden="true" />}
          <span>{t.downloadJpg}</span>
        </button>
      </div>

      {/* Status banner */}
      <div aria-live="polite" role="status" className={`min-h-5 text-center text-xs font-medium transition-all ${isError ? 'text-red-700 bg-red-50 p-2 rounded-lg' : message ? 'text-emerald-800 bg-emerald-50 p-2 rounded-lg' : 'text-ink-soft'}`}>
        {busy === 'png' ? `${t.generating} (PNG)` : busy === 'jpg' ? `${t.generating} (JPG)` : busy === 'share' ? t.generating : message}
      </div>

      {/* Share Section with Custom Styling */}
      <div className="rounded-2xl border border-gold/30 bg-white/70 p-4 shadow-xs backdrop-blur-xs">
        <h3 className="font-display text-base font-semibold tracking-tight text-ink flex items-center gap-2">
          <Share2 className="size-4 text-gold-deep" />
          {t.share}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {hasShare && (
            <button
              type="button"
              disabled={loading}
              onClick={nativeShare}
              className={`${btn} col-span-2 border border-gold/40 bg-cream/50 text-ink hover:bg-cream`}
            >
              {busy === 'share' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}
              {t.shareNative}
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={handleFacebookShare}
            className={`${btn} border border-blue-200/80 bg-blue-50/50 text-blue-950 hover:bg-blue-100/60`}
          >
            <span className="font-bold text-blue-600">f</span>
            <span>{t.shareFacebook}</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleWhatsAppShare}
            className={`${btn} border border-emerald-200/80 bg-emerald-50/50 text-emerald-950 hover:bg-emerald-100/60`}
          >
            <span className="font-bold text-emerald-600">WA</span>
            <span>{t.shareWhatsapp}</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={copyLink}
            className={`${btn} col-span-2 border border-gold/40 bg-white text-ink hover:bg-cream/70`}
          >
            <Copy className="size-4 text-gold-deep" aria-hidden="true" />
            <span>{t.copyLink}</span>
          </button>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => download('png', true)}
          className="mt-3 min-h-9 w-full text-center text-xs font-medium text-gold-deep hover:text-ink underline underline-offset-4 cursor-pointer"
        >
          {t.saveScreen}
        </button>
      </div>

      <div className="rounded-xl border border-gold/25 bg-cream/40 p-3.5 text-center">
        <p className="font-display text-sm italic leading-relaxed text-ink-soft">{t.invite}</p>
      </div>

      {/* Fullscreen Inspection Modal */}
      <Modal open={inspectOpen} onClose={() => setInspectOpen(false)} title={t.fullPreview}>
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-1">
          <div className="overflow-hidden rounded-lg shadow-2xl ring-1 ring-gold/40">
            <ScaledCard
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
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setInspectOpen(false)}
            className="min-h-10 rounded-full bg-ink px-6 text-xs font-semibold text-ivory hover:bg-ink/90 cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </Modal>

      {/* Save Screen Modal for in-app browser manual saving */}
      <Modal open={!!saveUrl} onClose={() => { setSaveUrl(null) }} title={t.saveScreenTitle}>
        <p className="text-sm leading-relaxed text-ink-soft">{t.saveScreenBody}</p>
        {inApp && <p className="mt-2 text-sm leading-relaxed text-gold-deep">{t.inAppNote}</p>}
        {saveUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={saveUrl} alt={t.saveScreenTitle} className="mx-auto mt-4 w-full max-w-xs rounded-md ring-1 ring-gold/40" />
        )}
        <div className="mt-4 grid gap-2">
          {saveUrl && (
            <a
              href={saveUrl}
              download="life-so-far.png"
              onClick={() => setTimeout(() => setSaveUrl(null), 300)}
              className={`${btn} bg-ink text-ivory hover:bg-ink/90`}
            >
              <Download className="size-4" aria-hidden="true" />
              Download PNG
            </a>
          )}
          <button type="button" onClick={openInBrowser} className={`${btn} border border-gold text-ink hover:bg-cream`}>
            {t.openInBrowser}
          </button>
          <button type="button" onClick={() => setSaveUrl(null)} className="min-h-11 w-full text-sm font-medium text-ink-soft underline underline-offset-2">
            {t.close}
          </button>
        </div>
      </Modal>
    </div>
  )
}

