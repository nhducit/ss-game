import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByDeviceId = query({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    return await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();
  },
});

export const upsert = mutation({
  args: {
    deviceId: v.string(),
    name: v.string(),
    emoji: v.string(),
    totalStars: v.number(),
    achievements: v.array(v.string()),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastPlayDate: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        emoji: args.emoji,
        totalStars: args.totalStars,
        achievements: args.achievements,
        currentStreak: args.currentStreak,
        longestStreak: args.longestStreak,
        lastPlayDate: args.lastPlayDate,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("players", args);
    }
  },
});

export const updateProfile = mutation({
  args: {
    deviceId: v.string(),
    name: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, { deviceId, name, emoji }) => {
    const existing = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { name, emoji });
    } else {
      await ctx.db.insert("players", {
        deviceId,
        name,
        emoji,
        totalStars: 0,
        achievements: [],
        currentStreak: 0,
        longestStreak: 0,
        lastPlayDate: "",
      });
    }
  },
});
