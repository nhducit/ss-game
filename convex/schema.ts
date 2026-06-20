import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

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
    // Recurring weekly mass times. daysOfWeek: 0=Sun..6=Sat.
    massTimes: v.array(
      v.object({
        daysOfWeek: v.array(v.number()),
        time: v.string(), // "HH:MM", 24h
        note: v.optional(v.string()),
      }),
    ),
  }).index('by_slug', ['slug']),
})
