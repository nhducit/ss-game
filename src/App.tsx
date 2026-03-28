import { useState, useCallback, useRef, useEffect } from 'react'
import './App.css'

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

function App() {
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
    // loser goes first next round
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
    <div className={`game ${turnClass}`}>
      <nav>
        <div className="nav-left">
          <h1>Caro</h1>
          <div className="scoreboard">
            <span className={`score-side ${currentPlayer === 'X' && !winner && !isDraw ? 'active' : ''}`}>
              <span className="stone-dot x-dot" />
              {scores.X}
            </span>
            <span className="score-sep">-</span>
            <span className={`score-side ${currentPlayer === 'O' && !winner && !isDraw ? 'active' : ''}`}>
              {scores.O}
              <span className="stone-dot o-dot" />
            </span>
          </div>
          <div className="status">
            {winner ? (
              <span><strong>{winner}</strong> wins!</span>
            ) : isDraw ? (
              <span>Draw!</span>
            ) : (
              <span>#{moveCount + 1}</span>
            )}
          </div>
        </div>
        <div className="nav-right">
          <div className="zoom-group">
            <button
              className="nav-btn"
              onClick={() => setCellSize(s => Math.max(20, s - 4))}
              disabled={cellSize <= 20}
              title="Smaller cells"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <button
              className="nav-btn"
              onClick={() => setCellSize(s => Math.min(56, s + 4))}
              disabled={cellSize >= 56}
              title="Larger cells"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
          </div>
          <div className="nav-sep" />
          <button
            className="nav-btn"
            onClick={undo}
            disabled={history.length === 0 || !!winner}
            title="Undo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
          <button
            className="nav-btn"
            onClick={resetGame}
            disabled={history.length === 0}
            title="New game"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <line x1="8" y1="8" x2="16" y2="16" />
              <line x1="16" y1="8" x2="8" y2="16" />
            </svg>
          </button>
          <button
            className="nav-btn"
            onClick={fullReset}
            title="Reset scores"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M5 6l1 14h12l1-14" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="board-wrapper" ref={boardRef}>
        <div className="board" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, '--cell': `${cellSize}px` } as React.CSSProperties}>
          {board.map((cell, i) => (
            <button
              key={i}
              className={
                `cell` +
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
        <div className="bottom-modal">
          <div className={`modal-content ${winner ? winner.toLowerCase() : ''}`}>
            <span className="modal-text">
              {winner ? (
                <><span className={`modal-dot ${winner.toLowerCase()}-dot`} />{winner === 'X' ? 'Red' : 'Blue'} wins!</>
              ) : (
                <>Draw!</>
              )}
            </span>
            <button className="modal-btn" onClick={resetGame}>Next Game</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
