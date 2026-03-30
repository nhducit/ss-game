import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Grid3X3, Hash, Circle, Disc, SquareDot, CircleDot, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PASSWORD = '88664422'

const games = [
  {
    id: 'caro',
    title: 'Caro (Gomoku)',
    description: 'Get 5 in a row on a 30x30 board',
    icon: Hash,
    to: '/caro' as const,
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic 3x3 — get 3 in a row',
    icon: Grid3X3,
    to: '/tic-tac-toe' as const,
  },
  {
    id: 'o-an-quan',
    title: 'Ô Ăn Quan',
    description: 'Vietnamese mancala — capture stones',
    icon: Circle,
    to: '/o-an-quan' as const,
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    description: 'Drop discs, get 4 in a row',
    icon: Disc,
    to: '/connect-four' as const,
  },
  {
    id: 'dots-and-boxes',
    title: 'Dots & Boxes',
    description: 'Draw lines, complete boxes to score',
    icon: SquareDot,
    to: '/dots-and-boxes' as const,
  },
  {
    id: 'reversi',
    title: 'Reversi',
    description: 'Flip discs by outflanking — Othello',
    icon: CircleDot,
    to: '/reversi' as const,
  },
]

export function GamesMenu() {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASSWORD) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (!unlocked) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
        <Lock className="size-12 text-muted-foreground" />
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Enter password</h1>
          <p className="mt-1 text-sm text-muted-foreground">These games require a password to play</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-full max-w-xs">
          <input
            type="password"
            inputMode="numeric"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            placeholder="Password"
            className={
              `w-full text-center text-2xl tracking-[0.3em] font-mono px-4 py-3 rounded-lg border-2 bg-background outline-none transition-colors` +
              (error ? ' border-red-500' : ' border-input focus:border-primary')
            }
            autoFocus
          />
          {error && <p className="text-sm text-red-500">Wrong password</p>}
          <Button type="submit" className="w-full" disabled={input.length === 0}>
            Unlock
          </Button>
        </form>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Board Games</h1>
        <p className="mt-1 text-muted-foreground">Pick a game to play</p>
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
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        &larr; Back to home
      </Link>
    </div>
  )
}
