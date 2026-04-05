import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import {
  getProfile,
  saveProfile,
  getGamification,
  getStreak,
  getPlayerLevel,
  getHistory,
  ALL_ACHIEVEMENTS,
  type GameHistoryEntry,
} from '@/games/gamification'

const AVATAR_OPTIONS = [
  '🧒', '👦', '👧', '🧒🏻', '👦🏻', '👧🏻',
  '🐱', '🐶', '🦊', '🐼', '🐸', '🦄',
  '🦁', '🐯', '🐻', '🐨', '🐰', '🐷',
  '🌟', '🚀', '🎨', '⚽', '🎸', '🌈',
]

function StarsPerDayChart({ history }: { history: GameHistoryEntry[] }) {
  const dailyData = useMemo(() => {
    const map = new Map<string, number>()
    for (const entry of history) {
      const day = entry.date.slice(0, 10)
      map.set(day, (map.get(day) ?? 0) + entry.stars)
    }
    // Last 14 days
    const days: { date: string; label: string; stars: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
      days.push({ date: key, label, stars: map.get(key) ?? 0 })
    }
    return days
  }, [history])

  const maxStars = Math.max(...dailyData.map(d => d.stars), 1)

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-foreground mb-3">Stars per day (last 2 weeks)</h3>
      <div className="flex items-end gap-1 h-28">
        {dailyData.map(d => (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center justify-end h-20">
              {d.stars > 0 && (
                <span className="text-[10px] text-muted-foreground tabular-nums mb-0.5">{d.stars}</span>
              )}
              <div
                className="w-full rounded-t bg-primary/80 transition-all duration-300"
                style={{ height: `${d.stars > 0 ? Math.max((d.stars / maxStars) * 100, 8) : 0}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground leading-tight text-center">{d.label.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HistoryTable({ history }: { history: GameHistoryEntry[] }) {
  const recent = useMemo(() => [...history].reverse().slice(0, 30), [history])

  if (recent.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No games played yet</p>
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-foreground mb-3">Recent games</h3>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-3 py-2 font-medium">Game</th>
              <th className="text-left px-3 py-2 font-medium">Level</th>
              <th className="text-right px-3 py-2 font-medium">Stars</th>
              <th className="text-right px-3 py-2 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((entry, i) => {
              const d = new Date(entry.date)
              const timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              return (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">{entry.game}</td>
                  <td className="px-3 py-2 capitalize text-muted-foreground">{entry.level}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{'⭐'.repeat(entry.stars)}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground text-xs">{timeStr}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(getProfile)
  const [editName, setEditName] = useState(profile.name)
  const gam = getGamification()
  const streak = getStreak()
  const lvl = getPlayerLevel(gam.totalStars)
  const history = getHistory()

  const totalGames = history.length

  useEffect(() => {
    setEditName(profile.name)
  }, [profile.name])

  const handleSaveName = () => {
    const trimmed = editName.trim()
    const updated = { ...profile, name: trimmed }
    saveProfile(updated)
    setProfile(updated)
  }

  const handlePickEmoji = (emoji: string) => {
    const updated = { ...profile, emoji }
    saveProfile(updated)
    setProfile(updated)
  }

  return (
    <div className="flex min-h-svh flex-col items-center gap-6 p-6 pt-4 pb-12 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 w-full">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">My Profile</h1>
      </div>

      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="text-7xl">{profile.emoji}</div>
        <div className="flex gap-2 w-full max-w-xs">
          <Input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Your name"
            className="text-center text-lg font-semibold"
            onBlur={handleSaveName}
            onKeyDown={e => e.key === 'Enter' && handleSaveName()}
          />
        </div>
      </div>

      {/* Avatar picker */}
      <div className="w-full">
        <h3 className="text-sm font-semibold text-foreground mb-2">Choose avatar</h3>
        <div className="grid grid-cols-8 gap-2">
          {AVATAR_OPTIONS.map(emoji => (
            <button
              key={emoji}
              onClick={() => handlePickEmoji(emoji)}
              className={`text-2xl rounded-lg p-1.5 transition-all touch-manipulation ${
                profile.emoji === emoji
                  ? 'bg-primary/20 ring-2 ring-primary scale-110'
                  : 'hover:bg-muted active:scale-95'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <Card>
          <CardHeader className="p-4 text-center">
            <div className="text-2xl font-bold tabular-nums">{gam.totalStars}</div>
            <CardTitle className="text-xs text-muted-foreground font-normal">Total Stars</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 text-center">
            <div className="text-2xl font-bold">{lvl.emoji} {lvl.name}</div>
            <CardTitle className="text-xs text-muted-foreground font-normal">Level</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 text-center">
            <div className="text-2xl font-bold tabular-nums">{streak.currentStreak}</div>
            <CardTitle className="text-xs text-muted-foreground font-normal">Day Streak</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 text-center">
            <div className="text-2xl font-bold tabular-nums">{totalGames}</div>
            <CardTitle className="text-xs text-muted-foreground font-normal">Games Played</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Level progress */}
      {lvl.nextLevel && (
        <div className="w-full">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{lvl.emoji} {lvl.name}</span>
            <span>{lvl.nextLevel.emoji} {lvl.nextLevel.name}</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.round(lvl.progress * 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {gam.totalStars} / {lvl.nextLevel.minStars} stars
          </p>
        </div>
      )}

      {/* Achievements */}
      <div className="w-full">
        <h3 className="text-sm font-semibold text-foreground mb-3">Achievements</h3>
        <div className="grid grid-cols-2 gap-2">
          {ALL_ACHIEVEMENTS.map(a => {
            const earned = gam.achievements.includes(a.id)
            return (
              <div
                key={a.id}
                className={`flex items-center gap-2.5 rounded-lg border p-3 transition-all ${
                  earned ? 'bg-muted/50' : 'opacity-40'
                }`}
              >
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chart */}
      <StarsPerDayChart history={history} />

      {/* History table */}
      <HistoryTable history={history} />
    </div>
  )
}
