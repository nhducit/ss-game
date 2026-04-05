import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, Brain, Ear, Puzzle, Skull } from 'lucide-react'
import { levels } from '@/games/english/words'
import { levels as chineseLevels } from '@/games/chinese/words'
import { useLevel } from '@/games/english/use-level'
import { useChineseLevel } from '@/games/chinese/use-level'
import { getStreak, getGamification, getPlayerLevel, ALL_ACHIEVEMENTS } from '@/games/gamification'

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

function GamificationBar() {
  const [data, setData] = useState({ streak: 0, stars: 0, achievements: [] as string[] })

  useEffect(() => {
    const s = getStreak()
    const g = getGamification()
    setData({ streak: s.currentStreak, stars: g.totalStars, achievements: g.achievements })
  }, [])

  const lvl = getPlayerLevel(data.stars)

  if (data.stars === 0 && data.streak === 0) return null

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {data.streak > 0 && (
          <div className="flex items-center gap-1.5 text-sm font-bold text-orange-500">
            🔥 {data.streak} day{data.streak !== 1 ? 's' : ''}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          {lvl.emoji} {lvl.name}
        </div>
        <div className="text-sm text-muted-foreground tabular-nums">
          ⭐ {data.stars} stars
        </div>
      </div>
      {lvl.nextLevel && (
        <div className="flex items-center gap-2 w-full max-w-xs">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.round(lvl.progress * 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">{lvl.nextLevel.emoji} {lvl.nextLevel.name}</span>
        </div>
      )}
      {data.achievements.length > 0 && (
        <div className="flex gap-1.5 flex-wrap justify-center">
          {data.achievements.map(id => {
            const a = ALL_ACHIEVEMENTS.find(a => a.id === id)
            return a ? (
              <span key={id} className="text-lg" title={`${a.name}: ${a.description}`}>
                {a.emoji}
              </span>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

export function Menu() {
  const [engLevel, setEngLevel] = useLevel()
  const [chnLevel, setChnLevel] = useChineseLevel()

  return (
    <div className="flex min-h-svh flex-col items-center gap-10 p-6 pt-12">
      {/* Gamification stats */}
      <GamificationBar />

      {/* English section */}
      <section className="flex flex-col items-center gap-5 w-full">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">English 🇬🇧</h2>
        </div>
        <LevelPills levels={levels} current={engLevel} onChange={(id) => setEngLevel(id as typeof engLevel)} />
        <GameGrid games={englishGames} />
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
