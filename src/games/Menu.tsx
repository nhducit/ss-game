import { Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, Brain, Ear } from 'lucide-react'
import { levels } from '@/games/english/words'
import { useLevel } from '@/games/english/use-level'

const games = [
  {
    id: 'spelling-bee',
    title: 'Spelling Bee 🐝',
    description: 'Listen & spell English words',
    icon: BookOpen,
    to: '/spelling-bee' as const,
  },
  {
    id: 'word-match',
    title: 'Word Match 🧠',
    description: 'Flip cards, match emoji to words',
    icon: Brain,
    to: '/word-match' as const,
  },
  {
    id: 'listen-pick',
    title: 'Listen & Pick 👂',
    description: 'Hear a word, pick the picture',
    icon: Ear,
    to: '/listen-pick' as const,
  },
]

export function Menu() {
  const [level, setLevel] = useLevel()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Games</h1>
        <p className="mt-1 text-muted-foreground">Pick a game to play</p>
      </div>

      {/* Level selector */}
      <div className="flex gap-2">
        {levels.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            className={
              `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all touch-manipulation` +
              (level === l.id
                ? ' bg-foreground text-background shadow-md'
                : ' bg-muted text-muted-foreground hover:bg-muted/80')
            }
          >
            <span>{l.emoji}</span>
            <span>{l.name}</span>
          </button>
        ))}
      </div>

      <div className="grid w-full max-w-2xl grid-cols-2 sm:grid-cols-3 gap-3">
        {games.map((game) => (
          <Link key={game.id} to={game.to} className="no-underline">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50 h-full">
              <CardHeader className="flex flex-col items-center text-center gap-2 p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted mx-auto">
                  <game.icon className="size-6 text-foreground" />
                </div>
                <div>
                  <CardTitle className="text-sm">{game.title}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">{game.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      <p className="text-xs text-muted-foreground/50 mt-4">
        Updated {new Date(__COMMIT_TIME__).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
      </p>
    </div>
  )
}
