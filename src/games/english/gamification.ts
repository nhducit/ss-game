const STREAK_KEY = 'daily-streak'
const GAMIFICATION_KEY = 'gamification'

interface StreakData {
  currentStreak: number
  lastPlayDate: string
  longestStreak: number
}

interface GamificationData {
  totalXP: number
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

/** Call when a game session is completed (results screen reached) */
export function recordGameCompletion(scoreEarned: number): string[] {
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

  // Update XP
  const gam = loadGamification()
  gam.totalXP += scoreEarned
  saveGamification(gam)

  // Check achievements
  return checkAchievements(streak, gam)
}

// ── Gamification / XP ──

function loadGamification(): GamificationData {
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted */ }
  return { totalXP: 0, achievements: [] }
}

function saveGamification(data: GamificationData) {
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data))
}

export function getGamification(): GamificationData {
  return loadGamification()
}

export interface LevelInfo {
  name: string
  minXP: number
  emoji: string
}

const LEVELS: LevelInfo[] = [
  { name: 'Beginner', minXP: 0, emoji: '🌱' },
  { name: 'Explorer', minXP: 100, emoji: '🗺️' },
  { name: 'Learner', minXP: 300, emoji: '📖' },
  { name: 'Scholar', minXP: 600, emoji: '🎓' },
  { name: 'Champion', minXP: 1000, emoji: '🏆' },
  { name: 'Master', minXP: 2000, emoji: '👑' },
  { name: 'Legend', minXP: 5000, emoji: '⭐' },
]

export function getLevel(xp: number): LevelInfo & { nextLevel: LevelInfo | null; progress: number } {
  let current = LEVELS[0]
  let nextIdx = 1
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i]
      nextIdx = i + 1
      break
    }
  }
  const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null
  const progress = next
    ? (xp - current.minXP) / (next.minXP - current.minXP)
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
  { id: 'score-100', name: 'Century', emoji: '💯', description: 'Earn 100 total XP' },
  { id: 'score-1000', name: 'Grand', emoji: '🏅', description: 'Earn 1000 total XP' },
  { id: 'score-5000', name: 'Legendary', emoji: '🌟', description: 'Earn 5000 total XP' },
]

function checkAchievements(streak: StreakData, gam: GamificationData): string[] {
  const newlyUnlocked: string[] = []
  const earned = new Set(gam.achievements)

  const checks: [string, boolean][] = [
    ['first-game', true],
    ['streak-3', streak.currentStreak >= 3],
    ['streak-7', streak.currentStreak >= 7],
    ['streak-30', streak.currentStreak >= 30],
    ['score-100', gam.totalXP >= 100],
    ['score-1000', gam.totalXP >= 1000],
    ['score-5000', gam.totalXP >= 5000],
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
