import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Bulb, BoolBlock, OperatorBlock } from './blocks'
import { ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecordGame } from '@/games/useRecordGame'
import type { DifficultyLevel } from '@/games/gamification'
import { AND, OR, NOT, V, evalExpr, variables, speakExpr, type Expr } from './expr'
import { Speaker } from './Speaker'

const EASY: Expr[] = [
  AND(V('A'), V('B')),
  OR(V('A'), V('B')),
  NOT(V('A')),
  AND(V('A'), NOT(V('B'))),
  OR(NOT(V('A')), V('B')),
  AND(NOT(V('A')), NOT(V('B'))),
  OR(NOT(V('A')), NOT(V('B'))),
]

const MEDIUM: Expr[] = [
  AND(V('A'), OR(V('B'), V('C'))),
  OR(V('A'), AND(V('B'), V('C'))),
  NOT(AND(V('A'), V('B'))),
  NOT(OR(V('A'), V('B'))),
  AND(OR(V('A'), V('B')), V('C')),
  OR(AND(V('A'), V('B')), NOT(V('C'))),
  AND(NOT(V('A')), OR(V('B'), V('C'))),
  OR(NOT(V('A')), AND(V('B'), V('C'))),
]

const HARD: Expr[] = [
  AND(OR(V('A'), V('B')), NOT(V('C'))),
  OR(AND(V('A'), V('B')), AND(V('C'), NOT(V('D')))),
  AND(OR(V('A'), NOT(V('B'))), OR(V('C'), V('D'))),
  OR(AND(NOT(V('A')), V('B')), AND(V('C'), NOT(V('D')))),
  NOT(AND(OR(V('A'), V('B')), V('C'))),
  AND(NOT(OR(V('A'), V('B'))), V('C')),
  OR(AND(V('A'), V('B')), AND(NOT(V('A')), V('C'))),
]

const POOLS = { easy: EASY, medium: MEDIUM, hard: HARD }
const STAR: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: 'starters', medium: 'movers', hard: 'flyers',
}
const ROUND_COUNT = 6

interface Puzzle {
  expr: Expr
  env: Record<string, boolean>
}

function randomEnv(vars: string[]): Record<string, boolean> {
  const env: Record<string, boolean> = {}
  for (const v of vars) env[v] = Math.random() < 0.5
  return env
}

function buildPuzzle(level: 'easy' | 'medium' | 'hard', exclude?: Puzzle): Puzzle {
  const pool = POOLS[level]
  for (let tries = 0; tries < 20; tries++) {
    const expr = pool[Math.floor(Math.random() * pool.length)]
    const env = randomEnv(variables(expr))
    const puzzle = { expr, env }
    if (!exclude) return puzzle
    const sameExpr = JSON.stringify(expr) === JSON.stringify(exclude.expr)
    const sameEnv = JSON.stringify(env) === JSON.stringify(exclude.env)
    if (!(sameExpr && sameEnv)) return puzzle
  }
  const expr = pool[0]
  return { expr, env: randomEnv(variables(expr)) }
}

function RenderExpr({ e, env }: { e: Expr; env: Record<string, boolean> }) {
  if (e.kind === 'var') return <BoolBlock value={env[e.name] ?? false} label={e.name} size="sm" />
  if (e.kind === 'not') return (
    <OperatorBlock op="not">
      <RenderExpr e={e.x} env={env} />
    </OperatorBlock>
  )
  return (
    <OperatorBlock op={e.kind}>
      <RenderExpr e={e.a} env={env} />
      <RenderExpr e={e.b} env={env} />
    </OperatorBlock>
  )
}

export function BulbQuiz({ level, onExit }: { level: 'easy' | 'medium' | 'hard'; onExit: () => void }) {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => buildPuzzle(level))
  const [picked, setPicked] = useState<boolean | null>(null)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const { record, reset } = useRecordGame()

  const answer = useMemo(() => evalExpr(puzzle.expr, puzzle.env), [puzzle])
  const correct = picked !== null && picked === answer
  const vars = useMemo(() => variables(puzzle.expr), [puzzle.expr])

  const pick = (v: boolean) => {
    if (picked !== null) return
    setPicked(v)
    if (v === answer) setScore(s => s + 1)
  }

  const next = () => {
    if (round + 1 >= ROUND_COUNT) {
      setDone(true)
      record(STAR[level], 'bulb-quiz')
    } else {
      setPuzzle(buildPuzzle(level, puzzle))
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
        <h2 className="text-3xl font-extrabold">Bulb Predictor!</h2>
        <p className="text-lg text-muted-foreground">You got {score}/{ROUND_COUNT} right</p>
        <div className="flex gap-2">
          <Button onClick={restart}><RotateCcw className="size-4" />Play again</Button>
          <Button variant="outline" onClick={onExit}>Back</Button>
        </div>
      </div>
    )
  }

  const envSpeech = vars.map(v => `${v} is ${puzzle.env[v] ? 'on' : 'off'}`).join(', ')

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

      <div className="flex items-center justify-center gap-2 max-w-md">
        <Speaker text={`Bulb Quiz. Will the bulb light up? The expression is ${speakExpr(puzzle.expr)}. The switches are: ${envSpeech}.`} />
        <p className="text-sm text-muted-foreground text-center">Will the bulb light up? 💡</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 py-2">
        {vars.map(v => (
          <div key={v} className="flex flex-col items-center gap-1">
            <span className="font-bold text-base">{v}</span>
            <span className={cn(
              'px-3 py-1.5 rounded-lg border-2 font-extrabold text-sm uppercase shadow-sm',
              puzzle.env[v]
                ? 'bg-amber-200 border-amber-500 text-amber-900'
                : 'bg-zinc-200 border-zinc-500 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
            )}>
              {puzzle.env[v] ? 'ON' : 'OFF'}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <RenderExpr e={puzzle.expr} env={puzzle.env} />
      </div>

      {picked !== null && (
        <div className="flex flex-col items-center gap-2 mt-1">
          <Bulb on={answer} size={80} />
          <span className={cn(
            'text-xs font-bold uppercase tracking-wide',
            answer ? 'text-amber-600' : 'text-zinc-500',
          )}>
            Bulb is {answer ? 'ON' : 'OFF'}
          </span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          size="lg"
          variant={picked === true ? (correct ? 'default' : 'destructive') : 'outline'}
          onClick={() => pick(true)}
          disabled={picked !== null}
          className={cn(picked === true && correct && 'bg-emerald-600 hover:bg-emerald-600')}
        >
          💡 ON
        </Button>
        <Button
          size="lg"
          variant={picked === false ? (correct ? 'default' : 'destructive') : 'outline'}
          onClick={() => pick(false)}
          disabled={picked !== null}
          className={cn(picked === false && correct && 'bg-emerald-600 hover:bg-emerald-600')}
        >
          ⚫ OFF
        </Button>
      </div>

      {picked !== null && (
        <>
          <div className={cn('flex items-center gap-2 font-bold text-base', correct ? 'text-emerald-600' : 'text-rose-500')}>
            {correct
              ? <><Check className="size-5" /> Correct!</>
              : <><X className="size-5" /> Answer: <span className="text-foreground">{answer ? 'ON' : 'OFF'}</span></>
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
