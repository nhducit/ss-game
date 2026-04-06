import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowLeft, Volume2, SkipForward, RotateCcw, Trophy } from 'lucide-react'
import { getWords, type Category, type Level, type Word } from '@/games/english/words'
import { speak, speakSequence } from '@/games/english/speak'
import { CategoryPicker } from '@/games/english/CategoryPicker'
import { recordCorrect, recordWrong, getSmartWordOrder } from '@/games/english/progress'
import { recordGameCompletion } from '@/games/gamification'

type Screen = 'categories' | 'playing' | 'results'

const KEYBOARD_ROWS = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  'ZXCVBNM'.split(''),
]
const MAX_WRONG = 6

function HangmanDrawing({ wrongCount }: { wrongCount: number }) {
  return (
    <svg viewBox="0 0 200 200" className="w-30 h-30 sm:w-40 sm:h-40 text-foreground">
      {/* Gallows - always shown */}
      <line x1="20" y1="190" x2="100" y2="190" stroke="currentColor" strokeWidth="4" />
      <line x1="60" y1="190" x2="60" y2="20" stroke="currentColor" strokeWidth="4" />
      <line x1="60" y1="20" x2="140" y2="20" stroke="currentColor" strokeWidth="4" />
      <line x1="140" y1="20" x2="140" y2="50" stroke="currentColor" strokeWidth="4" />
      {/* Head */}
      {wrongCount >= 1 && <circle cx="140" cy="65" r="15" stroke="currentColor" strokeWidth="4" fill="none" />}
      {/* Body */}
      {wrongCount >= 2 && <line x1="140" y1="80" x2="140" y2="130" stroke="currentColor" strokeWidth="4" />}
      {/* Left arm */}
      {wrongCount >= 3 && <line x1="140" y1="95" x2="115" y2="115" stroke="currentColor" strokeWidth="4" />}
      {/* Right arm */}
      {wrongCount >= 4 && <line x1="140" y1="95" x2="165" y2="115" stroke="currentColor" strokeWidth="4" />}
      {/* Left leg */}
      {wrongCount >= 5 && <line x1="140" y1="130" x2="115" y2="160" stroke="currentColor" strokeWidth="4" />}
      {/* Right leg */}
      {wrongCount >= 6 && <line x1="140" y1="130" x2="165" y2="160" stroke="currentColor" strokeWidth="4" />}
    </svg>
  )
}

export function Hangman() {
  const [screen, setScreen] = useState<Screen>('categories')
  const [category, setCategory] = useState<Category | null>(null)
  const [level, setLevel] = useState<Level>('starters')
  const [words, setWords] = useState<Word[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongCount, setWrongCount] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const [won, setWon] = useState<boolean | null>(null) // null = playing, true = won, false = lost
  const [nextDisabled, setNextDisabled] = useState(false)
  const hasSpoken = useRef(false)
  const gameCompletionRecorded = useRef(false)

  const currentWord = words[wordIndex] ?? null

  const resetWord = useCallback(() => {
    setGuessedLetters(new Set())
    setWrongCount(0)
    setWon(null)
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
    gameCompletionRecorded.current = false
    setGuessedLetters(new Set())
    setWrongCount(0)
    setWon(null)
    hasSpoken.current = false
  }, [])

  // Speak the word when it changes
  useEffect(() => {
    if (screen === 'playing' && currentWord && !hasSpoken.current) {
      hasSpoken.current = true
      const t = setTimeout(() => speak(currentWord.english), 300)
      return () => clearTimeout(t)
    }
  }, [screen, currentWord, wordIndex])

  const handleGuess = useCallback((letter: string) => {
    if (!currentWord || won !== null) return
    if (guessedLetters.has(letter)) return

    const newGuessed = new Set(guessedLetters)
    newGuessed.add(letter)
    setGuessedLetters(newGuessed)

    const wordUpper = currentWord.english.toUpperCase()

    if (wordUpper.includes(letter)) {
      // Correct guess - check if won
      const uniqueLetters = new Set(wordUpper.split(''))
      const allGuessed = [...uniqueLetters].every(l => newGuessed.has(l))
      if (allGuessed) {
        setWon(true)
        recordCorrect(category!.id, level, currentWord.english)
        const newStreak = streak + 1
        setStreak(newStreak)
        const points = 10 + (newStreak > 1 ? newStreak * 2 : 0)
        setScore(s => s + points)
        setNextDisabled(true)
        speakSequence([
          { text: currentWord.english, rate: 0.8 },
          ...currentWord.sentences.map(s => ({ text: s, rate: 0.75, pause: 400 })),
        ])
        setTimeout(() => {
          setNextDisabled(false)
        }, 3000)
      }
    } else {
      // Wrong guess
      const newWrong = wrongCount + 1
      setWrongCount(newWrong)
      if (newWrong >= MAX_WRONG) {
        setWon(false)
        recordWrong(category!.id, level, currentWord.english)
        setStreak(0)
        speak(currentWord.english)
      }
    }
  }, [currentWord, won, guessedLetters, wrongCount, category, level, streak])

  const advanceWord = useCallback(() => {
    if (wordIndex + 1 < words.length) {
      const nextIdx = wordIndex + 1
      setWordIndex(nextIdx)
      resetWord()
    } else {
      if (!gameCompletionRecorded.current) {
        gameCompletionRecorded.current = true
        recordGameCompletion(level, 'Hangman')
      }
      setScreen('results')
    }
  }, [wordIndex, words, resetWord, score])

  const skipWord = useCallback(() => {
    if (!currentWord || won !== null) return
    setStreak(0)
    setSkipped(s => s + 1)
    advanceWord()
  }, [currentWord, won, advanceWord])

  // Auto-advance after win
  useEffect(() => {
    if (won === true && !nextDisabled) {
      const t = setTimeout(advanceWord, 3000)
      return () => clearTimeout(t)
    }
  }, [won, nextDisabled, advanceWord])

  // ── Categories screen ──
  if (screen === 'categories') {
    return (
      <CategoryPicker
        title="Hangman 🪢"
        subtitle="Guess the word letter by letter"
        onSelect={startCategory}
      />
    )
  }

  // ── Results screen ──
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

  // ── Playing screen ──
  const wordUpper = currentWord ? currentWord.english.toUpperCase() : ''
  const wordLetters = wordUpper.split('')

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
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4 sm:p-6 overflow-y-auto">
          {/* Emoji hint */}
          <div className="text-5xl sm:text-6xl">{currentWord.emoji}</div>

          {/* Speaker button - always visible */}
          <button
            className="flex items-center justify-center size-12 sm:size-14 rounded-full bg-primary/10 hover:bg-primary/20 active:scale-95 transition-all touch-manipulation cursor-pointer"
            onClick={() => speak(currentWord.english)}
          >
            <Volume2 className="size-6 sm:size-7 text-primary" />
          </button>

          {/* Hangman drawing */}
          <HangmanDrawing wrongCount={wrongCount} />

          {/* Word display */}
          <div className="text-3xl sm:text-4xl font-bold tracking-[0.3em] uppercase select-none">
            {wordLetters.map((letter, i) => (
              <span key={i} className={won === false ? 'text-red-500' : guessedLetters.has(letter) ? 'text-foreground' : 'text-muted-foreground'}>
                {guessedLetters.has(letter) || won === false ? letter : '_'}{' '}
              </span>
            ))}
          </div>

          {/* Win/lose message */}
          {won === true && (
            <div className="text-center animate-in fade-in duration-300">
              <p className="text-lg font-bold text-green-600">Correct! 🎉</p>
            </div>
          )}
          {won === false && (
            <div className="text-center animate-in fade-in duration-300">
              <p className="text-lg font-bold text-red-500">
                The word was: <span className="text-2xl uppercase tracking-widest">{currentWord.english}</span>
              </p>
            </div>
          )}

          {/* Example sentences - shown after win or lose */}
          {won !== null && (
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

          {/* Keyboard layout */}
          {won === null && (
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 mt-1">
              {KEYBOARD_ROWS.map((row, ri) => (
                <div key={ri} className="flex gap-1.5 sm:gap-2">
                  {row.map(letter => {
                    const isGuessed = guessedLetters.has(letter)
                    const isCorrect = isGuessed && wordUpper.includes(letter)
                    const isWrong = isGuessed && !wordUpper.includes(letter)
                    return (
                      <button
                        key={letter}
                        className={
                          `font-bold rounded-lg w-9 h-10 sm:w-10 sm:h-11 transition-all duration-150 touch-manipulation select-none ` +
                          (isCorrect
                            ? 'bg-green-500 text-white cursor-default'
                            : isWrong
                              ? 'bg-red-500/20 text-red-500 line-through cursor-default'
                              : 'bg-muted hover:bg-muted/80 text-foreground cursor-pointer active:scale-95')
                        }
                        onClick={() => handleGuess(letter)}
                        disabled={isGuessed}
                      >
                        {letter}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-1">
            {won === null && (
              <Button
                variant="ghost"
                className="text-muted-foreground gap-2"
                onClick={skipWord}
              >
                <SkipForward className="size-4" /> Skip
              </Button>
            )}
            {won === true && (
              <Button className="gap-2 text-lg" onClick={advanceWord} disabled={nextDisabled}>
                ✓ Next word
              </Button>
            )}
            {won === false && (
              <Button className="gap-2" onClick={advanceWord}>
                Next word
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
