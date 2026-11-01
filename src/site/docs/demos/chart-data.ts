import type { ChartConfig } from "@/patina/ui/chart"

// Fieldbook's saltmarsh reserve. The week of Sun 8 – Sat 14 Nov 2026: sightings by place sum to each day's total,
// and the status split sums to the week's.

const places = [
  ["Sun 8", 14, 10, 4, 6],
  ["Mon 9", 11, 8, 3, 5],
  ["Tue 10", 17, 13, 5, 6],
  ["Wed 11", 6, 7, 2, 4],
  ["Thu 12", 15, 12, 4, 7],
  ["Fri 13", 19, 15, 5, 7],
  ["Sat 14", 21, 18, 6, 7],
] as const

export const week = places.map(([day, flats, saltings, reedbed, seawall]) => ({
  day,
  flats,
  saltings,
  reedbed,
  seawall,
  sightings: flats + saltings + reedbed + seawall,
}))

export const weekTotal = week.reduce((sum, d) => sum + d.sightings, 0)

export const sightingsConfig = {
  sightings: { label: "Sightings" },
} satisfies ChartConfig

export const placeConfig = {
  flats: { label: "Tidal flats" },
  saltings: { label: "Saltings" },
  reedbed: { label: "Reed bed" },
  seawall: { label: "Sea wall" },
} satisfies ChartConfig

export const waders = [
  { day: "Sun 8", curlew: 12, redshank: 9, avocet: 5 },
  { day: "Mon 9", curlew: 10, redshank: 7, avocet: 3 },
  { day: "Tue 10", curlew: 15, redshank: 11, avocet: 6 },
  { day: "Wed 11", curlew: 7, redshank: 5, avocet: 2 },
  { day: "Thu 12", curlew: 13, redshank: 10, avocet: 5 },
  { day: "Fri 13", curlew: 16, redshank: 12, avocet: 7 },
  { day: "Sat 14", curlew: 19, redshank: 14, avocet: 8 },
]

export const waderConfig = {
  curlew: { label: "Curlew" },
  redshank: { label: "Redshank" },
  avocet: { label: "Avocet" },
} satisfies ChartConfig

// High-tide roost counts, Saturdays from 5 Sep to 14 Nov.
export const roost = [
  { week: "5 Sep", curlew: 46, redshank: 38 },
  { week: "12 Sep", curlew: 52, redshank: 41 },
  { week: "19 Sep", curlew: 61, redshank: 36 },
  { week: "26 Sep", curlew: 58, redshank: 44 },
  { week: "3 Oct", curlew: 74, redshank: 49 },
  { week: "10 Oct", curlew: 81, redshank: 47 },
  { week: "17 Oct", curlew: 77, redshank: 55 },
  { week: "24 Oct", curlew: 92, redshank: 52 },
  { week: "31 Oct", curlew: 88, redshank: 61 },
  { week: "7 Nov", curlew: 96, redshank: 58 },
  { week: "14 Nov", curlew: 104, redshank: 63 },
]

export const roostConfig = {
  curlew: { label: "Curlew" },
  redshank: { label: "Redshank" },
} satisfies ChartConfig

// Brent geese arriving for the winter, same Saturdays.
export const brent = [
  { week: "5 Sep", brent: 0 },
  { week: "12 Sep", brent: 0 },
  { week: "19 Sep", brent: 12 },
  { week: "26 Sep", brent: 40 },
  { week: "3 Oct", brent: 115 },
  { week: "10 Oct", brent: 260 },
  { week: "17 Oct", brent: 410 },
  { week: "24 Oct", brent: 520 },
  { week: "31 Oct", brent: 610 },
  { week: "7 Nov", brent: 640 },
  { week: "14 Nov", brent: 702 },
]

export const brentConfig = {
  brent: {
    label: "Brent geese",
    color: "var(--print-detail)",
    hatch: "dots",
  },
} satisfies ChartConfig

export const status = [
  { status: "confirmed", count: 196, fill: "var(--hatch-confirmed)" },
  { status: "unconfirmed", count: 49, fill: "var(--hatch-unconfirmed)" },
  { status: "rare", count: 12, fill: "var(--hatch-rare)" },
]

export const statusConfig = {
  confirmed: { label: "Confirmed" },
  unconfirmed: { label: "Unconfirmed" },
  rare: { label: "Rare" },
} satisfies ChartConfig
