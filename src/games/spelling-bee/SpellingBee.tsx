import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowLeft, Volume2, SkipForward, RotateCcw, Trophy, Undo2 } from 'lucide-react'
import { shuffle, getWords, type Category, type Level, type Word } from '@/games/english/words'
import { speak, speakSequence } from '@/games/english/speak'
import { CategoryPicker } from '@/games/english/CategoryPicker'

type Screen = 'categories' | 'playing' | 'results'
type Result = 'pending' | 'correct' | 'wrong'

export function SpellingBee() {
  const [screen, setScreen] = useState<Screen>('categories')
  const [category, setCategory] = useState<Category | null>(null)
  const [level, setLevel] = useState<Level>('starters')
  const [words, setWords] = useState<Word[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [availableIndices, setAvailableIndices] = useState<number[]>([])
  const [scrambled, setScrambled] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [result, setResult] = useState<Result>('pending')
  const [skipped, setSkipped] = useState(0)
  const hasSpoken = useRef(false)

  const currentWord = words[wordIndex] ?? null

  const setupWord = useCallback((word: Word) => {
    const letters = word.english.split('')
    const shuffled = shuffle(letters.map((_, i) => i))
    setScrambled(letters)
    setAvailableIndices(shuffled)
    setSelected([])
    setResult('pending')
    hasSpoken.current = false
  }, [])

  const startCategory = useCallback((cat: Category, lvl: Level) => {
    const levelWords = getWords(cat, lvl)
    const shuffledWords = shuffle(levelWords)
    setCategory(cat)
    setLevel(lvl)
    setWords(shuffledWords)
    setWordIndex(0)
    setScore(0)
    setStreak(0)
    setSkipped(0)
    setScreen('playing')
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

  // Check answer when all letters are placed
  useEffect(() => {
    if (!currentWord || result !== 'pending') return
    if (selected.length === currentWord.english.length) {
      const userAnswer = selected.map(si => scrambled[availableIndices[si]]).join('')
      if (userAnswer === currentWord.english) {
        setResult('correct')
        const newStreak = streak + 1
        setStreak(newStreak)
        const points = 10 + (newStreak > 1 ? newStreak * 2 : 0)
        setScore(s => s + points)
        // Speak the word, then each example sentence
        speakSequence([
          { text: currentWord.english, rate: 0.8 },
          ...currentWord.sentences.map(s => ({ text: s, rate: 0.75, pause: 400 })),
        ])
      } else {
        setResult('wrong')
        setStreak(0)
      }
    }
  }, [selected, currentWord, result, availableIndices, scrambled, streak])

  const handleLetterTap = useCallback((scrambledIdx: number) => {
    if (!currentWord || result !== 'pending') return
    if (selected.includes(scrambledIdx)) return
    if (selected.length >= currentWord.english.length) return
    setSelected(prev => [...prev, scrambledIdx])
  }, [currentWord, result, selected])

  const undoLetter = useCallback(() => {
    if (result !== 'pending' || selected.length === 0) return
    setSelected(prev => prev.slice(0, -1))
  }, [result, selected])

  const advanceWord = useCallback(() => {
    if (wordIndex + 1 < words.length) {
      const nextIdx = wordIndex + 1
      setWordIndex(nextIdx)
      setupWord(words[nextIdx])
    } else {
      setScreen('results')
    }
  }, [wordIndex, words, setupWord])

  const retryWord = useCallback(() => {
    if (!currentWord) return
    setupWord(currentWord)
  }, [currentWord, setupWord])

  const skipWord = useCallback(() => {
    if (!currentWord || result !== 'pending') return
    setStreak(0)
    setSkipped(s => s + 1)
    advanceWord()
  }, [currentWord, result, advanceWord])

  if (screen === 'categories') {
    return (
      <CategoryPicker
        title="Spelling Bee 🐝"
        subtitle="Pick a topic to practice"
        gamePath="/spelling-bee"
        onSelect={startCategory}
      />
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
  const answerSlots = currentWord ? currentWord.english.split('') : []
  const selectedSet = new Set(selected)
  // Build user's current answer
  const userLetters = selected.map(si => scrambled[availableIndices[si]])

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

          {/* Speaker button for word */}
          <button
            className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-primary/10 hover:bg-primary/20 active:scale-95 transition-all touch-manipulation cursor-pointer"
            onClick={() => speak(currentWord.english)}
          >
            <Volume2 className="size-8 sm:size-10 text-primary" />
          </button>

          {/* Example sentences — only shown after answering */}
          {result !== 'pending' && (
            <div className="flex flex-col gap-2 items-center max-w-sm animate-in fade-in duration-300">
              {currentWord.sentences.map((sentence, i) => (
                <button
                  key={i}
                  onClick={() => speak(sentence, 0.75)}
                  className="flex items-center gap-2.5 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors cursor-pointer touch-manipulation"
                >
                  <Volume2 className="size-4 shrink-0" />
                  <span className="italic text-left">&ldquo;{sentence}&rdquo;</span>
                </button>
              ))}
            </div>
          )}

          {/* Answer slots */}
          <div className="flex gap-2 justify-center flex-wrap">
            {answerSlots.map((correctLetter, i) => {
              const filled = i < userLetters.length
              const userLetter = filled ? userLetters[i] : null
              const slotClass = result === 'pending'
                ? (filled
                    ? ' border-primary bg-primary/10 text-foreground scale-105'
                    : ' border-muted-foreground/30 bg-muted/30 text-transparent')
                : result === 'correct'
                  ? ' border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                  : (filled && userLetter === correctLetter
                      ? ' border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : filled
                        ? ' border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : ' border-muted-foreground/30 bg-muted/30 text-transparent')
              return (
                <div
                  key={i}
                  className={
                    `spelling-slot flex items-center justify-center w-12 h-14 sm:w-14 sm:h-16 rounded-lg border-2 text-2xl sm:text-3xl font-bold uppercase transition-all duration-200` +
                    slotClass
                  }
                >
                  {filled ? userLetter : '_'}
                </div>
              )
            })}
          </div>

          {/* Show correct answer when wrong */}
          {result === 'wrong' && (
            <div className="text-center">
              <p className="text-lg font-bold text-red-500">
                Correct spelling: <span className="text-2xl uppercase tracking-widest">{currentWord.english}</span>
              </p>
            </div>
          )}

          {/* Scrambled letter tiles */}
          {result === 'pending' && (
            <div className="flex gap-2 justify-center flex-wrap mt-1">
              {availableIndices.map((letterIdx, scrambledIdx) => {
                const used = selectedSet.has(scrambledIdx)
                return (
                  <button
                    key={scrambledIdx}
                    className={
                      `spelling-tile flex items-center justify-center w-12 h-14 sm:w-14 sm:h-16 rounded-xl text-2xl sm:text-3xl font-bold uppercase transition-all duration-150 touch-manipulation select-none` +
                      (used
                        ? ' opacity-0 scale-75 pointer-events-none'
                        : ' bg-foreground text-background hover:scale-110 active:scale-95 cursor-pointer shadow-md')
                    }
                    onClick={() => handleLetterTap(scrambledIdx)}
                    disabled={used}
                  >
                    {scrambled[letterIdx]}
                  </button>
                )
              })}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-1">
            {result === 'pending' && (
              <>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={undoLetter}
                  disabled={selected.length === 0}
                >
                  <Undo2 className="size-4" /> Undo
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
            {result === 'correct' && (
              <Button className="gap-2 text-lg" onClick={advanceWord}>
                ✓ Next word
              </Button>
            )}
            {result === 'wrong' && (
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2" onClick={retryWord}>
                  <RotateCcw className="size-4" /> Try again
                </Button>
                <Button className="gap-2" onClick={advanceWord}>
                  Next word
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
