import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { categories, levels, type Category, type Level } from './words'
import { getCategoryProgress } from './progress'

interface CategoryPickerProps {
  title: string
  subtitle: string
  gamePath: string
  onSelect: (category: Category, level: Level) => void
}

function ProgressBar({ learned, total }: { learned: number; total: number }) {
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0
  if (learned === 0) return null
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{learned}/{total}</span>
    </div>
  )
}

export function CategoryPicker({ title, subtitle, gamePath, onSelect }: CategoryPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  if (selectedCategory) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Games</Link>
          <ChevronRight className="size-3.5" />
          <Link to={gamePath as '/'} className="hover:text-foreground transition-colors">{title}</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground font-medium">{selectedCategory.emoji} {selectedCategory.name}</span>
        </nav>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {selectedCategory.emoji} {selectedCategory.name}
          </h1>
          <p className="mt-1 text-muted-foreground">Pick a level</p>
        </div>
        <div className="grid w-full max-w-md gap-3">
          {levels.map((level) => {
            const words = selectedCategory.words[level.id]
            const { learned, total } = getCategoryProgress(selectedCategory.id, level.id, words)
            return (
              <button
                key={level.id}
                onClick={() => onSelect(selectedCategory, level.id)}
                className="text-left w-full"
              >
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardHeader className="flex-row items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                      {level.emoji}
                    </div>
                    <div className="flex-1">
                      <CardTitle>{level.name}</CardTitle>
                      <CardDescription>{level.description} — {total} words</CardDescription>
                      <ProgressBar learned={learned} total={total} />
                    </div>
                  </CardHeader>
                </Card>
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to topics
        </button>
      </div>
    )
  }

  // Calculate total progress per category (across all levels)
  const categoryProgress = categories.map(cat => {
    let totalLearned = 0
    let totalWords = 0
    for (const level of levels) {
      const words = cat.words[level.id]
      const { learned, total } = getCategoryProgress(cat.id, level.id, words)
      totalLearned += learned
      totalWords += total
    }
    return { learned: totalLearned, total: totalWords }
  })

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Games</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid w-full max-w-md gap-3">
        {categories.map((cat, i) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="text-left w-full">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex-row items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                  {cat.emoji}
                </div>
                <div className="flex-1">
                  <CardTitle>{cat.name}</CardTitle>
                  <CardDescription>
                    {levels.map(l => l.name).join(' · ')}
                  </CardDescription>
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
