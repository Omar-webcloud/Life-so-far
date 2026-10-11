import { ImageResponse } from 'next/og'
import { getCardFromCache } from '@/lib/card-cache'
import { decodeShareData } from '@/lib/share-codec'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const d = searchParams.get('d')
    const format = searchParams.get('format') || 'png'
    const isJpg = format.toLowerCase() === 'jpg' || format.toLowerCase() === 'jpeg'
    const ext = isJpg ? 'jpg' : 'png'
    const filename = `life-so-far.${ext}`
    const contentType = isJpg ? 'image/jpeg' : 'image/png'

    // 1. If an exact client-rendered image is cached for this card ID, return it directly
    if (id) {
      const cached = getCardFromCache(id)
      if (cached?.image) {
        const base64Data = cached.image.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        return new Response(buffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-store',
          },
        })
      }
    }

    // 2. Otherwise, decode card data and render dynamically via ImageResponse
    const decoded = d ? decodeShareData(d) : null
    if (!decoded && !id) {
      return new Response('Card not found', { status: 404 })
    }

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
    const headerBadge =
      [nickname, ageLabel].filter(Boolean).join(' • ') || (lang === 'bn' ? 'ব্যক্তিগত টাইমলাইন' : 'Personal Timeline')

    const displayedMilestones = milestones.slice(0, 8)

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FAF6EC',
            padding: '48px 54px',
            fontFamily: 'serif',
            color: '#2A2723',
            border: '14px solid #FAF6EC',
          }}
        >
          {/* Outer elegant frame */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: '2px solid #B08D4A',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '28px',
              left: '28px',
              right: '28px',
              bottom: '28px',
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
                fontSize: '20px',
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
                padding: '8px 20px',
                borderRadius: '999px',
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'sans-serif',
                letterSpacing: '0.05em',
              }}
            >
              {chaptersLabel}
            </div>
          </div>

          {/* Card Title & Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '14px' }}>
            <div
              style={{
                fontSize: title.length > 25 ? '48px' : '60px',
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
                fontSize: '22px',
                color: '#6A6358',
                marginTop: '8px',
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
              gap: '14px',
              marginTop: '18px',
              marginBottom: '18px',
            }}
          >
            {displayedMilestones.length > 0 ? (
              displayedMilestones.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid rgba(176, 141, 74, 0.45)',
                    borderRadius: '14px',
                    padding: '12px 20px',
                    width: displayedMilestones.length > 3 ? '48%' : '100%',
                  }}
                >
                  <span style={{ fontSize: '30px' }}>{m.emoji || '✨'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span
                      style={{
                        fontSize: '20px',
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
                          fontSize: '15px',
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
                  padding: '18px',
                  fontFamily: 'sans-serif',
                  color: '#6A6358',
                  fontSize: '20px',
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
              paddingTop: '14px',
              fontFamily: 'sans-serif',
              fontSize: '18px',
              color: '#85652A',
            }}
          >
            <span style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '24px', color: '#2A2723' }}>
              Life So Far
            </span>
            <span style={{ letterSpacing: '0.1em', fontSize: '16px' }}>life-so-far.vercel.app</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 750,
      },
    )

    // Re-wrap with download headers so the in-app WebView or browser triggers a file download dialog
    const imageBytes = await imageResponse.arrayBuffer()
    return new Response(imageBytes, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return new Response('Failed to download card', { status: 500 })
  }
}
