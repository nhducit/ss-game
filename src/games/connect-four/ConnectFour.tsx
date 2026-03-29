import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import { Undo2, X, Trash2, ArrowLeft } from 'lucide-react'

type Player = 'X' | 'O'
type Cell = Player | null

const COLS = 7
const ROWS = 6

interface Move {
  row: number
  col: number
  player: Player
}

function createBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function getLowestEmptyRow(board: Cell[][], col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r][col]) return r
  }
  return -1
}

function checkWin(board: Cell[][], row: number, col: number): [number, number][] | null {
  const player = board[row][col]
  if (!player) return null

  const directions: [number, number][] = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal down-right
    [1, -1], // diagonal down-left
  ]

  for (const [dr, dc] of directions) {
    const cells: [number, number][] = [[row, col]]

    // Check forward
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i
      const c = col + dc * i
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break
      cells.push([r, c])
    }

    // Check backward
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i
      const c = col - dc * i
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) break
      cells.push([r, c])
    }

    if (cells.length >= 4) return cells
  }

  return null
}

export function ConnectFour() {
  const navigate = useNavigate()
  const [board, setBoard] = useState<Cell[][]>(createBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [winCells, setWinCells] = useState<Set<string> | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)
  const [scores, setScores] = useState({ X: 0, O: 0 })
  const [history, setHistory] = useState<Move[]>([])
  const [hoverCol, setHoverCol] = useState<number | null>(null)

  const moveCount = history.length
  const lastMove = moveCount > 0 ? history[moveCount - 1] : null
  const isDraw = !winner && moveCount === ROWS * COLS

  const turnClass = winner
    ? `turn-${winner.toLowerCase()}`
    : isDraw
      ? ''
      : `turn-${currentPlayer.toLowerCase()}`

  const handleDrop = useCallback((col: number) => {
    if (winner) return
    const row = getLowestEmptyRow(board, col)
    if (row < 0) return

    const next = board.map(r => [...r])
    next[row][col] = currentPlayer
    setBoard(next)
    setHistory(h => [...h, { row, col, player: currentPlayer }])

    const line = checkWin(next, row, col)
    if (line) {
      setWinner(currentPlayer)
      setWinCells(new Set(line.map(([r, c]) => `${r},${c}`)))
      setScores(s => ({ ...s, [currentPlayer]: s[currentPlayer] + 1 }))
    } else {
      setCurrentPlayer(p => (p === 'X' ? 'O' : 'X'))
    }
  }, [board, currentPlayer, winner])

  const undo = useCallback(() => {
    if (history.length === 0 || winner) return
    const last = history[history.length - 1]
    const next = board.map(r => [...r])
    next[last.row][last.col] = null
    setBoard(next)
    setHistory(h => h.slice(0, -1))
    setCurrentPlayer(last.player)
  }, [history, board, winner])

  const resetGame = useCallback(() => {
    setBoard(createBoard())
    setWinCells(null)
    setHistory([])
    setCurrentPlayer(winner ? (winner === 'X' ? 'O' : 'X') : 'X')
    setWinner(null)
    setHoverCol(null)
  }, [winner])

  const fullReset = useCallback(() => {
    setBoard(createBoard())
    setWinCells(null)
    setHistory([])
    setCurrentPlayer('X')
    setWinner(null)
    setScores({ X: 0, O: 0 })
    setHoverCol(null)
  }, [])

  const getHoverRow = (col: number): number => {
    return getLowestEmptyRow(board, col)
  }

  return (
    <div className={`game flex flex-col h-svh overflow-hidden transition-colors duration-300 ${turnClass}`}>
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
          <h1 className="hidden sm:block text-lg font-extrabold tracking-tight text-foreground m-0">Connect Four</h1>
          <div className="flex items-center gap-1 tabular-nums">
            <Badge
              variant={currentPlayer === 'X' && !winner && !isDraw ? 'secondary' : 'outline'}
              className="gap-1.5 font-bold tabular-nums"
            >
              <span className="inline-block size-2.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f08080,#c0392b)]" />
              {scores.X}
            </Badge>
            <span className="text-muted-foreground font-normal">-</span>
            <Badge
              variant={currentPlayer === 'O' && !winner && !isDraw ? 'secondary' : 'outline'}
              className="gap-1.5 font-bold tabular-nums"
            >
              {scores.O}
              <span className="inline-block size-2.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#87ceeb,#2980b9)]" />
            </Badge>
          </div>
          <Badge variant="ghost" className="text-muted-foreground">
            {winner ? (
              <span><strong>{winner}</strong> wins!</span>
            ) : isDraw ? (
              <span>Draw!</span>
            ) : (
              <span>#{moveCount + 1}</span>
            )}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={history.length === 0 || !!winner}
                />
              }
            >
              <Undo2 className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetGame}
                  disabled={history.length === 0}
                />
              }
            >
              <X className="size-4" />
            </TooltipTrigger>
            <TooltipContent>New game</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-5" />
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

      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className={`grid gap-1.5 rounded-2xl p-2 sm:p-3 shadow-lg transition-colors duration-300 ${
            winner
              ? winner === 'X' ? 'bg-rose-200 dark:bg-rose-300' : 'bg-sky-200 dark:bg-sky-300'
              : currentPlayer === 'X'
                ? 'bg-rose-200 dark:bg-rose-300'
                : 'bg-sky-200 dark:bg-sky-300'
          }`}
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            width: 'min(90vw, 70vh, 490px)',
          }}
        >
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
              const cell = board[row][col]
              const isWinCell = winCells?.has(`${row},${col}`)
              const isLastMove = lastMove?.row === row && lastMove?.col === col
              const isHoverTarget =
                !winner && hoverCol === col && getHoverRow(col) === row

              return (
                <button
                  key={`${row}-${col}`}
                  className="aspect-square touch-manipulation p-0 border-none bg-transparent cursor-pointer"
                  onClick={() => handleDrop(col)}
                  onMouseEnter={() => setHoverCol(col)}
                  onMouseLeave={() => setHoverCol(null)}
                  disabled={!!winner || getLowestEmptyRow(board, col) < 0}
                >
                  <div
                    className={[
                      'size-full rounded-full transition-all duration-200',
                      cell === 'X'
                        ? 'bg-[radial-gradient(circle_at_35%_35%,#f08080,#c0392b)] animate-drop'
                        : cell === 'O'
                          ? 'bg-[radial-gradient(circle_at_35%_35%,#87ceeb,#2980b9)] animate-drop'
                          : isHoverTarget
                            ? currentPlayer === 'X'
                              ? 'bg-rose-500/25'
                              : 'bg-sky-500/25'
                            : 'bg-background shadow-inner',
                      isWinCell ? 'animate-pulse' : '',
                      isLastMove ? 'ring-2 ring-white/70 ring-offset-1 ring-offset-transparent' : '',
                    ].join(' ')}
                  />
                </button>
              )
            })
          )}
        </div>
      </div>

      {(winner || isDraw) && (
        <div className="fixed inset-x-0 bottom-0 z-10 px-3 pb-3 animate-slide-up">
          <Card className="modal-card flex-row items-center justify-between gap-4 px-5 py-3.5 max-w-105 mx-auto">
            <span className="flex items-center gap-2 text-lg font-bold text-foreground">
              {winner ? (
                <>
                  <span
                    className={`inline-block size-4 rounded-full ${
                      winner === 'X'
                        ? 'bg-[radial-gradient(circle_at_35%_35%,#f08080,#c0392b)]'
                        : 'bg-[radial-gradient(circle_at_35%_35%,#87ceeb,#2980b9)]'
                    }`}
                  />
                  {winner === 'X' ? 'Red' : 'Blue'} wins!
                </>
              ) : (
                <>Draw!</>
              )}
            </span>
            <Button onClick={resetGame}>Next Game</Button>
          </Card>
        </div>
      )}
    </div>
  )
}
