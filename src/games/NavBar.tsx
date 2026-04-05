import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { getGamification, getStreak, getPlayerLevel, getProfile } from '@/games/gamification'

export function NavBar() {
  const [data, setData] = useState({ stars: 0, streak: 0, emoji: '🧒', name: '' })
  const location = useLocation()

  useEffect(() => {
    const g = getGamification()
    const s = getStreak()
    const p = getProfile()
    setData({ stars: g.totalStars, streak: s.currentStreak, emoji: p.emoji, name: p.name })
  }, [location.pathname])

  const lvl = getPlayerLevel(data.stars)

  // Hide on board games
  const hiddenPaths = ['/caro', '/tic-tac-toe', '/o-an-quan', '/connect-four', '/dots-and-boxes', '/reversi', '/games']
  if (hiddenPaths.includes(location.pathname)) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 w-full max-w-2xl mx-auto shrink-0">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        {data.streak > 0 && (
          <span className="text-sm font-bold text-orange-500">🔥 {data.streak}</span>
        )}
        <span className="text-sm font-bold tabular-nums">⭐ {data.stars}</span>
        <span className="text-xs text-muted-foreground">{lvl.emoji} {lvl.name}</span>
      </Link>
      <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="text-2xl">{data.emoji}</span>
        {data.name && <span className="text-sm font-medium text-foreground hidden sm:inline">{data.name}</span>}
      </Link>
    </div>
  )
}
