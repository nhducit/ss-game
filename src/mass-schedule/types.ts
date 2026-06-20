export interface MassTime {
  daysOfWeek: number[]
  time: string
  note?: string
}

export interface Church {
  _id: string
  name: string
  slug: string
  address: string
  city: string
  lat: number
  lng: number
  phone?: string
  sourceUrl?: string
  lastCrawledAt?: number
  massTimes: MassTime[]
}

export type ProposalStatus = 'pending' | 'approved' | 'rejected'

export interface CrawlProposal {
  _id: string
  churchId: string
  churchName: string
  churchSlug: string
  sourceUrl: string
  status: ProposalStatus
  fetchedAt: number
  excerpt: string
  proposedMassTimes: MassTime[]
  reviewedAt?: number
  reviewNote?: string
}
