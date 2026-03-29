import { Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Grid3X3, Hash, Circle, Disc, SquareDot, CircleDot } from 'lucide-react'

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

export function Menu() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Games</h1>
        <p className="mt-1 text-muted-foreground">Pick a game to play</p>
      </div>
      <div className="grid w-full max-w-md gap-3">
        {games.map((game) => (
          <Link key={game.id} to={game.to} className="no-underline">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex-row items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <game.icon className="size-5 text-foreground" />
                </div>
                <div>
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
