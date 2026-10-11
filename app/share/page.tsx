import type { Metadata } from 'next'
import Link from 'next/link'
import { decodeShareData } from '@/lib/share-codec'
import { getCardFromCache } from '@/lib/card-cache'
import { SharedCardView, type SharedCardData } from '@/components/life/shared-card-view'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolved = await searchParams
  const id = typeof resolved.id === 'string' ? resolved.id : ''
  const d = typeof resolved.d === 'string' ? resolved.d : ''

  // Look up card data
  const cached = id ? getCardFromCache(id) : null
  const decoded = d ? decodeShareData(d) : null
  const cardData = cached?.data || decoded

  const baseUrl = 'https://life-so-far.vercel.app'
  const isBn = cardData?.lang === 'bn'

  const nickname = cardData?.nickname?.trim() || ''
  const baseTitle = cardData?.cardTitle?.trim() || (isBn ? 'আমার জীবন এতদূর' : 'My Life So Far')
  const milestoneCount = cardData?.milestones?.length || 0

  const pageTitle = nickname
    ? (isBn ? `${nickname}-এর জীবনের গল্প | Life So Far` : `${nickname}'s Life Story | Life So Far`)
    : `${baseTitle} | Life So Far`

  const chaptersText = isBn
    ? `${milestoneCount}টি অধ্যায়ে সাজানো একটি ব্যক্তিগত টাইমলাইন।`
    : `${milestoneCount} chapters in a personal story timeline.`

  const description = `${chaptersText} ${isBn ? 'দেখুন এবং আপনার জীবনের গল্পও তৈরি করুন।' : 'Explore this journey and create your own shareable story card.'}`

  const ogQuery = new URLSearchParams()
  if (id) ogQuery.set('id', id)
  if (d) ogQuery.set('d', d)
  const ogImageUrl = `${baseUrl}/api/og?${ogQuery.toString()}`
  const pageUrl = `${baseUrl}/share?${ogQuery.toString()}`

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: pageTitle,
      description,
      siteName: 'Life So Far',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function SharePage({ searchParams }: Props) {
  const resolved = await searchParams
  const id = typeof resolved.id === 'string' ? resolved.id : ''
  const d = typeof resolved.d === 'string' ? resolved.d : ''

  const cached = id ? getCardFromCache(id) : null
  const decoded = d ? decodeShareData(d) : null
  const data = cached?.data || decoded

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Card Not Found</h1>
        <p className="mt-2 text-ink-soft max-w-md">
          This timeline link may have expired or is incomplete. You can start fresh and build your own story card anytime.
        </p>
        <Link
          href="/create"
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-ink/90"
        >
          Create Your Life Story
        </Link>
      </div>
    )
  }

  const card: SharedCardData = {
    lang: data.lang || 'en',
    cardTitle: data.cardTitle || (data.lang === 'bn' ? 'আমার জীবন এতদূর' : 'My Life So Far'),
    nickname: data.nickname || '',
    age: data.age || '',
    showAge: data.showAge !== false,
    showDates: data.showDates !== false,
    showDescriptions: data.showDescriptions !== false,
    milestones: (data.milestones || []).map((m: any, idx: number) => ({
      id: m.id || `m_${idx}`,
      title: m.title || '',
      when: m.when || '',
      description: m.description || '',
      emoji: m.emoji || '✨',
    })),
    photo: cached?.image || null,
  }

  return <SharedCardView card={card} />
}
