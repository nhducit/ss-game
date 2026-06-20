export interface TimeBucket {
  id: string
  label: string
  startMin: number
  endMin: number
}

export const TIME_BUCKETS: TimeBucket[] = [
  { id: 'early-morning', label: 'Sáng sớm (trước 6:00)', startMin: 0, endMin: 6 * 60 },
  { id: 'morning', label: 'Sáng (6:00 - 11:00)', startMin: 6 * 60, endMin: 11 * 60 },
  { id: 'afternoon', label: 'Chiều (11:00 - 17:00)', startMin: 11 * 60, endMin: 17 * 60 },
  { id: 'evening', label: 'Tối (sau 17:00)', startMin: 17 * 60, endMin: 24 * 60 },
]

// Unicode "Combining Diacritical Marks" block (0x0300-0x036f): what NFD
// normalization splits Vietnamese tone marks into, after the base letter.
const COMBINING_MARKS_START = 0x0300
const COMBINING_MARKS_END = 0x036f

/** Strips Vietnamese tone marks so "nui" matches "núi". */
export function normalizeForSearch(value: string): string {
  return Array.from(value.toLowerCase().normalize('NFD'))
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0
      return code < COMBINING_MARKS_START || code > COMBINING_MARKS_END
    })
    .join('')
    .replace(/đ/g, 'd')
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function isInBucket(time: string, bucketId: string): boolean {
  const bucket = TIME_BUCKETS.find((b) => b.id === bucketId)
  if (!bucket) return true
  const mins = timeToMinutes(time)
  return mins >= bucket.startMin && mins < bucket.endMin
}
