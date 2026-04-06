import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByDeviceId = query({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    return await ctx.db
      .query("gameHistory")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .collect();
  },
});
