import { vi } from 'react-day-picker/locale'
import { format } from 'date-fns'
import { CalendarIcon, Locate, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TIME_BUCKETS } from './filters'
import { locationPermissionGuideSteps } from './locationPermissionGuide'

const ALL = '__all__'

export function ChurchFilters({
  search,
  onSearchChange,
  date,
  onDateChange,
  timeBucket,
  onTimeBucketChange,
  city,
  onCityChange,
  cities,
  onUseLocation,
  locating,
  locationError,
  locationPermissionDenied,
}: {
  search: string
  onSearchChange: (value: string) => void
  date: Date
  onDateChange: (date: Date) => void
  timeBucket: string | null
  onTimeBucketChange: (bucket: string | null) => void
  city: string | null
  onCityChange: (city: string | null) => void
  cities: string[]
  onUseLocation: () => void
  locating: boolean
  locationError: string | null
  locationPermissionDenied: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm nhà thờ, địa chỉ..."
            className="pl-8"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" className="gap-1.5">
                <CalendarIcon className="size-3.5" />
                {format(date, 'EEE, dd/MM')}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && onDateChange(d)}
              locale={vi}
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={onUseLocation} disabled={locating} className="gap-1.5">
          <Locate className="size-3.5" />
          {locating ? 'Đang định vị...' : 'Gần tôi'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          items={{
            [ALL]: 'Mọi giờ trong ngày',
            ...Object.fromEntries(TIME_BUCKETS.map((b) => [b.id, b.label])),
          }}
          value={timeBucket ?? ALL}
          onValueChange={(v) => onTimeBucketChange(v === ALL ? null : (v as string))}
        >
          <SelectTrigger className="min-w-36">
            <SelectValue placeholder="Buổi lễ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Mọi giờ trong ngày</SelectItem>
            {TIME_BUCKETS.map((bucket) => (
              <SelectItem key={bucket.id} value={bucket.id}>
                {bucket.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={{ [ALL]: 'Mọi thành phố', ...Object.fromEntries(cities.map((c) => [c, c])) }}
          value={city ?? ALL}
          onValueChange={(v) => onCityChange(v === ALL ? null : (v as string))}
        >
          <SelectTrigger className="min-w-32">
            <SelectValue placeholder="Thành phố" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Mọi thành phố</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {locationError && <p className="text-xs text-destructive">{locationError}</p>}

      {locationError && locationPermissionDenied && (
        <ol className="list-decimal space-y-0.5 pl-4 text-xs text-muted-foreground">
          {locationPermissionGuideSteps().map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  )
}
