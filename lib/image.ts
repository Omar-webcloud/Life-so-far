export type PhotoErrorCode = 'type' | 'size' | 'corrupt'

export class PhotoError extends Error {
  code: PhotoErrorCode
  constructor(code: PhotoErrorCode) {
    super(code)
    this.code = code
  }
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024
const MAX_SIDE = 1000

export async function processPhoto(file: File): Promise<string> {
  if (!ACCEPTED.includes(file.type)) throw new PhotoError('type')
  if (file.size > MAX_BYTES) throw new PhotoError('size')

  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new PhotoError('corrupt'))
      el.src = url
    })
    if (!img.naturalWidth || !img.naturalHeight) throw new PhotoError('corrupt')

    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new PhotoError('corrupt')
    ctx.fillStyle = '#faf6ec'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.86)
  } catch (e) {
    throw e instanceof PhotoError ? e : new PhotoError('corrupt')
  } finally {
    URL.revokeObjectURL(url)
  }
}
