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

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
