import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react'
import { shuffle, getWords, type Category, type Level, type Word } from '@/games/english/words'
import { speak } from '@/games/english/speak'
import { CategoryPicker } from '@/games/english/CategoryPicker'
import { recordCorrect, getSmartWordOrder } from '@/games/english/progress'

interface MatchCard {
  id: number
  word: Word
  type: 'emoji' | 'word'
  matched: boolean
}

type Screen = 'categories' | 'playing' | 'results'

const PAIR_COUNT = 6

export function WordMatch() {
  const [screen, setScreen] = useState<Screen>('categories')
  const [category, setCategory] = useState<Category | null>(null)
  const [level, setLevel] = useState<Level>('starters')
  const [cards, setCards] = useState<MatchCard[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)

  const startCategory = useCallback((cat: Category, lvl: Level) => {
    const levelWords = getWords(cat, lvl)
    const selectedWords = getSmartWordOrder(cat.id, lvl, levelWords).slice(0, PAIR_COUNT)
    const cardPairs: MatchCard[] = []
    selectedWords.forEach((word, i) => {
      cardPairs.push({ id: i * 2, word, type: 'emoji', matched: false })
      cardPairs.push({ id: i * 2 + 1, word, type: 'word', matched: false })
    })
    setCategory(cat)
    setLevel(lvl)
    setCards(shuffle(cardPairs))
    setFlipped([])
    setLocked(false)
    setMoves(0)
    setMatches(0)
    setScreen('playing')
  }, [])

  const handleCardClick = useCallback((index: number) => {
    if (locked) return
    const card = cards[index]
    if (card.matched || flipped.includes(index)) return

    if (card.type === 'word') {
      speak(card.word.english)
    }

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      setLocked(true)
      const [first, second] = newFlipped
      const card1 = cards[first]
      const card2 = cards[second]

      if (card1.word.english === card2.word.english && card1.type !== card2.type) {
        speak(card1.word.english, 0.8)
        recordCorrect(category!.id, level, card1.word.english)
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === first || i === second ? { ...c, matched: true } : c
          ))
          setFlipped([])
          setLocked(false)
          setMatches(m => m + 1)
        }, 600)
      } else {
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 1000)
      }
    }
  }, [cards, flipped, locked])

  useEffect(() => {
    if (matches === PAIR_COUNT && matches > 0) {
      setTimeout(() => setScreen('results'), 500)
    }
  }, [matches])

  if (screen === 'categories') {
    return (
      <CategoryPicker
        title="Word Match 🧠"
        subtitle="Match emoji with words"
        onSelect={startCategory}
      />
    )
  }

  if (screen === 'results') {
    const stars = moves <= PAIR_COUNT + 2 ? 3 : moves <= PAIR_COUNT * 2 ? 2 : 1
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
        <div className="text-6xl animate-bounce">
          <Trophy className="size-16 text-yellow-500" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {stars === 3 ? 'Amazing! 🌟🌟🌟' : stars === 2 ? 'Great job! 🌟🌟' : 'Well done! 🌟'}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {category?.name}
          </p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-foreground">{moves}</span>
            <span className="text-sm text-muted-foreground">Moves</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-foreground">{PAIR_COUNT}</span>
            <span className="text-sm text-muted-foreground">Pairs</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => startCategory(category!, level)}>
            <RotateCcw className="size-4 mr-2" /> Play again
          </Button>
          <Button onClick={() => setScreen('categories')}>
            Other topics
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="game flex flex-col h-svh overflow-hidden">
      <div className="game-nav flex items-center justify-between px-4 h-13 shrink-0 border-b-2 border-border">
        <div className="flex items-center gap-3.5">
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" onClick={() => setScreen('categories')} />}
            >
              <ArrowLeft className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Back</TooltipContent>
          </Tooltip>
          <h1 className="hidden sm:block text-lg font-extrabold tracking-tight text-foreground m-0">
            {category?.emoji} {category?.name}
          </h1>
          <Badge variant="secondary" className="gap-1.5 font-bold tabular-nums">
            Moves: {moves}
          </Badge>
          <Badge variant="outline" className="gap-1.5 font-bold tabular-nums">
            {matches}/{PAIR_COUNT}
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-lg">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || card.matched
            return (
              <button
                key={card.id}
                className={
                  `match-card relative aspect-square rounded-xl border-2 text-center font-bold transition-all duration-300 touch-manipulation select-none` +
                  (card.matched
                    ? ' border-green-500 bg-green-50 dark:bg-green-950 scale-95 opacity-70'
                    : isFlipped
                      ? ' border-primary bg-muted'
                      : ' border-muted-foreground/20 bg-foreground text-background hover:scale-105 active:scale-95 cursor-pointer shadow-md')
                }
                onClick={() => handleCardClick(index)}
                disabled={card.matched || locked}
              >
                {isFlipped ? (
                  card.type === 'emoji' ? (
                    <span className="text-3xl sm:text-4xl">{card.word.emoji}</span>
                  ) : (
                    <span className="text-base sm:text-lg px-1">{card.word.english}</span>
                  )
                ) : (
                  <span className="text-2xl">?</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
