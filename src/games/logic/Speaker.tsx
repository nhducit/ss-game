import { Volume2 } from 'lucide-react'
import { speak } from '@/games/english/speak'
import { cn } from '@/lib/utils'

export function Speaker({ text, className, size = 'md' }: { text: string; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'size-8' : size === 'lg' ? 'size-14' : 'size-11'
  const icon = size === 'sm' ? 'size-4' : size === 'lg' ? 'size-7' : 'size-5'
  return (
    <button
      type="button"
      onClick={() => speak(text, 0.85)}
      aria-label="Read aloud"
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 active:scale-95 transition-all shrink-0 touch-manipulation',
        dim,
        className,
      )}
    >
      <Volume2 className={cn(icon, 'text-primary')} />
    </button>
  )
}
