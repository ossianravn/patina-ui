"use client"

import * as React from "react"
import { sketch } from "@/patina/ink/rough"
import { fork } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { useSeed } from "@/patina/print/seed-scope"

// Ringed-number steps (Mental Models' step paths), drawn like the questionnaire's progress rings: mono numbers in pen
// rings, the current ring inked, the others in the rule colour; a done step's number gives way to the hand tick in
// the drum. A pen line joins each ring to the next, solid once that stretch is behind you and dashed ahead.
// Horizontal steps fall back to the vertical layout when their container is too narrow for a row.

export interface Step {
  title: React.ReactNode
  description?: React.ReactNode
}

export interface StepsProps extends React.ComponentProps<"ol"> {
  steps: readonly Step[]
  /** Index of the step in progress; earlier steps are done. Pass steps.length when all are done. */
  current?: number
  orientation?: "vertical" | "horizontal"
  /** Words a screen reader hears after a done step's title. */
  doneLabel?: string
  seed?: string | number
}

type State = "done" | "current" | "upcoming"

const TICK = (seed: number) =>
  sketch.curve(
    [
      [4, 13],
      [10, 20],
      [24, 2],
    ],
    { seed, stroke: "var(--k)", strokeWidth: 2.8, roughness: 0.8 },
  )
const RING = (seed: number, current: boolean) =>
  sketch.circle(14, 14, 25, {
    seed,
    stroke: current ? "var(--ink)" : "var(--rule)",
    strokeWidth: current ? 1.5 : 1.3,
    roughness: 0.9,
  })
// The joining line, drawn in a 4 × 100 box and stretched along the gap with a constant pen width.
const JOIN = (seed: number, behind: boolean, across: boolean) => {
  const pen = {
    seed,
    stroke: behind
      ? "color-mix(in srgb, var(--line) 60%, transparent)"
      : "color-mix(in srgb, var(--ink-faint) 75%, transparent)",
    strokeWidth: 1.4,
    roughness: 0.6,
    nonScaling: true,
    ...(behind ? {} : { strokeLineDash: [4, 5] }),
  }
  return across
    ? sketch.line(0, 2, 100, 2, pen)
    : sketch.line(2, 0, 2, 100, pen)
}

function Steps({
  steps,
  current = 0,
  orientation = "vertical",
  doneLabel = "done",
  seed,
  className,
  ...props
}: StepsProps) {
  const base = useSeed(
    "steps",
    seed ?? steps.map((s) => String(s.title)).join("|"),
  )
  const marks = React.useMemo(
    () =>
      steps.map((_, i) => {
        const s = fork(base, String(i))
        return {
          ring: RING(s, i === current),
          tick: TICK(s + 1),
          down: JOIN(s + 2, i < current, false),
          across: JOIN(s + 2, i < current, true),
        }
      }),
    [steps, base, current],
  )
  const across = orientation === "horizontal"

  return (
    <div
      data-slot="steps"
      data-orientation={orientation}
      className={cn("@container/steps w-full min-w-0", className)}
    >
      <ol
        className={cn(
          "m-0 flex list-none flex-col p-0",
          across && "@min-[34rem]/steps:flex-row",
        )}
        {...props}
      >
        {steps.map((step, i) => {
          const state: State =
            i < current ? "done" : i === current ? "current" : "upcoming"
          const last = i === steps.length - 1
          return (
            <li
              key={i}
              data-slot="step"
              data-state={state}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "group/step relative flex min-w-0 items-start gap-tight pb-snug last:pb-0",
                across &&
                  "@min-[34rem]/steps:flex-1 @min-[34rem]/steps:flex-col @min-[34rem]/steps:items-stretch @min-[34rem]/steps:gap-hair @min-[34rem]/steps:pb-0",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  data-slot="step-ring"
                  className="relative flex size-7 shrink-0 items-center justify-center font-label text-label font-semibold text-ink-3 tabular-nums group-data-[state=current]/step:font-bold group-data-[state=current]/step:text-ink"
                >
                  <svg
                    viewBox="0 0 28 28"
                    className="absolute inset-0 size-full overflow-visible"
                    dangerouslySetInnerHTML={{ __html: marks[i]!.ring }}
                  />
                  {state === "done" ? (
                    <svg
                      viewBox="0 0 26 26"
                      className="relative size-[1.05rem] overflow-visible"
                      dangerouslySetInnerHTML={{ __html: marks[i]!.tick }}
                    />
                  ) : (
                    <span className="relative">{i + 1}</span>
                  )}
                </span>
                {across && !last ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 100 4"
                    preserveAspectRatio="none"
                    className="hidden h-1 min-w-4 flex-1 overflow-visible @min-[34rem]/steps:block"
                    dangerouslySetInnerHTML={{ __html: marks[i]!.across }}
                  />
                ) : null}
              </span>
              {!last ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 4 100"
                  preserveAspectRatio="none"
                  className={cn(
                    "pointer-events-none absolute start-[calc(0.875rem-2px)] top-8 h-[calc(100%-2.25rem)] w-1 overflow-visible",
                    across && "@min-[34rem]/steps:hidden",
                  )}
                  dangerouslySetInnerHTML={{ __html: marks[i]!.down }}
                />
              ) : null}
              <span
                className={cn(
                  "flex min-w-0 flex-col gap-0.5 pt-0.5",
                  across && "@min-[34rem]/steps:pe-snug",
                )}
              >
                <span
                  data-slot="step-title"
                  className="font-read text-body leading-subhead text-ink-3 group-data-[state=current]/step:font-semibold group-data-[state=current]/step:text-ink group-data-[state=done]/step:font-semibold group-data-[state=done]/step:text-ink-2"
                >
                  {step.title}
                  {state === "done" ? (
                    <span className="sr-only">, {doneLabel}</span>
                  ) : null}
                </span>
                {step.description ? (
                  <span
                    data-slot="step-description"
                    className="text-small leading-small text-ink-2"
                  >
                    {step.description}
                  </span>
                ) : null}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export { Steps }
