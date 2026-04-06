import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const STARS_PER_LEVEL: Record<string, number> = {
  starters: 1,
  movers: 2,
  flyers: 3,
};

const ALL_ACHIEVEMENT_CHECKS: [string, (p: { totalStars: number; currentStreak: number }) => boolean][] = [
  ["first-game", () => true],
  ["streak-3", (p) => p.currentStreak >= 3],
  ["streak-7", (p) => p.currentStreak >= 7],
  ["streak-30", (p) => p.currentStreak >= 30],
  ["stars-50", (p) => p.totalStars >= 50],
  ["stars-200", (p) => p.totalStars >= 200],
  ["stars-1000", (p) => p.totalStars >= 1000],
];

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const getByDeviceId = query({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    return await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();
  },
});

/** Create a new player profile. Only works if deviceId doesn't exist yet. */
export const createProfile = mutation({
  args: {
    deviceId: v.string(),
    name: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, { deviceId, name, emoji }) => {
    const trimmedName = name.trim().slice(0, 50);
    if (!trimmedName) throw new Error("Name is required");

    const existing = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();

    if (existing) {
      // Already exists — just update profile fields
      await ctx.db.patch(existing._id, { name: trimmedName, emoji });
      return existing._id;
    }

    return await ctx.db.insert("players", {
      deviceId,
      name: trimmedName,
      emoji,
      totalStars: 0,
      achievements: [],
      currentStreak: 0,
      longestStreak: 0,
      lastPlayDate: "",
    });
  },
});

/** Update profile name/emoji only. */
export const updateProfile = mutation({
  args: {
    deviceId: v.string(),
    name: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, { deviceId, name, emoji }) => {
    const trimmedName = name.trim().slice(0, 50);
    const player = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();

    if (!player) throw new Error("Player not found");
    await ctx.db.patch(player._id, { name: trimmedName, emoji });
  },
});

/**
 * Server-authoritative game completion.
 * Client sends ONLY the game name and level — server calculates everything.
 */
export const recordGameCompletion = mutation({
  args: {
    deviceId: v.string(),
    game: v.string(),
    level: v.union(v.literal("starters"), v.literal("movers"), v.literal("flyers")),
  },
  handler: async (ctx, { deviceId, game, level }) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();

    if (!player) throw new Error("Player not found");

    // Server calculates stars
    const stars = STARS_PER_LEVEL[level] ?? 1;
    const newTotalStars = player.totalStars + stars;

    // Server calculates streak
    const today = todayStr();
    let newStreak = player.currentStreak;
    let newLongest = player.longestStreak;
    if (player.lastPlayDate !== today) {
      if (player.lastPlayDate === yesterdayStr()) {
        newStreak = player.currentStreak + 1;
      } else {
        newStreak = 1;
      }
      newLongest = Math.max(newLongest, newStreak);
    }

    // Server checks achievements
    const earned = new Set(player.achievements);
    const newAchievements = [...player.achievements];
    const newlyUnlocked: string[] = [];
    for (const [id, check] of ALL_ACHIEVEMENT_CHECKS) {
      if (!earned.has(id) && check({ totalStars: newTotalStars, currentStreak: newStreak })) {
        newAchievements.push(id);
        newlyUnlocked.push(id);
      }
    }

    // Update player
    await ctx.db.patch(player._id, {
      totalStars: newTotalStars,
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastPlayDate: today,
      achievements: newAchievements,
    });

    // Record history
    await ctx.db.insert("gameHistory", {
      deviceId,
      date: new Date().toISOString(),
      game: game.slice(0, 50),
      level,
      stars,
    });

    return { stars, totalStars: newTotalStars, newlyUnlocked };
  },
});
