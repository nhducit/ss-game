import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'

// ── Constants ──
const ROWS = 5 // dots per column
const COLS = 5 // dots per row
const BOX_ROWS = ROWS - 1
const BOX_COLS = COLS - 1

// Horizontal lines: ROWS rows x (COLS-1) cols
const H_LINES = ROWS * (COLS - 1) // 20
// Vertical lines: (ROWS-1) rows x COLS cols
const V_LINES = (ROWS - 1) * COLS // 20
const TOTAL_LINES = H_LINES + V_LINES // 40
const TOTAL_BOXES = BOX_ROWS * BOX_COLS // 16

type Player = 1 | 2
type LineOwner = Player | null
type BoxOwner = Player | null

// ── Line indexing helpers ──
// Horizontal line at row r, between col c and c+1 → index = r * (COLS-1) + c
function hLineIndex(r: number, c: number): number {
  return r * (COLS - 1) + c
}
// Vertical line between row r and r+1 at col c → index = H_LINES + r * COLS + c
function vLineIndex(r: number, c: number): number {
  return H_LINES + r * COLS + c
}

// For a box at (r, c), return the 4 line indices: top, bottom, left, right
function boxLines(r: number, c: number): [number, number, number, number] {
  return [
    hLineIndex(r, c),       // top
    hLineIndex(r + 1, c),   // bottom
    vLineIndex(r, c),       // left
    vLineIndex(r, c + 1),   // right
  ]
}

// ── Layout constants for rendering ──
const DOT_SIZE = 12
const LINE_THICKNESS = 8
const LINE_HIT_AREA = 24
const GAP = 48 // distance between dots

function boardWidth(): number {
  return (COLS - 1) * GAP + DOT_SIZE
}
function boardHeight(): number {
  return (ROWS - 1) * GAP + DOT_SIZE
}

export function DotsAndBoxes() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<LineOwner[]>(() => Array(TOTAL_LINES).fill(null))
  const [boxes, setBoxes] = useState<BoxOwner[]>(() => Array(TOTAL_BOXES).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1)
  const [scores, setScores] = useState<[number, number]>([0, 0])
  const [totalScores, setTotalScores] = useState<[number, number]>([0, 0])
  const [recentBoxes, setRecentBoxes] = useState<Set<number>>(new Set())
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)

  const linesDrawn = lines.filter(l => l !== null).length
  const gameOver = linesDrawn === TOTAL_LINES

  const turnClass = gameOver
    ? ''
    : currentPlayer === 1
      ? 'turn-p1'
      : 'turn-p2'

  const handleLineClick = useCallback((lineIdx: number) => {
    if (lines[lineIdx] !== null || gameOver) return

    const newLines = [...lines]
    newLines[lineIdx] = currentPlayer

    const newBoxes = [...boxes]
    let boxesCompleted = 0

    const newRecent = new Set<number>()

    // Check which boxes this line completes
    for (let r = 0; r < BOX_ROWS; r++) {
      for (let c = 0; c < BOX_COLS; c++) {
        const boxIdx = r * BOX_COLS + c
        if (newBoxes[boxIdx] !== null) continue
        const [t, b, l, ri] = boxLines(r, c)
        if (newLines[t] !== null && newLines[b] !== null && newLines[l] !== null && newLines[ri] !== null) {
          newBoxes[boxIdx] = currentPlayer
          boxesCompleted++
          newRecent.add(boxIdx)
        }
      }
    }

    setLines(newLines)
    setBoxes(newBoxes)
    setRecentBoxes(newRecent)

    if (boxesCompleted > 0) {
      // Player scored: update scores, keep current player's turn
      setScores(s => {
        const next: [number, number] = [...s]
        next[currentPlayer - 1] += boxesCompleted
        return next
      })
    } else {
      // No box completed: switch player
      setCurrentPlayer(p => p === 1 ? 2 : 1)
    }
  }, [lines, boxes, currentPlayer, gameOver])

  const resetGame = useCallback(() => {
    // Add current scores to total
    setTotalScores(t => [t[0] + scores[0], t[1] + scores[1]])
    setLines(Array(TOTAL_LINES).fill(null))
    setBoxes(Array(TOTAL_BOXES).fill(null))
    setScores([0, 0])
    setRecentBoxes(new Set())
    setCurrentPlayer(1)
  }, [scores])

  const fullReset = useCallback(() => {
    setLines(Array(TOTAL_LINES).fill(null))
    setBoxes(Array(TOTAL_BOXES).fill(null))
    setScores([0, 0])
    setTotalScores([0, 0])
    setRecentBoxes(new Set())
    setCurrentPlayer(1)
  }, [])

  const p1Total = totalScores[0] + scores[0]
  const p2Total = totalScores[1] + scores[1]

  const bw = boardWidth()
  const bh = boardHeight()

  return (
    <div className={`game flex flex-col h-svh overflow-hidden transition-colors duration-300 ${turnClass}`}>
      {/* ── Navbar ── */}
      <div className={
        `game-nav flex items-center justify-between px-4 h-13 shrink-0 border-b-2 border-border transition-colors duration-300 ` +
        (!gameOver && currentPlayer === 1 ? 'bg-rose-500/10 border-b-rose-500/40 ' : '') +
        (!gameOver && currentPlayer === 2 ? 'bg-sky-500/10 border-b-sky-500/40 ' : '')
      }>
        <div className="flex items-center gap-3.5">
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })} />}
            >
              <ArrowLeft className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Back to menu</TooltipContent>
          </Tooltip>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground m-0">Dots & Boxes</h1>
          <div className="flex items-center gap-1 tabular-nums">
            <Badge
              variant={currentPlayer === 1 && !gameOver ? 'secondary' : 'outline'}
              className="gap-1.5 font-bold tabular-nums"
            >
              <span className="inline-block size-2.5 rounded-full bg-rose-500" />
              {p1Total}
            </Badge>
            <span className="text-muted-foreground font-normal">-</span>
            <Badge
              variant={currentPlayer === 2 && !gameOver ? 'secondary' : 'outline'}
              className="gap-1.5 font-bold tabular-nums"
            >
              {p2Total}
              <span className="inline-block size-2.5 rounded-full bg-sky-500" />
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
                  disabled={linesDrawn === 0}
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

      {/* ── Board ── */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="relative touch-manipulation"
          style={{ width: bw, height: bh }}
        >
          {/* Completed boxes */}
          {Array.from({ length: BOX_ROWS }, (_, r) =>
            Array.from({ length: BOX_COLS }, (_, c) => {
              const boxIdx = r * BOX_COLS + c
              const owner = boxes[boxIdx]
              if (!owner) return null
              const x = c * GAP + DOT_SIZE / 2
              const y = r * GAP + DOT_SIZE / 2
              const size = GAP - DOT_SIZE / 2
              return (
                <div
                  key={`box-${boxIdx}`}
                  className={
                    `absolute flex items-center justify-center font-bold text-sm transition-colors duration-200 rounded-sm ` +
                    (owner === 1 ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 ' : 'bg-sky-500/20 text-sky-600 dark:text-sky-400 ') +
                    (recentBoxes.has(boxIdx) ? 'animate-box-pop ' : '')
                  }
                  style={{
                    left: x,
                    top: y,
                    width: size,
                    height: size,
                  }}
                >
                  {scores[owner - 1] > 0 ? '' : ''}
                  <span className="select-none">
                    {Array.from(boxes).filter((b, i) => b === owner && i <= boxIdx).length}
                  </span>
                </div>
              )
            })
          )}

          {/* Horizontal lines */}
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS - 1 }, (_, c) => {
              const idx = hLineIndex(r, c)
              const owner = lines[idx]
              const x = c * GAP + DOT_SIZE
              const y = r * GAP + DOT_SIZE / 2 - LINE_THICKNESS / 2
              const w = GAP - DOT_SIZE
              const isHovered = hoveredLine === idx && owner === null

              return (
                <button
                  key={`h-${idx}`}
                  className={
                    `absolute border-none p-0 transition-colors duration-150 rounded-full ` +
                    (owner === 1
                      ? 'bg-rose-500 cursor-default '
                      : owner === 2
                        ? 'bg-sky-500 cursor-default '
                        : isHovered
                          ? (currentPlayer === 1 ? 'bg-rose-500/40 ' : 'bg-sky-500/40 ')
                          : 'bg-transparent hover:bg-muted-foreground/20 '
                    ) +
                    (!owner ? 'cursor-pointer ' : '')
                  }
                  style={{
                    left: x - (LINE_HIT_AREA - w) / 2,
                    top: y - (LINE_HIT_AREA - LINE_THICKNESS) / 2,
                    width: w + (LINE_HIT_AREA - w),
                    height: LINE_HIT_AREA,
                    // Use clip-path to show thin line but keep large hit area
                  }}
                  onClick={() => handleLineClick(idx)}
                  onMouseEnter={() => setHoveredLine(idx)}
                  onMouseLeave={() => setHoveredLine(null)}
                  disabled={owner !== null || gameOver}
                  aria-label={`Horizontal line row ${r} col ${c}`}
                >
                  <div
                    className={
                      `mx-auto rounded-full transition-colors duration-150 ` +
                      (owner === 1
                        ? 'bg-rose-500 '
                        : owner === 2
                          ? 'bg-sky-500 '
                          : isHovered
                            ? (currentPlayer === 1 ? 'bg-rose-500/40 ' : 'bg-sky-500/40 ')
                            : 'bg-transparent '
                      )
                    }
                    style={{
                      width: w,
                      height: LINE_THICKNESS,
                    }}
                  />
                </button>
              )
            })
          )}

          {/* Vertical lines */}
          {Array.from({ length: ROWS - 1 }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const idx = vLineIndex(r, c)
              const owner = lines[idx]
              const x = c * GAP + DOT_SIZE / 2 - LINE_THICKNESS / 2
              const y = r * GAP + DOT_SIZE
              const h = GAP - DOT_SIZE
              const isHovered = hoveredLine === idx && owner === null

              return (
                <button
                  key={`v-${idx}`}
                  className={
                    `absolute border-none p-0 flex items-center justify-center transition-colors duration-150 rounded-full ` +
                    (!owner ? 'cursor-pointer ' : 'cursor-default ')
                  }
                  style={{
                    left: x - (LINE_HIT_AREA - LINE_THICKNESS) / 2,
                    top: y - (LINE_HIT_AREA - h) / 2,
                    width: LINE_HIT_AREA,
                    height: h + (LINE_HIT_AREA - h),
                  }}
                  onClick={() => handleLineClick(idx)}
                  onMouseEnter={() => setHoveredLine(idx)}
                  onMouseLeave={() => setHoveredLine(null)}
                  disabled={owner !== null || gameOver}
                  aria-label={`Vertical line row ${r} col ${c}`}
                >
                  <div
                    className={
                      `rounded-full transition-colors duration-150 ` +
                      (owner === 1
                        ? 'bg-rose-500 '
                        : owner === 2
                          ? 'bg-sky-500 '
                          : isHovered
                            ? (currentPlayer === 1 ? 'bg-rose-500/40 ' : 'bg-sky-500/40 ')
                            : 'bg-transparent '
                      )
                    }
                    style={{
                      width: LINE_THICKNESS,
                      height: h,
                    }}
                  />
                </button>
              )
            })
          )}

          {/* Dots */}
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => (
              <div
                key={`dot-${r}-${c}`}
                className="size-3 rounded-full bg-foreground absolute z-10 pointer-events-none"
                style={{
                  left: c * GAP,
                  top: r * GAP,
                }}
              />
            ))
          )}
        </div>
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
              <span className="text-sm font-normal text-muted-foreground ml-1">{scores[0]} - {scores[1]}</span>
            </span>
            <Button onClick={resetGame}>Play Again</Button>
          </Card>
        </div>
      )}

      {/* ── Box pop animation ── */}
      <style>{`
        @keyframes box-pop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-box-pop {
          animation: box-pop 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
