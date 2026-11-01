import type { ReactNode } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  drawnBar,
  drawnCurve,
  drawnSector,
} from "@/patina/ui/chart"
import { DemoSection, type DemoMeta } from "../demo-kit"
import * as data from "./chart-data"

export const meta: DemoMeta = {
  title: "Chart",
  description:
    "Recharts printed on the page: each series in a drum of the ink set with its own hatch, its strokes drawn by hand through the exact data points.",
  item: "chart",
  group: "Charts",
}

// Curves are made once, so Recharts sees a stable `type`; each seed keeps a series' wobble its own.
const curlewCurve = drawnCurve("monotone", "curlew")
const redshankCurve = drawnCurve("monotone", "redshank")
const brentCurve = drawnCurve("monotone", "brent")

const CHART = "aspect-auto h-60 w-full"
const margin = { top: 8, right: 4, bottom: 0, left: 0 }
const dot = (key: string) => ({
  r: 2.5,
  strokeWidth: 0,
  fill: `var(--color-${key})`,
})

function ChartCard({
  title,
  description,
  footer,
  children,
}: {
  title: string
  description: string
  footer: ReactNode
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="text-small leading-small text-ink-2">
        {footer}
      </CardFooter>
    </Card>
  )
}

const xAxis = (key: string) => (
  <XAxis
    dataKey={key}
    tickLine={false}
    tickMargin={8}
    interval="equidistantPreserveStart"
  />
)
const yAxis = (
  <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
)

export default function ChartDemo() {
  return (
    <>
      <DemoSection title="Bars">
        <div className="grid items-start gap-snug lg:grid-cols-2">
          <ChartCard
            title="Sightings per day"
            description="All species · Sun 8 – Sat 14 Nov 2026"
            footer={`${data.weekTotal} sightings; the most on Sat 14, a spring tide.`}
          >
            <ChartContainer config={data.sightingsConfig} className={CHART}>
              <BarChart accessibilityLayer data={data.week} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("day")}
                {yAxis}
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="sightings"
                  fill="var(--hatch-sightings)"
                  shape={drawnBar}
                />
              </BarChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Sightings by place"
            description="Stacked · same week"
            footer="The tidal flats carry two in five sightings."
          >
            <ChartContainer config={data.placeConfig} className={CHART}>
              <BarChart accessibilityLayer data={data.week} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("day")}
                {yAxis}
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {Object.keys(data.placeConfig).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="place"
                    fill={`var(--hatch-${key})`}
                    shape={drawnBar}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </DemoSection>

      <DemoSection title="Lines and areas">
        <div className="grid items-start gap-snug lg:grid-cols-2">
          <ChartCard
            title="High-tide roost"
            description="Saturday counts · 5 Sep – 14 Nov"
            footer="Curlew passed a hundred on 14 Nov."
          >
            <ChartContainer config={data.roostConfig} className={CHART}>
              <LineChart accessibilityLayer data={data.roost} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("week")}
                {yAxis}
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="curlew"
                  type={curlewCurve}
                  stroke="var(--color-curlew)"
                  strokeWidth={1.5}
                  dot={dot("curlew")}
                />
                <Line
                  dataKey="redshank"
                  type={redshankCurve}
                  stroke="var(--color-redshank)"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  dot={dot("redshank")}
                />
              </LineChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Brent geese on the reserve"
            description="Saturday counts · 5 Sep – 14 Nov"
            footer="702 on 14 Nov, the most since the reserve opened."
          >
            <ChartContainer config={data.brentConfig} className={CHART}>
              <AreaChart accessibilityLayer data={data.brent} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("week")}
                {yAxis}
                <ChartTooltip
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Area
                  dataKey="brent"
                  type={brentCurve}
                  fill="var(--hatch-brent)"
                  fillOpacity={1}
                  stroke="var(--color-brent)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </DemoSection>

      <DemoSection title="Donut, tooltip and legend">
        <div className="grid items-start gap-snug lg:grid-cols-2">
          <ChartCard
            title="Sightings by status"
            description="Same week · checked by the warden"
            footer="Twelve rare records await the county recorder."
          >
            <ChartContainer config={data.statusConfig} className={CHART}>
              <PieChart accessibilityLayer>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="status" hideLabel />}
                />
                <Pie
                  data={data.status}
                  dataKey="count"
                  nameKey="status"
                  innerRadius="58%"
                  outerRadius="92%"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  shape={drawnSector}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox)) return null
                      const { cx = 0, cy = 0 } = viewBox
                      return (
                        <text x={cx} y={cy} textAnchor="middle">
                          <tspan
                            x={cx}
                            y={cy + 2}
                            className="fill-ink font-read text-h2 font-semibold"
                          >
                            {data.weekTotal}
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 22}
                            className="fill-ink-2 font-label text-label tracking-[0.06em] uppercase"
                          >
                            Sightings
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                />
              </PieChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Waders by day"
            description="Tooltip held open on Thu 12"
            footer="Avocets more than doubled the day after the storm."
          >
            <ChartContainer config={data.waderConfig} className={CHART}>
              <BarChart accessibilityLayer data={data.waders} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("day")}
                {yAxis}
                <ChartTooltip
                  defaultIndex={4}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend
                  verticalAlign="top"
                  content={<ChartLegendContent verticalAlign="top" />}
                />
                {Object.keys(data.waderConfig).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={`var(--hatch-${key})`}
                    shape={drawnBar}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </DemoSection>
    </>
  )
}
