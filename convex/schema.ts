import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    // Unique device/browser identifier
    deviceId: v.string(),
    name: v.string(),
    emoji: v.string(),
    totalStars: v.number(),
    achievements: v.array(v.string()),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastPlayDate: v.string(),
  }).index("by_deviceId", ["deviceId"]),

  gameHistory: defineTable({
    deviceId: v.string(),
    date: v.string(),
    game: v.string(),
    level: v.union(v.literal("starters"), v.literal("movers"), v.literal("flyers")),
    stars: v.number(),
  }).index("by_deviceId", ["deviceId"]),
});
