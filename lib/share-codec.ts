import type { Lang } from './i18n'
import type { Milestone, LifeState } from './life-store'

export type SerializedCard = {
  v: 1
  l: Lang
  t?: string
  n?: string
  a?: string
  sa?: boolean
  sd?: boolean
  sc?: boolean
  m: Array<{
    t: string
    w?: string
    d?: string
    e?: string
  }>
}

/**
 * Encodes the card state into a compact, URL-safe base64 string.
 */
export function encodeShareData(state: Partial<LifeState>): string {
  const payload: SerializedCard = {
    v: 1,
    l: state.lang || 'en',
    t: state.cardTitle?.trim() || undefined,
    n: state.nickname?.trim() || undefined,
    a: state.age?.trim() || undefined,
    sa: state.showAge !== false,
    sd: state.showDates !== false,
    sc: state.showDescriptions !== false,
    m: (state.milestones || [])
      .filter((m) => m.included && m.title.trim())
      .slice(0, 15)
      .map((m) => ({
        t: m.title.trim(),
        w: m.when?.trim() || undefined,
        d: m.description?.trim() || undefined,
        e: m.emoji?.trim() || undefined,
      })),
  }

  try {
    const json = JSON.stringify(payload)
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      const utf8 = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16)),
      )
      return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
    // Node.js environment
    return Buffer.from(json, 'utf-8').toString('base64url')
  } catch {
    return ''
  }
}

/**
 * Decodes a URL-safe base64 string back into card state.
 */
export function decodeShareData(encoded: string): {
  lang: Lang
  cardTitle: string
  nickname: string
  age: string
  showAge: boolean
  showDates: boolean
  showDescriptions: boolean
  milestones: Array<{
    id: string
    title: string
    when: string
    description: string
    emoji: string
    included: boolean
  }>
} | null {
  if (!encoded) return null
  try {
    let json = ''
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
      while (b64.length % 4) b64 += '='
      const bin = atob(b64)
      json = decodeURIComponent(
        Array.prototype.map.call(bin, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''),
      )
    } else {
      // Node.js environment
      json = Buffer.from(encoded, 'base64url').toString('utf-8')
    }

    const data = JSON.parse(json) as SerializedCard
    if (!data || data.v !== 1) return null

    const milestones = Array.isArray(data.m)
      ? data.m.map((item, idx) => ({
          id: `m_${idx}_${Date.now()}`,
          title: item.t || '',
          when: item.w || '',
          description: item.d || '',
          emoji: item.e || '',
          included: true,
        }))
      : []

    return {
      lang: data.l === 'bn' ? 'bn' : 'en',
      cardTitle: data.t || '',
      nickname: data.n || '',
      age: data.a || '',
      showAge: data.sa !== false,
      showDates: data.sd !== false,
      showDescriptions: data.sc !== false,
      milestones,
    }
  } catch {
    return null
  }
}
