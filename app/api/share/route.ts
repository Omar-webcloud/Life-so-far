import { NextResponse } from 'next/server'
import { saveCardToCache, getCardFromCache } from '@/lib/card-cache'

function generateId() {
  return Math.random().toString(36).substring(2, 10)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { image, data, d } = body

    const id = generateId()
    saveCardToCache(id, { image, data })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://life-so-far.vercel.app'
    const query = new URLSearchParams()
    query.set('id', id)
    if (d) query.set('d', d)

    const shareUrl = `${baseUrl}/share?${query.toString()}`

    return NextResponse.json({
      success: true,
      id,
      shareUrl,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process card share' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing card ID' }, { status: 400 })
  }

  const cached = getCardFromCache(id)
  if (!cached) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: cached.data,
    hasImage: !!cached.image,
  })
}
