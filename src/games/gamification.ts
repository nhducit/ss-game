const STREAK_KEY = 'daily-streak'
const GAMIFICATION_KEY = 'gamification'

export type DifficultyLevel = 'starters' | 'movers' | 'flyers'

const STARS_PER_LEVEL: Record<DifficultyLevel, number> = {
  starters: 1,
  movers: 2,
  flyers: 3,
}

interface StreakData {
  currentStreak: number
  lastPlayDate: string
  longestStreak: number
}

interface GamificationData {
  totalStars: number
  achievements: string[]
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

// ── Streak ──

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted */ }
  return { currentStreak: 0, lastPlayDate: '', longestStreak: 0 }
}

function saveStreak(data: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
}

export function getStreak(): StreakData {
  return loadStreak()
}

/** Call when a game session is completed. Stars awarded based on difficulty level. */
export function recordGameCompletion(level: DifficultyLevel): string[] {
  const stars = STARS_PER_LEVEL[level]

  // Update streak
  const streak = loadStreak()
  const t = today()
  if (streak.lastPlayDate !== t) {
    if (streak.lastPlayDate === yesterday()) {
      streak.currentStreak++
    } else {
      streak.currentStreak = 1
    }
    streak.lastPlayDate = t
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak)
    saveStreak(streak)
  }

  // Update stars
  const gam = loadGamification()
  gam.totalStars += stars
  saveGamification(gam)

  // Check achievements
  return checkAchievements(streak, gam)
}

// ── Gamification / Stars ──

function loadGamification(): GamificationData {
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Migrate from old XP format
      if ('totalXP' in parsed && !('totalStars' in parsed)) {
        return { totalStars: parsed.totalXP, achievements: parsed.achievements ?? [] }
      }
      return parsed
    }
  } catch { /* corrupted */ }
  return { totalStars: 0, achievements: [] }
}

function saveGamification(data: GamificationData) {
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data))
}

export function getGamification(): GamificationData {
  return loadGamification()
}

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

function checkAchievements(streak: StreakData, gam: GamificationData): string[] {
  const newlyUnlocked: string[] = []
  const earned = new Set(gam.achievements)

  const checks: [string, boolean][] = [
    ['first-game', true],
    ['streak-3', streak.currentStreak >= 3],
    ['streak-7', streak.currentStreak >= 7],
    ['streak-30', streak.currentStreak >= 30],
    ['stars-50', gam.totalStars >= 50],
    ['stars-200', gam.totalStars >= 200],
    ['stars-1000', gam.totalStars >= 1000],
  ]

  for (const [id, condition] of checks) {
    if (condition && !earned.has(id)) {
      gam.achievements.push(id)
      newlyUnlocked.push(id)
    }
  }

  if (newlyUnlocked.length > 0) {
    saveGamification(gam)
  }

  return newlyUnlocked
}
