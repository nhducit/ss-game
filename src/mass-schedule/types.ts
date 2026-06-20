export interface MassTime {
  daysOfWeek: number[]
  time: string
  note?: string
}

export interface Church {
  _id: string
  name: string
  slug: string
  address: string
  city: string
  lat: number
  lng: number
  phone?: string
  sourceUrl?: string
  massTimes: MassTime[]
}
