import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowLeft, Volume2, SkipForward, RotateCcw, Trophy, Undo2 } from 'lucide-react'
import { shuffle, getWords, type ChineseCategory, type Level, type ChineseWord } from '@/games/chinese/words'
import { speakChinese, speakChineseSequence } from '@/games/chinese/speak'
import { ChineseCategoryPicker } from '@/games/chinese/CategoryPicker'
import { recordCorrect, recordWrong, getSmartWordOrder } from '@/games/chinese/progress'
import { recordGameCompletion } from '@/games/gamification'

type Screen = 'categories' | 'playing' | 'results'
type Result = 'pending' | 'correct' | 'wrong'

export function PinyinSpell() {
  const [screen, setScreen] = useState<Screen>('categories')
  const [category, setCategory] = useState<ChineseCategory | null>(null)
  const [level, setLevel] = useState<Level>('starters')
  const [words, setWords] = useState<ChineseWord[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [availableIndices, setAvailableIndices] = useState<number[]>([])
  const [scrambled, setScrambled] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [result, setResult] = useState<Result>('pending')
  const [skipped, setSkipped] = useState(0)
  const [nextDisabled, setNextDisabled] = useState(false)
  const hasSpoken = useRef(false)

  const currentWord = words[wordIndex] ?? null

  const setupWord = useCallback((word: ChineseWord) => {
    const letters = word.pinyin.split('')
    const shuffled = shuffle(letters.map((_, i) => i))
    setScrambled(letters)
    setAvailableIndices(shuffled)
    setSelected([])
    setResult('pending')
    hasSpoken.current = false
  }, [])

  const startCategory = useCallback((cat: ChineseCategory, lvl: Level) => {
    const levelWords = getWords(cat, lvl)
    const smartWords = getSmartWordOrder(cat.id, lvl, levelWords)
    setCategory(cat)
    setLevel(lvl)
    setWords(smartWords)
    setWordIndex(0)
    setScore(0)
    setStreak(0)
    setSkipped(0)
    setScreen('playing')
    setupWord(smartWords[0])
  }, [setupWord])

  useEffect(() => {
    if (screen === 'playing' && currentWord && !hasSpoken.current) {
      hasSpoken.current = true
      const t = setTimeout(() => speakChinese(currentWord.chinese), 300)
      return () => clearTimeout(t)
    }
  }, [screen, currentWord, wordIndex])

  useEffect(() => {
    if (!currentWord || result !== 'pending') return
    if (selected.length === currentWord.pinyin.length) {
      const userAnswer = selected.map(si => scrambled[availableIndices[si]]).join('')
      if (userAnswer === currentWord.pinyin) {
        setResult('correct')
        recordCorrect(category!.id, level, currentWord.chinese)
        const newStreak = streak + 1
        setStreak(newStreak)
        const points = 10 + (newStreak > 1 ? newStreak * 2 : 0)
        setScore(s => s + points)
        setNextDisabled(true)
        speakChineseSequence([
          { text: currentWord.chinese, rate: 0.8 },
          ...currentWord.sentences.map(s => ({ text: s, rate: 0.75, pause: 400 })),
        ])
        setTimeout(() => setNextDisabled(false), 3000)
      } else {
        setResult('wrong')
        recordWrong(category!.id, level, currentWord.chinese)
        setStreak(0)
        setNextDisabled(true)
        setTimeout(() => setNextDisabled(false), 3000)
      }
    }
  }, [selected, currentWord, result, availableIndices, scrambled, streak, category, level])

  const handleLetterTap = useCallback((scrambledIdx: number) => {
    if (!currentWord || result !== 'pending') return
    if (selected.includes(scrambledIdx)) return
    if (selected.length >= currentWord.pinyin.length) return
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
      recordGameCompletion(level)
      setScreen('results')
    }
  }, [wordIndex, words, setupWord, level])

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
      <ChineseCategoryPicker
        title="Pinyin Spell 拼音"
        subtitle="Listen & spell the pinyin"
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
          <p className="mt-2 text-lg text-muted-foreground">{category?.name}</p>
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
          <Button onClick={() => setScreen('categories')}>Other topics</Button>
        </div>
      </div>
    )
  }

  const answerSlots = currentWord ? currentWord.pinyin.split('') : []
  const selectedSet = new Set(selected)
  const userLetters = selected.map(si => scrambled[availableIndices[si]])

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
          <Badge variant="secondary" className="gap-1.5 font-bold tabular-nums">⭐ {score}</Badge>
          {streak > 1 && (
            <Badge variant="outline" className="gap-1 font-bold text-orange-500 tabular-nums">🔥 {streak}</Badge>
          )}
        </div>
        <Badge variant="ghost" className="text-muted-foreground tabular-nums">{wordIndex + 1} / {words.length}</Badge>
      </div>

      {currentWord && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6 overflow-y-auto">
          {/* Emoji */}
          <div className="text-6xl sm:text-7xl">{currentWord.emoji}</div>

          {/* Chinese character */}
          <div className="text-4xl sm:text-5xl font-bold">{currentWord.chinese}</div>

          {/* English meaning */}
          <p className="text-lg text-muted-foreground">{currentWord.english}</p>

          {/* Speaker button */}
          <button
            className="flex items-center justify-center size-14 sm:size-16 rounded-full bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all touch-manipulation cursor-pointer"
            onClick={() => speakChinese(currentWord.chinese)}
          >
            <Volume2 className="size-7 sm:size-8 text-red-500" />
          </button>

          {/* Sentences — shown after answering */}
          {result !== 'pending' && (
            <div className="flex flex-col gap-2 items-center max-w-sm">
              {currentWord.sentences.map((sentence, i) => (
                <button
                  key={i}
                  onClick={() => speakChinese(sentence, 0.75)}
                  className="flex items-center gap-2.5 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors cursor-pointer touch-manipulation"
                >
                  <Volume2 className="size-4 shrink-0" />
                  <span className="text-left">&ldquo;{sentence}&rdquo;</span>
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
                ? (filled ? ' border-red-500 bg-red-500/10 text-foreground scale-105' : ' border-muted-foreground/30 bg-muted/30 text-transparent')
                : result === 'correct'
                  ? ' border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                  : (filled && userLetter === correctLetter
                      ? ' border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : filled ? ' border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : ' border-muted-foreground/30 bg-muted/30 text-transparent')
              return (
                <div key={i} className={`spelling-slot flex items-center justify-center w-10 h-12 sm:w-12 sm:h-14 rounded-lg border-2 text-xl sm:text-2xl font-bold transition-all duration-200` + slotClass}>
                  {filled ? userLetter : '_'}
                </div>
              )
            })}
          </div>

          {/* Show correct pinyin when wrong */}
          {result === 'wrong' && (
            <p className="text-lg font-bold text-red-500">
              Correct: <span className="text-2xl tracking-widest">{currentWord.pinyin}</span>
            </p>
          )}

          {/* Scrambled tiles */}
          {result === 'pending' && (
            <div className="flex gap-2 justify-center flex-wrap mt-1">
              {availableIndices.map((letterIdx, scrambledIdx) => {
                const used = selectedSet.has(scrambledIdx)
                return (
                  <button
                    key={scrambledIdx}
                    className={`spelling-tile flex items-center justify-center w-10 h-12 sm:w-12 sm:h-14 rounded-xl text-xl sm:text-2xl font-bold transition-all duration-150 touch-manipulation select-none` +
                      (used ? ' opacity-0 scale-75 pointer-events-none' : ' bg-foreground text-background hover:scale-110 active:scale-95 cursor-pointer shadow-md')}
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
                <Button variant="outline" className="gap-2" onClick={undoLetter} disabled={selected.length === 0}>
                  <Undo2 className="size-4" /> Undo
                </Button>
                <Button variant="ghost" className="text-muted-foreground gap-2" onClick={skipWord}>
                  <SkipForward className="size-4" /> Skip
                </Button>
              </>
            )}
            {result === 'correct' && (
              <Button className="gap-2 text-lg" onClick={advanceWord} disabled={nextDisabled}>✓ Next</Button>
            )}
            {result === 'wrong' && (
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2" onClick={retryWord} disabled={nextDisabled}>
                  <RotateCcw className="size-4" /> Try again
                </Button>
                <Button className="gap-2" onClick={advanceWord} disabled={nextDisabled}>Next</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
