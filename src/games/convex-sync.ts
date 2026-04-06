/**
 * Convex data layer — single source of truth for all player data.
 * No localStorage. All reads/writes go through Convex.
 */

const DEVICE_ID_KEY = 'device-id'

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

export { getDeviceId }

function getConvexUrl(): string {
  const url = import.meta.env.VITE_CONVEX_URL
  if (!url) throw new Error('VITE_CONVEX_URL is not set')
  return url
}

async function convexMutation(name: string, args: Record<string, unknown>) {
  const res = await fetch(`${getConvexUrl()}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: name, args, format: 'json' }),
  })
  if (!res.ok) throw new Error(`Convex mutation failed: ${res.status}`)
  const data = await res.json()
  return data.value
}

async function convexQuery(name: string, args: Record<string, unknown>) {
  const res = await fetch(`${getConvexUrl()}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: name, args, format: 'json' }),
  })
  if (!res.ok) throw new Error(`Convex query failed: ${res.status}`)
  const data = await res.json()
  return data.value
}

// ── Types ──

export interface PlayerData {
  name: string
  emoji: string
  totalStars: number
  achievements: string[]
  currentStreak: number
  longestStreak: number
  lastPlayDate: string
}

export interface GameHistoryEntry {
  date: string
  game: string
  level: 'starters' | 'movers' | 'flyers'
  stars: number
}

export interface GameCompletionResult {
  stars: number
  totalStars: number
  newlyUnlocked: string[]
}

// ── API ──

export async function getPlayer(): Promise<PlayerData | null> {
  return await convexQuery('players:getByDeviceId', { deviceId: getDeviceId() })
}

export async function createProfile(name: string, emoji: string): Promise<void> {
  await convexMutation('players:createProfile', {
    deviceId: getDeviceId(),
    name,
    emoji,
  })
}

export async function updateProfile(name: string, emoji: string): Promise<void> {
  await convexMutation('players:updateProfile', {
    deviceId: getDeviceId(),
    name,
    emoji,
  })
}

/**
 * Record a game completion. Server calculates stars, streaks, achievements.
 * Returns the stars earned and any newly unlocked achievements.
 */
export async function recordGameCompletion(
  level: 'starters' | 'movers' | 'flyers',
  game: string,
): Promise<GameCompletionResult> {
  return await convexMutation('players:recordGameCompletion', {
    deviceId: getDeviceId(),
    game,
    level,
  })
}

export async function getGameHistory(): Promise<GameHistoryEntry[]> {
  const result = await convexQuery('gameHistory:getByDeviceId', { deviceId: getDeviceId() })
  return (result ?? []).map((h: GameHistoryEntry) => ({
    date: h.date,
    game: h.game,
    level: h.level,
    stars: h.stars,
  }))
}
