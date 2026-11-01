import type { MotifName } from "@/patina/ink"

// Fieldbook's demo data: a saltmarsh reserve in mid-November. Static, so every visit starts the same; changes made in
// the demo live in memory and reset on reload. The demo clock is fixed at 14 November 2026.

export type Status = "confirmed" | "unconfirmed" | "rare"

export interface Observation {
  id: string
  species: string
  latin: string
  place: string
  /** Local time of the sighting, ISO 8601. */
  seen: string
  count: number
  status: Status
  motif: MotifName
  notes: string
}

export const PLACES = [
  "Tidal flats",
  "Sluice gate",
  "North hide",
  "Reed bed",
  "Sea wall",
  "Saltings",
] as const

export const STATUS_LABEL: Record<Status, string> = {
  confirmed: "Confirmed",
  unconfirmed: "Unconfirmed",
  rare: "Rare",
}

export const OBSERVATIONS: Observation[] = [
  {
    id: "obs-0412",
    species: "Grey heron",
    latin: "Ardea cinerea",
    place: "Tidal flats",
    seen: "2026-11-14T05:42",
    count: 1,
    status: "confirmed",
    motif: "horizon",
    notes: "Still for eleven minutes, then a single strike.",
  },
  {
    id: "obs-0411",
    species: "Curlew",
    latin: "Numenius arquata",
    place: "Saltings",
    seen: "2026-11-14T05:31",
    count: 14,
    status: "confirmed",
    motif: "flow",
    notes: "Feeding in a loose line along the creek edge.",
  },
  {
    id: "obs-0410",
    species: "Bittern",
    latin: "Botaurus stellaris",
    place: "Reed bed",
    seen: "2026-11-13T16:58",
    count: 1,
    status: "rare",
    motif: "sprig",
    notes: "Heard booming twice; seen briefly at the reed edge.",
  },
  {
    id: "obs-0409",
    species: "Brent goose",
    latin: "Branta bernicla",
    place: "Tidal flats",
    seen: "2026-11-13T09:12",
    count: 230,
    status: "confirmed",
    motif: "scatter",
    notes: "Dark-bellied. Flock lifted when the tide turned.",
  },
  {
    id: "obs-0408",
    species: "Kingfisher",
    latin: "Alcedo atthis",
    place: "Sluice gate",
    seen: "2026-11-13T08:04",
    count: 1,
    status: "unconfirmed",
    motif: "lens",
    notes: "A flash of blue past the gate; no perch seen.",
  },
  {
    id: "obs-0407",
    species: "Avocet",
    latin: "Recurvirostra avosetta",
    place: "Saltings",
    seen: "2026-11-12T14:20",
    count: 36,
    status: "confirmed",
    motif: "contours",
    notes: "Sweeping in the shallow pool behind the sea wall.",
  },
  {
    id: "obs-0406",
    species: "Spoonbill",
    latin: "Platalea leucorodia",
    place: "North hide",
    seen: "2026-11-12T11:47",
    count: 2,
    status: "rare",
    motif: "collage",
    notes: "Two adults, asleep for most of the hour.",
  },
  {
    id: "obs-0405",
    species: "Redshank",
    latin: "Tringa totanus",
    place: "Tidal flats",
    seen: "2026-11-12T07:15",
    count: 48,
    status: "confirmed",
    motif: "tiles",
    notes: "Alarm calls when a harrier passed over.",
  },
  {
    id: "obs-0404",
    species: "Marsh harrier",
    latin: "Circus aeruginosus",
    place: "Reed bed",
    seen: "2026-11-11T15:33",
    count: 1,
    status: "confirmed",
    motif: "orbits",
    notes: "Female quartering low over the reeds.",
  },
  {
    id: "obs-0403",
    species: "Water rail",
    latin: "Rallus aquaticus",
    place: "Reed bed",
    seen: "2026-11-11T08:50",
    count: 1,
    status: "unconfirmed",
    motif: "rings",
    notes: "Squealing call only.",
  },
  {
    id: "obs-0402",
    species: "Little egret",
    latin: "Egretta garzetta",
    place: "Sea wall",
    seen: "2026-11-10T13:05",
    count: 6,
    status: "confirmed",
    motif: "lino",
    notes: "Roosting on the wall at high tide.",
  },
  {
    id: "obs-0401",
    species: "Twite",
    latin: "Linaria flavirostris",
    place: "Saltings",
    seen: "2026-11-10T10:22",
    count: 11,
    status: "rare",
    motif: "constellation",
    notes: "Small flock on the saltmarsh plants; buff throats.",
  },
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/** "Sat 14 Nov, 05:42". Formatted by hand rather than Intl, so the server and every browser print the same text. */
export function when(iso: string) {
  const [date = "", clock = "00:00"] = iso.split("T")
  const [y = 2026, m = 1, d = 1] = date.split("-").map(Number)
  const weekday = DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return `${weekday} ${d} ${MONTHS[m - 1]}, ${clock}`
}

const NUMBER = new Intl.NumberFormat("en-GB")

/** "48,000". A fixed locale, so the server and every browser print the same text. */
export const tally = (n: number) => NUMBER.format(n)

/** The number after the highest id in a list, for the next record ("obs-0413" → 414). */
export const nextNumber = (list: Observation[]) =>
  list.reduce((max, o) => Math.max(max, Number(o.id.slice(4)) || 0), 0) + 1
