"use client"

import * as React from "react"
import { seedOf, stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import {
  hatchId,
  seriesStyle,
  useChart,
  type ChartConfig,
  type ChartHatch,
} from "@/patina/ui/chart-context"

// Hatch fills: one SVG pattern per series, defined once per chart and printed in the series' ink over a faint tint
// of it, the way a riso screen prints. Each kind reads differently without colour; the angle leans a few degrees by
// a seed from the series key, so it is the same on the server, in the browser and in every build.

const TINT = 0.16

function HatchPattern({
  id,
  hatch,
  color,
  seed,
}: {
  id: string
  hatch: ChartHatch
  color: string
  seed: string
}) {
  const lean = Math.round(stream(seedOf(seed), "hatch").signed() * 8)
  const tile = (size: number, angle: number, marks: React.ReactNode) => (
    <pattern
      id={id}
      width={size}
      height={size}
      patternUnits="userSpaceOnUse"
      patternTransform={`rotate(${angle})`}
    >
      <rect width={size} height={size} fill={color} fillOpacity={TINT} />
      <g fill={color}>{marks}</g>
    </pattern>
  )

  switch (hatch) {
    case "cross":
      return tile(
        7,
        45 + lean,
        <>
          <rect width={1.25} height={7} />
          <rect width={7} height={1.25} />
        </>,
      )
    case "dots":
      return tile(
        6,
        lean,
        <>
          <circle cx={1.5} cy={1.5} r={1.3} />
          <circle cx={4.5} cy={4.5} r={1.3} />
        </>,
      )
    case "horizontal":
      return tile(5, lean, <rect width={5} height={1.4} />)
    case "antidiagonal":
      return tile(4.5, -45 + lean, <rect width={1.25} height={4.5} />)
    default:
      return tile(6, 45 + lean, <rect width={1.5} height={6} />)
  }
}

/** Every series' hatch for one chart, in a hidden SVG that the chart's shapes refer to by id. */
export function ChartHatchDefs({
  chartId,
  config,
}: {
  chartId: string
  config: ChartConfig
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        {Object.keys(config).map((key) => (
          <HatchPattern
            key={key}
            id={hatchId(chartId, key)}
            hatch={seriesStyle(config, key).hatch}
            color={`var(--color-${key})`}
            seed={key}
          />
        ))}
      </defs>
    </svg>
  )
}

/**
 * A series' key in a tooltip or legend: a small square of its hatch with an ink edge, a short stroke in its dash
 * pattern for a line, or a plain ink square when the series has no hatch.
 */
export function ChartSwatch({
  seriesKey,
  color,
  variant = "hatch",
  dash,
  className,
}: {
  seriesKey?: string
  color?: string
  variant?: "hatch" | "ink" | "line"
  dash?: string | number
  className?: string
}) {
  const { chartId } = useChart()
  const ink =
    color ?? (seriesKey ? `var(--color-${seriesKey})` : "currentColor")

  if (variant === "line") {
    return (
      <svg
        data-slot="chart-swatch"
        aria-hidden="true"
        viewBox="0 0 16 10"
        className={cn("h-2.5 w-4 shrink-0 overflow-visible", className)}
      >
        <line
          x1={1}
          y1={5}
          x2={15}
          y2={5}
          stroke={ink}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={dash}
        />
      </svg>
    )
  }

  if (variant === "hatch" && seriesKey) {
    return (
      <svg
        data-slot="chart-swatch"
        aria-hidden="true"
        viewBox="0 0 12 12"
        className={cn("size-3 shrink-0", className)}
      >
        <rect
          x={0.75}
          y={0.75}
          width={10.5}
          height={10.5}
          rx={1}
          fill={`url(#${hatchId(chartId, seriesKey)})`}
          stroke={ink}
          strokeWidth={1.5}
        />
      </svg>
    )
  }

  return (
    <span
      data-slot="chart-swatch"
      aria-hidden="true"
      className={cn("size-2.5 shrink-0 rounded-[1px]", className)}
      style={{ backgroundColor: ink }}
    />
  )
}
