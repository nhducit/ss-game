import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Bulb, Switch, OperatorBlock, BoolBlock } from './blocks'
import { RotateCcw, Trophy, SkipForward, ArrowRight } from 'lucide-react'
import { useRecordGame } from '@/games/useRecordGame'
import type { DifficultyLevel } from '@/games/gamification'

type Expr =
  | { kind: 'var'; name: string }
  | { kind: 'not'; x: Expr }
  | { kind: 'and'; a: Expr; b: Expr }
  | { kind: 'or'; a: Expr; b: Expr }

const V = (n: string): Expr => ({ kind: 'var', name: n })
const NOT = (x: Expr): Expr => ({ kind: 'not', x })
const AND = (a: Expr, b: Expr): Expr => ({ kind: 'and', a, b })
const OR = (a: Expr, b: Expr): Expr => ({ kind: 'or', a, b })

function evalExpr(e: Expr, env: Record<string, boolean>): boolean {
  if (e.kind === 'var') return env[e.name] ?? false
  if (e.kind === 'not') return !evalExpr(e.x, env)
  if (e.kind === 'and') return evalExpr(e.a, env) && evalExpr(e.b, env)
  return evalExpr(e.a, env) || evalExpr(e.b, env)
}

function variables(e: Expr): string[] {
  const set = new Set<string>()
  const walk = (x: Expr) => {
    if (x.kind === 'var') set.add(x.name)
    else if (x.kind === 'not') walk(x.x)
    else { walk(x.a); walk(x.b) }
  }
  walk(e)
  return Array.from(set).sort()
}

function RenderExpr({ e, env }: { e: Expr; env: Record<string, boolean> }) {
  if (e.kind === 'var') return <BoolBlock value={env[e.name] ?? false} label={e.name} size="sm" />
  if (e.kind === 'not') return (
    <OperatorBlock op="not" result={evalExpr(e, env)}>
      <RenderExpr e={e.x} env={env} />
    </OperatorBlock>
  )
  return (
    <OperatorBlock op={e.kind} result={evalExpr(e, env)}>
      <RenderExpr e={e.a} env={env} />
      <RenderExpr e={e.b} env={env} />
    </OperatorBlock>
  )
}

const EASY: Expr[] = [
  AND(V('A'), V('B')),
  OR(V('A'), V('B')),
  NOT(V('A')),
  NOT(V('B')),
]
const MEDIUM: Expr[] = [
  AND(V('A'), NOT(V('B'))),
  OR(NOT(V('A')), V('B')),
  AND(V('A'), AND(V('B'), V('C'))),
  OR(V('A'), NOT(V('B'))),
  AND(NOT(V('A')), NOT(V('B'))),
]
const HARD: Expr[] = [
  AND(OR(V('A'), V('B')), NOT(V('C'))),
  OR(AND(V('A'), V('B')), AND(V('C'), NOT(V('D')))),
  OR(NOT(V('A')), NOT(V('B'))),
  AND(OR(V('A'), V('C')), OR(V('B'), NOT(V('C')))),
  AND(NOT(V('A')), OR(V('B'), V('C'))),
]

const LEVELS: { id: 'easy' | 'medium' | 'hard'; exprs: Expr[]; stars: DifficultyLevel }[] = [
  { id: 'easy', exprs: EASY, stars: 'starters' },
  { id: 'medium', exprs: MEDIUM, stars: 'movers' },
  { id: 'hard', exprs: HARD, stars: 'flyers' },
]

const ROUND_COUNT = 5

export function LightUp({ level, onExit }: { level: 'easy' | 'medium' | 'hard'; onExit: () => void }) {
  const cfg = LEVELS.find(l => l.id === level)!
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [currentExpr, setCurrentExpr] = useState<Expr>(() => pickExpr(cfg.exprs))
  const [env, setEnv] = useState<Record<string, boolean>>(() => initEnv(currentExpr))
  const [locked, setLocked] = useState(false)
  const [done, setDone] = useState(false)
  const { record, reset } = useRecordGame()

  const vars = useMemo(() => variables(currentExpr), [currentExpr])
  const result = evalExpr(currentExpr, env)

  const toggle = useCallback((name: string) => {
    if (locked || done) return
    const newEnv = { ...env, [name]: !(env[name] ?? false) }
    setEnv(newEnv)
    const lit = evalExpr(currentExpr, newEnv)
    if (lit) {
      setLocked(true)
      setScore(s => s + 1)
    }
  }, [locked, done, env, currentExpr])

  const next = () => {
    if (round + 1 >= ROUND_COUNT) {
      setDone(true)
      record(cfg.stars, 'light-up')
    } else {
      const nextExpr = pickExpr(cfg.exprs, currentExpr)
      setCurrentExpr(nextExpr)
      setEnv(initEnv(nextExpr))
      setRound(r => r + 1)
      setLocked(false)
    }
  }

  const skip = () => {
    const nextExpr = pickExpr(cfg.exprs, currentExpr)
    setCurrentExpr(nextExpr)
    setEnv(initEnv(nextExpr))
    setLocked(false)
  }

  const restart = () => {
    reset()
    const next = pickExpr(cfg.exprs)
    setCurrentExpr(next)
    setEnv(initEnv(next))
    setRound(0)
    setScore(0)
    setLocked(false)
    setDone(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto">
        <Trophy className="size-16 text-amber-500" />
        <h2 className="text-3xl font-extrabold">Bulb Master!</h2>
        <p className="text-lg text-muted-foreground">You lit {score}/{ROUND_COUNT} bulbs</p>
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
        <Button variant="ghost" size="sm" onClick={skip}><SkipForward className="size-4" />Skip</Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">Make the bulb light up 💡</p>
      </div>

      <div className="flex flex-col items-center gap-3 py-4">
        <Bulb on={result} size={100} />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderExpr e={currentExpr} env={env} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {vars.map(v => (
          <Switch key={v} on={env[v] ?? false} label={v} onToggle={() => toggle(v)} />
        ))}
      </div>

      {locked && (
        <Button size="lg" onClick={next} className="mt-4">
          {round + 1 >= ROUND_COUNT ? '🏁 Finish' : 'Next'} <ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  )
}

function pickExpr(list: Expr[], exclude?: Expr): Expr {
  let e = list[Math.floor(Math.random() * list.length)]
  if (exclude && list.length > 1) {
    while (JSON.stringify(e) === JSON.stringify(exclude)) {
      e = list[Math.floor(Math.random() * list.length)]
    }
  }
  return e
}

function initEnv(e: Expr): Record<string, boolean> {
  const env: Record<string, boolean> = {}
  for (const v of variables(e)) env[v] = false
  // Avoid starting already-correct
  if (evalExpr(e, env)) env[variables(e)[0]] = true
  return env
}
