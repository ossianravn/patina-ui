"use client"

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react"
import { cn } from "@/patina/lib/utils"

// Numbered notes beside the text. A SidenoteRef in a paragraph prints a superscript number that links to its note;
// the Sidenote itself follows the paragraph. Inside a SidenoteLayout that is wide enough (50rem), notes move into a
// margin column level with their paragraph; narrower, they stay where they are written, a plain block after the
// paragraph, so reading order and DOM order agree.
//
// SidenoteLayout numbers its notes in the order they appear among its direct children and shares the numbers by id,
// so place each note after the paragraph that cites it, in the order cited. Outside a layout, pass `number`.
// The reference is named "Note 1" and described by the note's text, so a screen reader hears the note at the
// reference; following the link moves to the note, whose own number links back.

const Numbers = createContext<ReadonlyMap<string, number>>(new Map())

function useNumber(id: string, number?: number) {
  const numbers = useContext(Numbers)
  const n = number ?? numbers.get(id)
  return n === undefined ? "*" : String(n)
}

/** A text column with a margin for its notes, on containers 50rem and wider. */
export function SidenoteLayout({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  // Consecutive notes share one margin cell, so a paragraph with two notes keeps them together beside it.
  const numbers = new Map<string, number>()
  const cells: ReactNode[] = []
  let run: ReactNode[] = []
  const flush = () => {
    if (!run.length) return
    cells.push(
      <div
        key={`notes-${cells.length}`}
        data-slot="sidenote-margin"
        className="flex flex-col gap-snug"
      >
        {run}
      </div>,
    )
    run = []
  }
  for (const child of Children.toArray(children)) {
    if (isValidElement<SidenoteProps>(child) && child.type === Sidenote) {
      numbers.set(child.props.id, numbers.size + 1)
      run.push(child)
    } else {
      flush()
      cells.push(child)
    }
  }
  flush()

  return (
    <div
      data-slot="sidenote-layout"
      className={cn("@container/sidenotes", className)}
      {...props}
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-y-snug @min-[50rem]/sidenotes:grid-cols-[minmax(0,var(--measure))_minmax(11rem,15rem)] @min-[50rem]/sidenotes:gap-x-line @min-[50rem]/sidenotes:[&>*]:col-start-1 @min-[50rem]/sidenotes:[&>[data-slot=sidenote-margin]]:col-start-2 [&>:is(h2,h3,h4)]:mt-tight">
        <Numbers value={numbers}>{cells}</Numbers>
      </div>
    </div>
  )
}

export interface SidenoteRefProps extends Omit<
  ComponentProps<"a">,
  "href" | "children"
> {
  /** The id of the Sidenote this reference points to. */
  to: string
  /** The note's number when the reference is not inside a SidenoteLayout. */
  number?: number
}

/** The superscript number in the text that links to its note. */
export function SidenoteRef({
  to,
  number,
  className,
  ...props
}: SidenoteRefProps) {
  const n = useNumber(to, number)
  return (
    <sup
      data-slot="sidenote-ref"
      className="relative -top-[0.55em] align-baseline text-[0.68em] leading-none [&>a]:no-underline"
    >
      <a
        id={`${to}-ref`}
        href={`#${to}`}
        aria-describedby={`${to}-body`}
        className={cn(
          "relative scroll-mt-section px-[0.12em] font-label font-semibold text-k-ink tabular-nums no-underline",
          "before:absolute before:-inset-x-1.5 before:-inset-y-2 before:content-[''] hover:highlight",
          className,
        )}
        {...props}
      >
        <span className="sr-only">Note </span>
        {n}
      </a>
    </sup>
  )
}

export interface SidenoteProps extends ComponentProps<"div"> {
  /** Matches the `to` of its SidenoteRef. */
  id: string
  /** The note's number when it is not inside a SidenoteLayout. */
  number?: number
}

/** A numbered note: in the margin of a wide SidenoteLayout, after its paragraph otherwise. */
export function Sidenote({
  id,
  number,
  className,
  children,
  ...props
}: SidenoteProps) {
  const n = useNumber(id, number)
  return (
    <div
      role="note"
      id={id}
      tabIndex={-1}
      data-slot="sidenote"
      className={cn(
        "group/sidenote grid scroll-mt-section grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-hair text-small leading-small text-ink-2 focus-visible:outline-offset-2 [&>a]:no-underline",
        "@max-[50rem]/sidenotes:border-l-2 @max-[50rem]/sidenotes:border-k/45 @max-[50rem]/sidenotes:pl-tight",
        className,
      )}
      {...props}
    >
      <a
        data-slot="sidenote-number"
        href={`#${id}-ref`}
        className="relative min-w-[1.4ch] font-label text-label font-semibold text-k-ink tabular-nums no-underline before:absolute before:-inset-2 before:content-[''] group-target/sidenote:highlight hover:highlight"
      >
        <span className="sr-only">Back to reference </span>
        {n}
      </a>
      <div id={`${id}-body`} data-slot="sidenote-body" className="min-w-0">
        {children}
      </div>
    </div>
  )
}
