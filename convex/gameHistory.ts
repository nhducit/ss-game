import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByDeviceId = query({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    return await ctx.db
      .query("gameHistory")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .collect();
  },
});

export const record = mutation({
  args: {
    deviceId: v.string(),
    date: v.string(),
    game: v.string(),
    level: v.union(v.literal("starters"), v.literal("movers"), v.literal("flyers")),
    stars: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("gameHistory", args);
  },
});
