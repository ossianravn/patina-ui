import type { Dashboard01Data } from "@/patina/blocks/dashboard-01"
import { OBSERVATIONS, PLACES } from "./data"

// The overview's numbers, all computed from the same records the observations list shows, for the week of
// Sun 8 – Sat 14 Nov 2026, and shaped for the dashboard-01 block that renders them.

const WEEK = [8, 9, 10, 11, 12, 13, 14]
const NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const dayOf = (iso: string) => Number(iso.slice(8, 10))

/** Observations recorded each day of the week. */
export const perDay = WEEK.map((d, i) => ({
  day: `${NAMES[i]} ${d}`,
  observations: OBSERVATIONS.filter((o) => dayOf(o.seen) === d).length,
}))

/** Birds counted at each place, most first. */
export const perPlace = PLACES.map((place) => ({
  place,
  birds: OBSERVATIONS.filter((o) => o.place === place).reduce(
    (sum, o) => sum + o.count,
    0,
  ),
}))
  .filter((p) => p.birds > 0)
  .sort((a, b) => b.birds - a.birds)

/** The week's largest counts. */
export const biggest = [...OBSERVATIONS]
  .sort((a, b) => b.count - a.count)
  .slice(0, 6)

const busiest = perDay.reduce((a, b) =>
  b.observations > a.observations ? b : a,
)

export const totals = {
  observations: OBSERVATIONS.length,
  species: new Set(OBSERVATIONS.map((o) => o.species)).size,
  rare: OBSERVATIONS.filter((o) => o.status === "rare").length,
  birds: OBSERVATIONS.reduce((sum, o) => sum + o.count, 0),
  busiest: busiest.day,
  topPlace: perPlace[0]?.place ?? "",
  topShare: Math.round(
    ((perPlace[0]?.birds ?? 0) /
      OBSERVATIONS.reduce((sum, o) => sum + o.count, 0)) *
      100,
  ),
}

/** Today's wader count: sectors of the reserve counted so far. */
export const waderCount = {
  done: 4,
  of: 6,
  sectors: [
    "Tidal flats north",
    "Tidal flats south",
    "Saltings",
    "Sluice gate",
    "Sea wall",
    "North hide",
  ],
}

/** The overview page's data, in the shape the dashboard block takes. */
export const overview: Dashboard01Data = {
  site: "Saltmarsh reserve",
  week: "Sun 8 – Sat 14 Nov",
  stats: [
    {
      label: "Observations",
      value: totals.observations,
      note: `Most on ${totals.busiest}`,
    },
    { label: "Species", value: totals.species, note: "One record each" },
    { label: "Rare", value: totals.rare, note: "For the county report" },
    {
      label: "Birds counted",
      value: totals.birds,
      note: `${totals.topShare}% on the ${totals.topPlace.toLowerCase()}`,
    },
  ],
  daily: perDay,
  dailyNote: `Nothing on Sunday or Monday; the most on ${totals.busiest}.`,
  places: perPlace,
  placesNote: `The ${totals.topPlace.toLowerCase()} carry ${totals.topShare}% of the birds, most of them one goose flock.`,
  records: {
    title: "Biggest counts",
    description: "This week, by birds counted",
    rows: biggest.map((o) => ({
      id: o.id,
      species: o.species,
      place: o.place,
      status: o.status,
      count: o.count,
      href: `/fieldbook/observations/${o.id}`,
    })),
  },
  survey: {
    title: "Winter wader count",
    description: "Today · led by Mira Okafor",
    sectors: waderCount.sectors.map((name, i) => ({
      name,
      counted: i < waderCount.done,
    })),
  },
}
