import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lightbulb, HelpCircle, Shapes, GraduationCap, Table, Equal, Puzzle, Eye, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Learn } from './Learn'
import { LightUp } from './LightUp'
import { GateGuess } from './GateGuess'
import { SpriteFilter } from './SpriteFilter'
import { TruthFill } from './TruthFill'
import { SpotSame } from './SpotSame'
import { BlockBuilder } from './BlockBuilder'
import { BulbQuiz } from './BulbQuiz'
import { OddOneOut } from './OddOneOut'

type View = 'menu' | 'learn' | 'light-up' | 'gate-guess' | 'sprite-filter' | 'truth-fill' | 'spot-same' | 'block-builder' | 'bulb-quiz' | 'odd-one-out'
type Level = 'easy' | 'medium' | 'hard'

const LEVELS: { id: Level; name: string; emoji: string; color: string }[] = [
  { id: 'easy', name: 'Easy', emoji: '🌱', color: 'bg-emerald-500' },
  { id: 'medium', name: 'Medium', emoji: '⚡', color: 'bg-amber-500' },
  { id: 'hard', name: 'Hard', emoji: '🔥', color: 'bg-rose-500' },
]

const ACTIVITIES: { id: Exclude<View, 'menu'>; title: string; description: string; icon: React.ComponentType<{ className?: string }>; accent: string }[] = [
  {
    id: 'learn',
    title: 'Learn 📚',
    description: 'See AND, OR, NOT in action with switches & bulbs',
    icon: GraduationCap,
    accent: 'from-sky-500 to-indigo-500',
  },
  {
    id: 'light-up',
    title: 'Light Up 💡',
    description: 'Flip switches to make the bulb glow',
    icon: Lightbulb,
    accent: 'from-amber-500 to-orange-500',
  },
  {
    id: 'gate-guess',
    title: 'Gate Guess 🔍',
    description: 'Read the truth table, pick the operator',
    icon: HelpCircle,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'sprite-filter',
    title: 'Sprite Filter ⭐',
    description: 'Tap sprites matching a condition',
    icon: Shapes,
    accent: 'from-pink-500 to-fuchsia-500',
  },
  {
    id: 'truth-fill',
    title: 'Truth Fill 📋',
    description: 'Fill the output column row by row',
    icon: Table,
    accent: 'from-violet-500 to-purple-600',
  },
  {
    id: 'spot-same',
    title: 'Spot the Same ⚖️',
    description: 'Are these two blocks always equal?',
    icon: Equal,
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'block-builder',
    title: 'Block Builder 🔧',
    description: 'Fill holes to match the target table',
    icon: Puzzle,
    accent: 'from-lime-500 to-green-600',
  },
  {
    id: 'bulb-quiz',
    title: 'Bulb Quiz 💡',
    description: 'Switches are set — will the bulb light?',
    icon: Eye,
    accent: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'odd-one-out',
    title: 'Odd One Out 🎯',
    description: 'Two blocks always match. Spot the different one',
    icon: Sparkles,
    accent: 'from-rose-500 to-red-500',
  },
]

export function Logic() {
  const [view, setView] = useState<View>('menu')
  const [level, setLevel] = useState<Level>('easy')

  if (view !== 'menu') {
    if (view === 'learn') {
      return (
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="flex items-center justify-between w-full max-w-3xl">
            <Button variant="ghost" size="sm" onClick={() => setView('menu')}>← Back</Button>
            <LevelPills level={level} onChange={setLevel} />
            <div className="w-12" />
          </div>
          <Learn level={level} />
        </div>
      )
    }
    if (view === 'light-up') return <LightUp level={level} onExit={() => setView('menu')} />
    if (view === 'gate-guess') return <GateGuess level={level} onExit={() => setView('menu')} />
    if (view === 'sprite-filter') return <SpriteFilter level={level} onExit={() => setView('menu')} />
    if (view === 'truth-fill') return <TruthFill level={level} onExit={() => setView('menu')} />
    if (view === 'spot-same') return <SpotSame level={level} onExit={() => setView('menu')} />
    if (view === 'block-builder') return <BlockBuilder level={level} onExit={() => setView('menu')} />
    if (view === 'bulb-quiz') return <BulbQuiz level={level} onExit={() => setView('menu')} />
    if (view === 'odd-one-out') return <OddOneOut level={level} onExit={() => setView('menu')} />
  }

  return (
    <div className="flex min-h-svh flex-col items-center gap-6 p-6 pt-2">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Scratch Logic 🧩</h1>
        <p className="mt-1 text-muted-foreground">AND · OR · NOT — learn & play</p>
      </div>

      <LevelPills level={level} onChange={setLevel} />

      <div className="grid w-full max-w-2xl grid-cols-2 sm:grid-cols-3 gap-3">
        {ACTIVITIES.map(a => (
          <button
            key={a.id}
            type="button"
            onClick={() => setView(a.id)}
            className="text-left no-underline"
          >
            <Card className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg h-full overflow-hidden">
              <CardHeader className="flex flex-col items-center text-center gap-2 p-4">
                <div className={cn('flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md', a.accent)}>
                  <a.icon className="size-7" />
                </div>
                <div>
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">{a.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>

      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-4">
        ← Back to home
      </Link>
    </div>
  )
}

function LevelPills({ level, onChange }: { level: Level; onChange: (l: Level) => void }) {
  return (
    <div className="flex gap-2">
      {LEVELS.map(l => (
        <button
          key={l.id}
          type="button"
          onClick={() => onChange(l.id)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all touch-manipulation',
            level === l.id
              ? 'bg-foreground text-background shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          <span>{l.emoji}</span>
          <span>{l.name}</span>
        </button>
      ))}
    </div>
  )
}
