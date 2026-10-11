import type { Metadata } from 'next'
import { Editor } from '@/components/life/editor'

export const metadata: Metadata = {
  title: 'Build your timeline — Life So Far',
  description: 'Add your milestones and create a shareable card. Everything stays in your browser.',
}

export default function CreatePage() {
  return <Editor />
}
