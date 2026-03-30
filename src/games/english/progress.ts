import { shuffle, type Level, type Word } from './words'

const STORAGE_KEY = 'english-progress'

interface WordProgress {
  /** Number of times answered correctly */
  correct: number
  /** Number of times answered wrong */
  wrong: number
  /** Timestamp of last correct answer */
  lastSeen: number
}

interface ProgressData {
  /** Key: "categoryId:level:word" */
  words: Record<string, WordProgress>
}

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // corrupted data, start fresh
  }
  return { words: {} }
}

function save(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function wordKey(categoryId: string, level: Level, word: string): string {
  return `${categoryId}:${level}:${word}`
}

/** Record a correct answer for a word */
export function recordCorrect(categoryId: string, level: Level, word: string) {
  const data = load()
  const key = wordKey(categoryId, level, word)
  const existing = data.words[key] ?? { correct: 0, wrong: 0, lastSeen: 0 }
  existing.correct++
  existing.lastSeen = Date.now()
  data.words[key] = existing
  save(data)
}

/** Record a wrong answer for a word */
export function recordWrong(categoryId: string, level: Level, word: string) {
  const data = load()
  const key = wordKey(categoryId, level, word)
  const existing = data.words[key] ?? { correct: 0, wrong: 0, lastSeen: 0 }
  existing.wrong++
  existing.lastSeen = Date.now()
  data.words[key] = existing
  save(data)
}

/** Get progress stats for a category + level */
export function getCategoryProgress(categoryId: string, level: Level, words: Word[]): {
  learned: number
  total: number
} {
  const data = load()
  let learned = 0
  for (const w of words) {
    const key = wordKey(categoryId, level, w.english)
    const p = data.words[key]
    // "Learned" = answered correctly at least 3 times
    if (p && p.correct >= 3) learned++
  }
  return { learned, total: words.length }
}

/**
 * Sort words for practice using spaced repetition:
 * - New words (never seen) come first
 * - Words answered wrong recently come next
 * - Learned words (correct >= 3) appear less often
 * - Within each group, randomize order
 *
 * Returns a shuffled subset favoring new/weak words.
 */
export function getSmartWordOrder(categoryId: string, level: Level, words: Word[]): Word[] {
  const data = load()
  const now = Date.now()

  const newWords: Word[] = []
  const weakWords: Word[] = []
  const learnedWords: Word[] = []

  for (const w of words) {
    const key = wordKey(categoryId, level, w.english)
    const p = data.words[key]

    if (!p || (p.correct === 0 && p.wrong === 0)) {
      // Never seen
      newWords.push(w)
    } else if (p.correct < 3 || p.wrong > p.correct) {
      // Seen but not yet learned, or more wrong than right
      weakWords.push(w)
    } else {
      // Learned (correct >= 3 and correct > wrong)
      learnedWords.push(w)
    }
  }

  // Shuffle each group
  const shuffledNew = shuffle(newWords)
  const shuffledWeak = shuffle(weakWords)
  const shuffledLearned = shuffle(learnedWords)

  // Take all new + weak words, then sprinkle in some learned words
  // Learned words: include ~30% of them for review, skip recently seen ones
  const ONE_DAY = 24 * 60 * 60 * 1000
  const learnedForReview = shuffledLearned.filter(w => {
    const key = wordKey(categoryId, level, w.english)
    const p = data.words[key]
    if (!p) return true
    // Include if not seen in the last day, or randomly 30% of the time
    return (now - p.lastSeen > ONE_DAY) || Math.random() < 0.3
  })

  return [...shuffledNew, ...shuffledWeak, ...learnedForReview]
}

/** Reset all progress */
export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY)
}
