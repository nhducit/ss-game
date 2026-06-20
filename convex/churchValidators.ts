import { v } from 'convex/values'

export const massTimeValidator = v.object({
  daysOfWeek: v.array(v.number()),
  time: v.string(), // "HH:MM", 24h
  note: v.optional(v.string()),
})
