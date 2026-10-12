'use client'

import { useRef, useState } from 'react'
import { Camera, ImagePlus, RefreshCw, Trash2, ZoomIn, ZoomOut } from 'lucide-react'
import { processPhoto, PhotoError } from '@/lib/image'
import { useLife } from '@/lib/life-store'

export function PhotoSection() {
  const { state, photo, photoSaved, update, setPhoto, t } = useLife()
  const input = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  async function handleFile(file: File) {
    setError('')
    setBusy(true)
    try {
      const data = await processPhoto(file)
      setPhoto(data)
      update({ photoZoom: 1, photoX: 50, photoY: 40 })
    } catch (err) {
      const code = err instanceof PhotoError ? err.code : 'corrupt'
      setError(code === 'type' ? t.photoErrType : code === 'size' ? t.photoErrSize : t.photoErrCorrupt)
    } finally {
      setBusy(false)
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) handleFile(file)
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <section aria-labelledby="photo-h" className="rounded-2xl border border-gold/30 bg-white/70 p-5 shadow-xs backdrop-blur-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-cream text-gold-deep ring-1 ring-gold/30">
            <Camera className="size-4" aria-hidden="true" />
          </div>
          <h2 id="photo-h" className="font-display text-xl font-semibold tracking-tight text-ink">
            {t.photoTitle}
          </h2>
        </div>
        <span className="rounded-full bg-cream/80 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold-deep border border-gold/30">
          {t.photoOptional}
        </span>
      </div>

      <p className="mt-1.5 text-xs sm:text-sm text-ink-soft leading-relaxed">{t.photoHint}</p>

      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} aria-hidden="true" tabIndex={-1} />

      {photo ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-gold/25 bg-cream/40">
            {/* Archival framed portrait preview */}
            <div className="relative size-24 shrink-0 overflow-hidden rounded-full ring-2 ring-gold-deep ring-offset-2 ring-offset-ivory shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt="Portrait preview"
                className="size-full object-cover"
                style={{
                  transform: `scale(${state.photoZoom || 1})`,
                  objectPosition: `${state.photoX || 50}% ${state.photoY || 40}%`,
                }}
              />
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left w-full">
              {/* Interactive Zoom Adjuster */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-ink-soft">
                <button
                  type="button"
                  title={t.zoomOut}
                  onClick={() => update({ photoZoom: Math.max(0.8, Number(((state.photoZoom || 1) - 0.1).toFixed(2))) })}
                  className="size-7 rounded-full border border-gold/40 bg-white flex items-center justify-center text-ink hover:bg-cream"
                >
                  <ZoomOut className="size-3.5" />
                </button>
                <input
                  type="range"
                  min="0.8"
                  max="2.2"
                  step="0.05"
                  value={state.photoZoom || 1}
                  onChange={(e) => update({ photoZoom: parseFloat(e.target.value) })}
                  className="w-28 sm:w-36 accent-gold-deep cursor-pointer"
                />
                <button
                  type="button"
                  title={t.zoomIn}
                  onClick={() => update({ photoZoom: Math.min(2.2, Number(((state.photoZoom || 1) + 0.1).toFixed(2))) })}
                  className="size-7 rounded-full border border-gold/40 bg-white flex items-center justify-center text-ink hover:bg-cream"
                >
                  <ZoomIn className="size-3.5" />
                </button>
                <span className="font-mono text-[11px] text-gold-deep font-semibold">
                  {Math.round((state.photoZoom || 1) * 100)}%
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => input.current?.click()}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-gold/60 bg-white px-3.5 text-xs font-semibold text-ink shadow-2xs hover:bg-cream transition-colors"
                >
                  <RefreshCw className="size-3.5 text-gold-deep" aria-hidden="true" />
                  {t.replacePhoto}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null)
                    setError('')
                  }}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ink/20 bg-white px-3.5 text-xs font-semibold text-ink/80 hover:border-red-300 hover:text-red-800 hover:bg-red-50/50 transition-colors"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  {t.removePhoto}
                </button>
              </div>
            </div>
          </div>
          {!photoSaved && <p className="text-xs text-gold-deep">{t.photoNotSaved}</p>}
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`mt-4 flex flex-col sm:flex-row items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-all duration-200 ${
            isDragging
              ? 'border-gold-deep bg-cream/90 scale-[1.01]'
              : 'border-gold/40 bg-cream/30 hover:border-gold-deep/70 hover:bg-cream/50'
          }`}
        >
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-ivory shadow-xs hover:bg-ink/90 transition-all btn-tactile disabled:opacity-60"
          >
            <ImagePlus className="size-4 text-gold-light" aria-hidden="true" />
            {busy ? t.generating : t.addPhoto}
          </button>
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-medium text-ink flex items-center justify-center sm:justify-start gap-1">
              <Camera className="size-3.5 text-gold-deep" />
              {t.dropPhoto}
            </p>
            <p className="text-xs text-ink-soft/80 mt-0.5">{t.skipPhoto}</p>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs sm:text-sm font-medium text-red-800 bg-red-50 p-2.5 rounded-lg border border-red-200">
          {error}
        </p>
      )}
    </section>
  )
}
