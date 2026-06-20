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
