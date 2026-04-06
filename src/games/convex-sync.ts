import type { PlayerProfile, DifficultyLevel } from './gamification'

const DEVICE_ID_KEY = 'device-id'

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

function getConvexUrl(): string | null {
  return import.meta.env.VITE_CONVEX_URL || null
}

async function convexMutation(name: string, args: Record<string, unknown>) {
  const url = getConvexUrl()
  if (!url) return
  const res = await fetch(`${url}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: name, args, format: 'json' }),
  })
  if (!res.ok) throw new Error(`Convex mutation failed: ${res.status}`)
  return res.json()
}

async function convexQuery(name: string, args: Record<string, unknown>) {
  const url = getConvexUrl()
  if (!url) return null
  const res = await fetch(`${url}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: name, args, format: 'json' }),
  })
  if (!res.ok) throw new Error(`Convex query failed: ${res.status}`)
  return res.json()
}

/** Sync current localStorage state to Convex. Fire-and-forget. */
export function syncToConvex() {
  if (!getConvexUrl()) return

  // Import lazily to avoid circular deps
  const profile = JSON.parse(localStorage.getItem('player-profile') || '{"name":"","emoji":"🧒"}')
  const gam = JSON.parse(localStorage.getItem('gamification') || '{"totalStars":0,"achievements":[]}')
  const streak = JSON.parse(localStorage.getItem('daily-streak') || '{"currentStreak":0,"longestStreak":0,"lastPlayDate":""}')

  convexMutation('players:upsert', {
    deviceId: getDeviceId(),
    name: profile.name,
    emoji: profile.emoji,
    totalStars: gam.totalStars ?? gam.totalXP ?? 0,
    achievements: gam.achievements ?? [],
    currentStreak: streak.currentStreak ?? 0,
    longestStreak: streak.longestStreak ?? 0,
    lastPlayDate: streak.lastPlayDate ?? '',
  }).catch(() => {})
}

/** Sync profile changes to Convex */
export function syncProfileToConvex(profile: PlayerProfile) {
  if (!getConvexUrl()) return
  convexMutation('players:updateProfile', {
    deviceId: getDeviceId(),
    name: profile.name,
    emoji: profile.emoji,
  }).catch(() => {})
}

/** Record a game completion to Convex */
export function syncGameHistoryToConvex(game: string, level: DifficultyLevel, stars: number) {
  if (!getConvexUrl()) return
  convexMutation('gameHistory:record', {
    deviceId: getDeviceId(),
    date: new Date().toISOString(),
    game,
    level,
    stars,
  }).catch(() => {})
}

/** Pull data from Convex and merge into localStorage (Convex wins on conflicts) */
export async function pullFromConvex(): Promise<boolean> {
  if (!getConvexUrl()) return false

  try {
    const deviceId = getDeviceId()
    const result = await convexQuery('players:getByDeviceId', { deviceId })
    const player = result?.value

    if (player) {
      // Profile: use Convex if local is empty
      const localProfile = JSON.parse(localStorage.getItem('player-profile') || '{}')
      if (!localProfile.name && player.name) {
        localStorage.setItem('player-profile', JSON.stringify({
          name: player.name,
          emoji: player.emoji,
        }))
      }

      // Stars: Convex wins if higher
      const localGam = JSON.parse(localStorage.getItem('gamification') || '{"totalStars":0}')
      const localStars = localGam.totalStars ?? localGam.totalXP ?? 0
      if (player.totalStars > localStars) {
        localStorage.setItem('gamification', JSON.stringify({
          totalStars: player.totalStars,
          achievements: player.achievements,
        }))
      }

      // Streak: Convex wins if higher
      const localStreak = JSON.parse(localStorage.getItem('daily-streak') || '{"currentStreak":0}')
      if (player.currentStreak > (localStreak.currentStreak ?? 0)) {
        localStorage.setItem('daily-streak', JSON.stringify({
          currentStreak: player.currentStreak,
          longestStreak: player.longestStreak,
          lastPlayDate: player.lastPlayDate,
        }))
      }
    }

    // Pull history
    const histResult = await convexQuery('gameHistory:getByDeviceId', { deviceId })
    const history = histResult?.value
    if (history && Array.isArray(history) && history.length > 0) {
      const localHistory = JSON.parse(localStorage.getItem('game-history') || '[]')
      if (history.length > localHistory.length) {
        const mapped = history.map((h: { date: string; game: string; level: string; stars: number }) => ({
          date: h.date,
          game: h.game,
          level: h.level,
          stars: h.stars,
        }))
        localStorage.setItem('game-history', JSON.stringify(mapped))
      }
    }

    return true
  } catch {
    return false
  }
}
