import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Volume2, SkipForward, RotateCcw, Trophy } from 'lucide-react'
import { categories, shuffle, type Category, type Word } from './words'

function speak(text: string, rate = 0.7) {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  window.speechSynthesis.speak(u)
}

type Screen = 'categories' | 'playing' | 'results'

export function SpellingBee() {
  const [screen, setScreen] = useState<Screen>('categories')
  const [category, setCategory] = useState<Category | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [availableIndices, setAvailableIndices] = useState<number[]>([])
  const [scrambled, setScrambled] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [shakeIndex, setShakeIndex] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [skipped, setSkipped] = useState(0)
  const hasSpoken = useRef(false)

  const currentWord = words[wordIndex] ?? null

  const setupWord = useCallback((word: Word) => {
    const letters = word.english.split('')
    const shuffled = shuffle(letters.map((_, i) => i))
    setScrambled(letters)
    setAvailableIndices(shuffled)
    setSelected([])
    setCompleted(false)
    hasSpoken.current = false
  }, [])

  const startCategory = useCallback((cat: Category) => {
    const shuffledWords = shuffle(cat.words)
    setCategory(cat)
    setWords(shuffledWords)
    setWordIndex(0)
    setScore(0)
    setStreak(0)
    setSkipped(0)
    setScreen('playing')
    setupWord(shuffledWords[0])
  }, [setupWord])

  // Speak the word when it changes (after user has interacted)
  useEffect(() => {
    if (screen === 'playing' && currentWord && !hasSpoken.current) {
      hasSpoken.current = true
      const t = setTimeout(() => speak(currentWord.english), 300)
      return () => clearTimeout(t)
    }
  }, [screen, currentWord, wordIndex])

  const handleLetterTap = useCallback((scrambledIdx: number) => {
    if (!currentWord || completed) return
    const letterIndex = availableIndices[scrambledIdx]
    if (letterIndex === undefined) return

    const nextPos = selected.length
    const expectedLetter = currentWord.english[nextPos]
    const tappedLetter = scrambled[letterIndex]

    if (tappedLetter === expectedLetter) {
      const newSelected = [...selected, scrambledIdx]
      setSelected(newSelected)

      if (newSelected.length === currentWord.english.length) {
        setCompleted(true)
        const newStreak = streak + 1
        setStreak(newStreak)
        const points = 10 + (newStreak > 1 ? newStreak * 2 : 0)
        setScore(s => s + points)
        speak(currentWord.english, 0.8)

        setTimeout(() => {
          if (wordIndex + 1 < words.length) {
            const nextIdx = wordIndex + 1
            setWordIndex(nextIdx)
            setupWord(words[nextIdx])
          } else {
            setScreen('results')
          }
        }, 1500)
      }
    } else {
      setShakeIndex(scrambledIdx)
      setStreak(0)
      setTimeout(() => setShakeIndex(null), 400)
    }
  }, [currentWord, completed, availableIndices, selected, scrambled, streak, wordIndex, words, setupWord])

  const skipWord = useCallback(() => {
    if (!currentWord || completed) return
    setStreak(0)
    setSkipped(s => s + 1)
    if (wordIndex + 1 < words.length) {
      const nextIdx = wordIndex + 1
      setWordIndex(nextIdx)
      setupWord(words[nextIdx])
    } else {
      setScreen('results')
    }
  }, [currentWord, completed, wordIndex, words, setupWord])

  if (screen === 'categories') {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Spelling Bee 🐝</h1>
          <p className="mt-1 text-muted-foreground">Pick a topic to practice</p>
        </div>
        <div className="grid w-full max-w-md gap-3">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => startCategory(cat)} className="text-left w-full">
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                    {cat.emoji}
                  </div>
                  <div>
                    <CardTitle>{cat.name}</CardTitle>
                    <CardDescription>{cat.words.length} words</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>
      </div>
    )
  }

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
          <Button variant="outline" onClick={() => startCategory(category!)}>
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
  const answerSlots = currentWord ? currentWord.english.split('') : []
  const selectedSet = new Set(selected)

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
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          {/* Emoji */}
          <div className="text-7xl sm:text-8xl">{currentWord.emoji}</div>

          {/* Speaker button */}
          <Button
            variant="outline"
            size="lg"
            className="gap-2 text-lg"
            onClick={() => speak(currentWord.english)}
          >
            <Volume2 className="size-5" /> Listen
          </Button>

          {/* Answer slots */}
          <div className="flex gap-2 justify-center flex-wrap">
            {answerSlots.map((letter, i) => {
              const filled = i < selected.length
              return (
                <div
                  key={i}
                  className={
                    `spelling-slot flex items-center justify-center w-12 h-14 sm:w-14 sm:h-16 rounded-lg border-2 text-2xl sm:text-3xl font-bold uppercase transition-all duration-200` +
                    (filled
                      ? ' border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 scale-105'
                      : ' border-muted-foreground/30 bg-muted/30 text-transparent')
                  }
                >
                  {filled ? letter : '_'}
                </div>
              )
            })}
          </div>

          {/* Scrambled letter tiles */}
          <div className="flex gap-2 justify-center flex-wrap mt-2">
            {availableIndices.map((letterIdx, scrambledIdx) => {
              const used = selectedSet.has(scrambledIdx)
              const isShaking = shakeIndex === scrambledIdx
              return (
                <button
                  key={scrambledIdx}
                  className={
                    `spelling-tile flex items-center justify-center w-12 h-14 sm:w-14 sm:h-16 rounded-xl text-2xl sm:text-3xl font-bold uppercase transition-all duration-150 touch-manipulation select-none` +
                    (used
                      ? ' opacity-0 scale-75 pointer-events-none'
                      : ' bg-foreground text-background hover:scale-110 active:scale-95 cursor-pointer shadow-md') +
                    (isShaking ? ' spelling-shake' : '') +
                    (completed ? ' pointer-events-none' : '')
                  }
                  onClick={() => handleLetterTap(scrambledIdx)}
                  disabled={used || completed}
                >
                  {scrambled[letterIdx]}
                </button>
              )
            })}
          </div>

          {/* Skip button */}
          {!completed && (
            <Button
              variant="ghost"
              className="text-muted-foreground gap-2 mt-2"
              onClick={skipWord}
            >
              <SkipForward className="size-4" /> Skip
            </Button>
          )}

          {/* Completion message */}
          {completed && (
            <div className="spelling-correct text-2xl font-bold text-green-600 dark:text-green-400 animate-bounce">
              ✓ Correct!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
