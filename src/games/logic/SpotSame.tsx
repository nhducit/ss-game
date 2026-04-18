import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { BoolBlock, OperatorBlock } from './blocks'
import { ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecordGame } from '@/games/useRecordGame'
import type { DifficultyLevel } from '@/games/gamification'
import { AND, OR, NOT, V, evalExpr, variables, allAssignments, equivalent, type Expr } from './expr'

interface Pair { a: Expr; b: Expr }

// Pairs where we control equivalence. Each level gets both kinds.
const EASY_PAIRS: Pair[] = [
  // equivalent
  { a: AND(V('A'), V('B')), b: AND(V('B'), V('A')) },
  { a: OR(V('A'), V('B')), b: OR(V('B'), V('A')) },
  { a: NOT(NOT(V('A'))), b: V('A') },
  { a: AND(V('A'), V('A')), b: V('A') },
  { a: OR(V('A'), V('A')), b: V('A') },
  // NOT equivalent
  { a: AND(V('A'), V('B')), b: OR(V('A'), V('B')) },
  { a: V('A'), b: NOT(V('A')) },
  { a: AND(V('A'), V('B')), b: V('A') },
]

const MEDIUM_PAIRS: Pair[] = [
  // De Morgan
  { a: NOT(AND(V('A'), V('B'))), b: OR(NOT(V('A')), NOT(V('B'))) },
  { a: NOT(OR(V('A'), V('B'))), b: AND(NOT(V('A')), NOT(V('B'))) },
  // distributive
  { a: AND(V('A'), OR(V('B'), V('C'))), b: OR(AND(V('A'), V('B')), AND(V('A'), V('C'))) },
  // absorption
  { a: OR(V('A'), AND(V('A'), V('B'))), b: V('A') },
  // NOT equivalent
  { a: AND(V('A'), NOT(V('B'))), b: AND(NOT(V('A')), V('B')) },
  { a: OR(V('A'), AND(V('B'), V('C'))), b: AND(OR(V('A'), V('B')), V('C')) },
  { a: NOT(AND(V('A'), V('B'))), b: AND(NOT(V('A')), NOT(V('B'))) },
]

const HARD_PAIRS: Pair[] = [
  // complex equivalent
  { a: OR(AND(V('A'), V('B')), AND(V('A'), NOT(V('B')))), b: V('A') },
  { a: AND(OR(V('A'), V('B')), OR(V('A'), NOT(V('B')))), b: V('A') },
  { a: NOT(AND(OR(V('A'), V('B')), V('C'))), b: OR(AND(NOT(V('A')), NOT(V('B'))), NOT(V('C'))) },
  { a: OR(V('A'), NOT(AND(V('A'), V('B')))), b: OR(V('A'), NOT(V('B'))) },
  // NOT equivalent (tricky)
  { a: AND(OR(V('A'), V('B')), V('C')), b: OR(AND(V('A'), V('C')), V('B')) },
  { a: NOT(OR(V('A'), AND(V('B'), V('C')))), b: AND(NOT(V('A')), OR(NOT(V('B')), NOT(V('C')))) },
  { a: OR(AND(V('A'), V('B')), V('C')), b: AND(V('A'), OR(V('B'), V('C'))) },
]

const POOLS = { easy: EASY_PAIRS, medium: MEDIUM_PAIRS, hard: HARD_PAIRS }
const STAR: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: 'starters', medium: 'movers', hard: 'flyers',
}
const ROUND_COUNT = 5

function RenderExpr({ e }: { e: Expr }) {
  if (e.kind === 'var') return <BoolBlock value={true} label={e.name} size="sm" />
  if (e.kind === 'not') return <OperatorBlock op="not"><RenderExpr e={e.x} /></OperatorBlock>
  return (
    <OperatorBlock op={e.kind}>
      <RenderExpr e={e.a} />
      <RenderExpr e={e.b} />
    </OperatorBlock>
  )
}

function pickPair(list: Pair[], exclude?: Pair): Pair {
  let p = list[Math.floor(Math.random() * list.length)]
  if (exclude && list.length > 1) {
    while (JSON.stringify(p) === JSON.stringify(exclude)) {
      p = list[Math.floor(Math.random() * list.length)]
    }
  }
  return p
}

export function SpotSame({ level, onExit }: { level: 'easy' | 'medium' | 'hard'; onExit: () => void }) {
  const pool = POOLS[level]
  const [pair, setPair] = useState<Pair>(() => pickPair(pool))
  const [picked, setPicked] = useState<'yes' | 'no' | null>(null)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const { record, reset } = useRecordGame()

  const same = useMemo(() => equivalent(pair.a, pair.b), [pair])
  const correctAns = same ? 'yes' : 'no'
  const correct = picked === correctAns

  const allVars = useMemo(
    () => Array.from(new Set([...variables(pair.a), ...variables(pair.b)])).sort(),
    [pair],
  )
  const counterExample = useMemo(() => {
    if (same) return null
    for (const env of allAssignments(allVars)) {
      if (evalExpr(pair.a, env) !== evalExpr(pair.b, env)) return env
    }
    return null
  }, [same, allVars, pair])

  const pick = (ans: 'yes' | 'no') => {
    if (picked !== null) return
    setPicked(ans)
    if (ans === correctAns) setScore(s => s + 1)
  }

  const next = () => {
    if (round + 1 >= ROUND_COUNT) {
      setDone(true)
      record(STAR[level], 'spot-same')
    } else {
      setPair(pickPair(pool, pair))
      setPicked(null)
      setRound(r => r + 1)
    }
  }

  const restart = () => {
    reset()
    setPair(pickPair(pool))
    setPicked(null)
    setRound(0)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto">
        <Trophy className="size-16 text-amber-500" />
        <h2 className="text-3xl font-extrabold">Equivalence Expert!</h2>
        <p className="text-lg text-muted-foreground">You got {score}/{ROUND_COUNT} right</p>
        <div className="flex gap-2">
          <Button onClick={restart}><RotateCcw className="size-4" />Play again</Button>
          <Button variant="outline" onClick={onExit}>Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" size="sm" onClick={onExit}>← Back</Button>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">Round {round + 1}/{ROUND_COUNT}</span>
          <span>⭐ {score}</span>
        </div>
        <div className="w-16" />
      </div>

      <p className="text-sm text-muted-foreground text-center">Do both blocks <em>always</em> give the same output?</p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
        <div className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border min-w-[180px]">
          <span className="text-xs text-muted-foreground font-bold">LEFT</span>
          <div className="flex flex-wrap items-center justify-center gap-1"><RenderExpr e={pair.a} /></div>
        </div>
        <div className="text-2xl font-extrabold text-muted-foreground">=?</div>
        <div className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border min-w-[180px]">
          <span className="text-xs text-muted-foreground font-bold">RIGHT</span>
          <div className="flex flex-wrap items-center justify-center gap-1"><RenderExpr e={pair.b} /></div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          size="lg"
          variant={picked === 'yes' ? (correct ? 'default' : 'destructive') : 'outline'}
          onClick={() => pick('yes')}
          disabled={picked !== null}
          className={cn(picked === 'yes' && correct && 'bg-emerald-600 hover:bg-emerald-600')}
        >
          ✅ Same
        </Button>
        <Button
          size="lg"
          variant={picked === 'no' ? (correct ? 'default' : 'destructive') : 'outline'}
          onClick={() => pick('no')}
          disabled={picked !== null}
          className={cn(picked === 'no' && correct && 'bg-emerald-600 hover:bg-emerald-600')}
        >
          ❌ Different
        </Button>
      </div>

      {picked !== null && (
        <div className="flex flex-col items-center gap-3 mt-2 max-w-md">
          <div className={cn('flex items-center gap-2 font-bold text-base', correct ? 'text-emerald-600' : 'text-rose-500')}>
            {correct
              ? <><Check className="size-5" /> {same ? 'Yes, always the same!' : 'Correct — they differ.'}</>
              : <><X className="size-5" /> Answer: <span className="text-foreground">{same ? 'Same' : 'Different'}</span></>
            }
          </div>
          {counterExample && (
            <div className="text-xs text-center text-muted-foreground">
              Counter-example: when {allVars.map(v => `${v}=${counterExample[v] ? 'on' : 'off'}`).join(', ')}, left is{' '}
              <strong className={cn(evalExpr(pair.a, counterExample) ? 'text-emerald-600' : 'text-rose-500')}>
                {evalExpr(pair.a, counterExample) ? 'on' : 'off'}
              </strong>
              {' '}but right is{' '}
              <strong className={cn(evalExpr(pair.b, counterExample) ? 'text-emerald-600' : 'text-rose-500')}>
                {evalExpr(pair.b, counterExample) ? 'on' : 'off'}
              </strong>.
            </div>
          )}
          <Button size="lg" onClick={next}>
            {round + 1 >= ROUND_COUNT ? '🏁 Finish' : 'Next'} <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
