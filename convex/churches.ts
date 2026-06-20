import { v } from 'convex/values'
import { internalQuery, mutation, query } from './_generated/server'
import { SEED_CHURCHES } from './churchSeedData'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('churches').collect()
  },
})

export const getInternal = internalQuery({
  args: { churchId: v.id('churches') },
  handler: async (ctx, { churchId }) => {
    return await ctx.db.get(churchId)
  },
})

/** Idempotent: only inserts the starter dataset if the table is empty. */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('churches').first()
    if (existing) return { inserted: 0 }
    for (const church of SEED_CHURCHES) {
      await ctx.db.insert('churches', church)
    }
    return { inserted: SEED_CHURCHES.length }
  },
})
