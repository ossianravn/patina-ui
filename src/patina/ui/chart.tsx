"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/patina/lib/utils"
import {
  ChartContext,
  THEMES,
  hatchId,
  seriesStyle,
  type ChartConfig,
} from "@/patina/ui/chart-context"
import { ChartHatchDefs } from "@/patina/ui/chart-hatch"

// A chart printed on the page: series in the drums of the page's ink set, each with its own hatch so series differ
// without colour; axis labels in the mono voice in text inks; grid lines faint dashed rules. Opt into drawn marks
// with drawnBar, drawnCurve and drawnSector (chart-drawn.tsx). Calm at every variation level: the data never moves.

const INITIAL_DIMENSION = { width: 320, height: 200 } as const

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${(id ?? uniqueId).replace(/[^\w-]/g, "")}`
  const context = React.useMemo(() => ({ config, chartId }), [config, chartId])

  return (
    <ChartContext.Provider value={context}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "relative flex aspect-video justify-center font-label text-label text-ink-2",
          // Axes: mono labels in a text ink; pen-line axis and tick lines; faint dashed rules for the grid.
          "[&_.recharts-cartesian-axis-tick-value]:fill-ink-2 [&_.recharts-cartesian-axis-tick-value]:tracking-[0.06em] [&_.recharts-cartesian-axis-tick-value]:uppercase [&_.recharts-cartesian-axis-tick-value]:tabular-nums [&_.recharts-polar-angle-axis-tick_text]:fill-ink-2 [&_.recharts-label]:fill-ink-2",
          "[&_.recharts-cartesian-axis-line[stroke='#666']]:stroke-line [&_.recharts-cartesian-axis-tick-line[stroke='#666']]:stroke-line [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-rule [&_.recharts-cartesian-grid_line[stroke='#ccc']:not([stroke-dasharray])]:[stroke-dasharray:2_4] [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-rule [&_.recharts-reference-line_[stroke='#ccc']]:stroke-line",
          // Hover: a dashed pencil line or a band of pressed paper; active dots are ink with a paper ring.
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-ink-3 [&_.recharts-curve.recharts-tooltip-cursor]:[stroke-dasharray:3_3] [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-paper-3/70 [&_.recharts-radial-bar-background-sector]:fill-paper-2 [&_.recharts-dot[stroke='#fff']]:stroke-card [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden",
          // Ink overprints like a riso drum: multiplied on day paper, screened on night paper.
          "[&_:is(.recharts-bar,.recharts-area,.recharts-line,.recharts-pie)]:mix-blend-multiply night:[&_:is(.recharts-bar,.recharts-area,.recharts-line,.recharts-pie)]:mix-blend-screen",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ChartHatchDefs chartId={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// Writes --color-<key> for every series (its own colour, or the next drum when it has none) and --hatch-<key>, which
// resolves to the series' pattern in this chart: fill="var(--hatch-<key>)".
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const keys = Object.keys(config)

  if (!keys.length) {
    return null
  }

  const blocks = Object.entries(THEMES).map(([theme, prefix]) => {
    const night = theme !== "light"
    const lines = keys.flatMap((key) => {
      const item = config[key]
      const color =
        item?.theme?.[theme as keyof typeof item.theme] ??
        item?.color ??
        (night ? undefined : seriesStyle(config, key).color)
      return [
        color ? `  --color-${key}: ${color};` : null,
        night ? null : `  --hatch-${key}: url(#${hatchId(id, key)});`,
      ].filter(Boolean)
    })
    return lines.length
      ? `${prefix} [data-chart="${id}"] {\n${lines.join("\n")}\n}`
      : ""
  })

  return <style dangerouslySetInnerHTML={{ __html: blocks.join("\n") }} />
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartLegend = RechartsPrimitive.Legend

/** A series' hatch as a fill value: `fill={hatchFill("curlew")}` is `fill="var(--hatch-curlew)"`. */
function hatchFill(key: string) {
  return `var(--hatch-${key})`
}

export { ChartContainer, ChartTooltip, ChartLegend, ChartStyle, hatchFill }
export {
  ChartTooltipContent,
  ChartLegendContent,
} from "@/patina/ui/chart-tooltip"
export { ChartSwatch } from "@/patina/ui/chart-hatch"
export { drawnBar, drawnCurve, drawnSector } from "@/patina/ui/chart-drawn"
export {
  CHART_HATCHES,
  CHART_INKS,
  type ChartConfig,
  type ChartHatch,
} from "@/patina/ui/chart-context"
