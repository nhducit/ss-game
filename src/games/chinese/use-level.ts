import { useSyncExternalStore, useCallback } from 'react'
import type { Level } from './words'

const STORAGE_KEY = 'chinese-level'
const listeners = new Set<() => void>()

function getLevel(): Level {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'starters' || raw === 'movers' || raw === 'flyers') return raw
  } catch {}
  return 'starters'
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useChineseLevel(): [Level, (level: Level) => void] {
  const level = useSyncExternalStore(subscribe, getLevel, () => 'starters' as Level)

  const setLevel = useCallback((newLevel: Level) => {
    localStorage.setItem(STORAGE_KEY, newLevel)
    listeners.forEach(cb => cb())
  }, [])

  return [level, setLevel]
}
