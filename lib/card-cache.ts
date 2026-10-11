import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

export type CachedCardItem = {
  id: string
  image?: string // Base64 or binary data URI
  data?: any
  createdAt: number
}

// Global cache survives across warm lambda invocations
const globalForCache = globalThis as unknown as {
  __lifeCardCache?: Map<string, CachedCardItem>
}

const memoryCache = globalForCache.__lifeCardCache || new Map<string, CachedCardItem>()
if (!globalForCache.__lifeCardCache) {
  globalForCache.__lifeCardCache = memoryCache
}

const tmpDir = path.join(os.tmpdir(), 'life-cards')

function ensureTmpDir() {
  try {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }
  } catch {
    // Ignore errors in read-only environments
  }
}

export function saveCardToCache(id: string, item: { image?: string; data?: any }) {
  const record: CachedCardItem = {
    id,
    image: item.image,
    data: item.data,
    createdAt: Date.now(),
  }

  // Keep in memory (limit to 100 entries to prevent memory pressure)
  if (memoryCache.size > 100) {
    const oldestKey = memoryCache.keys().next().value
    if (oldestKey) memoryCache.delete(oldestKey)
  }
  memoryCache.set(id, record)

  // Try saving image to disk in tmpDir as fallback
  if (item.image) {
    try {
      ensureTmpDir()
      const filePath = path.join(tmpDir, `${id}.png`)
      const base64Data = item.image.replace(/^data:image\/\w+;base64,/, '')
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'))
    } catch {
      // Ignore disk errors
    }
  }
}

export function getCardFromCache(id: string): CachedCardItem | null {
  const inMem = memoryCache.get(id)
  if (inMem) return inMem

  // Try reading from tmp directory
  try {
    const filePath = path.join(tmpDir, `${id}.png`)
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath)
      const dataUri = `data:image/png;base64,${buffer.toString('base64')}`
      const restored: CachedCardItem = {
        id,
        image: dataUri,
        createdAt: Date.now(),
      }
      memoryCache.set(id, restored)
      return restored
    }
  } catch {
    // Ignore
  }

  return null
}
