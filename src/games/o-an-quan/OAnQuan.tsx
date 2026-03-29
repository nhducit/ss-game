import { useState, useCallback, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import { ArrowLeft, RotateCcw, MoveLeft, MoveRight } from 'lucide-react'

// ── Board layout ──
// Indices go clockwise around the oval:
//            [0: Quan Left]
//   [1]  [2]  [3]  [4]  [5]      ← Player 1 (top)
//   [11] [10] [9]  [8]  [7]      ← Player 2 (bottom, displayed reversed)
//            [6: Quan Right]

const TOTAL = 12
const QUAN = new Set([0, 6])
const P1_CELLS = [1, 2, 3, 4, 5]
const P2_CELLS = [7, 8, 9, 10, 11]

type Dir = 1 | -1
type Player = 0 | 1

function initBoard(): number[] {
  const b = Array(TOTAL).fill(5)
  b[0] = 10
  b[6] = 10
  return b
}

function wrap(i: number): number {
  return ((i % TOTAL) + TOTAL) % TOTAL
}

function isPlayerCell(idx: number, player: Player): boolean {
  return player === 0 ? idx >= 1 && idx <= 5 : idx >= 7 && idx <= 11
}

function sideEmpty(b: number[], p: Player): boolean {
  return (p === 0 ? P1_CELLS : P2_CELLS).every(i => b[i] === 0)
}

// ── Turn step for animation ──
interface Step {
  type: 'pickup' | 'drop' | 'scoop' | 'capture' | 'done'
  board: number[]
  scores: [number, number]
  highlight?: number
  hand: number
}

function computeTurn(
  initB: number[],
  initS: [number, number],
  cell: number,
  dir: Dir,
  player: Player,
): Step[] {
  const b = [...initB]
  const s: [number, number] = [...initS]
  const steps: Step[] = []

  // Pick up all stones from selected cell
  let hand = b[cell]
  b[cell] = 0
  steps.push({ type: 'pickup', board: [...b], scores: [...s], highlight: cell, hand })

  // Distribute one stone at a time
  let pos = cell
  while (hand > 0) {
    pos = wrap(pos + dir)
    b[pos]++
    hand--
    steps.push({ type: 'drop', board: [...b], scores: [...s], highlight: pos, hand })
  }

  // Post-distribution: scoop / capture / end
  for (;;) {
    const np = wrap(pos + dir)

    // Next is a Quan → turn ends
    if (QUAN.has(np)) break

    // Next has stones → scoop and continue distributing
    if (b[np] > 0) {
      hand = b[np]
      b[np] = 0
      steps.push({ type: 'scoop', board: [...b], scores: [...s], highlight: np, hand })
      pos = np
      while (hand > 0) {
        pos = wrap(pos + dir)
        b[pos]++
        hand--
        steps.push({ type: 'drop', board: [...b], scores: [...s], highlight: pos, hand })
      }
      continue
    }

    // Next is empty → check for capture (empty → occupied pattern)
    const cp = wrap(np + dir)
    if (b[cp] > 0) {
      // Capture!
      s[player] += b[cp]
      b[cp] = 0
      steps.push({ type: 'capture', board: [...b], scores: [...s], highlight: cp, hand: 0 })

      // Chain capture: keep checking empty → occupied
      let chainPos = cp
      for (;;) {
        const ne = wrap(chainPos + dir)
        if (b[ne] !== 0) break // not empty → chain ends
        const nc = wrap(ne + dir)
        if (b[nc] === 0) break // two empties → chain ends
        s[player] += b[nc]
        b[nc] = 0
        steps.push({ type: 'capture', board: [...b], scores: [...s], highlight: nc, hand: 0 })
        chainPos = nc
      }
    }
    break
  }

  steps.push({ type: 'done', board: [...b], scores: [...s], hand: 0 })
  return steps
}

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

// Visual direction mapping:
// P1 (top row 1→5 left to right): visual left = -1, visual right = +1
// P2 (bottom row 11→7 left to right): visual left = +1, visual right = -1
function dirForVisual(player: Player, visual: 'left' | 'right'): Dir {
  if (player === 0) return visual === 'left' ? -1 : 1
  return visual === 'left' ? 1 : -1
}

// Display rows
const TOP_ROW = P1_CELLS                        // [1, 2, 3, 4, 5]
const BOT_ROW = [...P2_CELLS].reverse()          // [11, 10, 9, 8, 7]

export function OAnQuan() {
  const navigate = useNavigate()
  const [board, setBoard] = useState(initBoard)
  const [scores, setScores] = useState<[number, number]>([0, 0])
  const [currentPlayer, setCurrentPlayer] = useState<Player>(0)
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)
  const [highlight, setHighlight] = useState<number | null>(null)
  const [hand, setHand] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const cancelRef = useRef(false)

  const handleCellClick = (idx: number) => {
    if (animating || gameOver) return
    if (!isPlayerCell(idx, currentPlayer)) return
    if (board[idx] === 0) return
    setSelectedCell(idx === selectedCell ? null : idx)
  }

  const playTurn = useCallback(async (visual: 'left' | 'right') => {
    if (selectedCell === null || animating) return
    const cell = selectedCell
    const dir = dirForVisual(currentPlayer, visual)
    setSelectedCell(null)
    setAnimating(true)
    cancelRef.current = false

    const steps = computeTurn(board, scores, cell, dir, currentPlayer)

    for (const step of steps) {
      if (cancelRef.current) break
      const ms =
        step.type === 'drop' ? 100 :
        step.type === 'capture' ? 350 :
        step.type === 'scoop' ? 200 :
        step.type === 'pickup' ? 200 : 0
      if (ms > 0) await wait(ms)
      setBoard(step.board)
      setScores(step.scores)
      setHighlight(step.highlight ?? null)
      setHand(step.hand)
    }

    const final = steps[steps.length - 1]
    const fb = final.board
    const fs = final.scores

    // Check game end: both quan empty
    if (fb[0] === 0 && fb[6] === 0) {
      await wait(400)
      const endScores: [number, number] = [...fs]
      endScores[0] += P1_CELLS.reduce((sum, i) => sum + fb[i], 0)
      endScores[1] += P2_CELLS.reduce((sum, i) => sum + fb[i], 0)
      setBoard(Array(TOTAL).fill(0))
      setScores(endScores)
      setGameOver(true)
    } else {
      const next: Player = currentPlayer === 0 ? 1 : 0

      // If next player's side is empty, they must scatter stones
      if (sideEmpty(fb, next)) {
        if (fs[next] >= 5) {
          const newB = [...fb]
          const newS: [number, number] = [...fs]
          newS[next] -= 5
          const cells = next === 0 ? P1_CELLS : P2_CELLS
          cells.forEach(i => { newB[i] = 1 })
          await wait(300)
          setBoard(newB)
          setScores(newS)
        } else {
          // Can't scatter → game ends, other player collects remaining
          await wait(400)
          const endScores: [number, number] = [...fs]
          for (let i = 0; i < TOTAL; i++) endScores[currentPlayer] += fb[i]
          setBoard(Array(TOTAL).fill(0))
          setScores(endScores)
          setGameOver(true)
        }
      }

      if (!cancelRef.current) setCurrentPlayer(next)
    }

    setHighlight(null)
    setHand(0)
    setAnimating(false)
  }, [selectedCell, animating, board, scores, currentPlayer])

  const resetGame = useCallback(() => {
    cancelRef.current = true
    setBoard(initBoard())
    setScores([0, 0])
    setCurrentPlayer(0)
    setSelectedCell(null)
    setAnimating(false)
    setHighlight(null)
    setHand(0)
    setGameOver(false)
  }, [])

  const p1Color = currentPlayer === 0 && !gameOver
  const p2Color = currentPlayer === 1 && !gameOver

  return (
    <div className="flex flex-col h-svh overflow-hidden bg-background">
      {/* ── Navbar ── */}
      <div className={
        `flex items-center justify-between px-4 h-13 shrink-0 border-b-2 transition-colors duration-300 ` +
        (p1Color ? 'bg-rose-500/10 border-b-rose-500/40' : '') +
        (p2Color ? 'bg-sky-500/10 border-b-sky-500/40' : '') +
        (!p1Color && !p2Color ? 'border-b-border' : '')
      }>
        <div className="flex items-center gap-3.5">
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })} />}>
              <ArrowLeft className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Back to menu</TooltipContent>
          </Tooltip>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground m-0">Ô Ăn Quan</h1>
          <div className="flex items-center gap-1">
            <Badge
              variant={currentPlayer === 0 && !gameOver ? 'secondary' : 'outline'}
              className="gap-1.5 font-bold tabular-nums"
            >
              <span className="inline-block size-2.5 rounded-full bg-rose-500" />
              {scores[0]}
            </Badge>
            <span className="text-muted-foreground">-</span>
            <Badge
              variant={currentPlayer === 1 && !gameOver ? 'secondary' : 'outline'}
              className="gap-1.5 font-bold tabular-nums"
            >
              {scores[1]}
              <span className="inline-block size-2.5 rounded-full bg-sky-500" />
            </Badge>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={resetGame} />}>
            <RotateCcw className="size-4" />
          </TooltipTrigger>
          <TooltipContent>New game</TooltipContent>
        </Tooltip>
      </div>

      {/* ── Board area ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
        {/* Status line */}
        <div className="text-sm font-medium text-muted-foreground h-5">
          {gameOver ? '' : animating ? (
            hand > 0 ? `Distributing... (${hand} in hand)` : 'Playing...'
          ) : selectedCell !== null ? (
            'Choose direction'
          ) : (
            <span className="flex items-center gap-1.5">
              <span className={`inline-block size-2 rounded-full ${currentPlayer === 0 ? 'bg-rose-500' : 'bg-sky-500'}`} />
              Player {currentPlayer + 1}'s turn — tap a cell
            </span>
          )}
        </div>

        {/* Player 1 label */}
        <div className={`text-xs font-semibold uppercase tracking-wider ${p1Color ? 'text-rose-500' : 'text-muted-foreground/50'}`}>
          Player 1
        </div>

        {/* Board */}
        <div className="w-full max-w-sm">
          {/* Quan Top (index 0) */}
          <CellView
            count={board[0]}
            isQuan
            isHighlighted={highlight === 0}
            className="rounded-t-2xl"
          />

          {/* Player 1 row */}
          <div className="grid grid-cols-5">
            {TOP_ROW.map(i => (
              <CellView
                key={i}
                count={board[i]}
                isHighlighted={highlight === i}
                isSelected={selectedCell === i}
                isClickable={!animating && !gameOver && isPlayerCell(i, currentPlayer) && board[i] > 0}
                onClick={() => handleCellClick(i)}
                player={0}
                isActive={p1Color}
              />
            ))}
          </div>

          {/* Player 2 row */}
          <div className="grid grid-cols-5">
            {BOT_ROW.map(i => (
              <CellView
                key={i}
                count={board[i]}
                isHighlighted={highlight === i}
                isSelected={selectedCell === i}
                isClickable={!animating && !gameOver && isPlayerCell(i, currentPlayer) && board[i] > 0}
                onClick={() => handleCellClick(i)}
                player={1}
                isActive={p2Color}
              />
            ))}
          </div>

          {/* Quan Bottom (index 6) */}
          <CellView
            count={board[6]}
            isQuan
            isHighlighted={highlight === 6}
            className="rounded-b-2xl"
          />
        </div>

        {/* Player 2 label */}
        <div className={`text-xs font-semibold uppercase tracking-wider ${p2Color ? 'text-sky-500' : 'text-muted-foreground/50'}`}>
          Player 2
        </div>

        {/* Direction buttons */}
        {selectedCell !== null && !animating && (
          <div className="flex gap-3 animate-in fade-in duration-150">
            <Button variant="outline" size="lg" onClick={() => playTurn('left')} className="gap-2 min-w-28">
              <MoveLeft className="size-5" /> Left
            </Button>
            <Button variant="outline" size="lg" onClick={() => playTurn('right')} className="gap-2 min-w-28">
              Right <MoveRight className="size-5" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Game over modal ── */}
      {gameOver && (
        <div className="fixed inset-x-0 bottom-0 z-10 px-3 pb-3 animate-slide-up">
          <Card className="modal-card flex-row items-center justify-between gap-4 px-5 py-3.5 max-w-sm mx-auto">
            <span className="flex items-center gap-2 text-lg font-bold text-foreground">
              {scores[0] > scores[1] ? (
                <><span className="inline-block size-4 rounded-full bg-rose-500" /> Player 1 wins!</>
              ) : scores[1] > scores[0] ? (
                <><span className="inline-block size-4 rounded-full bg-sky-500" /> Player 2 wins!</>
              ) : (
                <>Draw!</>
              )}
              <span className="text-sm font-normal text-muted-foreground ml-1">{scores[0]} – {scores[1]}</span>
            </span>
            <Button onClick={resetGame}>Play Again</Button>
          </Card>
        </div>
      )}
    </div>
  )
}

// ── Cell component ──
function CellView({
  count,
  isQuan,
  isHighlighted,
  isSelected,
  isClickable,
  isActive,
  onClick,
  player,
  className,
}: {
  count: number
  isQuan?: boolean
  isHighlighted?: boolean
  isSelected?: boolean
  isClickable?: boolean
  isActive?: boolean
  onClick?: () => void
  player?: Player
  className?: string
}) {
  const Tag = isClickable ? 'button' : 'div'
  return (
    <Tag
      className={
        `flex flex-col items-center justify-center border border-border transition-all duration-150 ` +
        (isQuan ? 'h-14 bg-amber-100/60 dark:bg-amber-900/20 ' : 'h-16 ') +
        (isHighlighted ? 'bg-yellow-300/50 dark:bg-yellow-600/30 ring-2 ring-inset ring-yellow-500 ' : '') +
        (isSelected ? 'ring-2 ring-inset ring-blue-500 bg-blue-100/50 dark:bg-blue-800/30 ' : '') +
        (!isHighlighted && !isSelected && !isQuan && isActive && player === 0 ? 'bg-rose-50 dark:bg-rose-950/20 ' : '') +
        (!isHighlighted && !isSelected && !isQuan && isActive && player === 1 ? 'bg-sky-50 dark:bg-sky-950/20 ' : '') +
        (!isHighlighted && !isSelected && !isQuan && !isActive ? 'bg-muted/30 ' : '') +
        (isClickable ? 'cursor-pointer hover:brightness-95 active:scale-95 ' : '') +
        (count === 0 && !isQuan ? 'opacity-40 ' : '') +
        (className ?? '')
      }
      onClick={isClickable ? onClick : undefined}
      {...(isClickable ? {} : { role: undefined })}
    >
      <span className={
        `font-bold tabular-nums transition-all duration-150 ` +
        (isQuan ? 'text-lg text-amber-700 dark:text-amber-400 ' : 'text-xl ') +
        (count === 0 ? 'text-muted-foreground ' : 'text-foreground ')
      }>
        {count}
      </span>
      {isQuan && (
        <span className="text-[10px] text-amber-600/60 dark:text-amber-400/50 uppercase tracking-widest font-semibold">
          Quan
        </span>
      )}
    </Tag>
  )
}
