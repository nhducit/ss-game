import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { BoolBlock } from './blocks'
import { RotateCcw, Trophy, Check, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecordGame } from '@/games/useRecordGame'
import type { DifficultyLevel } from '@/games/gamification'

type Gate = 'and' | 'or' | 'not' | 'and-not' | 'or-not' | 'not-and' | 'not-or'

interface Puzzle {
  answer: Gate
  choices: Gate[]
  rows: { a: boolean; b?: boolean; out: boolean }[]
}

function evalGate(g: Gate, a: boolean, b: boolean): boolean {
  switch (g) {
    case 'and': return a && b
    case 'or': return a || b
    case 'not': return !a
    case 'and-not': return a && !b
    case 'or-not': return a || !b
    case 'not-and': return !(a && b)
    case 'not-or': return !(a || b)
  }
}

const GATE_LABELS: Record<Gate, string> = {
  'and': 'A and B',
  'or': 'A or B',
  'not': 'not A',
  'and-not': 'A and (not B)',
  'or-not': 'A or (not B)',
  'not-and': 'not (A and B)',
  'not-or': 'not (A or B)',
}

function GateChip({
  g,
  state,
  onClick,
}: {
  g: Gate
  state: 'idle' | 'selected-right' | 'selected-wrong' | 'reveal-right' | 'dim'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state !== 'idle'}
      className={cn(
        'px-4 py-3 rounded-xl border-2 font-bold transition-all active:scale-95 touch-manipulation text-base shadow-sm min-w-[140px]',
        state === 'idle' && 'bg-card border-border hover:border-primary hover:bg-muted/50',
        state === 'selected-right' && 'bg-emerald-500 border-emerald-600 text-white',
        state === 'selected-wrong' && 'bg-rose-500 border-rose-600 text-white',
        state === 'reveal-right' && 'bg-emerald-100 border-emerald-500 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
        state === 'dim' && 'bg-muted border-border opacity-50',
      )}
    >
      {GATE_LABELS[g]}
    </button>
  )
}

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildPuzzle(level: 'easy' | 'medium' | 'hard'): Puzzle {
  const easy: Gate[] = ['and', 'or', 'not']
  const medium: Gate[] = ['and', 'or', 'and-not', 'or-not']
  const hard: Gate[] = ['and', 'or', 'and-not', 'or-not', 'not-and', 'not-or']
  const pool = level === 'easy' ? easy : level === 'medium' ? medium : hard

  const answer = pool[Math.floor(Math.random() * pool.length)]
  const isUnary = answer === 'not'
  const rows = isUnary
    ? [
        { a: false, out: evalGate(answer, false, false) },
        { a: true, out: evalGate(answer, true, false) },
      ]
    : [
        { a: false, b: false, out: evalGate(answer, false, false) },
        { a: false, b: true, out: evalGate(answer, false, true) },
        { a: true, b: false, out: evalGate(answer, true, false) },
        { a: true, b: true, out: evalGate(answer, true, true) },
      ]

  const distractorsPool = pool.filter(g => g !== answer && (isUnary ? g === 'not' : g !== 'not'))
  shuffle(distractorsPool)
  const choices = shuffle([answer, ...distractorsPool.slice(0, 2)])
  return { answer, choices, rows }
}

const ROUND_COUNT = 5
const STAR_LEVEL: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: 'starters',
  medium: 'movers',
  hard: 'flyers',
}

export function GateGuess({ level, onExit }: { level: 'easy' | 'medium' | 'hard'; onExit: () => void }) {
  const [round, setRound] = useState(0)
  const [puzzle, setPuzzle] = useState<Puzzle>(() => buildPuzzle(level))
  const [picked, setPicked] = useState<Gate | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const { record, reset } = useRecordGame()

  const correct = picked !== null && picked === puzzle.answer

  const pick = useCallback((g: Gate) => {
    if (picked !== null) return
    setPicked(g)
    if (g === puzzle.answer) setScore(s => s + 1)
  }, [picked, puzzle.answer])

  const next = () => {
    if (round + 1 >= ROUND_COUNT) {
      setDone(true)
      record(STAR_LEVEL[level], 'gate-guess')
    } else {
      setPuzzle(buildPuzzle(level))
      setPicked(null)
      setRound(r => r + 1)
    }
  }

  const restart = () => {
    reset()
    setPuzzle(buildPuzzle(level))
    setPicked(null)
    setRound(0)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto">
        <Trophy className="size-16 text-amber-500" />
        <h2 className="text-3xl font-extrabold">Gate Guru!</h2>
        <p className="text-lg text-muted-foreground">You got {score}/{ROUND_COUNT} right</p>
        <div className="flex gap-2">
          <Button onClick={restart}><RotateCcw className="size-4" />Play again</Button>
          <Button variant="outline" onClick={onExit}>Back</Button>
        </div>
      </div>
    )
  }

  const isUnary = puzzle.answer === 'not'

  function chipState(g: Gate): 'idle' | 'selected-right' | 'selected-wrong' | 'reveal-right' | 'dim' {
    if (picked === null) return 'idle'
    if (g === picked) return correct ? 'selected-right' : 'selected-wrong'
    if (g === puzzle.answer) return 'reveal-right'
    return 'dim'
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" size="sm" onClick={onExit}>← Back</Button>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">Round {round + 1}/{ROUND_COUNT}</span>
          <span>⭐ {score}</span>
        </div>
        <div className="w-16" />
      </div>

      <p className="text-sm text-muted-foreground text-center max-w-md">
        Which Scratch operator matches this truth table? 🔍
      </p>

      <div className="overflow-x-auto">
        <table className="mx-auto font-mono text-base border-separate border-spacing-0 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#59C059] text-white">
              <th className="px-5 py-2 border border-[#3a8a3a]">A</th>
              {!isUnary && <th className="px-5 py-2 border border-[#3a8a3a]">B</th>}
              <th className="px-5 py-2 border border-[#3a8a3a]">💡</th>
            </tr>
          </thead>
          <tbody>
            {puzzle.rows.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-muted/50' : ''}>
                <td className="px-4 py-2 border border-border text-center">
                  <BoolBlock value={r.a} label="A" size="sm" />
                </td>
                {!isUnary && (
                  <td className="px-4 py-2 border border-border text-center">
                    <BoolBlock value={r.b!} label="B" size="sm" />
                  </td>
                )}
                <td className={cn(
                  'px-4 py-2 border border-border text-center font-bold',
                  r.out ? 'text-emerald-600' : 'text-rose-500',
                )}>
                  {r.out ? '✅ on' : '❌ off'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {puzzle.choices.map(g => (
          <GateChip key={g} g={g} state={chipState(g)} onClick={() => pick(g)} />
        ))}
      </div>

      {picked !== null && (
        <>
          <div className={cn('flex items-center gap-2 font-bold text-base', correct ? 'text-emerald-600' : 'text-rose-500')}>
            {correct
              ? <><Check className="size-5" /> Correct!</>
              : <><X className="size-5" /> Answer: <span className="text-foreground">{GATE_LABELS[puzzle.answer]}</span></>
            }
          </div>
          <Button size="lg" onClick={next}>
            {round + 1 >= ROUND_COUNT ? '🏁 Finish' : 'Next'} <ArrowRight className="size-4" />
          </Button>
        </>
      )}
    </div>
  )
}
