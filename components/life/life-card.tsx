import type { CSSProperties } from 'react'
import { dictionaries, formatNumber, headlineText, type Lang } from '@/lib/i18n'

export const CARD_W = 1080
export const CARD_H = 1350
const PAD = 88

const INK = '#2a2723'
const MUTED = '#6a6358'
const GOLD = '#b08d4a'
const GOLD_TEXT = '#85652a'
const IVORY = '#faf6ec'

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
      <div style={{ ...display, ...clamp(mt.titleLines), fontSize: mt.titleSize, lineHeight: 1.25, color: INK, fontWeight: 600 }}>
        {m.emoji ? `${m.emoji}\u00A0` : ''}
        {m.title}
      </div>
      {mt.descLines > 0 && showDescriptions && m.description.trim() && (
        <div style={{ ...sans, ...clamp(mt.descLines), fontSize: mt.descSize, lineHeight: 1.4, color: MUTED, marginTop: 2 }}>
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
        background: IVORY,
        border: `3px solid ${GOLD}`,
        boxShadow: `0 0 0 6px ${IVORY}`,
        flexShrink: 0,
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
  const n = Math.max(items.length, 1)
  const rowH = Math.min(height / n, 150)
  const used = rowH * items.length
  const offset = (height - used) / 2
  const anyWhen = showDates && items.some((m) => m.when.trim())
  const anyDesc = showDescriptions && items.some((m) => m.description.trim())
  const colW = centered ? (width - 28 - 72) / 2 : width - 58
  const maxLen = Math.max(1, ...items.map((m) => m.title.length + (m.emoji ? 2 : 0)))
  const mt = metricsFor(rowH, anyWhen, anyDesc, showDescriptions, maxTitle, colW, maxLen)

  return (
    <div style={{ position: 'relative', width, height }}>
      {items.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: offset + rowH / 2,
            height: used - rowH,
            width: 2,
            left: centered ? width / 2 - 1 : 11,
            background: `linear-gradient(${GOLD}, ${GOLD})`,
            opacity: 0.55,
          }}
        />
      )}
      <div style={{ position: 'absolute', top: offset, left: 0, width }}>
        {items.map((m, i) => {
          const itemMt = {
            ...mt,
            showWhen: showDates && !!m.when.trim(),
          }
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
                <div>{left && <ItemText m={m} mt={itemMt} align="right" showDates={showDates} showDescriptions={showDescriptions} />}</div>
                <Marker size={22} />
                <div>{!left && <ItemText m={m} mt={itemMt} align="left" showDates={showDates} showDescriptions={showDescriptions} />}</div>
              </div>
            )
          }
          return (
            <div key={m.id} style={{ height: rowH, display: 'flex', alignItems: 'center', gap: 36 }}>
              <Marker size={22} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <ItemText m={m} mt={itemMt} align="left" showDates={showDates} showDescriptions={showDescriptions} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Footer({ lang, brand }: { lang: Lang; brand?: string }) {
  return (
    <div
      style={{
        ...sans,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: `1px solid ${GOLD}66`,
        fontSize: 20,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: MUTED,
      }}
    >
      <span style={{ ...display, letterSpacing: 0, textTransform: 'none', fontSize: 26, fontStyle: 'italic', color: INK }}>
        {dictionaries[lang].appName}
      </span>
      {brand && <span>{brand}</span>}
    </div>
  )
}

export function LifeCard(props: LifeCardProps) {
  const { lang, nickname, age, showAge, showDates, showDescriptions, photo, photoZoom, photoX, photoY, brand } = props
  const t = dictionaries[lang]
  const items = props.milestones.slice(0, 15)
  const title = props.cardTitle.trim() || t.defaultCardTitle
  const headline = headlineText(items.length, age, showAge, lang)
  const hasPhoto = !!photo
  const innerW = CARD_W - PAD * 2
  const nick = nickname.trim()

  const base: CSSProperties = {
    position: 'relative',
    width: CARD_W,
    height: CARD_H,
    background: `radial-gradient(120% 80% at 50% 0%, #fffdf7 0%, ${IVORY} 55%, #f3ecd9 100%)`,
    color: INK,
    overflow: 'hidden',
    ...sans,
  }

  const frame = (
    <div
      style={{
        position: 'absolute',
        inset: 28,
        border: `1.5px solid ${GOLD}`,
        borderRadius: 4,
        opacity: 0.7,
        pointerEvents: 'none',
      }}
    />
  )

  if (hasPhoto) {
    const headerH = 410
    const gap = 44
    const timelineH = CARD_H - PAD * 2 - headerH - gap - 52 - 24
    const tSize = titleSizeFor(title, 68, 16)
    return (
      <div style={base} data-variant="photo">
        {frame}
        <div style={{ position: 'absolute', left: PAD, top: PAD, width: innerW, height: CARD_H - PAD * 2 }}>
          <div style={{ height: headerH, display: 'flex', gap: 52, alignItems: 'stretch' }}>
            <div style={{ position: 'relative', width: 300, height: headerH, flexShrink: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: -12,
                  borderRadius: '162px 162px 18px 18px',
                  border: `1.5px solid ${GOLD}`,
                  opacity: 0.8,
                }}
              />
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '150px 150px 8px 8px', background: '#e8dfca' }}>
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
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 20, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD_TEXT, fontWeight: 600, marginBottom: 18, overflowWrap: 'anywhere' }}>
                {nick || t.eyebrow}
              </div>
              <div style={{ ...display, ...clamp(3), fontSize: tSize, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
              <div style={{ width: 72, height: 2, background: GOLD, margin: '26px 0' }} />
              <div style={{ ...display, ...clamp(2), fontSize: 38, lineHeight: 1.2, fontStyle: 'italic', color: GOLD_TEXT }}>{headline}</div>
              <div style={{ ...clamp(2), fontSize: 22, lineHeight: 1.45, color: MUTED, marginTop: 16 }}>{t.tagline}</div>
            </div>
          </div>
          <div style={{ marginTop: gap }}>
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
            <Footer lang={lang} brand={brand} />
          </div>
        </div>
      </div>
    )
  }

  // Variant B: no picture, typographic composition
  const headerH = 410
  const gap = 36
  const timelineH = CARD_H - PAD * 2 - headerH - gap - 52 - 24
  const centered = items.length <= 8
  const tSize = titleSizeFor(title, 96, 14)
  return (
    <div style={base} data-variant="typographic">
      {frame}
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
          opacity: 0.1,
          letterSpacing: '-0.04em',
        }}
      >
        {formatNumber(items.length, lang)}
      </div>
      <div style={{ position: 'absolute', left: PAD, top: PAD, width: innerW, height: CARD_H - PAD * 2 }}>
        <div style={{ height: headerH, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 21, letterSpacing: '0.32em', textTransform: 'uppercase', color: GOLD_TEXT, fontWeight: 600, marginBottom: 22, overflowWrap: 'anywhere' }}>
            {nick || t.eyebrow}
          </div>
          <div style={{ ...display, ...clamp(2), fontSize: tSize, lineHeight: 1.05, fontWeight: 600, letterSpacing: '-0.015em', maxWidth: innerW }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, margin: '28px 0' }}>
            <div style={{ width: 96, height: 1.5, background: GOLD }} />
            <div style={{ width: 12, height: 12, background: GOLD, transform: 'rotate(45deg)' }} />
            <div style={{ width: 96, height: 1.5, background: GOLD }} />
          </div>
          <div style={{ ...display, ...clamp(2), fontSize: 50, lineHeight: 1.15, fontStyle: 'italic', color: GOLD_TEXT, maxWidth: innerW }}>{headline}</div>
          <div style={{ ...clamp(2), fontSize: 24, lineHeight: 1.45, color: MUTED, marginTop: 20 }}>{t.tagline}</div>
        </div>
        <div style={{ marginTop: gap }}>
          <Timeline
            items={items}
            height={timelineH}
            width={innerW}
            showDates={showDates}
            showDescriptions={showDescriptions}
            centered={centered}
            maxTitle={centered ? 42 : 38}
          />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <Footer lang={lang} brand={brand} />
        </div>
      </div>
    </div>
  )
}
