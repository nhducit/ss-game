import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { BoolBlock, OperatorBlock } from './blocks'
import { ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecordGame } from '@/games/useRecordGame'
import type { DifficultyLevel } from '@/games/gamification'
import { AND, OR, NOT, V, evalExpr, variables, allAssignments, speakExpr, type Expr } from './expr'
import { Speaker } from './Speaker'

const EASY: Expr[] = [
  AND(V('A'), V('B')),
  OR(V('A'), V('B')),
  NOT(V('A')),
  AND(V('A'), NOT(V('B'))),
]
const MEDIUM: Expr[] = [
  OR(V('A'), NOT(V('B'))),
  AND(NOT(V('A')), V('B')),
  OR(AND(V('A'), V('B')), V('C')),
  AND(OR(V('A'), V('B')), V('C')),
  NOT(AND(V('A'), V('B'))),
]
const HARD: Expr[] = [
  AND(OR(V('A'), V('B')), NOT(V('C'))),
  OR(NOT(V('A')), AND(V('B'), V('C'))),
  OR(AND(V('A'), V('B')), AND(NOT(V('A')), V('C'))),
  AND(OR(V('A'), NOT(V('B'))), OR(V('B'), V('C'))),
]

const POOLS = { easy: EASY, medium: MEDIUM, hard: HARD }
const STAR: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: 'starters', medium: 'movers', hard: 'flyers',
}

type Cell = boolean | null
const ROUND_COUNT = 4

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

function pickExpr(list: Expr[], exclude?: Expr): Expr {
  let e = list[Math.floor(Math.random() * list.length)]
  if (exclude && list.length > 1) {
    while (JSON.stringify(e) === JSON.stringify(exclude)) {
      e = list[Math.floor(Math.random() * list.length)]
    }
  }
  return e
}

export function TruthFill({ level, onExit }: { level: 'easy' | 'medium' | 'hard'; onExit: () => void }) {
  const pool = POOLS[level]
  const [initial] = useState(() => pickExpr(pool))
  const [expr, setExpr] = useState<Expr>(initial)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Cell[]>(() => new Array(1 << variables(initial).length).fill(null))
  const [checked, setChecked] = useState(false)
  const [done, setDone] = useState(false)
  const { record, reset } = useRecordGame()

  const vars = useMemo(() => variables(expr), [expr])
  const rows = useMemo(() => allAssignments(vars), [vars])
  const correctOutputs = useMemo(() => rows.map(env => evalExpr(expr, env)), [rows, expr])

  const cycle = (i: number) => {
    if (checked) return
    setAnswers(a => {
      const copy = a.slice()
      const cur = copy[i]
      copy[i] = cur === null ? true : cur === true ? false : null
      return copy
    })
  }

  const filled = answers.every(a => a !== null)
  const allCorrect = answers.every((a, i) => a === correctOutputs[i])

  const submit = () => {
    setChecked(true)
    if (allCorrect) setScore(s => s + 1)
  }

  const next = () => {
    if (round + 1 >= ROUND_COUNT) {
      setDone(true)
      record(STAR[level], 'truth-fill')
    } else {
      const e = pickExpr(pool, expr)
      setExpr(e)
      setAnswers(new Array(allAssignments(variables(e)).length).fill(null))
      setChecked(false)
      setRound(r => r + 1)
    }
  }

  const restart = () => {
    reset()
    const e = pickExpr(pool)
    setExpr(e)
    setAnswers(new Array(allAssignments(variables(e)).length).fill(null))
    setChecked(false)
    setRound(0)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto">
        <Trophy className="size-16 text-amber-500" />
        <h2 className="text-3xl font-extrabold">Table Tamer!</h2>
        <p className="text-lg text-muted-foreground">Perfect tables: {score}/{ROUND_COUNT}</p>
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

      <div className="flex items-center justify-center gap-2">
        <Speaker text={`Truth Fill. Fill in the output for each row. The expression is: ${speakExpr(expr)}.`} />
        <p className="text-sm text-muted-foreground text-center">Fill in the bulb column — tap a cell to toggle on/off 💡</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 py-2">
        <RenderExpr e={expr} />
      </div>

      <div className="overflow-x-auto">
        <table className="mx-auto font-mono text-sm border-separate border-spacing-0 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#59C059] text-white">
              {vars.map(v => (
                <th key={v} className="px-4 py-2 border border-[#3a8a3a]">{v}</th>
              ))}
              <th className="px-4 py-2 border border-[#3a8a3a]">💡 output</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((env, i) => {
              const ans = answers[i]
              const correct = correctOutputs[i]
              const wasRight = checked && ans === correct
              const wasWrong = checked && ans !== null && ans !== correct
              const missed = checked && ans === null
              return (
                <tr key={i} className={i % 2 === 0 ? 'bg-muted/50' : ''}>
                  {vars.map(v => (
                    <td key={v} className="px-3 py-2 border border-border text-center">
                      <BoolBlock value={env[v]} label={v} size="sm" />
                    </td>
                  ))}
                  <td className="px-3 py-2 border border-border text-center">
                    <button
                      type="button"
                      onClick={() => cycle(i)}
                      disabled={checked}
                      className={cn(
                        'min-w-[110px] px-3 py-2 rounded-lg border-2 font-bold transition-all active:scale-95 touch-manipulation',
                        !checked && ans === null && 'bg-muted border-dashed border-border text-muted-foreground hover:border-primary',
                        !checked && ans === true && 'bg-amber-100 border-amber-500 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
                        !checked && ans === false && 'bg-zinc-200 border-zinc-500 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
                        wasRight && 'bg-emerald-500 border-emerald-600 text-white',
                        wasWrong && 'bg-rose-500 border-rose-600 text-white',
                        missed && 'bg-amber-100 border-amber-500 text-amber-900',
                      )}
                    >
                      {ans === null ? '?' : ans ? 'on ✨' : 'off'}
                      {wasWrong && <div className="text-[10px] font-normal mt-0.5">was {correct ? 'on' : 'off'}</div>}
                      {missed && <div className="text-[10px] font-normal mt-0.5">{correct ? 'on' : 'off'}</div>}
                    </button>
                  </td>
                </tr>
              )
            })}
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
          <div className={cn('flex items-center gap-2 font-bold text-base', allCorrect ? 'text-emerald-600' : 'text-rose-500')}>
            {allCorrect ? <><Check className="size-5" /> All correct!</> : <><X className="size-5" /> Some rows were off</>}
          </div>
          <Button size="lg" onClick={next}>
            {round + 1 >= ROUND_COUNT ? '🏁 Finish' : 'Next'} <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
