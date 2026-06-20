import { v } from 'convex/values'
import { action } from './_generated/server'
import { internal } from './_generated/api'

const TIME_RE = /\b([01]?\d|2[0-3])[:h]([0-5]\d)\b/gi

const DAY_KEYWORDS: { pattern: RegExp; days: number[] }[] = [
  { pattern: /chúa nhật|chủ nhật/i, days: [0] },
  { pattern: /thứ\s*2\b|thứ\s*hai/i, days: [1] },
  { pattern: /thứ\s*3\b|thứ\s*ba/i, days: [2] },
  { pattern: /thứ\s*4\b|thứ\s*tư/i, days: [3] },
  { pattern: /thứ\s*5\b|thứ\s*năm/i, days: [4] },
  { pattern: /thứ\s*6\b|thứ\s*sáu/i, days: [5] },
  { pattern: /thứ\s*7\b|thứ\s*bảy/i, days: [6] },
  { pattern: /hàng ngày|ngày thường|các ngày trong tuần/i, days: [1, 2, 3, 4, 5, 6] },
]

const DAY_LOOKBACK = 60

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function guessDays(text: string, matchIndex: number): number[] | null {
  const context = text.slice(Math.max(0, matchIndex - DAY_LOOKBACK), matchIndex)
  for (const { pattern, days } of DAY_KEYWORDS) {
    if (pattern.test(context)) return days
  }
  return null
}

/** Best-effort guess only — the result is always staged as a pending proposal for human review. */
function extractMassTimes(text: string): { daysOfWeek: number[]; time: string }[] {
  const results: { daysOfWeek: number[]; time: string }[] = []
  for (const match of text.matchAll(TIME_RE)) {
    const hour = Number(match[1])
    const minute = Number(match[2])
    const days = guessDays(text, match.index ?? 0)
    if (!days) continue
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    const key = `${days.join(',')}|${time}`
    if (results.some((r) => `${r.daysOfWeek.join(',')}|${r.time}` === key)) continue
    results.push({ daysOfWeek: days, time })
  }
  return results.sort((a, b) => a.time.localeCompare(b.time))
}

export const recrawlChurch = action({
  args: { churchId: v.id('churches') },
  handler: async (ctx, { churchId }): Promise<{ proposalId: string }> => {
    const church = await ctx.runQuery(internal.churches.getInternal, { churchId })
    if (!church) throw new Error('Không tìm thấy nhà thờ')
    if (!church.sourceUrl) throw new Error('Nhà thờ này chưa có sourceUrl để crawl')

    const res = await fetch(church.sourceUrl)
    if (!res.ok) throw new Error(`Tải trang thất bại: HTTP ${res.status}`)
    const text = htmlToText(await res.text())

    const proposalId = await ctx.runMutation(internal.crawlProposals.create, {
      churchId,
      sourceUrl: church.sourceUrl,
      excerpt: text.slice(0, 4000),
      proposedMassTimes: extractMassTimes(text),
    })
    return { proposalId }
  },
})
