"use client"

import * as React from "react"

// The chart's shared state: its config, its id (which scopes the hatch patterns) and the defaults that give every
// series an ink and a hatch, so series differ by pattern as well as colour.

// Format: { THEME_NAME: CSS_SELECTOR }. Patina's night paper is data-theme="night" on the root, not shadcn's .dark.
export const THEMES = { light: "", dark: ':root[data-theme="night"]' } as const

/** The hatch a series fills its bars, areas and slices with. */
export type ChartHatch =
  "diagonal" | "cross" | "dots" | "horizontal" | "antidiagonal"

/** Series without a hatch take the next one in this order. */
export const CHART_HATCHES: readonly ChartHatch[] = [
  "diagonal",
  "cross",
  "dots",
  "horizontal",
  "antidiagonal",
]

/** Series without a colour take the next drum in this order, so a chart re-inks with the page's ink set. Red comes
 * before blue because blue beside the violet detail drum is too close to tell apart (dataviz validator). */
export const CHART_INKS: readonly string[] = [
  "var(--print-line)",
  "var(--print-accent)",
  "var(--print-detail)",
  "var(--print-red)",
  "var(--print-blue)",
]

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    /** Patina: the series' hatch; defaults by position in the config. */
    hatch?: ChartHatch
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
  /** Scopes the chart's hatch patterns, so several charts on a page never share an id. */
  chartId: string
}

export const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

/** The id of a series' hatch pattern inside one chart. */
export function hatchId(chartId: string, key: string) {
  return `${chartId}-hatch-${key.replace(/[^\w-]/g, "_")}`
}

/** A series' ink and hatch, explicit or by its position in the config. */
export function seriesStyle(config: ChartConfig, key: string) {
  const index = Math.max(0, Object.keys(config).indexOf(key))
  const item = config[key]
  return {
    color: item?.color ?? CHART_INKS[index % CHART_INKS.length]!,
    hatch: item?.hatch ?? CHART_HATCHES[index % CHART_HATCHES.length]!,
  }
}

/** Whether a fill refers to a series' hatch (var(--hatch-<key>) or its pattern id), not an ink or a gradient. */
export function isHatchFill(value: unknown): value is string {
  return typeof value === "string" && value.includes("-hatch-")
}

/**
 * The config key an item belongs to: the value of `key` on the item or its data row (a pie slice's name, say),
 * else `key` itself. Undefined when neither is in the config.
 */
export function getPayloadConfigKey(
  config: ChartConfig,
  payload: unknown,
  key: string,
): string | undefined {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  if (configLabelKey in config) return configLabelKey
  return key in config ? key : undefined
}
