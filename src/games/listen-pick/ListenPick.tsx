import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowLeft, Volume2, RotateCcw, Trophy } from 'lucide-react'
import { shuffle, getWords, type Category, type Level, type Word } from '@/games/english/words'
import { speak } from '@/games/english/speak'
import { CategoryPicker } from '@/games/english/CategoryPicker'

type Screen = 'categories' | 'playing' | 'results'

const OPTIONS_COUNT = 4

interface Round {
  correct: Word
  options: Word[]
}

function buildRounds(words: Word[]): Round[] {
  const shuffled = shuffle(words)
  return shuffled.map((correct) => {
    const distractors = shuffle(words.filter(w => w.english !== correct.english)).slice(0, OPTIONS_COUNT - 1)
    const options = shuffle([correct, ...distractors])
    return { correct, options }
  })
}

export function ListenPick() {
  const [screen, setScreen] = useState<Screen>('categories')
  const [category, setCategory] = useState<Category | null>(null)
  const [level, setLevel] = useState<Level>('starters')
  const [rounds, setRounds] = useState<Round[]>([])
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [shakeIndex, setShakeIndex] = useState<number | null>(null)
  const [correct, setCorrect] = useState(false)
  const [showWord, setShowWord] = useState(false)
  const hasSpoken = useRef(false)

  const currentRound = rounds[roundIndex] ?? null

  const startCategory = useCallback((cat: Category, lvl: Level) => {
    const levelWords = getWords(cat, lvl)
    const newRounds = buildRounds(levelWords)
    setCategory(cat)
    setLevel(lvl)
    setRounds(newRounds)
    setRoundIndex(0)
    setScore(0)
    setStreak(0)
    setCorrect(false)
    setShowWord(false)
    setScreen('playing')
    hasSpoken.current = false
  }, [])

  useEffect(() => {
    if (screen === 'playing' && currentRound && !hasSpoken.current) {
      hasSpoken.current = true
      const t = setTimeout(() => speak(currentRound.correct.english), 300)
      return () => clearTimeout(t)
    }
  }, [screen, currentRound, roundIndex])

  const handlePick = useCallback((word: Word, optionIndex: number) => {
    if (!currentRound || correct) return

    if (word.english === currentRound.correct.english) {
      setCorrect(true)
      setShowWord(true)
      const newStreak = streak + 1
      setStreak(newStreak)
      const points = 10 + (newStreak > 1 ? newStreak * 2 : 0)
      setScore(s => s + points)
      speak(currentRound.correct.english, 0.8)

      setTimeout(() => {
        if (roundIndex + 1 < rounds.length) {
          setRoundIndex(r => r + 1)
          setCorrect(false)
          setShowWord(false)
          hasSpoken.current = false
        } else {
          setScreen('results')
        }
      }, 1500)
    } else {
      setShakeIndex(optionIndex)
      setStreak(0)
      setTimeout(() => setShakeIndex(null), 400)
    }
  }, [currentRound, correct, streak, roundIndex, rounds])

  if (screen === 'categories') {
    return (
      <CategoryPicker
        title="Listen & Pick 👂"
        subtitle="Hear a word, pick the picture"
        onSelect={startCategory}
      />
    )
  }

  if (screen === 'results') {
    const total = rounds.length
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
            <span className="text-3xl font-bold text-foreground">{total}</span>
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

  return (
    <div className="game flex flex-col h-svh overflow-hidden">
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
          {roundIndex + 1} / {rounds.length}
        </Badge>
      </div>

      {currentRound && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 text-xl px-8 py-6"
            onClick={() => speak(currentRound.correct.english)}
          >
            <Volume2 className="size-6" /> Listen
          </Button>

          {showWord && (
            <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 animate-bounce">
              {currentRound.correct.english}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xs">
            {currentRound.options.map((word, i) => {
              const isCorrectPick = correct && word.english === currentRound.correct.english
              const isShaking = shakeIndex === i
              return (
                <button
                  key={`${roundIndex}-${i}`}
                  className={
                    `listen-pick-option flex items-center justify-center aspect-square rounded-2xl border-2 text-5xl sm:text-6xl transition-all duration-200 touch-manipulation select-none` +
                    (isCorrectPick
                      ? ' border-green-500 bg-green-50 dark:bg-green-950 scale-105'
                      : ' border-muted-foreground/20 bg-muted hover:scale-105 active:scale-95 cursor-pointer') +
                    (isShaking ? ' spelling-shake' : '') +
                    (correct && !isCorrectPick ? ' opacity-40 pointer-events-none' : '')
                  }
                  onClick={() => handlePick(word, i)}
                  disabled={correct}
                >
                  {word.emoji}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
