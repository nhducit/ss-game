import { v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
import { massTimeValidator } from './churchValidators'

export const create = internalMutation({
  args: {
    churchId: v.id('churches'),
    sourceUrl: v.string(),
    excerpt: v.string(),
    proposedMassTimes: v.array(massTimeValidator),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('crawlProposals', {
      ...args,
      status: 'pending',
      fetchedAt: Date.now(),
    })
  },
})

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    const proposals = await ctx.db
      .query('crawlProposals')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect()
    return await Promise.all(
      proposals.map(async (proposal) => {
        const church = await ctx.db.get(proposal.churchId)
        return {
          ...proposal,
          churchName: church?.name ?? 'Không rõ',
          churchSlug: church?.slug ?? '',
        }
      }),
    )
  },
})

export const approve = mutation({
  args: {
    proposalId: v.id('crawlProposals'),
    massTimes: v.optional(v.array(massTimeValidator)),
  },
  handler: async (ctx, { proposalId, massTimes }) => {
    const proposal = await ctx.db.get(proposalId)
    if (!proposal) throw new Error('Không tìm thấy đề xuất')
    if (proposal.status !== 'pending') throw new Error('Đề xuất này đã được xử lý')

    await ctx.db.patch(proposal.churchId, {
      massTimes: massTimes ?? proposal.proposedMassTimes,
      lastCrawledAt: Date.now(),
    })
    await ctx.db.patch(proposalId, { status: 'approved', reviewedAt: Date.now() })
  },
})

export const reject = mutation({
  args: {
    proposalId: v.id('crawlProposals'),
    reviewNote: v.optional(v.string()),
  },
  handler: async (ctx, { proposalId, reviewNote }) => {
    const proposal = await ctx.db.get(proposalId)
    if (!proposal) throw new Error('Không tìm thấy đề xuất')
    if (proposal.status !== 'pending') throw new Error('Đề xuất này đã được xử lý')

    await ctx.db.patch(proposalId, { status: 'rejected', reviewedAt: Date.now(), reviewNote })
  },
})
