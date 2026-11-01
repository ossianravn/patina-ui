"use client"

import { cn } from "@/patina/lib/utils"
import {
  RecordsCard,
  SurveyCard,
  tally,
  type RecordsCardProps,
  type SurveyCardProps,
} from "@/patina/blocks/dashboard-01-lists"
import {
  ChartCard,
  DailyChart,
  PlaceChart,
  StatCard,
} from "@/patina/blocks/dashboard-01-parts"

// A week at a glance: four headline numbers, records per day and counts per place as drawn bars in hatch, a ledger
// of records and a survey's progress. Pass your own data, shaped like SAMPLE; the layout follows the width of its
// container, so it works beside a sidebar as well as on a whole page.

export const meta = {
  title: "Dashboard",
  description:
    "A week at a glance: headline numbers, two hand-drawn bar charts in hatch, a ledger of records and a survey in progress.",
}

export interface Dashboard01Data {
  /** The place the numbers describe, above the title. */
  site: string
  /** The period, beside the site and under the charts' titles. */
  week: string
  stats: { label: string; value: number; note: string }[]
  daily: { day: string; observations: number }[]
  dailyNote: string
  places: { place: string; birds: number }[]
  placesNote: string
  records: RecordsCardProps
  survey: SurveyCardProps
}

/** A saltmarsh reserve in the week of Sun 8 – Sat 14 Nov 2026. */
export const SAMPLE: Dashboard01Data = {
  site: "Saltmarsh reserve",
  week: "Sun 8 – Sat 14 Nov",
  stats: [
    { label: "Observations", value: 12, note: "Most on Thu 12" },
    { label: "Species", value: 12, note: "One record each" },
    { label: "Rare", value: 3, note: "For the county report" },
    { label: "Birds counted", value: 352, note: "79% on the tidal flats" },
  ],
  daily: [
    { day: "Sun 8", observations: 0 },
    { day: "Mon 9", observations: 0 },
    { day: "Tue 10", observations: 2 },
    { day: "Wed 11", observations: 2 },
    { day: "Thu 12", observations: 3 },
    { day: "Fri 13", observations: 3 },
    { day: "Sat 14", observations: 2 },
  ],
  dailyNote: "Nothing on Sunday or Monday; the most on Thu 12.",
  places: [
    { place: "Tidal flats", birds: 279 },
    { place: "Saltings", birds: 61 },
    { place: "Sea wall", birds: 6 },
    { place: "Reed bed", birds: 3 },
    { place: "North hide", birds: 2 },
    { place: "Sluice gate", birds: 1 },
  ],
  placesNote:
    "The tidal flats carry 79% of the birds, most of them one goose flock.",
  records: {
    title: "Recent records",
    description: "The week's latest six",
    rows: [
      {
        id: "obs-0412",
        species: "Grey heron",
        place: "Tidal flats",
        status: "confirmed",
        count: 1,
      },
      {
        id: "obs-0411",
        species: "Curlew",
        place: "Saltings",
        status: "confirmed",
        count: 14,
      },
      {
        id: "obs-0410",
        species: "Bittern",
        place: "Reed bed",
        status: "rare",
        count: 1,
      },
      {
        id: "obs-0409",
        species: "Brent goose",
        place: "Tidal flats",
        status: "confirmed",
        count: 230,
      },
      {
        id: "obs-0408",
        species: "Kingfisher",
        place: "Sluice gate",
        status: "unconfirmed",
        count: 1,
      },
      {
        id: "obs-0407",
        species: "Avocet",
        place: "Saltings",
        status: "confirmed",
        count: 36,
      },
    ],
  },
  survey: {
    title: "Winter wader count",
    description: "Today · led by Mira Okafor",
    sectors: [
      { name: "Tidal flats north", counted: true },
      { name: "Tidal flats south", counted: true },
      { name: "Saltings", counted: true },
      { name: "Sluice gate", counted: true },
      { name: "Sea wall", counted: false },
      { name: "North hide", counted: false },
    ],
  },
}

export interface Dashboard01Props {
  data?: Dashboard01Data
  title?: string
  className?: string
}

export function Dashboard01({
  data = SAMPLE,
  title = "Overview",
  className,
}: Dashboard01Props) {
  return (
    <div className={cn("@container", className)}>
      <div className="mx-auto max-w-[72rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <p className="label-mono m-0 text-ink-2">
          {data.site} · {data.week}
        </p>
        <h1 className="m-0 mt-hair text-h1">{title}</h1>

        <section
          aria-label="This week"
          className="mt-line grid grid-cols-2 gap-snug @min-[56rem]:grid-cols-4"
        >
          {data.stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={tally(stat.value)}
              note={stat.note}
            />
          ))}
        </section>

        <div className="mt-snug grid gap-snug @min-[56rem]:grid-cols-2">
          <ChartCard
            title="Observations per day"
            description={data.week}
            footer={data.dailyNote}
          >
            <DailyChart data={data.daily} />
          </ChartCard>
          <ChartCard
            title="Birds counted by place"
            description="Same week, every species"
            footer={data.placesNote}
          >
            <PlaceChart data={data.places} />
          </ChartCard>
        </div>

        <div className="mt-snug grid gap-snug @min-[56rem]:grid-cols-[minmax(0,1fr)_20rem]">
          <RecordsCard {...data.records} />
          <SurveyCard {...data.survey} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard01
