import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { saveProfile } from '@/games/gamification'

const AVATAR_OPTIONS = [
  '🧒', '👦', '👧', '🧒🏻', '👦🏻', '👧🏻',
  '🐱', '🐶', '🦊', '🐼', '🐸', '🦄',
  '🦁', '🐯', '🐻', '🐨', '🐰', '🐷',
  '🌟', '🚀', '🎨', '⚽', '🎸', '🌈',
]

export function SetupProfile({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🧒')

  const handleStart = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    saveProfile({ name: trimmed, emoji })
    onComplete()
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
        disabled={!name.trim()}
      >
        Let's go!
      </Button>
    </div>
  )
}
