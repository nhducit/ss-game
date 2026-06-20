import type { Church, CrawlProposal, MassTime } from './types'

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
  endpoint: 'query' | 'mutation' | 'action',
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

async function convexAction<T>(path: string, args: Record<string, unknown> = {}): Promise<T> {
  return await callConvex<T>('action', path, args)
}

export async function listChurches(): Promise<Church[]> {
  return await convexQuery<Church[]>('churches:list')
}

export async function seedChurches(): Promise<{ inserted: number }> {
  return await convexMutation<{ inserted: number }>('churches:seed')
}

export async function recrawlChurch(churchId: string): Promise<{ proposalId: string }> {
  return await convexAction<{ proposalId: string }>('crawl:recrawlChurch', { churchId })
}

export async function listPendingProposals(): Promise<CrawlProposal[]> {
  return await convexQuery<CrawlProposal[]>('crawlProposals:listPending')
}

export async function approveProposal(proposalId: string, massTimes?: MassTime[]): Promise<void> {
  await convexMutation('crawlProposals:approve', { proposalId, massTimes })
}

export async function rejectProposal(proposalId: string): Promise<void> {
  await convexMutation('crawlProposals:reject', { proposalId })
}
