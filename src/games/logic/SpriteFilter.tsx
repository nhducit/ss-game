import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { OperatorBlock } from './blocks'
import { RotateCcw, Trophy, Check, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecordGame } from '@/games/useRecordGame'
import type { DifficultyLevel } from '@/games/gamification'
import { Speaker } from './Speaker'

type Color = 'red' | 'blue' | 'yellow'
type Shape = 'star' | 'heart' | 'circle'
type Size = 'big' | 'small'

interface Sprite {
  id: number
  color: Color
  shape: Shape
  size: Size
}

type Condition =
  | { kind: 'prop'; prop: 'color' | 'shape' | 'size'; val: string }
  | { kind: 'not'; c: Condition }
  | { kind: 'and'; a: Condition; b: Condition }
  | { kind: 'or'; a: Condition; b: Condition }

function speakCondition(c: Condition): string {
  if (c.kind === 'prop') return `${c.val}`
  if (c.kind === 'not') {
    return c.c.kind === 'prop' ? `not ${c.c.val}` : `not, ${speakCondition(c.c)}`
  }
  const joiner = c.kind === 'and' ? 'and' : 'or'
  return `${speakCondition(c.a)}, ${joiner}, ${speakCondition(c.b)}`
}

function matches(c: Condition, s: Sprite): boolean {
  if (c.kind === 'prop') return (s as unknown as Record<string, string>)[c.prop] === c.val
  if (c.kind === 'not') return !matches(c.c, s)
  if (c.kind === 'and') return matches(c.a, s) && matches(c.b, s)
  return matches(c.a, s) || matches(c.b, s)
}

function PropPill({ emoji, label }: { emoji: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF8C1A] text-white font-bold text-sm shadow-sm">
      <span className="text-base">{emoji}</span>
      <span>{label}</span>
    </span>
  )
}

function RenderCondition({ c }: { c: Condition }) {
  if (c.kind === 'prop') {
    const emoji = c.prop === 'color' ? colorEmoji(c.val as Color) : c.prop === 'shape' ? shapeEmoji(c.val as Shape) : c.val === 'big' ? '📏' : '📐'
    return <PropPill emoji={emoji} label={c.val} />
  }
  if (c.kind === 'not') {
    return <OperatorBlock op="not"><RenderCondition c={c.c} /></OperatorBlock>
  }
  return (
    <OperatorBlock op={c.kind}>
      <RenderCondition c={c.a} />
      <RenderCondition c={c.b} />
    </OperatorBlock>
  )
}

function colorEmoji(c: Color): string {
  return c === 'red' ? '🔴' : c === 'blue' ? '🔵' : '🟡'
}
function shapeEmoji(s: Shape): string {
  return s === 'star' ? '⭐' : s === 'heart' ? '❤️' : '⚪'
}

function SpriteTile({ sprite, selected, onClick, lockedShow }: { sprite: Sprite; selected: boolean; onClick: () => void; lockedShow: 'good' | 'missed' | 'bad' | 'ok' | null }) {
  const colorClass = sprite.color === 'red' ? 'text-rose-500' : sprite.color === 'blue' ? 'text-sky-500' : 'text-amber-400'
  const sizeClass = sprite.size === 'big' ? 'text-6xl' : 'text-3xl'
  const shapeChar = sprite.shape === 'star' ? '★' : sprite.shape === 'heart' ? '♥' : '●'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={lockedShow !== null}
      className={cn(
        'relative flex items-center justify-center rounded-2xl border-4 transition-all aspect-square touch-manipulation',
        'bg-white dark:bg-zinc-900',
        lockedShow === null && (selected ? 'border-primary ring-4 ring-primary/30 scale-105' : 'border-border hover:border-primary/50 active:scale-95'),
        lockedShow === 'good' && 'border-emerald-500 ring-4 ring-emerald-500/40',
        lockedShow === 'missed' && 'border-amber-500 ring-4 ring-amber-500/40',
        lockedShow === 'bad' && 'border-rose-500 ring-4 ring-rose-500/40',
        lockedShow === 'ok' && 'border-border opacity-50',
      )}
    >
      <span className={cn(colorClass, sizeClass, 'drop-shadow')}>{shapeChar}</span>
      {lockedShow === 'good' && <Check className="absolute top-1 right-1 size-5 text-emerald-600" />}
      {lockedShow === 'bad' && <X className="absolute top-1 right-1 size-5 text-rose-600" />}
      {lockedShow === 'missed' && <span className="absolute top-1 right-1 text-xs font-bold text-amber-600">missed</span>}
    </button>
  )
}

function randomSprite(id: number): Sprite {
  const colors: Color[] = ['red', 'blue', 'yellow']
  const shapes: Shape[] = ['star', 'heart', 'circle']
  const sizes: Size[] = ['big', 'small']
  return {
    id,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    size: sizes[Math.floor(Math.random() * sizes.length)],
  }
}

function randomCondition(level: 'easy' | 'medium' | 'hard'): Condition {
  const prop = (): Condition => {
    const kinds: ('color' | 'shape' | 'size')[] = ['color', 'shape', 'size']
    const p = kinds[Math.floor(Math.random() * kinds.length)]
    if (p === 'color') return { kind: 'prop', prop: 'color', val: ['red', 'blue', 'yellow'][Math.floor(Math.random() * 3)] }
    if (p === 'shape') return { kind: 'prop', prop: 'shape', val: ['star', 'heart', 'circle'][Math.floor(Math.random() * 3)] }
    return { kind: 'prop', prop: 'size', val: ['big', 'small'][Math.floor(Math.random() * 2)] }
  }
  const distinct = (a: Condition, b: Condition) => JSON.stringify(a) !== JSON.stringify(b)

  if (level === 'easy') {
    if (Math.random() < 0.25) return { kind: 'not', c: prop() }
    return prop()
  }
  if (level === 'medium') {
    const pick = Math.random()
    const a = prop()
    let b = prop()
    let tries = 0
    while (!distinct(a, b) && tries++ < 10) b = prop()
    if (pick < 0.4) return { kind: 'and', a, b }
    if (pick < 0.75) return { kind: 'or', a, b }
    if (pick < 0.9) return { kind: 'and', a, b: { kind: 'not', c: b } }
    return { kind: 'or', a, b: { kind: 'not', c: b } }
  }
  // hard: 3-term combos
  const p = [prop(), prop(), prop()]
  const patterns = [
    { kind: 'and' as const, a: { kind: 'or' as const, a: p[0], b: p[1] }, b: { kind: 'not' as const, c: p[2] } },
    { kind: 'or' as const, a: { kind: 'and' as const, a: p[0], b: p[1] }, b: p[2] },
    { kind: 'and' as const, a: p[0], b: { kind: 'or' as const, a: p[1], b: { kind: 'not' as const, c: p[2] } } },
    { kind: 'or' as const, a: { kind: 'not' as const, c: p[0] }, b: { kind: 'and' as const, a: p[1], b: p[2] } },
  ]
  return patterns[Math.floor(Math.random() * patterns.length)]
}

function buildGrid(level: 'easy' | 'medium' | 'hard'): { sprites: Sprite[]; condition: Condition } {
  for (let attempt = 0; attempt < 30; attempt++) {
    const sprites = Array.from({ length: 9 }, (_, i) => randomSprite(i))
    const condition = randomCondition(level)
    const hits = sprites.filter(s => matches(condition, s)).length
    if (hits >= 2 && hits <= 6) return { sprites, condition }
  }
  const sprites = Array.from({ length: 9 }, (_, i) => randomSprite(i))
  return { sprites, condition: randomCondition(level) }
}

const ROUND_COUNT = 5
const STAR_LEVEL: Record<'easy' | 'medium' | 'hard', DifficultyLevel> = {
  easy: 'starters',
  medium: 'movers',
  hard: 'flyers',
}

export function SpriteFilter({ level, onExit }: { level: 'easy' | 'medium' | 'hard'; onExit: () => void }) {
  const [round, setRound] = useState(0)
  const [grid, setGrid] = useState(() => buildGrid(level))
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const { record, reset } = useRecordGame()

  const correctIds = useMemo(
    () => new Set(grid.sprites.filter(s => matches(grid.condition, s)).map(s => s.id)),
    [grid],
  )
  const allRight = useMemo(() => {
    if (selected.size !== correctIds.size) return false
    for (const id of correctIds) if (!selected.has(id)) return false
    return true
  }, [selected, correctIds])

  const toggle = useCallback((id: number) => {
    if (checked) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [checked])

  const submit = () => {
    if (checked) return
    setChecked(true)
    if (allRight) setScore(s => s + 1)
  }

  const next = () => {
    if (round + 1 >= ROUND_COUNT) {
      setDone(true)
      record(STAR_LEVEL[level], 'sprite-filter')
    } else {
      setGrid(buildGrid(level))
      setSelected(new Set())
      setChecked(false)
      setRound(r => r + 1)
    }
  }

  const restart = () => {
    reset()
    setGrid(buildGrid(level))
    setSelected(new Set())
    setChecked(false)
    setRound(0)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto">
        <Trophy className="size-16 text-amber-500" />
        <h2 className="text-3xl font-extrabold">Filter Pro!</h2>
        <p className="text-lg text-muted-foreground">Perfect picks: {score}/{ROUND_COUNT}</p>
        <div className="flex gap-2">
          <Button onClick={restart}><RotateCcw className="size-4" />Play again</Button>
          <Button variant="outline" onClick={onExit}>Back</Button>
        </div>
      </div>
    )
  }

  function tileState(s: Sprite): 'good' | 'missed' | 'bad' | 'ok' | null {
    if (!checked) return null
    const wanted = correctIds.has(s.id)
    const picked = selected.has(s.id)
    if (wanted && picked) return 'good'
    if (wanted && !picked) return 'missed'
    if (!wanted && picked) return 'bad'
    return 'ok'
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

      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Speaker text={`Sprite Filter. Tap every sprite that is ${speakCondition(grid.condition)}.`} />
          <p className="text-sm text-muted-foreground">Tap every sprite that matches:</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderCondition c={grid.condition} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
        {grid.sprites.map(s => (
          <SpriteTile
            key={s.id}
            sprite={s}
            selected={selected.has(s.id)}
            lockedShow={tileState(s)}
            onClick={() => toggle(s.id)}
          />
        ))}
      </div>

      {!checked && (
        <Button size="lg" onClick={submit} className="mt-2">
          Check <Check className="size-4" />
        </Button>
      )}
      {checked && (
        <div className="flex flex-col items-center gap-3 mt-2">
          <div className={cn('flex items-center gap-2 font-bold text-base', allRight ? 'text-emerald-600' : 'text-rose-500')}>
            {allRight ? <><Check className="size-5" /> Perfect pick!</> : <><X className="size-5" /> See the markers above</>}
          </div>
          <Button size="lg" onClick={next}>
            {round + 1 >= ROUND_COUNT ? '🏁 Finish' : 'Next'} <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
