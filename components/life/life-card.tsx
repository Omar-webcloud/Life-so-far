import type { CSSProperties } from 'react'
import { formatNumber, headlineText, type Lang } from '@/lib/i18n'

export const CARD_W = 1080
export const CARD_H = 1350
const PAD = 88

const INK = '#2a2723'
const MUTED = '#6a6358'
const GOLD = '#b08d4a'
const GOLD_TEXT = '#85652a'
const IVORY = '#faf6ec'
const CREAM = '#f3ecd9'

export type CardMilestone = {
  id: string
  title: string
  when: string
  description: string
  emoji: string
}

export type LifeCardProps = {
  lang: Lang
  cardTitle: string
  nickname: string
  age: string
  showAge: boolean
  showDates: boolean
  showDescriptions: boolean
  milestones: CardMilestone[]
  photo: string | null
  photoZoom: number
  photoX: number
  photoY: number
  brand?: string
}

const display: CSSProperties = { fontFamily: 'var(--font-playfair), var(--font-noto-serif-bn), Georgia, serif' }
const sans: CSSProperties = { fontFamily: 'var(--font-inter), var(--font-noto-sans-bn), system-ui, sans-serif' }

function clamp(lines: number): CSSProperties {
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines,
    overflow: 'hidden',
    overflowWrap: 'anywhere',
  }
}

function titleSizeFor(text: string, base: number, long: number) {
  return text.length > long ? Math.max(base * 0.7, base - (text.length - long) * 1.6) : base
}

type Metrics = {
  rowH: number
  titleSize: number
  descSize: number
  whenSize: number
  titleLines: number
  descLines: number
  showWhen: boolean
}

function metricsFor(
  rowH: number,
  hasWhen: boolean,
  hasDesc: boolean,
  showDesc: boolean,
  maxTitle: number,
  colW: number,
  maxLen: number,
): Metrics {
  let titleSize = Math.min(maxTitle, Math.max(20, rowH * 0.4))
  const sizes = (s: number) => ({
    desc: Math.max(17, s * 0.58),
    when: Math.max(15, s * 0.46),
  })
  const linesFor = (s: number) => Math.min(2, Math.max(1, Math.ceil((maxLen * s * 0.56) / colW)))
  const fits = (s: number) => {
    const { when } = sizes(s)
    return linesFor(s) * s * 1.25 + (hasWhen ? when * 1.5 : 0) + 12 <= rowH
  }
  while (!fits(titleSize) && titleSize > 20) titleSize -= 1
  const { desc: descSize, when: whenSize } = sizes(titleSize)
  const titleLines = linesFor(titleSize)
  const whenH = hasWhen ? whenSize * 1.5 : 0
  const remaining = rowH - 12 - whenH - titleLines * titleSize * 1.25
  const descLines = hasDesc && showDesc ? Math.max(0, Math.min(2, Math.floor(remaining / (descSize * 1.4)))) : 0
  return { rowH, titleSize, descSize, whenSize, titleLines, descLines, showWhen: hasWhen }
}

function ItemText({
  m,
  mt,
  align,
  showDates,
  showDescriptions,
}: {
  m: CardMilestone
  mt: Metrics
  align: 'left' | 'right'
  showDates: boolean
  showDescriptions: boolean
}) {
  const when = showDates && m.when.trim() ? m.when.trim() : ''
  return (
    <div style={{ textAlign: align, minWidth: 0 }}>
      {when && (
        <div
          style={{
            ...sans,
            fontSize: mt.whenSize,
            lineHeight: 1.3,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: GOLD_TEXT,
            fontWeight: 600,
            marginBottom: 2,
          }}
        >
          {when}
        </div>
      )}
      <div style={{ ...display, ...clamp(mt.titleLines), fontSize: mt.titleSize, lineHeight: 1.25, fontWeight: 600 }}>
        {m.emoji ? `${m.emoji} ${m.title}` : m.title}
      </div>
      {mt.descLines > 0 && m.description.trim() && showDescriptions && (
        <div style={{ ...sans, ...clamp(mt.descLines), fontSize: mt.descSize, lineHeight: 1.4, color: MUTED, marginTop: 4 }}>
          {m.description.trim()}
        </div>
      )}
    </div>
  )
}

function Marker({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: GOLD,
        flexShrink: 0,
        boxShadow: `0 0 0 ${size * 0.35}px ${GOLD}22`,
      }}
    />
  )
}

function Timeline({
  items,
  height,
  width,
  showDates,
  showDescriptions,
  centered,
  maxTitle,
}: {
  items: CardMilestone[]
  height: number
  width: number
  showDates: boolean
  showDescriptions: boolean
  centered: boolean
  maxTitle: number
}) {
  if (items.length === 0) return null
  const rowH = Math.floor(height / items.length)
  const markerCol = 28
  const colW = centered ? (width - markerCol - 36 * 2) / 2 : width - markerCol - 36

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unused = colW

  const itemMt = (m: CardMilestone): Metrics => {
    const maxLen = m.title.length + (m.description?.length || 0) * 0.6
    return metricsFor(
      rowH,
      showDates && !!m.when.trim(),
      !!m.description.trim(),
      showDescriptions,
      maxTitle,
      centered ? (width - markerCol - 72) / 2 : width - markerCol - 36,
      maxLen,
    )
  }

  return (
    <div style={{ position: 'relative', height, overflow: 'hidden' }}>
      {/* Vertical timeline line */}
      <div
        style={{
          position: 'absolute',
          left: centered ? width / 2 - 1 : 11,
          top: 0,
          bottom: 0,
          width: 2,
          background: `linear-gradient(to bottom, ${GOLD}00, ${GOLD}55 10%, ${GOLD}55 90%, ${GOLD}00)`,
        }}
      />
      {items.map((m, i) => {
        const itemMtVal = itemMt(m)
        itemMtVal.showWhen = showDates && !!m.when.trim()
        if (centered) {
          const left = i % 2 === 0
          return (
            <div
              key={m.id}
              style={{
                height: rowH,
                display: 'grid',
                gridTemplateColumns: '1fr 28px 1fr',
                columnGap: 36,
                alignItems: 'center',
              }}
            >
              <div>{left && <ItemText m={m} mt={itemMtVal} align="right" showDates={showDates} showDescriptions={showDescriptions} />}</div>
              <Marker size={22} />
              <div>{!left && <ItemText m={m} mt={itemMtVal} align="left" showDates={showDates} showDescriptions={showDescriptions} />}</div>
            </div>
          )
        }
        return (
          <div key={m.id} style={{ height: rowH, display: 'flex', alignItems: 'center', gap: 36 }}>
            <Marker size={22} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <ItemText m={m} mt={itemMtVal} align="left" showDates={showDates} showDescriptions={showDescriptions} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Card hallmark with small favicon emblem
function CardFavicon({ brand }: { brand?: string }) {
  return (
    <div
      style={{
        ...sans,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: 38,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/life-so-far-logo.png"
        alt="Life So Far"
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          boxShadow: '0 1px 3px rgba(42, 39, 35, 0.12)',
          border: `1px solid ${GOLD}44`,
          display: 'block',
        }}
      />
      {brand && (
        <span
          style={{
            fontSize: 15,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: MUTED,
            opacity: 0.65,
          }}
        >
          {brand}
        </span>
      )}
    </div>
  )
}

export function LifeCard(props: LifeCardProps) {
  const { lang, nickname, age, showAge, showDates, showDescriptions, photo, photoZoom, photoX, photoY, brand } = props
  const { dictionaries } = require('@/lib/i18n')
  const t = dictionaries[lang]
  const items = props.milestones.slice(0, 15)
  // Card title always defaults to English "My Life So Far"
  const title = props.cardTitle.trim() || 'My Life So Far'
  const headline = headlineText(items.length, age, showAge, lang)
  const hasPhoto = !!photo
  const innerW = CARD_W - PAD * 2
  const nick = nickname.trim()

  const base: CSSProperties = {
    position: 'relative',
    width: CARD_W,
    height: CARD_H,
    background: `radial-gradient(ellipse 110% 70% at 50% 0%, #fffef9 0%, ${IVORY} 45%, #ede5cc 100%)`,
    color: INK,
    overflow: 'hidden',
    ...sans,
  }

  // Outer decorative frame
  const frame = (
    <>
      {/* Main border */}
      <div
        style={{
          position: 'absolute',
          inset: 24,
          border: `1.5px solid ${GOLD}`,
          borderRadius: 6,
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      />
      {/* Inner hairline */}
      <div
        style={{
          position: 'absolute',
          inset: 30,
          border: `0.5px solid ${GOLD}`,
          borderRadius: 4,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />
      {/* Subtle corner ornaments */}
      {[
        { top: 32, left: 32 },
        { top: 32, right: 32 },
        { bottom: 32, left: 32 },
        { bottom: 32, right: 32 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            width: 16,
            height: 16,
            border: `1.5px solid ${GOLD}`,
            opacity: 0.55,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )

  if (hasPhoto) {
    const headerH = 420
    const gap = 44
    const markH = 38
    const timelineH = CARD_H - PAD * 2 - headerH - gap - markH - 20
    const tSize = titleSizeFor(title, 68, 16)
    // Photo circle dimensions
    const photoSize = 300
    const photoRadius = photoSize / 2  // fully circular

    return (
      <div style={base} data-variant="photo">
        {frame}
        <div style={{ position: 'absolute', left: PAD, top: PAD, width: innerW, height: CARD_H - PAD * 2 }}>
          <div style={{ height: headerH, display: 'flex', gap: 52, alignItems: 'center' }}>

            {/* Photo — fully round */}
            <div style={{ position: 'relative', width: photoSize, height: photoSize, flexShrink: 0 }}>
              {/* Outer glow ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${GOLD}33 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />
              {/* Gold ring border */}
              <div
                style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: '50%',
                  border: `2px solid ${GOLD}`,
                  opacity: 0.85,
                  pointerEvents: 'none',
                }}
              />
              {/* Inner ring accent */}
              <div
                style={{
                  position: 'absolute',
                  inset: -1,
                  borderRadius: '50%',
                  border: `1px solid ${GOLD}55`,
                  pointerEvents: 'none',
                }}
              />
              {/* Photo clip */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  borderRadius: '50%',
                  background: '#e8dfca',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: `${photoX}% ${photoY}%`,
                    transform: `scale(${photoZoom})`,
                    transformOrigin: `${photoX}% ${photoY}%`,
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Header text */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  fontSize: 19,
                  letterSpacing: '0.30em',
                  textTransform: 'uppercase',
                  color: GOLD_TEXT,
                  fontWeight: 600,
                  marginBottom: 16,
                  overflowWrap: 'anywhere',
                }}
              >
                {nick || t.eyebrow}
              </div>
              <div style={{ ...display, ...clamp(3), fontSize: tSize, lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.01em', color: INK }}>
                {title}
              </div>

              {/* Gold rule with diamond accent */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
                <div style={{ flex: 1, height: 1.5, background: `linear-gradient(to right, ${GOLD}, ${GOLD}44)` }} />
                <div style={{ width: 9, height: 9, background: GOLD, transform: 'rotate(45deg)', flexShrink: 0 }} />
              </div>

              <div style={{ ...display, ...clamp(2), fontSize: 36, lineHeight: 1.2, fontStyle: 'italic', color: GOLD_TEXT, fontWeight: 400 }}>
                {headline}
              </div>
              <div style={{ ...sans, ...clamp(2), fontSize: 21, lineHeight: 1.5, color: MUTED, marginTop: 14, fontStyle: 'italic' }}>
                {t.tagline}
              </div>
            </div>
          </div>

          {/* Divider line between header and timeline */}
          <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}44, transparent)`, margin: `${gap / 2}px 0` }} />

          <div style={{ marginTop: gap / 2 }}>
            <Timeline
              items={items}
              height={timelineH}
              width={innerW}
              showDates={showDates}
              showDescriptions={showDescriptions}
              centered={false}
              maxTitle={36}
            />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <CardFavicon brand={brand} />
          </div>
        </div>
      </div>
    )
  }

  // Variant B: no picture, typographic composition
  const headerH = 410
  const gap = 36
  const markH = 38
  const timelineH = CARD_H - PAD * 2 - headerH - gap - markH - 20
  const centered = items.length <= 8
  const tSize = titleSizeFor(title, 96, 14)
  return (
    <div style={base} data-variant="typographic">
      {frame}
      {/* Large watermark number */}
      <div
        aria-hidden
        style={{
          ...display,
          position: 'absolute',
          top: 40,
          right: 60,
          fontSize: 340,
          lineHeight: 1,
          fontWeight: 700,
          color: GOLD,
          opacity: 0.07,
          letterSpacing: '-0.04em',
        }}
      >
        {formatNumber(items.length, lang)}
      </div>
      <div style={{ position: 'absolute', left: PAD, top: PAD, width: innerW, height: CARD_H - PAD * 2 }}>
        <div style={{ height: headerH, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: GOLD_TEXT,
              fontWeight: 600,
              marginBottom: 22,
              overflowWrap: 'anywhere',
            }}
          >
            {nick || t.eyebrow}
          </div>
          <div style={{ ...display, ...clamp(2), fontSize: tSize, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.015em', maxWidth: innerW, color: INK }}>
            {title}
          </div>

          {/* Decorative divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, margin: '28px 0' }}>
            <div style={{ width: 96, height: 1.5, background: `linear-gradient(to left, ${GOLD}, ${GOLD}22)` }} />
            <div style={{ width: 12, height: 12, background: GOLD, transform: 'rotate(45deg)', flexShrink: 0 }} />
            <div style={{ width: 96, height: 1.5, background: `linear-gradient(to right, ${GOLD}, ${GOLD}22)` }} />
          </div>

          <div style={{ ...display, ...clamp(2), fontSize: 50, lineHeight: 1.15, fontStyle: 'italic', color: GOLD_TEXT, maxWidth: innerW, fontWeight: 400 }}>
            {headline}
          </div>
          <div style={{ ...sans, ...clamp(2), fontSize: 23, lineHeight: 1.45, color: MUTED, marginTop: 20, fontStyle: 'italic' }}>
            {t.tagline}
          </div>
        </div>

        {/* Horizontal rule */}
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}44, transparent)`, marginBottom: gap }} />

        <Timeline
          items={items}
          height={timelineH}
          width={innerW}
          showDates={showDates}
          showDescriptions={showDescriptions}
          centered={centered}
          maxTitle={centered ? 42 : 38}
        />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <CardFavicon brand={brand} />
        </div>
      </div>
    </div>
  )
}
