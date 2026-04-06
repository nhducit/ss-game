import { useCallback, useRef } from 'react'
import { recordGameCompletion } from '@/games/convex-sync'
import { notifyStarsEarned, type DifficultyLevel } from '@/games/gamification'

/**
 * Hook that records game completion to Convex and triggers star notification.
 * Ensures it only fires once per game session.
 */
export function useRecordGame() {
  const recorded = useRef(false)

  const record = useCallback(async (level: DifficultyLevel, game: string) => {
    if (recorded.current) return
    recorded.current = true
    try {
      const result = await recordGameCompletion(level, game)
      notifyStarsEarned(result.stars, result.totalStars)
    } catch {
      // Allow retry on failure
      recorded.current = false
    }
  }, [])

  const reset = useCallback(() => {
    recorded.current = false
  }, [])

  return { record, reset }
}
