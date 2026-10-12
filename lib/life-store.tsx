'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { dictionaries, sampleMilestones, type Category, type Dict, type Lang } from './i18n'

export type Milestone = {
  id: string
  title: string
  category: Category
  when: string
  description: string
  emoji: string
  included: boolean
}

export type LifeState = {
  lang: Lang
  cardTitle: string
  nickname: string
  age: string
  showAge: boolean
  showDates: boolean
  showDescriptions: boolean
  milestones: Milestone[]
  photoZoom: number
  photoX: number
  photoY: number
}

const DEFAULT_STATE: LifeState = {
  lang: 'en',
  cardTitle: '',
  nickname: '',
  age: '',
  showAge: true,
  showDates: true,
  showDescriptions: true,
  milestones: [],
  photoZoom: 1,
  photoX: 50,
  photoY: 40,
}

const STATE_KEY = 'lsf:state:v1'
const PHOTO_KEY = 'lsf:photo:v1'

type StorageStatus = 'ok' | 'unavailable' | 'full'

type Ctx = {
  state: LifeState
  photo: string | null
  photoSaved: boolean
  hydrated: boolean
  storage: StorageStatus
  t: Dict
  update: (patch: Partial<LifeState>) => void
  setLang: (lang: Lang) => void
  setPhoto: (dataUrl: string | null) => void
  addMilestone: (m: Partial<Milestone> & { title: string }) => void
  updateMilestone: (id: string, patch: Partial<Milestone>) => void
  removeMilestone: (id: string) => void
  moveMilestone: (id: string, dir: -1 | 1) => void
  loadSample: () => void
  resetAll: () => void
}

const LifeContext = createContext<Ctx | null>(null)

export function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

export function LifeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LifeState>(DEFAULT_STATE)
  const [photo, setPhotoState] = useState<string | null>(null)
  const [photoSaved, setPhotoSaved] = useState(true)
  const [hydrated, setHydrated] = useState(false)
  const [storage, setStorage] = useState<StorageStatus>('ok')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STATE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LifeState>
        setState({ ...DEFAULT_STATE, ...parsed, milestones: Array.isArray(parsed.milestones) ? parsed.milestones : [] })
      }
      const storedPhoto = window.localStorage.getItem(PHOTO_KEY)
      if (storedPhoto) setPhotoState(storedPhoto)
    } catch {
      setStorage('unavailable')
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    document.documentElement.lang = state.lang
  }, [state.lang])

  useEffect(() => {
    if (!hydrated || storage === 'unavailable') return
    try {
      window.localStorage.setItem(STATE_KEY, JSON.stringify(state))
    } catch (e) {
      setStorage(e instanceof DOMException && e.name.includes('Quota') ? 'full' : 'unavailable')
    }
  }, [state, storage, hydrated])

  const update = useCallback((patch: Partial<LifeState>) => setState((s) => ({ ...s, ...patch })), [])
  const setLang = useCallback((lang: Lang) => setState((s) => ({ ...s, lang })), [])

  const setPhoto = useCallback((dataUrl: string | null) => {
    setPhotoState(dataUrl)
    try {
      if (dataUrl) window.localStorage.setItem(PHOTO_KEY, dataUrl)
      else window.localStorage.removeItem(PHOTO_KEY)
      setPhotoSaved(true)
    } catch {
      setPhotoSaved(false)
    }
  }, [])

  const addMilestone = useCallback((m: Partial<Milestone> & { title: string }) => {
    setState((s) => ({
      ...s,
      milestones: [
        ...s.milestones,
        { id: newId(), category: 'personal', when: '', description: '', emoji: '', included: true, ...m },
      ],
    }))
  }, [])

  const updateMilestone = useCallback((id: string, patch: Partial<Milestone>) => {
    setState((s) => ({ ...s, milestones: s.milestones.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))
  }, [])

  const removeMilestone = useCallback((id: string) => {
    setState((s) => ({ ...s, milestones: s.milestones.filter((m) => m.id !== id) }))
  }, [])

  const moveMilestone = useCallback((id: string, dir: -1 | 1) => {
    setState((s) => {
      const i = s.milestones.findIndex((m) => m.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= s.milestones.length) return s
      const next = [...s.milestones]
      ;[next[i], next[j]] = [next[j], next[i]]
      return { ...s, milestones: next }
    })
  }, [])

  const loadSample = useCallback(() => {
    setState((s) => {
      const lang = s.lang
      const samples: Milestone[] = sampleMilestones.map((m) => ({
        id: newId(),
        title: m[lang][0],
        category: 'personal',
        when: m.when,
        description: m[lang][1],
        emoji: m.emoji,
        included: true,
      }))
      return {
        ...s,
        nickname: s.nickname || (lang === 'bn' ? 'আবুল হায়াত' : 'Abul Hayat'),
        age: s.age || '23',
        milestones: samples,
      }
    })
  }, [])

  const resetAll = useCallback(() => {
    setState((s) => ({ ...DEFAULT_STATE, lang: s.lang }))
    setPhotoState(null)
    setPhotoSaved(true)
    try {
      window.localStorage.removeItem(PHOTO_KEY)
      window.localStorage.removeItem(STATE_KEY)
      window.sessionStorage.clear()
    } catch {
      /* storage unavailable */
    }
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      state,
      photo,
      photoSaved,
      hydrated,
      storage,
      t: dictionaries[state.lang],
      update,
      setLang,
      setPhoto,
      addMilestone,
      updateMilestone,
      removeMilestone,
      moveMilestone,
      loadSample,
      resetAll,
    }),
    [state, photo, photoSaved, hydrated, storage, update, setLang, setPhoto, addMilestone, updateMilestone, removeMilestone, moveMilestone, loadSample, resetAll],
  )

  return <LifeContext.Provider value={value}>{children}</LifeContext.Provider>
}

export function useLife() {
  const ctx = useContext(LifeContext)
  if (!ctx) throw new Error('useLife must be used within LifeProvider')
  return ctx
}
