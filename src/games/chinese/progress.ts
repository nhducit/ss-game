import { shuffle, type Level, type ChineseWord } from './words'

const STORAGE_KEY = 'chinese-progress'

interface WordProgress {
  correct: number
  wrong: number
  lastSeen: number
}

interface ProgressData {
  words: Record<string, WordProgress>
}

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { words: {} }
}

function save(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function wordKey(categoryId: string, level: Level, word: string): string {
  return `${categoryId}:${level}:${word}`
}

export function recordCorrect(categoryId: string, level: Level, word: string) {
  const data = load()
  const key = wordKey(categoryId, level, word)
  const existing = data.words[key] ?? { correct: 0, wrong: 0, lastSeen: 0 }
  existing.correct++
  existing.lastSeen = Date.now()
  data.words[key] = existing
  save(data)
}

export function recordWrong(categoryId: string, level: Level, word: string) {
  const data = load()
  const key = wordKey(categoryId, level, word)
  const existing = data.words[key] ?? { correct: 0, wrong: 0, lastSeen: 0 }
  existing.wrong++
  existing.lastSeen = Date.now()
  data.words[key] = existing
  save(data)
}

export function getCategoryProgress(categoryId: string, level: Level, words: ChineseWord[]): {
  learned: number
  total: number
} {
  const data = load()
  let learned = 0
  for (const w of words) {
    const key = wordKey(categoryId, level, w.chinese)
    const p = data.words[key]
    if (p && p.correct >= 3) learned++
  }
  return { learned, total: words.length }
}

export function getSmartWordOrder(categoryId: string, level: Level, words: ChineseWord[]): ChineseWord[] {
  const data = load()
  const now = Date.now()

  const newWords: ChineseWord[] = []
  const weakWords: ChineseWord[] = []
  const learnedWords: ChineseWord[] = []

  for (const w of words) {
    const key = wordKey(categoryId, level, w.chinese)
    const p = data.words[key]
    if (!p || (p.correct === 0 && p.wrong === 0)) {
      newWords.push(w)
    } else if (p.correct < 3 || p.wrong > p.correct) {
      weakWords.push(w)
    } else {
      learnedWords.push(w)
    }
  }

  const shuffledNew = shuffle(newWords)
  const shuffledWeak = shuffle(weakWords)
  const shuffledLearned = shuffle(learnedWords)

  const ONE_DAY = 24 * 60 * 60 * 1000
  const learnedForReview = shuffledLearned.filter(w => {
    const key = wordKey(categoryId, level, w.chinese)
    const p = data.words[key]
    if (!p) return true
    return (now - p.lastSeen > ONE_DAY) || Math.random() < 0.3
  })

  return [...shuffledNew, ...shuffledWeak, ...learnedForReview]
}
