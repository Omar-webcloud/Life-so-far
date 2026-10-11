import { ImageResponse } from 'next/og'
import { getCardFromCache } from '@/lib/card-cache'
import { decodeShareData } from '@/lib/share-codec'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const d = searchParams.get('d')

    // 1. If an exact client-rendered image was cached for this card, return it directly!
    if (id) {
      const cached = getCardFromCache(id)
      if (cached?.image) {
        const base64Data = cached.image.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        return new Response(buffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      }
    }

    // 2. Otherwise, decode the card data from 'd' and generate a high-res 1200x630 Open Graph card!
    const decoded = d ? decodeShareData(d) : null

    const title = decoded?.cardTitle?.trim() || (decoded?.lang === 'bn' ? 'আমার জীবন এতদূর' : 'My Life So Far')
    const nickname = decoded?.nickname?.trim() || ''
    const age = decoded?.showAge && decoded?.age?.trim() ? decoded.age.trim() : ''
    const milestones = decoded?.milestones || []
    const lang = decoded?.lang || 'en'

    const chapterCount = milestones.length
    const chaptersLabel =
      lang === 'bn'
        ? `${chapterCount}টি অধ্যায়`
        : chapterCount === 1
          ? '1 Chapter'
          : `${chapterCount} Chapters`

    const ageLabel = age ? (lang === 'bn' ? `${age} বছর` : `${age} Years`) : ''
    const headerBadge = [nickname, ageLabel].filter(Boolean).join(' • ') || (lang === 'bn' ? 'ব্যক্তিগত টাইমলাইন' : 'Personal Timeline')

    const displayedMilestones = milestones.slice(0, 6)

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FAF6EC',
            padding: '40px 48px',
            fontFamily: 'serif',
            color: '#2A2723',
            border: '12px solid #FAF6EC',
          }}
        >
          {/* Outer elegant frame */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '18px',
              right: '18px',
              bottom: '18px',
              border: '2px solid #B08D4A',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              right: '24px',
              bottom: '24px',
              border: '1px solid rgba(176, 141, 74, 0.4)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#85652A',
                fontFamily: 'sans-serif',
              }}
            >
              <span>{headerBadge}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#B08D4A',
                color: '#FAF6EC',
                padding: '6px 18px',
                borderRadius: '999px',
                fontSize: '17px',
                fontWeight: 600,
                fontFamily: 'sans-serif',
                letterSpacing: '0.05em',
              }}
            >
              {chaptersLabel}
            </div>
          </div>

          {/* Card Title & Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
            <div
              style={{
                fontSize: title.length > 25 ? '44px' : '56px',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#2A2723',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#6A6358',
                marginTop: '6px',
                fontFamily: 'sans-serif',
              }}
            >
              {lang === 'bn'
                ? 'মনে রাখার মতো মুহূর্ত আর সুন্দর স্মৃতির সংকলন।'
                : 'A journey of milestones, memories, and chapters worth remembering.'}
            </div>
          </div>

          {/* Milestones Grid */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '16px',
              marginBottom: '16px',
            }}
          >
            {displayedMilestones.length > 0 ? (
              displayedMilestones.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid rgba(176, 141, 74, 0.45)',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    width: displayedMilestones.length > 3 ? '48%' : '100%',
                  }}
                >
                  <span style={{ fontSize: '26px' }}>{m.emoji || '✨'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#2A2723',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: 'sans-serif',
                      }}
                    >
                      {m.title}
                    </span>
                    {m.when && (
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#85652A',
                          fontWeight: 500,
                          fontFamily: 'sans-serif',
                        }}
                      >
                        {m.when}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  fontFamily: 'sans-serif',
                  color: '#6A6358',
                  fontSize: '18px',
                }}
              >
                Turn your journey into a beautiful story card.
              </div>
            )}
          </div>

          {/* Bottom branding footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(176, 141, 74, 0.35)',
              paddingTop: '12px',
              fontFamily: 'sans-serif',
              fontSize: '16px',
              color: '#85652A',
            }}
          >
            <span style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '22px', color: '#2A2723' }}>
              Life So Far
            </span>
            <span style={{ letterSpacing: '0.1em', fontSize: '15px' }}>life-so-far.vercel.app</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    return new Response('Failed to generate card image', { status: 500 })
  }
}
