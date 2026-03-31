import { Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { chineseCategories, levels, type ChineseCategory, type Level } from './words'
import { getCategoryProgress } from './progress'
import { useChineseLevel } from './use-level'

interface CategoryPickerProps {
  title: string
  subtitle: string
  onSelect: (category: ChineseCategory, level: Level) => void
}

function ProgressBar({ learned, total }: { learned: number; total: number }) {
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0
  if (learned === 0) return null
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-red-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{learned}/{total}</span>
    </div>
  )
}

export function ChineseCategoryPicker({ title, subtitle, onSelect }: CategoryPickerProps) {
  const [level] = useChineseLevel()
  const levelInfo = levels.find(l => l.id === level)!

  const categoryProgress = chineseCategories.map(cat => {
    const words = cat.words[level]
    return getCategoryProgress(cat.id, level, words)
  })

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Games</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {levelInfo.emoji} {levelInfo.name} — {levelInfo.description}
        </p>
      </div>
      <div className="grid w-full max-w-md gap-3">
        {chineseCategories.map((cat, i) => (
          <button key={cat.id} onClick={() => onSelect(cat, level)} className="text-left w-full">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex-row items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                  {cat.emoji}
                </div>
                <div className="flex-1">
                  <CardTitle>{cat.name}</CardTitle>
                  <CardDescription>{cat.words[level].length} words</CardDescription>
                  <ProgressBar learned={categoryProgress[i].learned} total={categoryProgress[i].total} />
                </div>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
