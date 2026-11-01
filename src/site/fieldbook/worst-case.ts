import { OBSERVATIONS, type Observation } from "./data"

// Worst-case Fieldbook data, for the dev-only data switch (`/fieldbook/data/worst`). Every value is one a real
// notebook produces or an import could carry: hybrids and qualifiers in names, trinomials, five-figure counts,
// free-text places from older records, a missing Latin name. Never imported by client code.

const WORST: Observation[] = [
  {
    id: "obs-0520",
    species: "Caspian gull × yellow-legged gull hybrid",
    latin: "Larus cachinnans × Larus michahellis",
    place: "Sea wall, 200 m north of the sluice gate",
    seen: "2026-11-14T06:58",
    count: 1,
    status: "unconfirmed",
    motif: "rings",
    notes:
      "Third-winter type. Mantle a shade too dark for a pure Caspian; photos taken.",
  },
  {
    id: "obs-0519",
    species: "Ruff",
    latin: "Calidris pugnax",
    place: "Saltings",
    seen: "2026-11-14T06:40",
    count: 1,
    status: "rare",
    motif: "sprig",
    notes: "",
  },
  {
    id: "obs-0518",
    species: "Red knot",
    latin: "Calidris canutus",
    place: "Tidal flats",
    seen: "2026-11-14T06:12",
    count: 48000,
    status: "confirmed",
    motif: "scatter",
    notes: "Whole flock up at once when the peregrine came through.",
  },
  {
    id: "obs-0517",
    species: "Black redstart",
    latin: "Phoenicurus ochruros gibraltariensis",
    place: "North hide (east window, the one that sticks)",
    seen: "2026-11-13T15:47",
    count: 2,
    status: "rare",
    motif: "lens",
    notes: "Female-type pair on the hide roof.",
  },
  {
    id: "obs-0516",
    species: "Chiffchaff/willow warbler",
    latin: "",
    place: "Reed bed",
    seen: "2026-11-13T11:05",
    count: 3,
    status: "unconfirmed",
    motif: "flow",
    notes: "Calls only, never seen well.",
  },
  {
    id: "obs-0515",
    species: "Snow bunting & Lapland bunting",
    latin: "Plectrophenax nivalis & Calcarius lapponicus",
    place: "Saltings",
    seen: "2026-11-13T09:30",
    count: 1284,
    status: "confirmed",
    motif: "constellation",
    notes: "Mixed flock along the strandline.",
  },
  {
    id: "obs-0514",
    species: "Curlew",
    latin: "Numenius arquata",
    place: "Saltings",
    seen: "2026-11-12T16:20",
    count: 214,
    status: "confirmed",
    motif: "contours",
    notes: "",
  },
  {
    id: "obs-0513",
    species: "Curlew",
    latin: "Numenius arquata",
    place: "Tidal flats",
    seen: "2026-11-12T07:02",
    count: 9,
    status: "confirmed",
    motif: "horizon",
    notes: "",
  },
]

/** 1,000 rows, unpaginated: the demo records repeated with fresh ids. */
const THOUSAND: Observation[] = Array.from({ length: 1000 }, (_, i) => {
  const base = OBSERVATIONS[i % OBSERVATIONS.length]!
  return { ...base, id: `obs-${String(2000 - i).padStart(4, "0")}` }
})

export const DATASETS = {
  demo: OBSERVATIONS,
  worst: WORST,
  empty: [],
  one: [OBSERVATIONS[1]!],
  thousand: THOUSAND,
} satisfies Record<string, Observation[]>

export type Dataset = keyof typeof DATASETS
