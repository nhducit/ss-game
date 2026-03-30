import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { categories, levels, type Category, type Level } from './words'

interface CategoryPickerProps {
  title: string
  subtitle: string
  gamePath: string
  onSelect: (category: Category, level: Level) => void
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
            const wordCount = selectedCategory.words[level.id].length
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
                    <div>
                      <CardTitle>{level.name}</CardTitle>
                      <CardDescription>{level.description} — {wordCount} words</CardDescription>
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
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="text-left w-full">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex-row items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                  {cat.emoji}
                </div>
                <div>
                  <CardTitle>{cat.name}</CardTitle>
                  <CardDescription>
                    {levels.map(l => l.name).join(' · ')}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
