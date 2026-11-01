import { useState } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/patina/ui/card"
import { Switch } from "@/patina/ui/switch"
import {
  OBSERVATIONS,
  nextNumber,
  tally,
  type Observation,
} from "@/site/fieldbook/data"
import { NewObservation } from "@/site/fieldbook/new-observation"
import { ObservationRow } from "@/site/fieldbook/observation-row"
import {
  ChartCard,
  DailyChart,
  StatCard,
} from "@/patina/blocks/dashboard-01-parts"
import { SettingsRow } from "@/patina/blocks/settings-01"
import { perDay, totals } from "@/site/fieldbook/overview-data"

// Real Fieldbook pieces, working: the observations list with its New observation dialog, the overview's numbers and
// chart, and a card of notification settings. Changes live in memory, as in Fieldbook itself.

const PAGES = new Set(OBSERVATIONS.map((o) => o.id))

function ObservationsExcerpt() {
  const [items, setItems] = useState(() => OBSERVATIONS.slice(0, 4))
  const [next, setNext] = useState(() => nextNumber(OBSERVATIONS))
  const [fresh, setFresh] = useState<string | null>(null)
  const add = (item: Observation) => {
    setItems((list) => [item, ...list])
    setNext((n) => n + 1)
    setFresh(item.id)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="col-start-1">Observations</CardTitle>
        <CardDescription className="col-start-1">
          Saltmarsh reserve · this morning
        </CardDescription>
        {/* Under the title when the header is too narrow for both (CardAction never wraps by itself). */}
        <CardAction className="@max-[22rem]/card-header:col-span-2 @max-[22rem]/card-header:col-start-1 @max-[22rem]/card-header:row-span-1 @max-[22rem]/card-header:row-start-3 @max-[22rem]/card-header:mt-hair @max-[22rem]/card-header:justify-self-start">
          <NewObservation next={next} onAdd={add} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="m-0 list-none border-t border-dashed border-rule p-0">
          {items.map((item) => (
            <ObservationRow
              key={item.id}
              item={item}
              href={
                PAGES.has(item.id)
                  ? `/fieldbook/observations/${item.id}`
                  : undefined
              }
              fresh={item.id === fresh}
              onDuplicate={() =>
                add({ ...item, id: `obs-${String(next).padStart(4, "0")}` })
              }
              onDelete={() =>
                setItems((list) => list.filter((o) => o.id !== item.id))
              }
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

const ALERTS = [
  ["tides", "Tide alerts", "An hour before high tide at your saved sites."],
  ["digest", "Weekly digest", "Every Monday: your week's sightings."],
  ["rare", "Rare sightings nearby", "A rarity within 20 km."],
] as const

function SettingsCard() {
  const [on, setOn] = useState<Record<string, boolean>>({
    tides: true,
    rare: true,
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Mira Okafor · mira@example.com</CardDescription>
      </CardHeader>
      <CardContent className="[&>div:last-child]:border-b-0 [&>div:last-child]:pb-0">
        {ALERTS.map(([key, label, hint]) => (
          <SettingsRow
            key={key}
            label={label}
            hint={hint}
            htmlFor={`studio-${key}`}
          >
            <Switch
              id={`studio-${key}`}
              checked={!!on[key]}
              onCheckedChange={(value) =>
                setOn((s) => ({ ...s, [key]: value }))
              }
            />
          </SettingsRow>
        ))}
      </CardContent>
    </Card>
  )
}

/** The Fieldbook previews, arranged for the studio's preview column. */
export function FieldbookPreviews() {
  return (
    <>
      <div className="@min-[40rem]:col-span-2">
        <ObservationsExcerpt />
      </div>
      <div className="grid grid-cols-2 gap-snug @min-[40rem]:col-span-2">
        <StatCard
          label="Observations"
          value={tally(totals.observations)}
          note={`Most on ${totals.busiest}`}
        />
        <StatCard
          label="Rare"
          value={tally(totals.rare)}
          note="For the county report"
        />
      </div>
      <ChartCard
        title="Observations per day"
        description="Sun 8 – Sat 14 Nov"
        footer={`The most on ${totals.busiest}.`}
      >
        <DailyChart data={perDay} />
      </ChartCard>
      <SettingsCard />
    </>
  )
}
