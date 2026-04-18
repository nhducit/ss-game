import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BoolBlock, OperatorBlock } from './blocks'
import { ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecordGame } from '@/games/useRecordGame'
import type { DifficultyLevel } from '@/games/gamification'
import { AND, OR, NOT, V, evalExpr, variables, allAssignments, speakExpr, type Expr } from './expr'
import { Speaker } from './Speaker'

type Op = 'and' | 'or'
type UnaryFlag = 'id' | 'not'

// A puzzle: an expression template with holes. The student fills 1 or 2 holes.
// For simplicity: each hole is either a binary operator (AND/OR) or a NOT flag.
interface Puzzle {
  // Build the expression from hole choices
  build: (choices: (Op | UnaryFlag)[]) => Expr
  // Kinds of each hole, in order
  holes: ('op' | 'unary')[]
  // The target expression (correct answer)
  target: Expr
  // Description of the goal (shown to the kid)
  description: string
}

// Easy: 1 hole, binary op between two vars
function easyOpBetween(aName: string, bName: string): Puzzle {
  const op: Op = Math.random() < 0.5 ? 'and' : 'or'
  const target = op === 'and' ? AND(V(aName), V(bName)) : OR(V(aName), V(bName))
  return {
    build: (choices) => {
      const o = choices[0] as Op
      return o === 'and' ? AND(V(aName), V(bName)) : OR(V(aName), V(bName))
    },
    holes: ['op'],
    target,
    description: `Bulb should light when ${describe(target)}`,
  }
}

function describe(e: Expr): string {
  if (e.kind === 'var') return e.name + ' is on'
  if (e.kind === 'not') return e.x.kind === 'var' ? `${e.x.name} is off` : `not (${describe(e.x)})`
  const joiner = e.kind === 'and' ? 'and' : 'or'
  return `${describe(e.a)} ${joiner} ${describe(e.b)}`
}

// Easy: 1 hole, unary (identity or NOT) on one var combined with another
function easyNotThenOp(aName: string, bName: string): Puzzle {
  const useNot: UnaryFlag = Math.random() < 0.5 ? 'not' : 'id'
  const op: Op = Math.random() < 0.5 ? 'and' : 'or'
  const left: Expr = useNot === 'not' ? NOT(V(aName)) : V(aName)
  const target = op === 'and' ? AND(left, V(bName)) : OR(left, V(bName))
  return {
    build: (choices) => {
      const u = choices[0] as UnaryFlag
      const l: Expr = u === 'not' ? NOT(V(aName)) : V(aName)
      return op === 'and' ? AND(l, V(bName)) : OR(l, V(bName))
    },
    holes: ['unary'],
    target,
    description: `Bulb should light when ${describe(target)}`,
  }
}

// Medium: 2 holes (unary + binary op)
function mediumPuzzle(aName: string, bName: string): Puzzle {
  const useNot: UnaryFlag = Math.random() < 0.5 ? 'not' : 'id'
  const op: Op = Math.random() < 0.5 ? 'and' : 'or'
  const right: Expr = useNot === 'not' ? NOT(V(bName)) : V(bName)
  const target = op === 'and' ? AND(V(aName), right) : OR(V(aName), right)
  return {
    build: (choices) => {
      const o = choices[0] as Op
      const u = choices[1] as UnaryFlag
      const r: Expr = u === 'not' ? NOT(V(bName)) : V(bName)
      return o === 'and' ? AND(V(aName), r) : OR(V(aName), r)
    },
    holes: ['op', 'unary'],
    target,
    description: `Bulb should light when ${describe(target)}`,
  }
}

// Hard: 2 binary holes — (A ?1 B) ?2 C
function hardPuzzle(aName: string, bName: string, cName: string): Puzzle {
  const op1: Op = Math.random() < 0.5 ? 'and' : 'or'
  const op2: Op = Math.random() < 0.5 ? 'and' : 'or'
  // avoid degenerate (both same) — ok, still valid
  const inner: Expr = op1 === 'and' ? AND(V(aName), V(bName)) : OR(V(aName), V(bName))
  const target = op2 === 'and' ? AND(inner, V(cName)) : OR(inner, V(cName))
  return {
    build: (choices) => {
      const o1 = choices[0] as Op
      const o2 = choices[1] as Op
      const inn: Expr = o1 === 'and' ? AND(V(aName), V(bName)) : OR(V(aName), V(bName))
      return o2 === 'and' ? AND(inn, V(cName)) : OR(inn, V(cName))
    },
    holes: ['op', 'op'],
    target,
    description: `Bulb should light when ${describe(target)}`,
  }
}

function buildPuzzle(level: 'easy' | 'medium' | 'hard'): Puzzle {
  if (level === 'easy') {
    return Math.random() < 0.5 ? easyOpBetween('A', 'B') : easyNotThenOp('A', 'B')
  }
  if (level === 'medium') return mediumPuzzle('A', 'B')
  return hardPuzzle('A', 'B', 'C')
}

const STAR: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: 'starters', medium: 'movers', hard: 'flyers',
}
const ROUND_COUNT = 5

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

function HoleButton({
  kind,
  value,
  onClick,
  wrong,
  revealed,
}: {
  kind: 'op' | 'unary'
  value: Op | UnaryFlag | null
  onClick: () => void
  wrong?: boolean
  revealed?: Op | UnaryFlag
}) {
  const shown = value ?? '?'
  const label = shown === 'id' ? '(no NOT)' : shown.toUpperCase()
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-2 rounded-lg border-2 font-extrabold text-white text-sm transition-all active:scale-95 touch-manipulation min-w-[80px]',
        value === null && 'bg-muted border-dashed border-muted-foreground text-muted-foreground',
        value !== null && kind === 'op' && 'bg-[#59C059] border-[#3a8a3a]',
        value !== null && kind === 'unary' && (value === 'not' ? 'bg-[#59C059] border-[#3a8a3a]' : 'bg-zinc-400 border-zinc-500'),
        wrong && 'ring-4 ring-rose-500/60',
      )}
    >
      {label}
      {wrong && revealed && (
        <div className="text-[10px] font-normal mt-0.5 text-rose-100">(was {revealed === 'id' ? '(no NOT)' : revealed.toUpperCase()})</div>
      )}
    </button>
  )
}

// Render the template with holes filled in as plain blocks / placeholder pills
function RenderTemplate({
  puzzle,
  choices,
  setChoice,
  checked,
}: {
  puzzle: Puzzle
  choices: (Op | UnaryFlag | null)[]
  setChoice: (i: number, v: Op | UnaryFlag) => void
  checked: boolean
}) {
  // We render shapes that match each level's template directly for clarity
  const h = puzzle.holes
  if (h.length === 1 && h[0] === 'op') {
    // A ? B
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <BoolBlock value={true} label="A" size="sm" />
        <HoleButton kind="op" value={choices[0]} onClick={() => cycle(setChoice, 0, choices[0] as Op | null, ['and', 'or'])} />
        <BoolBlock value={true} label="B" size="sm" />
      </div>
    )
  }
  if (h.length === 1 && h[0] === 'unary') {
    // (? A) {fixed op} B → we need to know the fixed op... inferred from target
    const target = puzzle.target
    const op = target.kind === 'and' || target.kind === 'or' ? target.kind : 'and'
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <HoleButton kind="unary" value={choices[0]} onClick={() => cycle(setChoice, 0, choices[0] as UnaryFlag | null, ['id', 'not'])} />
        <BoolBlock value={true} label="A" size="sm" />
        <span className="px-2 py-1.5 rounded-md bg-[#59C059] text-white font-bold text-sm uppercase">{op}</span>
        <BoolBlock value={true} label="B" size="sm" />
      </div>
    )
  }
  if (h.length === 2 && h[0] === 'op' && h[1] === 'unary') {
    // A [op] ([not?] B)
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <BoolBlock value={true} label="A" size="sm" />
        <HoleButton kind="op" value={choices[0]} onClick={() => cycle(setChoice, 0, choices[0] as Op | null, ['and', 'or'])} />
        <HoleButton kind="unary" value={choices[1]} onClick={() => cycle(setChoice, 1, choices[1] as UnaryFlag | null, ['id', 'not'])} />
        <BoolBlock value={true} label="B" size="sm" />
      </div>
    )
  }
  // hard: (A [op1] B) [op2] C
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-muted-foreground font-bold">(</span>
      <BoolBlock value={true} label="A" size="sm" />
      <HoleButton kind="op" value={choices[0]} onClick={() => cycle(setChoice, 0, choices[0] as Op | null, ['and', 'or'])} />
      <BoolBlock value={true} label="B" size="sm" />
      <span className="text-muted-foreground font-bold">)</span>
      <HoleButton kind="op" value={choices[1]} onClick={() => cycle(setChoice, 1, choices[1] as Op | null, ['and', 'or'])} />
      <BoolBlock value={true} label="C" size="sm" />
    </div>
  )

  function cycle<T extends string>(
    setter: (i: number, v: Op | UnaryFlag) => void,
    i: number,
    cur: T | null,
    options: T[],
  ) {
    if (checked) return
    const idx = cur === null ? -1 : options.indexOf(cur)
    const nxt = options[(idx + 1) % options.length]
    setter(i, nxt as unknown as Op | UnaryFlag)
  }
}

export function BlockBuilder({ level, onExit }: { level: 'easy' | 'medium' | 'hard'; onExit: () => void }) {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => buildPuzzle(level))
  const [choices, setChoices] = useState<(Op | UnaryFlag | null)[]>(() => puzzle.holes.map(() => null))
  const [checked, setChecked] = useState(false)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const { record, reset } = useRecordGame()

  const filled = choices.every(c => c !== null)

  let correct = false
  let builtExpr: Expr | null = null
  if (filled) {
    builtExpr = puzzle.build(choices as (Op | UnaryFlag)[])
    const vars = variables(builtExpr)
    correct = allAssignments(vars).every(env => evalExpr(builtExpr!, env) === evalExpr(puzzle.target, env))
  }

  const setChoice = (i: number, v: Op | UnaryFlag) => {
    if (checked) return
    setChoices(prev => {
      const copy = prev.slice()
      copy[i] = v
      return copy
    })
  }

  const submit = () => {
    setChecked(true)
    if (correct) setScore(s => s + 1)
  }

  const next = () => {
    if (round + 1 >= ROUND_COUNT) {
      setDone(true)
      record(STAR[level], 'block-builder')
    } else {
      const p = buildPuzzle(level)
      setPuzzle(p)
      setChoices(p.holes.map(() => null))
      setChecked(false)
      setRound(r => r + 1)
    }
  }

  const restart = () => {
    reset()
    const p = buildPuzzle(level)
    setPuzzle(p)
    setChoices(p.holes.map(() => null))
    setChecked(false)
    setRound(0)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto">
        <Trophy className="size-16 text-amber-500" />
        <h2 className="text-3xl font-extrabold">Block Builder!</h2>
        <p className="text-lg text-muted-foreground">Correct builds: {score}/{ROUND_COUNT}</p>
        <div className="flex gap-2">
          <Button onClick={restart}><RotateCcw className="size-4" />Play again</Button>
          <Button variant="outline" onClick={onExit}>Back</Button>
        </div>
      </div>
    )
  }

  // Truth table for the target (to help kid verify)
  const targetVars = variables(puzzle.target)
  const rows = allAssignments(targetVars)

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

      <div className="flex items-center justify-center gap-2 max-w-md">
        <Speaker text={`Block Builder. Tap the question mark blocks to pick operators. Match the target: ${speakExpr(puzzle.target)}.`} />
        <p className="text-sm text-muted-foreground text-center">
          Tap the <span className="font-bold">?</span> blocks to pick operators. Match the target below 🔧
        </p>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground font-bold">YOUR BLOCK</span>
        <RenderTemplate puzzle={puzzle} choices={choices} setChoice={setChoice} checked={checked} />
      </div>

      <div className="p-4 rounded-xl bg-card border border-border flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground font-bold">TARGET</span>
        <p className="text-sm text-center font-medium">{puzzle.description}</p>
        <table className="font-mono text-xs border-separate border-spacing-0 mt-1">
          <thead>
            <tr className="bg-[#59C059] text-white">
              {targetVars.map(v => <th key={v} className="px-2 py-1 border border-[#3a8a3a]">{v}</th>)}
              <th className="px-2 py-1 border border-[#3a8a3a]">💡</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((env, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-muted/50' : ''}>
                {targetVars.map(v => (
                  <td key={v} className="px-2 py-1 border border-border text-center">{env[v] ? 'on' : 'off'}</td>
                ))}
                <td className={cn('px-2 py-1 border border-border text-center font-bold', evalExpr(puzzle.target, env) ? 'text-emerald-600' : 'text-rose-500')}>
                  {evalExpr(puzzle.target, env) ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!checked && (
        <Button size="lg" onClick={submit} disabled={!filled}>
          Check <Check className="size-4" />
        </Button>
      )}
      {checked && (
        <div className="flex flex-col items-center gap-3">
          <div className={cn('flex items-center gap-2 font-bold text-base', correct ? 'text-emerald-600' : 'text-rose-500')}>
            {correct
              ? <><Check className="size-5" /> Perfect match!</>
              : <><X className="size-5" /> Not quite — target shown:</>
            }
          </div>
          {!correct && builtExpr && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Answer:</span>
              <RenderExpr e={puzzle.target} />
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

