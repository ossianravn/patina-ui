import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Badge } from "@/patina/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/patina/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  drawnBar,
  type ChartConfig,
} from "@/patina/ui/chart"
import { Progress } from "@/patina/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/patina/ui/table"
import { STATUS_LABEL, tally } from "./data"
import { biggest, perDay, perPlace, totals, waderCount } from "./overview-data"

const BADGE = {
  confirmed: "secondary",
  unconfirmed: "outline",
  rare: "default",
} as const
const dayConfig = {
  observations: { label: "Observations" },
} satisfies ChartConfig
const placeConfig = { birds: { label: "Birds counted" } } satisfies ChartConfig

/** A headline number: what it counts in mono, the number, one line of context. */
function Stat({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <Card size="sm">
      <CardContent>
        <p className="label-mono m-0 text-ink-2">{label}</p>
        <p className="m-0 mt-hair font-read text-h1 leading-heading tabular-nums">
          {value}
        </p>
        <p className="m-0 mt-hair text-small leading-small text-ink-2">
          {note}
        </p>
      </CardContent>
    </Card>
  )
}

function ChartCard({
  title,
  description,
  footer,
  children,
}: {
  title: string
  description: string
  footer: string
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <p className="m-0 text-small leading-small text-ink-2">{footer}</p>
      </CardFooter>
    </Card>
  )
}

/** Fieldbook's overview of the week: headline numbers, two charts, the biggest counts and today's survey. */
export function Overview() {
  return (
    <div className="mx-auto max-w-[72rem] px-snug pb-page pt-section sm:px-line">
      <p className="label-mono m-0 text-ink-2">
        Saltmarsh reserve · Sun 8 – Sat 14 Nov
      </p>
      <h1 className="m-0 mt-hair text-h1">Overview</h1>

      <section
        aria-label="This week"
        className="mt-line grid grid-cols-2 gap-snug lg:grid-cols-4"
      >
        <Stat
          label="Observations"
          value={tally(totals.observations)}
          note={`Most on ${totals.busiest}`}
        />
        <Stat
          label="Species"
          value={tally(totals.species)}
          note="One record each"
        />
        <Stat
          label="Rare"
          value={tally(totals.rare)}
          note="For the county report"
        />
        <Stat
          label="Birds counted"
          value={tally(totals.birds)}
          note={`${totals.topShare}% on the ${totals.topPlace.toLowerCase()}`}
        />
      </section>

      <div className="mt-snug grid gap-snug lg:grid-cols-2">
        <ChartCard
          title="Observations per day"
          description="Sun 8 – Sat 14 Nov"
          footer={`Nothing on Sunday or Monday; the most on ${totals.busiest}.`}
        >
          <ChartContainer
            config={dayConfig}
            className="aspect-auto h-56 w-full"
          >
            <BarChart
              accessibilityLayer
              data={perDay}
              margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={8}
                tickFormatter={(d: string) => d.split(" ")[1] ?? d}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={28}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="observations"
                fill="var(--hatch-observations)"
                shape={drawnBar}
              />
            </BarChart>
          </ChartContainer>
        </ChartCard>
        <ChartCard
          title="Birds counted by place"
          description="Same week, every species"
          footer={`The ${totals.topPlace.toLowerCase()} carry ${totals.topShare}% of the birds, most of them one goose flock.`}
        >
          <ChartContainer
            config={placeConfig}
            className="aspect-auto h-56 w-full"
          >
            <BarChart
              accessibilityLayer
              data={perPlace}
              layout="vertical"
              margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="place"
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="birds" fill="var(--hatch-birds)" shape={drawnBar}>
                <LabelList
                  dataKey="birds"
                  position="right"
                  className="fill-ink-2 font-label text-label tabular-nums"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>

      <div className="mt-snug grid gap-snug lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader>
            <CardTitle>Biggest counts</CardTitle>
            <CardDescription>This week, by birds counted</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Species</TableHead>
                  <TableHead className="max-sm:hidden">Place</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {biggest.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <a href={`/fieldbook/observations/${o.id}`}>
                        {o.species}
                      </a>
                    </TableCell>
                    <TableCell className="text-ink-2 max-sm:hidden">
                      {o.place}
                    </TableCell>
                    <TableCell>
                      <Badge variant={BADGE[o.status]}>
                        {STATUS_LABEL[o.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {tally(o.count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="self-start">
          <CardHeader>
            <CardTitle>Winter wader count</CardTitle>
            <CardDescription>Today · led by Mira Okafor</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress
              value={(waderCount.done / waderCount.of) * 100}
              aria-label="Sectors counted"
            />
            <p className="label-mono m-0 mt-tight text-ink-2">
              {waderCount.done} of {waderCount.of} sectors counted
            </p>
            <ul className="m-0 mt-snug list-none p-0">
              {waderCount.sectors.map((s, i) => (
                <li
                  key={s}
                  className="flex items-baseline justify-between gap-tight border-b border-dashed border-rule py-hair"
                >
                  <span className={i < waderCount.done ? "" : "text-ink-2"}>
                    {s}
                  </span>
                  <span className="label-mono text-ink-3">
                    {i < waderCount.done ? "Counted" : "To do"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
