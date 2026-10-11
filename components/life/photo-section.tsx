'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { processPhoto, PhotoError } from '@/lib/image'
import { useLife } from '@/lib/life-store'

export function PhotoSection() {
  const { photo, photoSaved, state, update, setPhoto, t } = useLife()
  const input = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
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

  const slider = (label: string, value: number, min: number, max: number, step: number, key: 'photoZoom' | 'photoX' | 'photoY') => (
    <label className="flex items-center gap-3 text-sm text-ink-soft">
      <span className="w-36 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => update({ [key]: Number(e.target.value) })}
        className="h-6 w-full accent-gold-deep"
      />
    </label>
  )

  return (
    <section aria-labelledby="photo-h" className="rounded-xl border border-gold/30 bg-white/50 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="photo-h" className="font-display text-xl font-semibold">
          {t.photoTitle}
        </h2>
        <span className="text-xs font-medium uppercase tracking-widest text-gold-deep">{t.photoOptional}</span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">{t.photoHint}</p>

      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} aria-hidden="true" tabIndex={-1} />

      {photo ? (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" className="size-20 rounded-full object-cover ring-2 ring-gold/60" />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => input.current?.click()} className="min-h-11 rounded-full border border-gold px-4 text-sm font-medium hover:bg-cream">
                {t.replacePhoto}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhoto(null)
                  setError('')
                }}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink/20 px-4 text-sm font-medium hover:bg-cream"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                {t.removePhoto}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            {slider(t.photoZoom, state.photoZoom, 1, 2.5, 0.05, 'photoZoom')}
            {slider(t.photoHoriz, state.photoX, 0, 100, 1, 'photoX')}
            {slider(t.photoVert, state.photoY, 0, 100, 1, 'photoY')}
          </div>
          {!photoSaved && <p className="text-sm text-gold-deep">{t.photoNotSaved}</p>}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gold px-5 text-sm font-medium transition-colors hover:bg-cream disabled:opacity-60"
          >
            <ImagePlus className="size-4" aria-hidden="true" />
            {t.addPhoto}
          </button>
          <p className="text-sm text-ink-soft">{t.skipPhoto}</p>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          {error}
        </p>
      )}
    </section>
  )
}
