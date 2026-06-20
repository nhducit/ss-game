import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { massTimeValidator } from './churchValidators'

export default defineSchema({
  players: defineTable({
    deviceId: v.string(),
    name: v.string(),
    emoji: v.string(),
    totalStars: v.number(),
    achievements: v.array(v.string()),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastPlayDate: v.string(),
  }).index('by_deviceId', ['deviceId']),

  appConfig: defineTable({
    key: v.string(),
    // Global lock override: true = locked regardless of schedule
    locked: v.boolean(),
    // Schedule: array of { day (0-6, Sun-Sat), startHour, startMin, endHour, endMin }
    schedule: v.array(
      v.object({
        day: v.number(),
        startHour: v.number(),
        startMin: v.number(),
        endHour: v.number(),
        endMin: v.number(),
      }),
    ),
  }).index('by_key', ['key']),

  gameHistory: defineTable({
    deviceId: v.string(),
    date: v.string(),
    game: v.string(),
    level: v.union(v.literal('starters'), v.literal('movers'), v.literal('flyers')),
    stars: v.number(),
  }).index('by_deviceId', ['deviceId']),

  churches: defineTable({
    name: v.string(),
    slug: v.string(),
    address: v.string(),
    city: v.string(),
    lat: v.number(),
    lng: v.number(),
    phone: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    lastCrawledAt: v.optional(v.number()),
    // Recurring weekly mass times. daysOfWeek: 0=Sun..6=Sat.
    massTimes: v.array(massTimeValidator),
  }).index('by_slug', ['slug']),

  // Staged updates produced by crawling a church's sourceUrl. Nothing here
  // touches the live church record until an admin approves it.
  crawlProposals: defineTable({
    churchId: v.id('churches'),
    sourceUrl: v.string(),
    status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
    fetchedAt: v.number(),
    excerpt: v.string(), // plain-text snippet pulled from the page, for human review
    proposedMassTimes: v.array(massTimeValidator), // best-effort guess, editable before approval
    reviewedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()),
  })
    .index('by_church', ['churchId'])
    .index('by_status', ['status']),
})
