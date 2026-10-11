'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Copy, Download, Loader2, Share2 } from 'lucide-react'
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
      const blob = await makeBlob(format)
      const ext = format === 'png' ? 'png' : 'jpg'
      const filename = `life-so-far.${ext}`

      if (openSaveScreen || inApp) {
        // In-app browsers (Facebook, Instagram…) block programmatic downloads.
        // Show the image in a modal so the user can long-press to save it.
        const objUrl = URL.createObjectURL(blob)
        setSaveUrl(objUrl)
      } else {
        // Desktop / standard mobile browsers: trigger a real file download.
        // triggerDownload uses the File System Access API (Chrome/Edge native
        // Save dialog) and falls back to anchor-click for Firefox & Safari.
        triggerDownload(blob, filename)
        notify(format === 'png' ? 'PNG saved to your downloads folder.' : 'JPG saved to your downloads folder.')
        setTimeout(() => notify(''), 4000)
      }
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
          <button
            type="button"
            disabled={loading}
            onClick={handleFacebookShare}
            className={`${btn} border border-gold text-ink hover:bg-cream`}
          >
            {t.shareFacebook}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleWhatsAppShare}
            className={`${btn} border border-gold text-ink hover:bg-cream`}
          >
            {t.shareWhatsapp}
          </button>
          <button type="button" disabled={loading} onClick={copyLink} className={`${btn} col-span-2 border border-gold text-ink hover:bg-cream`}>
            <Copy className="size-4" aria-hidden="true" />
            {t.copyLink}
          </button>
        </div>
        <button type="button" disabled={loading} onClick={() => download('png', true)} className="mt-3 min-h-11 w-full text-sm font-medium text-gold-deep underline underline-offset-4">
          {t.saveScreen}
        </button>
      </div>

      <div aria-live="polite" role="status" className={`min-h-5 text-center text-sm ${isError ? 'text-red-800' : 'text-ink-soft'}`}>
        {busy === 'png' ? `${t.generating} (PNG)` : busy === 'jpg' ? `${t.generating} (JPG)` : busy === 'share' ? '' : message}
      </div>

      <p className="text-balance rounded-xl bg-cream/70 p-4 text-center font-display text-lg italic leading-snug">{t.invite}</p>

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

