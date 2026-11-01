"use client"

import {
  useMemo,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react"
import { sketch, type Pen } from "@/patina/ink/rough"
import { fork, stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { textOf, useSeed } from "@/patina/print/seed-scope"

// A line lifted out of the text and set large: the quote in the reading serif, held to a short measure, beside a
// hand mark in the region's drum (a drawn opening quotation mark, or a bracket down its side) and over an attribution
// in mono. The mark's strokes and slight lean come from the seed; calm stands it upright. Inside Typography it takes
// more room above and below than a paragraph and sheds the blockquote's margin bar and italic.

export interface PullQuoteProps extends ComponentProps<"figure"> {
  /** Who said it, set in mono beneath the quote. */
  cite?: ReactNode
  mark?: "quote" | "bracket"
  /** Same seed, same mark. Defaults to the quote's text. */
  seed?: string | number
}

const ink = (seed: number, extra: Partial<Pen> = {}): Pen => ({
  seed,
  stroke: "var(--k)",
  strokeWidth: 3,
  roughness: 1,
  ...extra,
})

/** Two drawn commas, blob below and tail rising to the right: an opening quotation mark. */
function quoteMark(s: number) {
  const at = stream(s, "quote")
  return [0, 25]
    .map((dx, i) => {
      const x = 12 + dx
      const lean = at.between(-1.5, 1.5)
      return (
        sketch.circle(x, 28, 12.5, {
          ...ink(fork(s, `blob:${i}`), { strokeWidth: 1 }),
          fill: "var(--k)",
          fillStyle: "solid",
        }) +
        sketch.curve(
          [
            [x - 5.5, 27],
            [x - 5 + lean, 16],
            [x + 5 + lean, at.between(5, 8)],
          ],
          ink(fork(s, `tail:${i}`)),
        )
      )
    })
    .join("")
}

const bracketMark = (s: number) =>
  sketch.path("M 13 2 Q 4 2 4 10 L 4 90 Q 4 98 13 98", {
    ...ink(fork(s, "bracket"), { strokeWidth: 2.6, roughness: 0.9 }),
    nonScaling: true,
  })

/** A large serif quotation with a hand mark and a mono attribution. */
export function PullQuote({
  cite,
  mark = "quote",
  seed,
  className,
  style,
  children,
  ...props
}: PullQuoteProps) {
  const s = useSeed("pull-quote", seed ?? textOf(children))
  const drawing = useMemo(
    () => (mark === "bracket" ? bracketMark(s) : quoteMark(s)),
    [mark, s],
  )
  const vars = {
    "--quote-turn": stream(s, "turn").signed().toFixed(2),
  } as CSSProperties

  return (
    <figure
      data-slot="pull-quote"
      data-mark={mark}
      className={cn(
        "m-0 grid grid-cols-[minmax(0,1fr)] gap-x-snug gap-y-hair sm:grid-cols-[auto_minmax(0,1fr)] data-[mark=bracket]:grid-cols-[auto_minmax(0,1fr)]",
        "sm:[&>figcaption]:col-start-2 data-[mark=bracket]:[&>figcaption]:col-start-2",
        // Inside Typography: more room than a paragraph, and none of the blockquote's bar, inset or italic.
        "[[data-slot=typography]>&]:my-line [&>blockquote]:m-0 [&>blockquote]:max-w-[19em] [&>blockquote]:border-0 [&>blockquote]:p-0 [&>blockquote]:text-ink [&>blockquote]:not-italic [&>figcaption]:mt-1",
        className,
      )}
      style={{ ...vars, ...style }}
      {...props}
    >
      {mark === "bracket" ? (
        // Positioned inside an empty column, so the bracket stretches to the quote without adding height of its own.
        <span aria-hidden="true" className="relative w-3.5">
          <svg
            viewBox="0 0 16 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
            dangerouslySetInnerHTML={{ __html: drawing }}
          />
        </span>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 50 40"
          className="h-auto w-11 overflow-visible [rotate:calc(var(--tilt-max)*var(--quote-turn)*3)] sm:mt-1.5 sm:w-14"
          dangerouslySetInnerHTML={{ __html: drawing }}
        />
      )}
      <blockquote className="font-read text-lead leading-subhead font-normal text-balance sm:text-h2 sm:leading-[1.25]">
        {children}
      </blockquote>
      {cite && (
        <figcaption>
          <span className="label-mono text-ink-2">— {cite}</span>
        </figcaption>
      )}
    </figure>
  )
}
