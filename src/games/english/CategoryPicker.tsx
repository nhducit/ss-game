import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { categories, type Category } from './words'

interface CategoryPickerProps {
  title: string
  subtitle: string
  onSelect: (category: Category) => void
}

export function CategoryPicker({ title, subtitle, onSelect }: CategoryPickerProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid w-full max-w-md gap-3">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => onSelect(cat)} className="text-left w-full">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex-row items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                  {cat.emoji}
                </div>
                <div>
                  <CardTitle>{cat.name}</CardTitle>
                  <CardDescription>{cat.words.length} words</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
