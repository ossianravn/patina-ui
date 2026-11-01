"use client"

import * as React from "react"
import { sketch } from "@/patina/ink/rough"
import { fork, stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { Stamp } from "@/patina/marks/stamp"
import { Tape } from "@/patina/marks/paper-marks"
import { textOf, useSeed } from "@/patina/print/seed-scope"

// One question branching to its answers (Mental Models' KindMap). The question sits on a card at the top; drawn
// branches fall from it to a card per option, each with its answer. The chosen branch is inked in the drum and its
// card is stamped and, at the lively level, taped down. Cards lean by a seeded share of --tilt-max. In a narrow
// container, or with more than four options, the options stack under the question on a drawn rail.

export interface DecisionOption {
  id: string
  title: React.ReactNode
  /** Why this option fits, in a sentence or two. */
  answer: React.ReactNode
}

export interface DecisionMapProps extends Omit<
  React.ComponentProps<"section">,
  "children"
> {
  question: React.ReactNode
  options: readonly DecisionOption[]
  /** The id of the option to highlight. */
  chosen?: string
  /** The stamp on the chosen card. */
  chosenLabel?: string
  seed?: string | number
}

// Branches are drawn in a 1000 × 56 box stretched across the row; each leaves the question and lands vertically on
// its column's centre, so the fixed-size arrowheads on the cards line up with it at any width.
function branches(n: number, chosen: number, seed: number) {
  return Array.from({ length: n }, (_, i) => {
    const x0 = 500 + (i - (n - 1) / 2) * 16
    const x1 = ((i + 0.5) / n) * 1000
    return sketch.path(`M ${x0} 0 C ${x0} 30 ${x1} 24 ${x1} 56`, {
      seed: fork(seed, `branch:${i}`),
      stroke: i === chosen ? "var(--k)" : "var(--line)",
      strokeWidth: i === chosen ? 2.2 : 1.4,
      roughness: 0.8,
      nonScaling: true,
    })
  })
}

const HEAD = (seed: number, ink: string) =>
  sketch.line(1, 1, 6, 7, {
    seed,
    stroke: ink,
    strokeWidth: 1.6,
    roughness: 0.5,
  }) +
  sketch.line(11, 1, 6, 7, {
    seed: seed + 1,
    stroke: ink,
    strokeWidth: 1.6,
    roughness: 0.5,
  })

const lean = (seed: number, label: string, share = 1) =>
  `calc(var(--tilt-max) * ${(stream(seed, label).signed() * share).toFixed(2)})`

function DecisionMap({
  question,
  options,
  chosen,
  chosenLabel = "Best fit",
  seed,
  className,
  ...props
}: DecisionMapProps) {
  const s = useSeed(
    "decision-map",
    seed ?? textOf(question) ?? options.map((o) => o.id).join("|"),
  )
  const id = React.useId()
  const n = options.length
  const across = n >= 2 && n <= 4
  const at = options.findIndex((o) => o.id === chosen)
  const marks = React.useMemo(
    () => ({
      branches: branches(n, at, s).join(""),
      heads: options.map((_, i) =>
        HEAD(fork(s, `head:${i}`), i === at ? "var(--k)" : "var(--line)"),
      ),
    }),
    [n, at, s, options],
  )
  const wide = (classes: string) => (across ? classes : "")

  return (
    <section
      data-slot="decision-map"
      aria-labelledby={`${id}-question`}
      className={cn("@container/decision-map w-full min-w-0", className)}
      {...props}
    >
      <div className="flex flex-col items-stretch @min-[40rem]/decision-map:items-center">
        <div
          data-slot="decision-map-question"
          className={cn(
            "sheet relative px-snug py-tight",
            wide(
              "@min-[40rem]/decision-map:max-w-[36rem] @min-[40rem]/decision-map:text-center",
            ),
          )}
          style={{ rotate: lean(s, "question", 0.6) }}
        >
          <p
            id={`${id}-question`}
            className="m-0 font-read text-lead leading-subhead font-semibold text-balance text-ink"
          >
            {question}
          </p>
        </div>
        {across ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 56"
            preserveAspectRatio="none"
            className="hidden h-14 w-full overflow-visible @min-[40rem]/decision-map:block"
            dangerouslySetInnerHTML={{ __html: marks.branches }}
          />
        ) : null}
        <ul
          className={cn(
            "m-0 mt-tight flex w-full list-none flex-col p-0",
            wide(
              "@min-[40rem]/decision-map:mt-0 @min-[40rem]/decision-map:grid @min-[40rem]/decision-map:grid-cols-[repeat(var(--options),minmax(0,1fr))]",
            ),
          )}
          style={{ "--options": n } as React.CSSProperties}
        >
          {options.map((option, i) => (
            <li
              key={option.id}
              data-slot="decision-map-option"
              data-chosen={i === at || undefined}
              className={cn(
                "group/option relative flex flex-col ps-line pb-tight last:pb-0",
                // The rail: a pen line down the start edge with an elbow to each card.
                "before:pointer-events-none before:absolute before:start-[0.6rem] before:-top-tight before:bottom-0 before:border-s-[1.5px] before:border-line before:[filter:var(--rough-3)] last:before:bottom-auto last:before:h-[calc(1.6rem+var(--space-tight))]",
                "not-first:before:top-0 not-first:last:before:h-[1.6rem]",
                "after:pointer-events-none after:absolute after:start-[0.6rem] after:top-[1.6rem] after:w-[calc(var(--space-line)-0.6rem)] after:border-t-[1.5px] after:border-line after:[filter:var(--rough-3)] data-chosen:after:border-t-2 data-chosen:after:border-k",
                wide(
                  "@min-[40rem]/decision-map:px-[calc(var(--space-snug)/2)] @min-[40rem]/decision-map:pb-0 @min-[40rem]/decision-map:before:hidden @min-[40rem]/decision-map:after:hidden",
                ),
              )}
            >
              {across ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 8"
                  className="absolute -top-2 left-1/2 hidden h-2 w-3 -translate-x-1/2 overflow-visible @min-[40rem]/decision-map:block"
                  dangerouslySetInnerHTML={{ __html: marks.heads[i]! }}
                />
              ) : null}
              <div
                className="sheet relative flex h-full flex-col gap-1 px-snug py-tight"
                style={{ rotate: lean(fork(s, option.id), "card") }}
              >
                {i === at ? <Tape seed={`${s}:${option.id}`} /> : null}
                <p className="m-0 font-read text-body leading-subhead font-semibold text-ink">
                  {option.title}
                </p>
                <p className="m-0 text-small leading-small text-ink-2">
                  {option.answer}
                </p>
                {i === at ? (
                  <Stamp
                    seed={`${s}:${option.id}`}
                    className="mt-hair self-start"
                  >
                    {chosenLabel}
                  </Stamp>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { DecisionMap }
