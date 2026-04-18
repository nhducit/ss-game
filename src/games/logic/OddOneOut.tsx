import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { BoolBlock, OperatorBlock } from './blocks'
import { ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecordGame } from '@/games/useRecordGame'
import type { DifficultyLevel } from '@/games/gamification'
import { AND, OR, NOT, V, equivalent, speakExpr, type Expr } from './expr'
import { Speaker } from './Speaker'

interface Triple {
  // Two equivalent expressions plus one odd.
  equivA: Expr
  equivB: Expr
  odd: Expr
}

// Each triple: two equivalent exprs + one non-equivalent "odd". The game
// shuffles the order per-round so the odd index rotates.
const EASY_TRIPLES: Triple[] = [
  {
    equivA: AND(V('A'), V('B')),
    equivB: AND(V('B'), V('A')),
    odd: OR(V('A'), V('B')),
  },
  {
    equivA: OR(V('A'), V('B')),
    equivB: OR(V('B'), V('A')),
    odd: AND(V('A'), V('B')),
  },
  {
    equivA: NOT(NOT(V('A'))),
    equivB: V('A'),
    odd: NOT(V('A')),
  },
  {
    equivA: AND(V('A'), V('A')),
    equivB: V('A'),
    odd: NOT(V('A')),
  },
  {
    equivA: OR(V('A'), V('A')),
    equivB: V('A'),
    odd: AND(V('A'), NOT(V('A'))),
  },
  {
    equivA: AND(V('A'), NOT(V('B'))),
    equivB: AND(NOT(V('B')), V('A')),
    odd: AND(NOT(V('A')), V('B')),
  },
]

const MEDIUM_TRIPLES: Triple[] = [
  // De Morgan
  {
    equivA: NOT(AND(V('A'), V('B'))),
    equivB: OR(NOT(V('A')), NOT(V('B'))),
    odd: AND(NOT(V('A')), NOT(V('B'))),
  },
  {
    equivA: NOT(OR(V('A'), V('B'))),
    equivB: AND(NOT(V('A')), NOT(V('B'))),
    odd: OR(NOT(V('A')), NOT(V('B'))),
  },
  // Distributive
  {
    equivA: AND(V('A'), OR(V('B'), V('C'))),
    equivB: OR(AND(V('A'), V('B')), AND(V('A'), V('C'))),
    odd: OR(V('A'), AND(V('B'), V('C'))),
  },
  {
    equivA: OR(V('A'), AND(V('B'), V('C'))),
    equivB: AND(OR(V('A'), V('B')), OR(V('A'), V('C'))),
    odd: AND(V('A'), OR(V('B'), V('C'))),
  },
  // Absorption
  {
    equivA: OR(V('A'), AND(V('A'), V('B'))),
    equivB: V('A'),
    odd: OR(V('A'), V('B')),
  },
  {
    equivA: AND(V('A'), OR(V('A'), V('B'))),
    equivB: V('A'),
    odd: AND(V('A'), V('B')),
  },
]

const HARD_TRIPLES: Triple[] = [
  {
    equivA: OR(AND(V('A'), V('B')), AND(V('A'), NOT(V('B')))),
    equivB: V('A'),
    odd: AND(V('A'), V('B')),
  },
  {
    equivA: AND(OR(V('A'), V('B')), OR(V('A'), NOT(V('B')))),
    equivB: V('A'),
    odd: OR(V('A'), V('B')),
  },
  {
    equivA: NOT(AND(V('A'), V('B'))),
    equivB: OR(NOT(V('A')), NOT(V('B'))),
    odd: NOT(OR(V('A'), V('B'))),
  },
  {
    equivA: AND(OR(V('A'), V('B')), NOT(AND(V('A'), V('B')))),
    equivB: OR(AND(V('A'), NOT(V('B'))), AND(NOT(V('A')), V('B'))),
    odd: OR(AND(V('A'), V('B')), AND(NOT(V('A')), NOT(V('B')))),
  },
  {
    equivA: AND(OR(V('A'), V('B')), OR(V('B'), V('C'))),
    equivB: OR(V('B'), AND(V('A'), V('C'))),
    odd: AND(V('A'), OR(V('B'), V('C'))),
  },
]

const POOLS = { easy: EASY_TRIPLES, medium: MEDIUM_TRIPLES, hard: HARD_TRIPLES }
const STAR: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: 'starters', medium: 'movers', hard: 'flyers',
}
const ROUND_COUNT = 5

interface Round {
  items: Expr[]
  oddIndex: number
  triple: Triple
}

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRound(level: 'easy' | 'medium' | 'hard', exclude?: Triple): Round {
  const pool = POOLS[level]
  let triple = pool[Math.floor(Math.random() * pool.length)]
  if (exclude && pool.length > 1) {
    while (JSON.stringify(triple) === JSON.stringify(exclude)) {
      triple = pool[Math.floor(Math.random() * pool.length)]
    }
  }
  const labelled: { expr: Expr; isOdd: boolean }[] = [
    { expr: triple.equivA, isOdd: false },
    { expr: triple.equivB, isOdd: false },
    { expr: triple.odd, isOdd: true },
  ]
  shuffle(labelled)
  const oddIndex = labelled.findIndex(i => i.isOdd)
  return { items: labelled.map(i => i.expr), oddIndex, triple }
}

function RenderExpr({ e, depth = 0 }: { e: Expr; depth?: number }) {
  if (e.kind === 'var') return <BoolBlock value={true} label={e.name} size="sm" />
  if (e.kind === 'not') return <OperatorBlock op="not" depth={depth}><RenderExpr e={e.x} depth={depth + 1} /></OperatorBlock>
  return (
    <OperatorBlock op={e.kind} depth={depth}>
      <RenderExpr e={e.a} depth={depth + 1} />
      <RenderExpr e={e.b} depth={depth + 1} />
    </OperatorBlock>
  )
}

export function OddOneOut({ level, onExit }: { level: 'easy' | 'medium' | 'hard'; onExit: () => void }) {
  const [round, setRound] = useState<Round>(() => buildRound(level))
  const [roundNum, setRoundNum] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const { record, reset } = useRecordGame()

  const correct = picked !== null && picked === round.oddIndex

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    if (i === round.oddIndex) setScore(s => s + 1)
  }

  const next = () => {
    if (roundNum + 1 >= ROUND_COUNT) {
      setDone(true)
      record(STAR[level], 'odd-one-out')
    } else {
      setRound(buildRound(level, round.triple))
      setPicked(null)
      setRoundNum(r => r + 1)
    }
  }

  const restart = () => {
    reset()
    setRound(buildRound(level))
    setPicked(null)
    setRoundNum(0)
    setScore(0)
    setDone(false)
  }

  // Sanity: equivalence of the two non-odd items (used to describe result).
  const twinEquiv = useMemo(() => {
    const twins: Expr[] = []
    round.items.forEach((e, i) => { if (i !== round.oddIndex) twins.push(e) })
    return twins.length === 2 && equivalent(twins[0], twins[1])
  }, [round])

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto">
        <Trophy className="size-16 text-amber-500" />
        <h2 className="text-3xl font-extrabold">Sharp Eye!</h2>
        <p className="text-lg text-muted-foreground">You got {score}/{ROUND_COUNT} right</p>
        <div className="flex gap-2">
          <Button onClick={restart}><RotateCcw className="size-4" />Play again</Button>
          <Button variant="outline" onClick={onExit}>Back</Button>
        </div>
      </div>
    )
  }

  const spokenList = round.items.map((e, i) => `Block ${i + 1}: ${speakExpr(e)}`).join('. ')

  return (
    <div className="flex flex-col items-center gap-5 p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" size="sm" onClick={onExit}>← Back</Button>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">Round {roundNum + 1}/{ROUND_COUNT}</span>
          <span>⭐ {score}</span>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex items-center justify-center gap-2 max-w-md">
        <Speaker text={`Odd One Out. Two blocks give the same output for every input. One is different. Find the odd one. ${spokenList}.`} />
        <p className="text-sm text-muted-foreground text-center">
          Two blocks are <em>always</em> equal. One is different. Tap the odd one out.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xl">
        {round.items.map((e, i) => {
          const isPicked = picked === i
          const isCorrectPick = isPicked && correct
          const isWrongPick = isPicked && !correct
          const revealOdd = picked !== null && i === round.oddIndex && !isPicked
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border-2 transition-all active:scale-[0.98] touch-manipulation',
                picked === null && 'bg-card border-border hover:border-primary hover:bg-muted/40',
                isCorrectPick && 'bg-emerald-500 border-emerald-600 text-white',
                isWrongPick && 'bg-rose-500 border-rose-600 text-white',
                revealOdd && 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900/40',
                picked !== null && !isPicked && !revealOdd && 'opacity-50',
              )}
            >
              <span className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full font-extrabold',
                picked === null && 'bg-muted text-foreground',
                isCorrectPick && 'bg-white text-emerald-700',
                isWrongPick && 'bg-white text-rose-700',
                revealOdd && 'bg-emerald-500 text-white',
                picked !== null && !isPicked && !revealOdd && 'bg-muted text-muted-foreground',
              )}>
                {i + 1}
              </span>
              <div className="flex flex-wrap items-center gap-1 flex-1">
                <RenderExpr e={e} />
              </div>
              {isCorrectPick && <Check className="size-5" />}
              {isWrongPick && <X className="size-5" />}
              {revealOdd && <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">← odd one</span>}
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div className="flex flex-col items-center gap-3">
          <div className={cn('flex items-center gap-2 font-bold text-base', correct ? 'text-emerald-600' : 'text-rose-500')}>
            {correct
              ? <><Check className="size-5" /> Nice — the other two are {twinEquiv ? 'always equal' : 'the same'}.</>
              : <><X className="size-5" /> Answer: Block {round.oddIndex + 1}</>
            }
          </div>
          <Button size="lg" onClick={next}>
            {roundNum + 1 >= ROUND_COUNT ? '🏁 Finish' : 'Next'} <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
