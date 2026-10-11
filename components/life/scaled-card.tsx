'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import { CARD_H, CARD_W, LifeCard, type LifeCardProps } from './life-card'

export const ScaledCard = forwardRef<HTMLDivElement, LifeCardProps & { className?: string }>(function ScaledCard(
  { className, ...card },
  ref,
) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => {
      if (el.clientWidth > 0) setScale(el.clientWidth / CARD_W)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={box}
      className={className}
      style={{ position: 'relative', width: '100%', height: CARD_H * scale, overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: CARD_W, height: CARD_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <div ref={ref} style={{ width: CARD_W, height: CARD_H }}>
          <LifeCard {...card} />
        </div>
      </div>
    </div>
  )
})
