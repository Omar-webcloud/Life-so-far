import { toCanvas } from 'html-to-image'

export type ExportFormat = 'png' | 'jpg'

export function isInAppBrowser() {
  if (typeof navigator === 'undefined') return false
  return /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|Messenger|Snapchat|TikTok/i.test(navigator.userAgent)
}

async function render(node: HTMLElement, pixelRatio: number) {
  const options = { pixelRatio, cacheBust: false, style: { transform: 'none', margin: '0' } }
  // First pass warms up fonts/images (needed by some Safari/WebKit builds).
  await toCanvas(node, options)
  return toCanvas(node, options)
}

export async function exportCard(node: HTMLElement, format: ExportFormat): Promise<Blob> {
  if (document.fonts?.ready) await document.fonts.ready
  let canvas: HTMLCanvasElement
  try {
    canvas = await render(node, 2)
  } catch {
    canvas = await render(node, 1)
  }
  const type = format === 'png' ? 'image/png' : 'image/jpeg'
  let blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.95))
  if (!blob && canvas.width > 1080) {
    canvas = await render(node, 1)
    blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.95))
  }
  if (!blob) throw new Error('blob')
  return blob
}

/**
 * Cross-browser download with two-stage fallback:
 *
 * 1. File System Access API (Chrome 86+, Edge 86+)
 *    Shows the native OS "Save as…" dialog, so the user can choose exactly
 *    where to save, and the filename with extension is always pre-filled.
 *
 * 2. Anchor element with `download` attribute (Firefox, Safari, all others)
 *    Creates an invisible <a> with a blob URL, clicks it, then cleans up.
 *    The anchor is positioned off-screen (not display:none) so Firefox
 *    will honour the click. The cleanup is delayed 5 s so Firefox has time
 *    to start the download before the object URL is revoked.
 */
export function triggerDownload(blob: Blob, filename: string) {
  const mimeType = blob.type || (filename.endsWith('.png') ? 'image/png' : 'image/jpeg')
  const ext = filename.endsWith('.png') ? 'png' : 'jpg'

  // Stage 1 — File System Access API
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    ;(window as Window & { showSaveFilePicker: (opts: object) => Promise<FileSystemFileHandle> })
      .showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: `${ext.toUpperCase()} Image`, accept: { [mimeType]: ['.' + ext] } }],
      })
      .then(async (handle) => {
        const writable = await (handle as any).createWritable()
        await writable.write(blob)
        await writable.close()
      })
      .catch((e: Error) => {
        // AbortError means the user cancelled — that's fine.
        if (e.name !== 'AbortError') _anchorDownload(blob, filename)
      })
    return
  }

  // Stage 2 — Anchor element download
  _anchorDownload(blob, filename)
}

function _anchorDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename   // includes the extension, e.g. "life-so-far.png"
  a.type = blob.type
  a.rel = 'noopener'
  // Must be attached to the DOM for Firefox; keep it off-screen so it's invisible
  Object.assign(a.style, {
    position: 'fixed',
    top: '-9999px',
    left: '-9999px',
    opacity: '0',
    pointerEvents: 'none',
  })
  document.body.appendChild(a)
  a.click()
  // Delay cleanup so Firefox has time to begin the download
  setTimeout(() => {
    a.remove()
    URL.revokeObjectURL(url)
  }, 5000)
}
