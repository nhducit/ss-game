import { Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, Brain, Ear, Puzzle, Skull, Blocks } from 'lucide-react'
import { levels } from '@/games/english/words'
import { levels as chineseLevels } from '@/games/chinese/words'
import { useLevel } from '@/games/english/use-level'
import { useChineseLevel } from '@/games/chinese/use-level'

const englishGames = [
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
  {
    id: 'sentence-builder',
    title: 'Sentence Builder 📝',
    description: 'Build sentences word by word',
    icon: Puzzle,
    to: '/sentence-builder' as const,
  },
  {
    id: 'hangman',
    title: 'Hangman 🪢',
    description: 'Guess the word letter by letter',
    icon: Skull,
    to: '/hangman' as const,
  },
]

const codingGames = [
  {
    id: 'logic',
    title: 'Scratch Logic 🧩',
    description: 'AND · OR · NOT — learn & play',
    icon: Blocks,
    to: '/logic' as const,
  },
]

const chineseGames = [
  {
    id: 'pinyin-spell',
    title: 'Pinyin Spell 拼音',
    description: 'Listen & spell the pinyin',
    icon: BookOpen,
    to: '/pinyin-spell' as const,
  },
  {
    id: 'character-match',
    title: 'Character Match 🀄',
    description: 'Match characters to pictures',
    icon: Brain,
    to: '/character-match' as const,
  },
  {
    id: 'chinese-listen-pick',
    title: 'Listen & Pick 听一听',
    description: 'Hear a word, pick the picture',
    icon: Ear,
    to: '/chinese-listen-pick' as const,
  },
]

function LevelPills({ levels: lvls, current, onChange }: {
  levels: { id: string; name: string; emoji: string }[]
  current: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex gap-2">
      {lvls.map((l) => (
        <button
          key={l.id}
          onClick={() => onChange(l.id)}
          className={
            `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all touch-manipulation` +
            (current === l.id
              ? ' bg-foreground text-background shadow-md'
              : ' bg-muted text-muted-foreground hover:bg-muted/80')
          }
        >
          <span>{l.emoji}</span>
          <span>{l.name}</span>
        </button>
      ))}
    </div>
  )
}

function GameGrid({ games }: { games: { id: string; title: string; description: string; icon: React.ComponentType<{ className?: string }>; to: string }[] }) {
  return (
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
  )
}

export function Menu() {
  const [engLevel, setEngLevel] = useLevel()
  const [chnLevel, setChnLevel] = useChineseLevel()

  return (
    <div className="flex min-h-svh flex-col items-center gap-8 p-6 pt-2">
      {/* English section */}
      <section className="flex flex-col items-center gap-5 w-full">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">English 🇬🇧</h2>
        </div>
        <LevelPills levels={levels} current={engLevel} onChange={(id) => setEngLevel(id as typeof engLevel)} />
        <GameGrid games={englishGames} />
      </section>

      {/* Coding section */}
      <section className="flex flex-col items-center gap-5 w-full">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Coding 🧑‍💻</h2>
        </div>
        <GameGrid games={codingGames} />
      </section>

      {/* Chinese section */}
      <section className="flex flex-col items-center gap-5 w-full">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Chinese 🇨🇳</h2>
        </div>
        <LevelPills levels={chineseLevels} current={chnLevel} onChange={(id) => setChnLevel(id as typeof chnLevel)} />
        <GameGrid games={chineseGames} />
      </section>

      <p className="text-xs text-muted-foreground/50 mt-4 pb-6">
        Updated {new Date(__COMMIT_TIME__).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
      </p>
    </div>
  )
}
