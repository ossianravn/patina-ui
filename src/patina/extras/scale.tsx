"use client"

import * as React from "react"
import { sketch } from "@/patina/ink/rough"
import { fork } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { Circle } from "@/patina/marks/hand-marks"
import { useSeed } from "@/patina/print/seed-scope"

// A drawn scale (Mental Models' EvidenceScale): a pen line through one dot per stop, the dots up to the value inked
// in the drum, and the value's label circled by hand. Labels stay in HTML so they keep their size at any width; when
// the container is too narrow for the row, the scale stands upright with the labels beside their dots.

export interface ScaleProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "role"
> {
  /** The stops in order: words, or numbers for a numeric scale. */
  stops: readonly (string | number)[]
  /** One of the stops. */
  value: string | number
  /** What the scale measures; shown above it and used as its accessible name. */
  label: string
  /** Words for the two ends of a numeric scale, e.g. ["Fog", "Clear"]. */
  ends?: readonly [string, string]
  seed?: string | number
}

// Container widths below which the row stands upright, chosen from the longest label. Literal classes so Tailwind
// sees them.
const STACK = {
  sm: {
    row: "@max-[20rem]/scale:grid-cols-1 @max-[20rem]/scale:grid-rows-[repeat(var(--stops),auto)] @max-[20rem]/scale:gap-y-hair",
    stop: "@max-[20rem]/scale:flex-row @max-[20rem]/scale:items-center @max-[20rem]/scale:gap-tight",
    across: "@max-[20rem]/scale:hidden",
    down: "@max-[20rem]/scale:block",
  },
  md: {
    row: "@max-[28rem]/scale:grid-cols-1 @max-[28rem]/scale:grid-rows-[repeat(var(--stops),auto)] @max-[28rem]/scale:gap-y-hair",
    stop: "@max-[28rem]/scale:flex-row @max-[28rem]/scale:items-center @max-[28rem]/scale:gap-tight",
    across: "@max-[28rem]/scale:hidden",
    down: "@max-[28rem]/scale:block",
  },
  lg: {
    row: "@max-[36rem]/scale:grid-cols-1 @max-[36rem]/scale:grid-rows-[repeat(var(--stops),auto)] @max-[36rem]/scale:gap-y-hair",
    stop: "@max-[36rem]/scale:flex-row @max-[36rem]/scale:items-center @max-[36rem]/scale:gap-tight",
    across: "@max-[36rem]/scale:hidden",
    down: "@max-[36rem]/scale:block",
  },
} as const

/** Roughly how wide a row of mono labels needs to be, in rem: 0.48rem a character plus room for the ring. */
function stackAt(labels: string[]): keyof typeof STACK {
  const widest = Math.max(...labels.map((l) => l.length), 1)
  const need = labels.length * (widest * 0.48 + 1.6)
  return need <= 20 ? "sm" : need <= 28 ? "md" : "lg"
}

function Scale({
  stops,
  value,
  label,
  ends,
  seed,
  className,
  style,
  ...props
}: ScaleProps) {
  const at = Math.max(0, stops.indexOf(value))
  const numeric = typeof stops[0] === "number"
  const s = useSeed("scale", seed ?? `${label}:${stops.join("|")}`)
  const marks = React.useMemo(
    () => ({
      across: sketch.line(0, 2.4, 100, 1.6, {
        seed: s,
        stroke: "var(--line)",
        strokeWidth: 1.6,
        roughness: 0.9,
        nonScaling: true,
      }),
      down: sketch.line(2, 0, 2.6, 100, {
        seed: s,
        stroke: "var(--line)",
        strokeWidth: 1.6,
        roughness: 0.9,
        nonScaling: true,
      }),
      dots: stops.map((_, i) =>
        sketch.circle(9, 9, 12, {
          seed: fork(s, `dot:${i}`),
          stroke: i <= at ? "var(--k)" : "var(--line)",
          strokeWidth: i <= at ? 1 : 1.4,
          fill: i <= at ? "var(--k)" : "var(--card)",
          fillStyle: "solid",
          roughness: 0.9,
        }),
      ),
    }),
    [s, stops, at],
  )
  const words = stops.map((stop, i) =>
    numeric && ends && (i === 0 || i === stops.length - 1)
      ? `${stop} ${ends[i === 0 ? 0 : 1]}`
      : String(stop),
  )
  const stack = STACK[stackAt(words)]
  const valueText = numeric
    ? `${stops[at]} of ${stops[stops.length - 1]}${ends ? ` (${stops[0]} ${ends[0]}, ${stops[stops.length - 1]} ${ends[1]})` : ""}`
    : `${stops[at]}, ${at + 1} of ${stops.length}`
  const inset = `calc(50% / var(--stops))`

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={numeric ? Number(stops[0]) : 1}
      aria-valuemax={numeric ? Number(stops[stops.length - 1]) : stops.length}
      aria-valuenow={numeric ? Number(stops[at]) : at + 1}
      aria-valuetext={valueText}
      data-slot="scale"
      className={cn(
        "@container/scale flex w-full max-w-[36rem] min-w-0 flex-col gap-tight",
        className,
      )}
      style={{ "--stops": stops.length, ...style } as React.CSSProperties}
      {...props}
    >
      <span
        aria-hidden="true"
        className="text-small leading-small font-semibold text-ink"
      >
        {label}
      </span>
      <div
        aria-hidden="true"
        className={cn(
          "relative grid grid-cols-[repeat(var(--stops),minmax(0,1fr))]",
          stack.row,
        )}
      >
        <svg
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
          className={cn(
            "absolute top-[7px] h-1 overflow-visible",
            stack.across,
          )}
          style={{ left: inset, width: `calc(100% - 100% / var(--stops))` }}
          dangerouslySetInnerHTML={{ __html: marks.across }}
        />
        <svg
          viewBox="0 0 4 100"
          preserveAspectRatio="none"
          className={cn(
            "absolute top-[9px] left-[7px] hidden h-[calc(100%-18px)] w-1 overflow-visible",
            stack.down,
          )}
          dangerouslySetInnerHTML={{ __html: marks.down }}
        />
        {words.map((word, i) => (
          <span
            key={i}
            data-slot="scale-stop"
            data-current={i === at || undefined}
            className={cn(
              "relative flex min-w-0 flex-col items-center gap-hair",
              stack.stop,
            )}
          >
            <svg
              viewBox="0 0 18 18"
              className="size-[18px] shrink-0 overflow-visible"
              dangerouslySetInnerHTML={{ __html: marks.dots[i]! }}
            />
            <span
              className={cn(
                "font-label text-label leading-[1.45] tracking-[0.06em] whitespace-nowrap uppercase tabular-nums",
                i === at ? "font-bold text-ink" : "font-medium text-ink-3",
              )}
            >
              {i === at ? (
                <Circle
                  seed={`${s}:${word}`}
                  className="-mx-[0.5em] px-[0.5em]"
                >
                  {word}
                </Circle>
              ) : (
                word
              )}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export { Scale }
