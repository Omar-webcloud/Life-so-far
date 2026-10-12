import type { Metadata } from 'next'
import { Editor } from '@/components/life/editor'

export const metadata: Metadata = {
  title: 'Build Your Timeline | Life So Far',
  description: 'Add your milestones and create an elegant, shareable life story card. Completely private and personal.',
  alternates: {
    canonical: '/create',
  },
}

export default function CreatePage() {
  return <Editor />
}
