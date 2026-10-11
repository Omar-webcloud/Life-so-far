'use client'

import { useLife } from '@/lib/life-store'
import { sampleMilestones } from '@/lib/i18n'
import { ScaledCard } from './scaled-card'

export function SampleCard({ withPhoto, className }: { withPhoto: boolean; className?: string }) {
  const { state, t } = useLife()
  const lang = state.lang
  const milestones = sampleMilestones.map((m, i) => ({
    id: String(i),
    title: m[lang][0],
    description: m[lang][1],
    when: m.when,
    emoji: m.emoji,
  }))
  return (
    <ScaledCard
      className={className}
      lang={lang}
      cardTitle=""
      nickname={withPhoto ? t.sampleNickname : ''}
      age="23"
      showAge
      showDates
      showDescriptions
      milestones={milestones}
      photo={withPhoto ? '/sample-portrait.png' : null}
      photoZoom={1}
      photoX={50}
      photoY={30}
    />
  )
}
