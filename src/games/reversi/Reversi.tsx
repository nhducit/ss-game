import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'

type Player = 'X' | 'O'
type Cell = Player | null

const SIZE = 8
const TOTAL = SIZE * SIZE

const DIRECTIONS = [
  -SIZE - 1, -SIZE, -SIZE + 1,
  -1,                 1,
  SIZE - 1,  SIZE,  SIZE + 1,
]

function rowCol(index: number): [number, number] {
  return [Math.floor(index / SIZE), index % SIZE]
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE
}

function getFlips(board: Cell[], player: Player, index: number): number[] {
  if (board[index] !== null) return []
  const opponent: Player = player === 'X' ? 'O' : 'X'
  const [row, col] = rowCol(index)
  const allFlips: number[] = []

  for (const dir of DIRECTIONS) {
    const flips: number[] = []
    let [r, c] = [row, col]

    let dRow: number, dCol: number
    if (dir === -SIZE - 1) { dRow = -1; dCol = -1 }
    else if (dir === -SIZE) { dRow = -1; dCol = 0 }
    else if (dir === -SIZE + 1) { dRow = -1; dCol = 1 }
    else if (dir === -1) { dRow = 0; dCol = -1 }
    else if (dir === 1) { dRow = 0; dCol = 1 }
    else if (dir === SIZE - 1) { dRow = 1; dCol = -1 }
    else if (dir === SIZE) { dRow = 1; dCol = 0 }
    else { dRow = 1; dCol = 1 } // SIZE + 1

    r += dRow
    c += dCol
    while (inBounds(r, c) && board[r * SIZE + c] === opponent) {
      flips.push(r * SIZE + c)
      r += dRow
      c += dCol
    }
    if (flips.length > 0 && inBounds(r, c) && board[r * SIZE + c] === player) {
      allFlips.push(...flips)
    }
  }
  return allFlips
}

function getValidMoves(board: Cell[], player: Player): Set<number> {
  const moves = new Set<number>()
  for (let i = 0; i < TOTAL; i++) {
    if (board[i] === null && getFlips(board, player, i).length > 0) {
      moves.add(i)
    }
  }
  return moves
}

function makeMove(board: Cell[], player: Player, index: number): { newBoard: Cell[]; flipped: number[] } {
  const flips = getFlips(board, player, index)
  const newBoard = [...board]
  newBoard[index] = player
  for (const f of flips) {
    newBoard[f] = player
  }
  return { newBoard, flipped: flips }
}

function createInitialBoard(): Cell[] {
  const board: Cell[] = Array(TOTAL).fill(null)
  // d4=O, e4=X, d5=X, e5=O  (0-indexed: [3,3]=O, [3,4]=X, [4,3]=X, [4,4]=O)
  board[3 * SIZE + 3] = 'O'
  board[3 * SIZE + 4] = 'X'
  board[4 * SIZE + 3] = 'X'
  board[4 * SIZE + 4] = 'O'
  return board
}

function countDiscs(board: Cell[]): { X: number; O: number } {
  let X = 0, O = 0
  for (const cell of board) {
    if (cell === 'X') X++
    else if (cell === 'O') O++
  }
  return { X, O }
}

export function Reversi() {
  const navigate = useNavigate()
  const [board, setBoard] = useState<Cell[]>(createInitialBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [scores, setScores] = useState({ X: 0, O: 0 })
  const [lastPlaced, setLastPlaced] = useState<number | null>(null)
  const [flippedCells, setFlippedCells] = useState<Set<number>>(new Set())
  const [gameOver, setGameOver] = useState(false)
  const [gameResult, setGameResult] = useState<'X' | 'O' | 'draw' | null>(null)
  const [skipNotice, setSkipNotice] = useState<Player | null>(null)

  const discCount = countDiscs(board)
  const validMoves = getValidMoves(board, currentPlayer)

  // Handle turn skipping and game over
  useEffect(() => {
    if (gameOver) return

    if (validMoves.size === 0) {
      const opponent: Player = currentPlayer === 'X' ? 'O' : 'X'
      const opponentMoves = getValidMoves(board, opponent)

      if (opponentMoves.size === 0) {
        // Neither player can move - game over
        setGameOver(true)
        const count = countDiscs(board)
        if (count.X > count.O) {
          setGameResult('X')
          setScores(s => ({ ...s, X: s.X + 1 }))
        } else if (count.O > count.X) {
          setGameResult('O')
          setScores(s => ({ ...s, O: s.O + 1 }))
        } else {
          setGameResult('draw')
        }
      } else {
        // Skip current player's turn
        setSkipNotice(currentPlayer)
        const timer = setTimeout(() => {
          setSkipNotice(null)
          setCurrentPlayer(opponent)
        }, 1200)
        return () => clearTimeout(timer)
      }
    }
  }, [board, currentPlayer, gameOver, validMoves])

  // Check if board is full
  useEffect(() => {
    if (gameOver) return
    const count = countDiscs(board)
    if (count.X + count.O === TOTAL) {
      setGameOver(true)
      if (count.X > count.O) {
        setGameResult('X')
        setScores(s => ({ ...s, X: s.X + 1 }))
      } else if (count.O > count.X) {
        setGameResult('O')
        setScores(s => ({ ...s, O: s.O + 1 }))
      } else {
        setGameResult('draw')
      }
    }
  }, [board, gameOver])

  const handleClick = useCallback((index: number) => {
    if (gameOver || !validMoves.has(index) || skipNotice) return

    const { newBoard, flipped } = makeMove(board, currentPlayer, index)
    setBoard(newBoard)
    setLastPlaced(index)
    setFlippedCells(new Set(flipped))

    // Clear flip animation after transition
    setTimeout(() => setFlippedCells(new Set()), 400)

    const opponent: Player = currentPlayer === 'X' ? 'O' : 'X'
    setCurrentPlayer(opponent)
  }, [board, currentPlayer, gameOver, validMoves, skipNotice])

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard())
    setLastPlaced(null)
    setFlippedCells(new Set())
    setGameOver(false)
    setGameResult(null)
    setSkipNotice(null)
    setCurrentPlayer(gameResult === 'draw' ? 'X' : gameResult === 'X' ? 'O' : 'X')
  }, [gameResult])

  const fullReset = useCallback(() => {
    setBoard(createInitialBoard())
    setLastPlaced(null)
    setFlippedCells(new Set())
    setGameOver(false)
    setGameResult(null)
    setSkipNotice(null)
    setCurrentPlayer('X')
    setScores({ X: 0, O: 0 })
  }, [])

  const turnClass = gameOver
    ? gameResult && gameResult !== 'draw' ? `turn-${gameResult.toLowerCase()}` : ''
    : `turn-${currentPlayer.toLowerCase()}`

  return (
    <div className={`game flex flex-col h-svh overflow-hidden transition-colors duration-300 ${turnClass}`}>
      {/* Navbar */}
      <div className="game-nav flex items-center justify-between px-4 h-13 shrink-0 border-b-2 border-border transition-colors duration-300">
        <div className="flex items-center gap-3.5">
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })} />}
            >
              <ArrowLeft className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Back to menu</TooltipContent>
          </Tooltip>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground m-0">Reversi</h1>
          <div className="flex items-center gap-1 tabular-nums">
            <Badge
              variant={currentPlayer === 'X' && !gameOver ? 'secondary' : 'outline'}
              className="gap-1.5 font-bold tabular-nums"
            >
              <span className="inline-block size-2.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f08080,#c0392b)]" />
              {scores.X}
              <span className="text-muted-foreground font-normal text-xs">({discCount.X})</span>
            </Badge>
            <span className="text-muted-foreground font-normal">-</span>
            <Badge
              variant={currentPlayer === 'O' && !gameOver ? 'secondary' : 'outline'}
              className="gap-1.5 font-bold tabular-nums"
            >
              <span className="text-muted-foreground font-normal text-xs">({discCount.O})</span>
              {scores.O}
              <span className="inline-block size-2.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#87ceeb,#2980b9)]" />
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetGame}
                  disabled={discCount.X + discCount.O <= 4 && !gameOver}
                />
              }
            >
              <RotateCcw className="size-4" />
            </TooltipTrigger>
            <TooltipContent>New game</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" onClick={fullReset} />}
            >
              <Trash2 className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Reset scores</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Skip notice */}
      {skipNotice && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg bg-foreground/90 text-background text-sm font-semibold animate-fade-in">
          {skipNotice === 'X' ? 'Red' : 'Blue'} has no moves — skipped!
        </div>
      )}

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="grid grid-cols-8 bg-emerald-700 dark:bg-emerald-900 rounded-lg overflow-hidden shadow-xl"
          style={{ width: 'min(85vw, 75vh, 480px)', aspectRatio: '1' }}
        >
          {board.map((cell, i) => {
            const isValid = validMoves.has(i)
            const isLast = i === lastPlaced
            const isFlipped = flippedCells.has(i)
            return (
              <button
                key={i}
                className="relative border border-emerald-800/40 dark:border-emerald-950/40 bg-transparent p-0 touch-manipulation flex items-center justify-center cursor-pointer"
                style={{ aspectRatio: '1' }}
                onClick={() => handleClick(i)}
                disabled={!isValid || gameOver || !!skipNotice}
              >
                {cell && (
                  <div
                    className={
                      `w-[80%] h-[80%] rounded-full transition-transform duration-300` +
                      (cell === 'X'
                        ? ' bg-[radial-gradient(circle_at_35%_35%,#f08080,#c0392b)]'
                        : ' bg-[radial-gradient(circle_at_35%_35%,#87ceeb,#2980b9)]') +
                      (isFlipped ? ' scale-0 animate-[flip-in_0.4s_ease-out_forwards]' : '') +
                      (isLast ? ' ring-2 ring-white/70 ring-offset-1 ring-offset-emerald-700' : '')
                    }
                  />
                )}
                {!cell && isValid && (
                  <div
                    className={
                      'w-[25%] h-[25%] rounded-full opacity-40' +
                      (currentPlayer === 'X'
                        ? ' bg-[radial-gradient(circle_at_35%_35%,#f08080,#c0392b)]'
                        : ' bg-[radial-gradient(circle_at_35%_35%,#87ceeb,#2980b9)]')
                    }
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Game over modal */}
      {gameOver && gameResult && (
        <div className="fixed inset-x-0 bottom-0 z-10 px-3 pb-3 animate-slide-up">
          <Card className="modal-card flex-row items-center justify-between gap-4 px-5 py-3.5 max-w-105 mx-auto">
            <span className="flex items-center gap-2 text-lg font-bold text-foreground">
              {gameResult === 'draw' ? (
                <>Draw! ({discCount.X} - {discCount.O})</>
              ) : (
                <>
                  <span className={`inline-block size-4 rounded-full ${gameResult === 'X' ? 'bg-[radial-gradient(circle_at_35%_35%,#f08080,#c0392b)]' : 'bg-[radial-gradient(circle_at_35%_35%,#87ceeb,#2980b9)]'}`} />
                  {gameResult === 'X' ? 'Red' : 'Blue'} wins! ({discCount.X} - {discCount.O})
                </>
              )}
            </span>
            <Button onClick={resetGame}>Next Game</Button>
          </Card>
        </div>
      )}

      {/* Flip animation keyframes */}
      <style>{`
        @keyframes flip-in {
          0% { transform: scale(0) rotateY(90deg); }
          50% { transform: scale(0.8) rotateY(45deg); }
          100% { transform: scale(1) rotateY(0deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, -8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
