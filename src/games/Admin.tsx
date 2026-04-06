import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Lock, Unlock, Plus, Trash2 } from 'lucide-react'
import { getAppConfig, setAppLocked, setAppSchedule, type ScheduleSlot } from '@/games/convex-sync'

const ADMIN_PASSWORD = '88664422'
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function ScheduleEditor({ schedule, onChange }: {
  schedule: ScheduleSlot[]
  onChange: (schedule: ScheduleSlot[]) => void
}) {
  const addSlot = () => {
    onChange([...schedule, { day: 1, startHour: 8, startMin: 0, endHour: 9, endMin: 0 }])
  }

  const removeSlot = (index: number) => {
    onChange(schedule.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, field: keyof ScheduleSlot, value: number) => {
    const updated = [...schedule]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Allowed time slots</h3>
        <Button variant="outline" size="sm" onClick={addSlot} className="gap-1.5">
          <Plus className="size-3.5" /> Add slot
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        App is unlocked during these times (unless global lock is on)
      </p>
      {schedule.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No schedule set — app is always unlocked when global lock is off
        </p>
      )}
      <div className="flex flex-col gap-3">
        {schedule.map((slot, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            <select
              value={slot.day}
              onChange={e => updateSlot(i, 'day', Number(e.target.value))}
              className="rounded-md border bg-background px-2 py-1.5 text-sm"
            >
              {DAY_NAMES.map((name, d) => (
                <option key={d} value={d}>{name}</option>
              ))}
            </select>
            <Input
              type="time"
              value={`${pad(slot.startHour)}:${pad(slot.startMin)}`}
              onChange={e => {
                const [h, m] = e.target.value.split(':').map(Number)
                updateSlot(i, 'startHour', h)
                updateSlot(i, 'startMin', m)
              }}
              className="w-28 text-sm"
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="time"
              value={`${pad(slot.endHour)}:${pad(slot.endMin)}`}
              onChange={e => {
                const [h, m] = e.target.value.split(':').map(Number)
                updateSlot(i, 'endHour', h)
                updateSlot(i, 'endMin', m)
              }}
              className="w-28 text-sm"
            />
            <Button variant="ghost" size="icon" onClick={() => removeSlot(i)}>
              <Trash2 className="size-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminPanel() {
  const navigate = useNavigate()
  const [locked, setLocked] = useState(false)
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getAppConfig()
      .then(config => {
        setLocked(config.locked)
        setSchedule(config.schedule)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleToggleLock = useCallback(async (checked: boolean) => {
    setLocked(checked)
    setSaving(true)
    await setAppLocked(checked).catch(() => {})
    setSaving(false)
  }, [])

  const handleSaveSchedule = useCallback(async () => {
    setSaving(true)
    await setAppSchedule(schedule).catch(() => {})
    setSaving(false)
  }, [schedule])

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center gap-6 p-6 pt-4 pb-12 max-w-lg mx-auto">
      <div className="flex items-center gap-3 w-full">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">Admin</h1>
      </div>

      {/* Global lock toggle */}
      <Card className="w-full">
        <CardHeader className="flex-row items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            {locked ? <Lock className="size-5 text-red-500" /> : <Unlock className="size-5 text-green-500" />}
            <div>
              <CardTitle className="text-base">
                {locked ? 'App is locked' : 'App is unlocked'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {locked ? 'Kids cannot use the app' : 'Kids can play games'}
              </p>
            </div>
          </div>
          <Switch
            checked={locked}
            onCheckedChange={handleToggleLock}
            disabled={saving}
          />
        </CardHeader>
      </Card>

      {locked && (
        <p className="text-sm text-orange-500 font-medium text-center">
          Global lock is ON — overrides all schedule slots
        </p>
      )}

      {/* Schedule */}
      <Card className="w-full">
        <CardHeader className="p-5">
          <ScheduleEditor schedule={schedule} onChange={setSchedule} />
          <Button
            onClick={handleSaveSchedule}
            disabled={saving}
            className="mt-4 w-full"
          >
            {saving ? 'Saving...' : 'Save schedule'}
          </Button>
        </CardHeader>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        When schedule is set and global lock is off, the app is only available during the scheduled times.
      </p>
    </div>
  )
}

export function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (authenticated) {
    return <AdminPanel />
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Lock className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Admin Access</h1>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false) }}
          placeholder="Enter password"
          className="text-center text-lg"
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          autoFocus
        />
        {error && <p className="text-sm text-red-500 text-center">Wrong password</p>}
        <Button onClick={handleLogin} disabled={!password}>
          Enter
        </Button>
      </div>
    </div>
  )
}
