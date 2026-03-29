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

interface Move {
  index: number
  player: Player
}

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
]

function checkWin(board: Cell[]): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line
    }
  }
  return null
}

export function TicTacToe() {
  const navigate = useNavigate()
  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [winLine, setWinLine] = useState<Set<number> | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)
  const [scores, setScores] = useState({ X: 0, O: 0 })
  const [history, setHistory] = useState<Move[]>([])

  const moveCount = history.length
  const lastMove = moveCount > 0 ? history[moveCount - 1].index : null
  const isDraw = !winner && moveCount === 9

  const turnClass = winner
    ? `turn-${winner.toLowerCase()}`
    : isDraw
      ? ''
      : `turn-${currentPlayer.toLowerCase()}`

  const handleClick = useCallback((index: number) => {
    if (board[index] || winner) return
    const next = [...board]
    next[index] = currentPlayer
    setBoard(next)
    setHistory(h => [...h, { index, player: currentPlayer }])

    const line = checkWin(next)
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
    setBoard(Array(9).fill(null))
    setWinLine(null)
    setHistory([])
    setCurrentPlayer(winner ? (winner === 'X' ? 'O' : 'X') : 'X')
    setWinner(null)
  }, [winner])

  const fullReset = useCallback(() => {
    setBoard(Array(9).fill(null))
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
          <h1 className="text-lg font-extrabold tracking-tight text-foreground m-0">Tic Tac Toe</h1>
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

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-3 gap-0 w-[min(80vw,80vh,420px)] aspect-square">
          {board.map((cell, i) => (
            <button
              key={i}
              className={
                `ttt-cell relative border-none bg-transparent cursor-pointer p-0 touch-manipulation aspect-square` +
                (cell ? ` ${cell.toLowerCase()}` : '') +
                (winLine?.has(i) ? ' winning' : '') +
                (i === lastMove ? ' last' : '')
              }
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
