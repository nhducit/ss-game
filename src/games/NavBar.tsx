import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { getPlayer } from '@/games/convex-sync'
import { getPlayerLevel } from '@/games/gamification'

const CELEBRATIONS = [
  '🎉', '🥳', '🎊', '✨', '💪', '👏', '🌟', '💫', '🏅', '🎯',
]

const MESSAGES = [
  'Amazing!', 'Great job!', 'Keep going!', 'Awesome!',
  'Fantastic!', 'Brilliant!', 'Way to go!', 'Super!',
]

function StarNotification({ stars, onDone }: { stars: number; onDone: () => void }) {
  const emoji = CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)]
  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl animate-star-fly"
          style={{
            '--angle': `${(i * 45)}deg`,
            '--delay': `${i * 60}ms`,
          } as React.CSSProperties}
        >
          ⭐
        </span>
      ))}
      <div className="animate-star-pop flex flex-col items-center gap-1">
        <span className="text-5xl">{emoji}</span>
        <div className="bg-foreground text-background px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          +{stars} ⭐
        </div>
        <span className="text-sm font-semibold text-foreground mt-1">{message}</span>
      </div>
    </div>
  )
}

export function NavBar() {
  const [data, setData] = useState({ stars: 0, streak: 0, emoji: '🧒', name: '' })
  const [notification, setNotification] = useState<{ stars: number; key: number } | null>(null)
  const [bounce, setBounce] = useState(false)
  const location = useLocation()
  const keyRef = useRef(0)

  const refresh = useCallback(() => {
    getPlayer().then(player => {
      if (player) {
        setData({
          stars: player.totalStars,
          streak: player.currentStreak,
          emoji: player.emoji,
          name: player.name,
        })
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
  }, [location.pathname, refresh])

  useEffect(() => {
    function onStarsEarned(e: Event) {
      const { stars } = (e as CustomEvent).detail
      keyRef.current++
      setNotification({ stars, key: keyRef.current })
      setBounce(true)
      setTimeout(refresh, 300)
      setTimeout(() => setBounce(false), 600)
    }
    window.addEventListener('stars-earned', onStarsEarned)
    return () => window.removeEventListener('stars-earned', onStarsEarned)
  }, [refresh])

  const dismissNotification = useCallback(() => {
    setNotification(null)
  }, [])

  const lvl = getPlayerLevel(data.stars)

  const hiddenPaths = ['/caro', '/tic-tac-toe', '/o-an-quan', '/connect-four', '/dots-and-boxes', '/reversi', '/games']
  if (hiddenPaths.includes(location.pathname)) return null

  return (
    <>
      {notification && (
        <StarNotification
          key={notification.key}
          stars={notification.stars}
          onDone={dismissNotification}
        />
      )}
      <div className="flex items-center justify-between px-4 py-3 w-full max-w-2xl mx-auto shrink-0">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {data.streak > 0 && (
            <span className="text-sm font-bold text-orange-500">🔥 {data.streak}</span>
          )}
          <span className={`text-sm font-bold tabular-nums transition-transform ${bounce ? 'scale-150 text-yellow-500' : ''}`}>
            ⭐ {data.stars}
          </span>
          <span className="text-xs text-muted-foreground">{lvl.emoji} {lvl.name}</span>
        </Link>
        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">{data.emoji}</span>
          {data.name && <span className="text-sm font-medium text-foreground hidden sm:inline">{data.name}</span>}
        </Link>
      </div>
    </>
  )
}
