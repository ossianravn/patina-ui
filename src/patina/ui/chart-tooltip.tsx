"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType } from "recharts"
import { cn } from "@/patina/lib/utils"
import {
  getPayloadConfigKey,
  isHatchFill,
  useChart,
} from "@/patina/ui/chart-context"
import { ChartSwatch } from "@/patina/ui/chart-hatch"

// The tooltip is a small float sheet of card stock, like a popover: the label in the mono voice, one row per series
// with its swatch, name and a tabular mono value. The legend is a row of mono labels, each with the series' hatch
// (or its stroke and dash, for a line). Both use text inks; the print inks stay in the swatches.

type TooltipNameType = number | string

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const configKey = getPayloadConfigKey(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : configKey && config[configKey]?.label

    const classes = cn("label-mono font-semibold text-ink", labelClassName)
    if (labelFormatter) {
      return <div className={classes}>{labelFormatter(value, payload)}</div>
    }

    if (!value) {
      return null
    }

    return <div className={classes}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "float-sheet grid min-w-36 items-start gap-hair px-tight py-hair",
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
            const configKey = getPayloadConfigKey(config, item, key)
            const itemConfig = configKey ? config[configKey] : undefined
            const fill = (item.payload as { fill?: unknown } | undefined)?.fill
            const hatched = isHatchFill(item.fill) || isHatchFill(fill)
            const raw = color ?? (hatched ? undefined : (item.color ?? fill))
            const ink =
              (typeof raw === "string" && !isHatchFill(raw) && raw) ||
              (configKey ? `var(--color-${configKey})` : "var(--ink)")

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg:not([data-slot=chart-swatch])]:size-3 [&>svg:not([data-slot=chart-swatch])]:text-ink-2",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator &&
                      (indicator === "dot" ? (
                        <ChartSwatch
                          seriesKey={configKey}
                          color={ink}
                          variant={hatched ? "hatch" : "ink"}
                        />
                      ) : (
                        <div
                          className={cn(
                            "shrink-0 rounded-[1px] border-(--swatch) bg-(--swatch)",
                            indicator === "line" && "w-1",
                            indicator === "dashed" &&
                              "w-0 border-[1.5px] border-dashed bg-transparent",
                            nestLabel && indicator === "dashed" && "my-0.5",
                          )}
                          style={{ "--swatch": ink } as React.CSSProperties}
                        />
                      ))
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between gap-snug",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1">
                        {nestLabel ? tooltipLabel : null}
                        <span className="label-mono text-ink-2">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span className="font-label text-small leading-none font-semibold text-ink tabular-nums">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  const keys = Object.keys(config)
  const order = (key?: string) => {
    const at = key ? keys.indexOf(key) : -1
    return at < 0 ? keys.length : at
  }

  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-snug gap-y-hair",
        verticalAlign === "top" ? "pb-tight" : "pt-tight",
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          return { item, configKey: getPayloadConfigKey(config, item, key) }
        })
        // In config order, the order inks and hatches are dealt in, not Recharts' alphabetical one.
        .sort((a, b) => order(a.configKey) - order(b.configKey))
        .map(({ item, configKey }, index) => {
          const itemConfig = configKey ? config[configKey] : undefined
          const series = item.payload as
            { fill?: unknown; strokeDasharray?: string | number } | undefined
          const hatched = isHatchFill(series?.fill) || isHatchFill(item.color)
          const variant = hatched
            ? "hatch"
            : item.type === "line"
              ? "line"
              : "ink"
          const ink =
            !isHatchFill(item.color) && item.color
              ? item.color
              : configKey && `var(--color-${configKey})`

          return (
            <div
              key={index}
              className="label-mono flex items-center gap-1.5 text-ink-2 [&>svg:not([data-slot=chart-swatch])]:size-3 [&>svg:not([data-slot=chart-swatch])]:text-ink-2"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <ChartSwatch
                  seriesKey={configKey}
                  color={ink || undefined}
                  variant={variant}
                  dash={series?.strokeDasharray}
                />
              )}
              {itemConfig?.label ?? item.value}
            </div>
          )
        })}
    </div>
  )
}

export { ChartTooltipContent, ChartLegendContent }
