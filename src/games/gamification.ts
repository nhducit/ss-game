/**
 * Pure utility functions for gamification display.
 * No data storage — all data comes from Convex via convex-sync.ts.
 */

export type DifficultyLevel = 'starters' | 'movers' | 'flyers'

// ── Player Levels ──

export interface PlayerLevel {
  name: string
  minStars: number
  emoji: string
}

const LEVELS: PlayerLevel[] = [
  { name: 'Beginner', minStars: 0, emoji: '🌱' },
  { name: 'Explorer', minStars: 20, emoji: '🗺️' },
  { name: 'Learner', minStars: 50, emoji: '📖' },
  { name: 'Scholar', minStars: 100, emoji: '🎓' },
  { name: 'Champion', minStars: 200, emoji: '🏆' },
  { name: 'Master', minStars: 500, emoji: '👑' },
  { name: 'Legend', minStars: 1000, emoji: '⭐' },
]

export function getPlayerLevel(stars: number): PlayerLevel & { nextLevel: PlayerLevel | null; progress: number } {
  let current = LEVELS[0]
  let nextIdx = 1
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (stars >= LEVELS[i].minStars) {
      current = LEVELS[i]
      nextIdx = i + 1
      break
    }
  }
  const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null
  const progress = next
    ? (stars - current.minStars) / (next.minStars - current.minStars)
    : 1
  return { ...current, nextLevel: next, progress }
}

// ── Achievements ──

export interface Achievement {
  id: string
  name: string
  emoji: string
  description: string
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-game', name: 'First Steps', emoji: '👣', description: 'Complete your first game' },
  { id: 'streak-3', name: 'On Fire', emoji: '🔥', description: '3-day streak' },
  { id: 'streak-7', name: 'Week Warrior', emoji: '⚔️', description: '7-day streak' },
  { id: 'streak-30', name: 'Monthly Master', emoji: '📅', description: '30-day streak' },
  { id: 'stars-50', name: 'Rising Star', emoji: '💫', description: 'Earn 50 stars' },
  { id: 'stars-200', name: 'Superstar', emoji: '🏅', description: 'Earn 200 stars' },
  { id: 'stars-1000', name: 'Legendary', emoji: '🌟', description: 'Earn 1000 stars' },
]

// ── Star notification ──

export function notifyStarsEarned(stars: number, totalStars: number) {
  window.dispatchEvent(new CustomEvent('stars-earned', { detail: { stars, totalStars } }))
}
