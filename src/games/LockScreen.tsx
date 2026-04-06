import { Lock } from 'lucide-react'

export function LockScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background p-6">
      <Lock className="size-16 text-muted-foreground" />
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Time's up!
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Ask daddy to unlock the app for you.
        </p>
      </div>
    </div>
  )
}
