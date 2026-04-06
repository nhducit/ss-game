import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createProfile } from '@/games/convex-sync'

const AVATAR_OPTIONS = [
  '🧒', '👦', '👧', '🧒🏻', '👦🏻', '👧🏻',
  '🐱', '🐶', '🦊', '🐼', '🐸', '🦄',
  '🦁', '🐯', '🐻', '🐨', '🐰', '🐷',
  '🌟', '🚀', '🎨', '⚽', '🎸', '🌈',
]

export function SetupProfile({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🧒')
  const [saving, setSaving] = useState(false)

  const handleStart = async () => {
    const trimmed = name.trim()
    if (!trimmed || saving) return
    setSaving(true)
    try {
      await createProfile(trimmed, emoji)
      onComplete()
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome!</h1>
        <p className="mt-2 text-muted-foreground">What should we call you?</p>
      </div>

      <div className="text-7xl">{emoji}</div>

      <div className="grid grid-cols-8 gap-2 max-w-xs">
        {AVATAR_OPTIONS.map(e => (
          <button
            key={e}
            onClick={() => setEmoji(e)}
            className={`text-2xl rounded-lg p-1.5 transition-all touch-manipulation ${
              emoji === e
                ? 'bg-primary/20 ring-2 ring-primary scale-110'
                : 'hover:bg-muted active:scale-95'
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        className="text-center text-lg font-semibold max-w-xs"
        onKeyDown={e => e.key === 'Enter' && handleStart()}
        autoFocus
      />

      <Button
        size="lg"
        className="text-lg px-8"
        onClick={handleStart}
        disabled={!name.trim() || saving}
      >
        {saving ? 'Setting up...' : "Let's go!"}
      </Button>
    </div>
  )
}
