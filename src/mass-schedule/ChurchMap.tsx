import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { divIcon, type LatLngExpression, type LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Church } from './types'

const VIETNAM_CENTER: LatLngExpression = [16.0, 106.0]

function pinIcon(highlighted: boolean) {
  const color = highlighted ? '#dc2626' : '#2563eb'
  return divIcon({
    html: `<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>`,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  })
}

function FitToChurches({ churches }: { churches: Church[] }) {
  const map = useMap()
  useEffect(() => {
    if (churches.length === 0) return
    if (churches.length === 1) {
      map.setView([churches[0].lat, churches[0].lng], 14)
      return
    }
    const bounds: LatLngTuple[] = churches.map((c) => [c.lat, c.lng])
    map.fitBounds(bounds, { padding: [32, 32] })
  }, [churches, map])
  return null
}

function FlyToSelected({ church }: { church: Church | null }) {
  const map = useMap()
  useEffect(() => {
    if (church) map.flyTo([church.lat, church.lng], 15, { duration: 0.6 })
  }, [church, map])
  return null
}

export function ChurchMap({
  churches,
  selected,
  onSelect,
  userLocation,
}: {
  churches: Church[]
  selected: Church | null
  onSelect: (church: Church) => void
  userLocation: { lat: number; lng: number } | null
}) {
  const initialCenter = useMemo<LatLngExpression>(() => {
    if (churches.length > 0) return [churches[0].lat, churches[0].lng]
    return VIETNAM_CENTER
  }, [churches])

  return (
    <MapContainer
      center={initialCenter}
      zoom={6}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToChurches churches={churches} />
      <FlyToSelected church={selected} />
      {userLocation && (
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={300}
          pathOptions={{ color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.3 }}
        />
      )}
      {churches.map((church) => (
        <Marker
          key={church.slug}
          position={[church.lat, church.lng]}
          icon={pinIcon(selected?.slug === church.slug)}
          eventHandlers={{ click: () => onSelect(church) }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{church.name}</p>
              <p className="text-muted-foreground">{church.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
