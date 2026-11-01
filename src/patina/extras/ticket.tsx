"use client"

import type { ComponentProps, CSSProperties, ReactNode } from "react"
import { EditionNumber } from "@/patina/extras/edition-number"
import { cn } from "@/patina/lib/utils"
import { Paper } from "@/patina/paper/paper"

// A ticket on card stock: the body holds a kicker, a serif title and mono fields (label above value); a stub at the
// end is torn off along a perforated line, with a notch cut from each edge where the line meets it and a serial
// number beneath. Notches and perforation holes are cut by a mask, so the page shows through them and Paper's drop
// shadow follows the cut. At the lively level the ticket sits a little crooked by its seed; calm stands it straight.

const notch = (y: string) =>
  `radial-gradient(circle at var(--ticket-x) ${y}, #0000 var(--ticket-notch), #000 calc(var(--ticket-notch) + 0.5px))`
const holes =
  "radial-gradient(circle at var(--ticket-x) 50%, #0000 1.3px, #000 1.8px) 0 0 / 100% 7px repeat-y"
const CUT = `${notch("0")}, ${notch("100%")}, ${holes}`
// A printed rule inside each part, clear of the notches.
const FRAME =
  "before:pointer-events-none before:absolute before:inset-[8px] before:rounded-[2px] before:border before:border-k/40 before:content-[''] group-data-[size=sm]/ticket:before:inset-[6px]"

export interface TicketProps extends ComponentProps<"div"> {
  /** Same seed, same tilt and wear. */
  seed?: string | number
  size?: "default" | "sm"
  /** Classes for the outer frame, which carries the shadow and tilt. */
  frameClassName?: string
}

/** A ticket with a perforated stub. Put TicketContent and TicketStub inside. */
export function Ticket({
  seed,
  size = "default",
  frameClassName,
  className,
  style,
  ...props
}: TicketProps) {
  const cut = {
    mask: CUT,
    WebkitMask: CUT,
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
    ...style,
  } as CSSProperties
  return (
    <Paper
      seed={seed}
      tilt
      data-slot="ticket"
      data-size={size}
      frameClassName={cn("w-fit", frameClassName)}
      className={cn(
        "group/ticket flex p-0 text-ink",
        "[--ticket-notch:9px] [--ticket-stub:7.5rem] [--ticket-x:calc(100%_-_var(--ticket-stub))] rtl:[--ticket-x:var(--ticket-stub)]",
        "data-[size=sm]:[--ticket-notch:7px] data-[size=sm]:[--ticket-stub:5.5rem]",
        className,
      )}
      style={cut}
      {...props}
    />
  )
}

/** The ticket's body: kicker, title and fields. */
export function TicketContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="ticket-content"
      className={cn(
        "relative flex min-w-0 flex-1 flex-col gap-hair p-snug pe-line group-data-[size=sm]/ticket:px-snug group-data-[size=sm]/ticket:py-4",
        FRAME,
        className,
      )}
      {...props}
    />
  )
}

/** A mono line above the title: who issued the ticket, or what kind it is. */
export function TicketKicker({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="ticket-kicker"
      className={cn("label-mono text-k-ink", className)}
      {...props}
    />
  )
}

export function TicketTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="ticket-title"
      className={cn(
        "font-read text-lead leading-subhead font-semibold text-balance group-data-[size=sm]/ticket:text-body",
        className,
      )}
      {...props}
    />
  )
}

/** The ticket's fields, each sized to its value and wrapping onto a new line when the ticket is narrow. */
export function TicketFields({ className, ...props }: ComponentProps<"dl">) {
  return (
    <dl
      data-slot="ticket-fields"
      className={cn(
        "m-0 mt-tight flex flex-wrap gap-x-line gap-y-tight group-data-[size=sm]/ticket:mt-hair group-data-[size=sm]/ticket:gap-x-snug",
        className,
      )}
      {...props}
    />
  )
}

export interface TicketFieldProps extends ComponentProps<"div"> {
  label: ReactNode
}

/** A label above its value, both in mono. */
export function TicketField({
  label,
  children,
  className,
  ...props
}: TicketFieldProps) {
  return (
    <div
      data-slot="ticket-field"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    >
      <dt className="label-mono text-ink-3">{label}</dt>
      <dd className="m-0 font-label text-small leading-small font-semibold whitespace-nowrap text-ink tabular-nums">
        {children}
      </dd>
    </div>
  )
}

export interface TicketStubProps extends ComponentProps<"div"> {
  /** The ticket's serial number, printed under the stub's fields. */
  number?: number
  digits?: number
}

/** The part that tears off: a field or two set large, and the serial number. */
export function TicketStub({
  number,
  digits = 4,
  children,
  className,
  ...props
}: TicketStubProps) {
  return (
    <div
      data-slot="ticket-stub"
      className={cn(
        "relative flex w-(--ticket-stub) shrink-0 flex-col items-center justify-center gap-tight px-tight py-snug text-center group-data-[size=sm]/ticket:gap-hair group-data-[size=sm]/ticket:py-4",
        FRAME,
        "[&_[data-slot=ticket-field]]:items-center [&_[data-slot=ticket-field]_dd]:font-read [&_[data-slot=ticket-field]_dd]:text-h1 [&_[data-slot=ticket-field]_dd]:leading-none group-data-[size=sm]/ticket:[&_[data-slot=ticket-field]_dd]:text-lead",
        className,
      )}
      {...props}
    >
      {children && <dl className="m-0 flex flex-col gap-hair">{children}</dl>}
      {number !== undefined && (
        <EditionNumber
          value={number}
          digits={digits}
          className="label-mono text-k-ink"
        />
      )}
    </div>
  )
}
