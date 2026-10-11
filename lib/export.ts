import { toCanvas } from 'html-to-image'

export type ExportFormat = 'png' | 'jpg'

export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /FBAN|FBAV|Instagram|Messenger|FB_IAB|FBIOS|MicroMessenger|WebView|Line\/|Snapchat|TikTok/i.test(ua)
}

/** Helper: convert Blob to base64 Data URL */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Could not read blob.'))
    reader.readAsDataURL(blob)
  })
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
 * Method 1: Client-Side Download (<a download>) for standard browsers (Chrome, Safari, Firefox, Edge).
 * Converts blob to Data URL, creates an invisible <a> element with download attribute,
 * appends to body, triggers click, and removes it.
 */
export async function triggerDownload(blob: Blob, filename: string): Promise<void> {
  const dataUrl = await blobToDataUrl(blob)

  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

