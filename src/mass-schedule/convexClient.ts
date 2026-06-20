import type { Church } from './types'

function getConvexUrl(): string {
  const url = import.meta.env.VITE_CONVEX_URL
  if (!url) throw new Error('VITE_CONVEX_URL is not set')
  return url
}

interface ConvexResponse {
  status: 'success' | 'error'
  value?: unknown
  errorMessage?: string
}

async function callConvex<T>(
  endpoint: 'query' | 'mutation',
  path: string,
  args: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${getConvexUrl()}/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  })
  if (!res.ok) throw new Error(`Convex ${endpoint} failed: ${res.status}`)
  const data: ConvexResponse = await res.json()
  if (data.status === 'error') {
    throw new Error(data.errorMessage ?? `Convex ${endpoint} ${path} failed`)
  }
  return data.value as T
}

async function convexQuery<T>(path: string, args: Record<string, unknown> = {}): Promise<T> {
  return await callConvex<T>('query', path, args)
}

async function convexMutation<T>(path: string, args: Record<string, unknown> = {}): Promise<T> {
  return await callConvex<T>('mutation', path, args)
}

export async function listChurches(): Promise<Church[]> {
  return await convexQuery<Church[]>('churches:list')
}

export async function seedChurches(): Promise<{ inserted: number }> {
  return await convexMutation<{ inserted: number }>('churches:seed')
}
