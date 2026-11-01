"use client"

import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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

// The dashboard's parts, usable on their own: a headline number, a card that frames a chart, and its two charts in
// drawn bars over per-series hatch.

/** A headline number: what it counts in mono, the number, one line of context. */
export function StatCard({
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

/** A chart with its title and period above and one line on what it shows below. */
export function ChartCard({
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

const dailyConfig = {
  observations: { label: "Observations" },
} satisfies ChartConfig
const placeConfig = { birds: { label: "Birds counted" } } satisfies ChartConfig

/** Records per day as drawn bars in hatch; the axis shows the date, the tooltip the weekday too ("Sat 14"). */
export function DailyChart({
  data,
}: {
  data: { day: string; observations: number }[]
}) {
  return (
    <ChartContainer config={dailyConfig} className="aspect-auto h-56 w-full">
      <BarChart
        accessibilityLayer
        data={data}
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
  )
}

/** A count per place as horizontal drawn bars, most first, each labelled with its number. */
export function PlaceChart({
  data,
}: {
  data: { place: string; birds: number }[]
}) {
  return (
    <ChartContainer config={placeConfig} className="aspect-auto h-56 w-full">
      <BarChart
        accessibilityLayer
        data={data}
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
  )
}
