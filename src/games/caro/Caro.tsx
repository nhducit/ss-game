import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Card } from '@/components/ui/card'
import { ZoomIn, ZoomOut, Undo2, X, Trash2, ArrowLeft, EllipsisVertical } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

type Player = 'X' | 'O'
type Cell = Player | null

interface Move {
  index: number
  player: Player
}

const SIZE = 30
const WIN_LENGTH = 5

const DIRECTIONS = [
  [0, 1],  // horizontal
  [1, 0],  // vertical
  [1, 1],  // diagonal
  [1, -1], // anti-diagonal
]

function checkWin(board: Cell[], row: number, col: number, player: Player): number[] | null {
  for (const [dr, dc] of DIRECTIONS) {
    const cells: number[] = []
    const r = row - dr * (WIN_LENGTH - 1)
    const c = col - dc * (WIN_LENGTH - 1)
    for (let start = 0; start < WIN_LENGTH * 2 - 1; start++) {
      const cr = r + dr * start
      const cc = c + dc * start
      if (cr >= 0 && cr < SIZE && cc >= 0 && cc < SIZE && board[cr * SIZE + cc] === player) {
        cells.push(cr * SIZE + cc)
        if (cells.length === WIN_LENGTH) return cells
      } else {
        cells.length = 0
      }
    }
  }
  return null
}

export function Caro() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [board, setBoard] = useState<Cell[]>(() => Array(SIZE * SIZE).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [winLine, setWinLine] = useState<Set<number> | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)
  const [scores, setScores] = useState({ X: 0, O: 0 })
  const [history, setHistory] = useState<Move[]>([])
  const [cellSize, setCellSize] = useState(36)
  const boardRef = useRef<HTMLDivElement>(null)

  const moveCount = history.length
  const lastMove = moveCount > 0 ? history[moveCount - 1].index : null
  const isDraw = !winner && moveCount === SIZE * SIZE

  const turnClass = winner
    ? `turn-${winner.toLowerCase()}`
    : isDraw
      ? ''
      : `turn-${currentPlayer.toLowerCase()}`

  useEffect(() => {
    const el = boardRef.current
    if (el) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2
    }
  }, [])

  const handleClick = useCallback((index: number) => {
    if (board[index] || winner) return
    const next = [...board]
    next[index] = currentPlayer
    setBoard(next)
    setHistory(h => [...h, { index, player: currentPlayer }])

    const row = Math.floor(index / SIZE)
    const col = index % SIZE
    const line = checkWin(next, row, col, currentPlayer)
    if (line) {
      setWinner(currentPlayer)
      setWinLine(new Set(line))
      setScores(s => ({ ...s, [currentPlayer]: s[currentPlayer] + 1 }))
    } else {
      setCurrentPlayer(p => p === 'X' ? 'O' : 'X')
    }
  }, [board, currentPlayer, winner])

  const undo = useCallback(() => {
    if (history.length === 0 || winner) return
    const last = history[history.length - 1]
    const next = [...board]
    next[last.index] = null
    setBoard(next)
    setHistory(h => h.slice(0, -1))
    setCurrentPlayer(last.player)
  }, [history, board, winner])

  const resetGame = useCallback(() => {
    setBoard(Array(SIZE * SIZE).fill(null))
    setWinLine(null)
    setHistory([])
    setCurrentPlayer(winner ? (winner === 'X' ? 'O' : 'X') : 'X')
    setWinner(null)
  }, [winner])

  const fullReset = useCallback(() => {
    setBoard(Array(SIZE * SIZE).fill(null))
    setWinLine(null)
    setHistory([])
    setCurrentPlayer('X')
    setWinner(null)
    setScores({ X: 0, O: 0 })
  }, [])

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
          <h1 className="hidden sm:block text-lg font-extrabold tracking-tight text-foreground m-0">Caro</h1>
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
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
              <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
              <DropdownMenuItem onClick={() => setCellSize(s => Math.max(20, s - 4))} disabled={cellSize <= 20}>
                <ZoomOut className="size-4" /> Smaller cells
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCellSize(s => Math.min(56, s + 4))} disabled={cellSize >= 56}>
                <ZoomIn className="size-4" /> Larger cells
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={undo} disabled={history.length === 0 || !!winner}>
                <Undo2 className="size-4" /> Undo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={resetGame} disabled={history.length === 0}>
                <X className="size-4" /> New game
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={fullReset}>
                <Trash2 className="size-4" /> Reset scores
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCellSize(s => Math.max(20, s - 4))}
                      disabled={cellSize <= 20}
                    />
                  }
                >
                  <ZoomOut className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Smaller cells</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCellSize(s => Math.min(56, s + 4))}
                      disabled={cellSize >= 56}
                    />
                  }
                >
                  <ZoomIn className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Larger cells</TooltipContent>
              </Tooltip>
            </div>
            <Separator orientation="vertical" className="mx-1 h-5" />
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
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon" onClick={fullReset} />}
              >
                <Trash2 className="size-4" />
              </TooltipTrigger>
              <TooltipContent>Reset scores</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto w-full overscroll-contain" ref={boardRef}>
        <div
          className="grid gap-0 mx-auto p-2 box-content"
          style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, width: `calc(var(--cell) * 30)`, '--cell': `${cellSize}px` } as React.CSSProperties}
        >
          {board.map((cell, i) => (
            <button
              key={i}
              className={
                `caro-cell relative border-none bg-transparent cursor-pointer p-0 touch-manipulation` +
                (cell ? ` ${cell.toLowerCase()}` : '') +
                (winLine?.has(i) ? ' winning' : '') +
                (i === lastMove ? ' last' : '')
              }
              style={{ width: 'var(--cell)', height: 'var(--cell)' }}
              onClick={() => handleClick(i)}
              disabled={!!cell || !!winner}
            />
          ))}
        </div>
      </div>

      {(winner || isDraw) && (
        <div className="fixed inset-x-0 bottom-0 z-10 px-3 pb-3 animate-slide-up">
          <Card className="modal-card flex-row items-center justify-between gap-4 px-5 py-3.5 max-w-105 mx-auto">
            <span className="flex items-center gap-2 text-lg font-bold text-foreground">
              {winner ? (
                <><span className={`inline-block size-4 rounded-full ${winner === 'X' ? 'bg-[radial-gradient(circle_at_35%_35%,#f08080,#c0392b)]' : 'bg-[radial-gradient(circle_at_35%_35%,#87ceeb,#2980b9)]'}`} />{winner === 'X' ? 'Red' : 'Blue'} wins!</>
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
