import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowLeft, Volume2, SkipForward, RotateCcw, Trophy } from 'lucide-react'
import { shuffle, getWords, type Category, type Level, type Word } from '@/games/english/words'
import { speak, speakSequence } from '@/games/english/speak'
import { CategoryPicker } from '@/games/english/CategoryPicker'
import { recordCorrect, recordWrong, getSmartWordOrder } from '@/games/english/progress'
import { recordGameCompletion } from '@/games/english/gamification'

type Screen = 'categories' | 'playing' | 'results'

interface Token {
  /** Original word with punctuation as it appears in the sentence */
  original: string
  /** Normalized: lowercase, leading/trailing punctuation stripped */
  normalized: string
}

function normalize(word: string): string {
  return word.replace(/^[^a-zA-Z0-9]+/, '').replace(/[^a-zA-Z0-9]+$/, '').toLowerCase()
}

function tokenize(sentence: string): Token[] {
  return sentence.split(/\s+/).filter(Boolean).map(w => ({
    original: w,
    normalized: normalize(w),
  }))
}

export function SentenceBuilder() {
  const [screen, setScreen] = useState<Screen>('categories')
  const [category, setCategory] = useState<Category | null>(null)
  const [level, setLevel] = useState<Level>('starters')
  const [words, setWords] = useState<Word[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [skipped, setSkipped] = useState(0)

  // Sentence state
  const [sentence, setSentence] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([])
  const [placedOrder, setPlacedOrder] = useState<number[]>([]) // indices into shuffledIndices
  const [shakingIdx, setShakingIdx] = useState<number | null>(null)
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const hasSpoken = useRef(false)
  const resultsRecorded = useRef(false)

  const currentWord = words[wordIndex] ?? null
  const isComplete = tokens.length > 0 && placedOrder.length === tokens.length

  const setupWord = useCallback((word: Word) => {
    const sentenceText = word.sentences[Math.floor(Math.random() * word.sentences.length)]
    const toks = tokenize(sentenceText)
    const indices = shuffle(toks.map((_, i) => i))
    setSentence(sentenceText)
    setTokens(toks)
    setShuffledIndices(indices)
    setPlacedOrder([])
    setShakingIdx(null)
    hasSpoken.current = false
  }, [])

  const startCategory = useCallback((cat: Category, lvl: Level) => {
    const levelWords = getWords(cat, lvl)
    const shuffledWords = getSmartWordOrder(cat.id, lvl, levelWords)
    setCategory(cat)
    setLevel(lvl)
    setWords(shuffledWords)
    setWordIndex(0)
    setScore(0)
    setStreak(0)
    setSkipped(0)
    setScreen('playing')
    resultsRecorded.current = false
    setupWord(shuffledWords[0])
  }, [setupWord])

  // Speak the word when it changes
  useEffect(() => {
    if (screen === 'playing' && currentWord && !hasSpoken.current) {
      hasSpoken.current = true
      const t = setTimeout(() => speak(currentWord.english), 300)
      return () => clearTimeout(t)
    }
  }, [screen, currentWord, wordIndex])

  // Handle completion
  useEffect(() => {
    if (!isComplete || !currentWord || !category) return

    recordCorrect(category.id, level, currentWord.english)
    const newStreak = streak + 1
    setStreak(newStreak)
    const points = 10 + (newStreak > 1 ? newStreak * 2 : 0)
    setScore(s => s + points)

    speak(sentence, 0.8)

    const timer = setTimeout(() => {
      advanceWord()
    }, 2500)
    setAutoAdvanceTimer(timer)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete])

  const advanceWord = useCallback(() => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer)
      setAutoAdvanceTimer(null)
    }
    if (wordIndex + 1 < words.length) {
      const nextIdx = wordIndex + 1
      setWordIndex(nextIdx)
      setupWord(words[nextIdx])
    } else {
      setScreen('results')
    }
  }, [wordIndex, words, setupWord, autoAdvanceTimer])

  // Record game completion when entering results
  useEffect(() => {
    if (screen === 'results' && !resultsRecorded.current) {
      resultsRecorded.current = true
      recordGameCompletion(score)
    }
  }, [screen, score])

  const handleChipTap = useCallback((shuffledIdx: number) => {
    if (isComplete) return
    // Already placed?
    if (placedOrder.includes(shuffledIdx)) return

    const tokenIdx = shuffledIndices[shuffledIdx]
    const tappedToken = tokens[tokenIdx]
    const nextExpectedPos = placedOrder.length

    // Find which token indices are still expected at this position
    // We need to match by normalized form, handling duplicates
    const expectedToken = tokens[nextExpectedPos]

    if (tappedToken.normalized === expectedToken.normalized) {
      setPlacedOrder(prev => [...prev, shuffledIdx])
    } else {
      // Wrong - shake the chip
      setShakingIdx(shuffledIdx)
      setTimeout(() => setShakingIdx(null), 500)
    }
  }, [isComplete, placedOrder, shuffledIndices, tokens])

  const skipWord = useCallback(() => {
    if (!currentWord || isComplete) return
    recordWrong(category!.id, level, currentWord.english)
    setStreak(0)
    setSkipped(s => s + 1)
    advanceWord()
  }, [currentWord, isComplete, category, level, advanceWord])

  const resetSentence = useCallback(() => {
    if (isComplete) return
    setPlacedOrder([])
  }, [isComplete])

  // Categories screen
  if (screen === 'categories') {
    return (
      <CategoryPicker
        title="Sentence Builder 📝"
        subtitle="Build sentences word by word"
        onSelect={startCategory}
      />
    )
  }

  // Results screen
  if (screen === 'results') {
    const total = words.length
    const answered = total - skipped
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
        <div className="text-6xl animate-bounce">
          <Trophy className="size-16 text-yellow-500" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {score >= total * 8 ? 'Great job! 🌟' : 'Well done! 👏'}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {category?.name}
          </p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-foreground">{score}</span>
            <span className="text-sm text-muted-foreground">Score</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-foreground">{answered}/{total}</span>
            <span className="text-sm text-muted-foreground">Words</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => startCategory(category!, level)}>
            <RotateCcw className="size-4 mr-2" /> Play again
          </Button>
          <Button onClick={() => setScreen('categories')}>
            Other topics
          </Button>
        </div>
      </div>
    )
  }

  // Playing screen
  const placedSet = new Set(placedOrder)

  return (
    <div className="game flex flex-col h-svh overflow-hidden">
      {/* Nav bar */}
      <div className="game-nav flex items-center justify-between px-4 h-13 shrink-0 border-b-2 border-border">
        <div className="flex items-center gap-3.5">
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" onClick={() => setScreen('categories')} />}
            >
              <ArrowLeft className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Back</TooltipContent>
          </Tooltip>
          <h1 className="hidden sm:block text-lg font-extrabold tracking-tight text-foreground m-0">
            {category?.emoji} {category?.name}
          </h1>
          <Badge variant="secondary" className="gap-1.5 font-bold tabular-nums">
            ⭐ {score}
          </Badge>
          {streak > 1 && (
            <Badge variant="outline" className="gap-1 font-bold text-orange-500 tabular-nums">
              🔥 {streak}
            </Badge>
          )}
        </div>
        <Badge variant="ghost" className="text-muted-foreground tabular-nums">
          {wordIndex + 1} / {words.length}
        </Badge>
      </div>

      {/* Main game area */}
      {currentWord && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6 overflow-y-auto">
          {/* Emoji */}
          <div className="text-6xl sm:text-7xl">{currentWord.emoji}</div>

          {/* Target word + speaker */}
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">
              {currentWord.english}
            </span>
            <button
              className="flex items-center justify-center size-10 rounded-full bg-primary/10 hover:bg-primary/20 active:scale-95 transition-all touch-manipulation cursor-pointer"
              onClick={() => speak(currentWord.english)}
            >
              <Volume2 className="size-5 text-primary" />
            </button>
          </div>

          {/* Built sentence area */}
          <div className="flex gap-2 justify-center flex-wrap min-h-[52px] px-2">
            {tokens.map((token, pos) => {
              const isPlaced = pos < placedOrder.length
              if (isPlaced) {
                const shuffledIdx = placedOrder[pos]
                const tokenIdx = shuffledIndices[shuffledIdx]
                return (
                  <span
                    key={pos}
                    className="px-4 py-2.5 rounded-xl text-lg font-semibold transition-all duration-150 touch-manipulation select-none bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700"
                  >
                    {tokens[tokenIdx].original}
                  </span>
                )
              }
              // Placeholder slot
              return (
                <span
                  key={pos}
                  className="px-4 py-2.5 rounded-xl text-lg font-semibold transition-all duration-150 select-none bg-muted/40 text-muted-foreground/30 border border-dashed border-muted-foreground/20"
                >
                  {token.original.replace(/[a-zA-Z0-9]/g, '\u00A0')}
                </span>
              )
            })}
          </div>

          {/* Completion message */}
          {isComplete && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-in fade-in duration-300">
              <button
                onClick={() => speak(sentence, 0.8)}
                className="flex items-center gap-2 text-sm sm:text-base hover:text-green-700 dark:hover:text-green-300 transition-colors cursor-pointer touch-manipulation"
              >
                <Volume2 className="size-4 shrink-0" />
                <span className="italic">&ldquo;{sentence}&rdquo;</span>
              </button>
            </div>
          )}

          {/* Available word chips */}
          {!isComplete && (
            <div className="flex gap-2 justify-center flex-wrap mt-1">
              {shuffledIndices.map((tokenIdx, shuffledIdx) => {
                const used = placedSet.has(shuffledIdx)
                const isShaking = shakingIdx === shuffledIdx
                return (
                  <button
                    key={shuffledIdx}
                    className={
                      `px-4 py-2.5 rounded-xl text-lg font-semibold transition-all duration-150 touch-manipulation select-none` +
                      (used
                        ? ' opacity-0 scale-75 pointer-events-none'
                        : ' bg-foreground text-background hover:scale-105 active:scale-95 cursor-pointer shadow-md') +
                      (isShaking ? ' spelling-shake' : '')
                    }
                    onClick={() => handleChipTap(shuffledIdx)}
                    disabled={used}
                  >
                    {tokens[tokenIdx].original}
                  </button>
                )
              })}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-1">
            {!isComplete && (
              <>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={resetSentence}
                  disabled={placedOrder.length === 0}
                >
                  <RotateCcw className="size-4" /> Reset
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground gap-2"
                  onClick={skipWord}
                >
                  <SkipForward className="size-4" /> Skip
                </Button>
              </>
            )}
            {isComplete && (
              <Button className="gap-2 text-lg" onClick={advanceWord}>
                ✓ Next word
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
