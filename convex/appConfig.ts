import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const CONFIG_KEY = "global";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("appConfig")
      .withIndex("by_key", (q) => q.eq("key", CONFIG_KEY))
      .first();
  },
});

export const setLocked = mutation({
  args: { locked: v.boolean() },
  handler: async (ctx, { locked }) => {
    const existing = await ctx.db
      .query("appConfig")
      .withIndex("by_key", (q) => q.eq("key", CONFIG_KEY))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { locked });
    } else {
      await ctx.db.insert("appConfig", {
        key: CONFIG_KEY,
        locked,
        schedule: [],
      });
    }
  },
});

export const setSchedule = mutation({
  args: {
    schedule: v.array(v.object({
      day: v.number(),
      startHour: v.number(),
      startMin: v.number(),
      endHour: v.number(),
      endMin: v.number(),
    })),
  },
  handler: async (ctx, { schedule }) => {
    const existing = await ctx.db
      .query("appConfig")
      .withIndex("by_key", (q) => q.eq("key", CONFIG_KEY))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { schedule });
    } else {
      await ctx.db.insert("appConfig", {
        key: CONFIG_KEY,
        locked: false,
        schedule,
      });
    }
  },
});
