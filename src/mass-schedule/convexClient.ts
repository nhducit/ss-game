import type { Church } from './types'

function getConvexUrl(): string {
  const url = import.meta.env.VITE_CONVEX_URL
  if (!url) throw new Error('VITE_CONVEX_URL is not set')
  return url
}

async function convexQuery<T>(path: string, args: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`${getConvexUrl()}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  })
  if (!res.ok) throw new Error(`Convex query failed: ${res.status}`)
  const data = await res.json()
  return data.value
}

async function convexMutation<T>(path: string, args: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`${getConvexUrl()}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  })
  if (!res.ok) throw new Error(`Convex mutation failed: ${res.status}`)
  const data = await res.json()
  return data.value
}

export async function listChurches(): Promise<Church[]> {
  return await convexQuery<Church[]>('churches:list')
}

export async function seedChurches(): Promise<{ inserted: number }> {
  return await convexMutation<{ inserted: number }>('churches:seed')
}
