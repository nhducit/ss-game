import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Church as ChurchIcon, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { listChurches, seedChurches } from './convexClient'
import { ChurchMap } from './ChurchMap'
import { ChurchFilters } from './ChurchFilters'
import { haversineKm, formatDistance } from './distance'
import { isInBucket, timeToMinutes } from './filters'
import { MOCK_CHURCHES } from './mockChurches'
import type { Church, MassTime } from './types'

interface UserLocation {
  lat: number
  lng: number
}

function matchingMassTimes(church: Church, weekday: number, timeBucket: string | null): MassTime[] {
  return church.massTimes
    .filter((mt) => mt.daysOfWeek.includes(weekday))
    .filter((mt) => !timeBucket || isInBucket(mt.time, timeBucket))
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
}

export function MassSchedule() {
  const navigate = useNavigate()
  const [churches, setChurches] = useState<Church[] | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [seedError, setSeedError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Church | null>(null)

  const [search, setSearch] = useState('')
  const [date, setDate] = useState(() => new Date())
  const [timeBucket, setTimeBucket] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const loadChurches = useCallback(() => {
    listChurches()
      .then((result) => {
        const list = Array.isArray(result) ? result : []
        setChurches(list.length > 0 ? list : MOCK_CHURCHES)
      })
      .catch(() => setChurches(MOCK_CHURCHES))
  }, [])

  useEffect(() => {
    loadChurches()
  }, [loadChurches])

  const handleSeed = useCallback(async () => {
    setSeeding(true)
    setSeedError(null)
    try {
      await seedChurches()
      loadChurches()
    } catch (err) {
      setSeedError(err instanceof Error ? err.message : 'Nạp dữ liệu mẫu thất bại')
    } finally {
      setSeeding(false)
    }
  }, [loadChurches])

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Thiết bị không hỗ trợ định vị')
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocationError('Không thể lấy vị trí của bạn')
        setLocating(false)
      },
      { timeout: 8000 },
    )
  }, [])

  const cities = useMemo(() => {
    if (!churches) return []
    return Array.from(new Set(churches.map((c) => c.city))).sort()
  }, [churches])

  const weekday = date.getDay()

  const filtered = useMemo(() => {
    if (!churches) return []
    const q = search.trim().toLowerCase()
    return churches
      .filter((c) => !city || c.city === city)
      .filter((c) => !q || `${c.name} ${c.address} ${c.city}`.toLowerCase().includes(q))
      .map((c) => ({ church: c, massTimes: matchingMassTimes(c, weekday, timeBucket) }))
      .filter((entry) => entry.massTimes.length > 0)
      .map((entry) =>
        userLocation
          ? {
              ...entry,
              distanceKm: haversineKm(
                userLocation.lat,
                userLocation.lng,
                entry.church.lat,
                entry.church.lng,
              ),
            }
          : entry,
      )
      .sort((a, b) => {
        if ('distanceKm' in a && 'distanceKm' in b) {
          return (a as { distanceKm: number }).distanceKm - (b as { distanceKm: number }).distanceKm
        }
        return a.church.name.localeCompare(b.church.name)
      })
  }, [churches, search, city, weekday, timeBucket, userLocation])

  const mapChurches = filtered.map((entry) => entry.church)

  if (churches === null) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    )
  }

  if (churches.length === 0) {
    return (
      <div className="flex min-h-svh flex-col gap-6 p-6 pt-4 pb-12 max-w-lg mx-auto">
        <div className="flex items-center gap-3 w-full">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">Giờ lễ</h1>
        </div>
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ChurchIcon />
            </EmptyMedia>
            <EmptyTitle>Chưa có dữ liệu nhà thờ</EmptyTitle>
            <EmptyDescription>
              Nạp dữ liệu mẫu (~10 nhà thờ tại Việt Nam) để bắt đầu sử dụng tính năng tìm giờ lễ.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Đang nạp...' : 'Nạp dữ liệu mẫu'}
          </Button>
          {seedError && <p className="text-xs text-destructive">{seedError}</p>}
        </Empty>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col gap-4 p-4 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 w-full">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">Giờ lễ nhà thờ</h1>
      </div>

      <ChurchFilters
        search={search}
        onSearchChange={setSearch}
        date={date}
        onDateChange={setDate}
        timeBucket={timeBucket}
        onTimeBucketChange={setTimeBucket}
        city={city}
        onCityChange={setCity}
        cities={cities}
        onUseLocation={handleUseLocation}
        locating={locating}
        locationError={locationError}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="h-72 w-full shrink-0 md:h-[calc(100svh-13rem)] md:w-1/2 md:sticky md:top-4">
          <ChurchMap
            churches={mapChurches}
            selected={selected}
            onSelect={setSelected}
            userLocation={userLocation}
          />
        </div>

        <div className="flex w-full flex-col gap-3 md:w-1/2">
          {filtered.length === 0 && (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ChurchIcon />
                </EmptyMedia>
                <EmptyTitle>Không tìm thấy lễ phù hợp</EmptyTitle>
                <EmptyDescription>Thử đổi ngày, giờ hoặc bỏ bộ lọc thành phố.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {filtered.map((entry) => (
            <Card
              key={entry.church.slug}
              className={`cursor-pointer transition-colors ${
                selected?.slug === entry.church.slug ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelected(entry.church)}
            >
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{entry.church.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {entry.church.address}
                    </p>
                  </div>
                  {'distanceKm' in entry && (
                    <Badge variant="secondary" className="shrink-0">
                      {formatDistance((entry as { distanceKm: number }).distanceKm)}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {entry.massTimes.map((mt, i) => (
                    <Badge key={i} variant="outline">
                      {mt.time}
                      {mt.note ? ` · ${mt.note}` : ''}
                    </Badge>
                  ))}
                </div>

                {entry.church.phone && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="size-3" />
                    {entry.church.phone}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
