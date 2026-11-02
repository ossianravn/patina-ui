"use client"

import type { ComponentProps, CSSProperties, ReactNode } from "react"
import type { InkSet, MotifName } from "@/patina/ink"
import { stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { Tape } from "@/patina/marks/paper-marks"
import { Print } from "@/patina/print/print"
import { textOf, useSeed } from "@/patina/print/seed-scope"

// An index card pinned to the page (Mental Models' ModelCard): a spot print on top, then a mono kicker, a serif title
// and a one-line hook, on a sheet of card stock. At the lively level it sits a little crooked under a strip of tape;
// at calm it stands upright and untaped. Tilt and tape are paint: the card's box, text and hit area stay put.
//
// With `href` the title becomes a link whose hit area stretches over the whole card, so the link's name is the title
// alone; the card straightens and lifts on hover and takes the dashed focus ring. Interactive children of a linked
// card need `relative z-10` to sit above the stretched link.

/** Motifs that read well as a small cover, in the order a seed picks from. */
const COVERS: MotifName[] = [
  "horizon",
  "sprig",
  "contours",
  "flow",
  "orbits",
  "lens",
  "rings",
  "constellation",
  "halftone",
  "collage",
  "lino",
  "blocks",
]

export interface IndexCardProps extends Omit<ComponentProps<"div">, "title"> {
  title: ReactNode
  /** A mono label above the title, such as "No. 0412 · Tidal flats". */
  kicker?: ReactNode
  /** One line under the title in the second ink. */
  hook?: ReactNode
  /** The cover print's motif; the seed picks one when left out, and false leaves the card without a print. */
  motif?: MotifName | false
  /** A cover of your own in place of the print, such as a picture or a live preview. */
  cover?: ReactNode
  inks?: InkSet
  /** Makes the whole card a link to this address. */
  href?: string
  /** Same seed, same print, tilt and tape. Defaults to the title's text. */
  seed?: string | number
  /** A strip of tape across the top edge, shown at the lively level. */
  tape?: boolean
}

/** An index card: a cover print, a kicker, a title and a hook, tilted and taped at the lively level. */
export function IndexCard({
  title,
  kicker,
  hook,
  motif,
  cover,
  inks,
  href,
  seed,
  tape = true,
  className,
  style,
  children,
  ...props
}: IndexCardProps) {
  const source = seed ?? textOf(title)
  const s = useSeed("index-card", source)
  const pick = stream(s, "motif").pick(COVERS)
  const coverMotif = motif === false ? null : (motif ?? pick)
  const vars = {
    "--card-turn": stream(s, "tilt").signed().toFixed(2),
  } as CSSProperties

  return (
    <div
      data-slot="index-card"
      data-link={href ? "" : undefined}
      className={cn(
        "sheet relative isolate flex min-w-0 flex-col p-snug pb-line text-ink",
        "[rotate:calc(var(--tilt-max)*var(--card-turn))] transition-[rotate,translate,box-shadow] duration-(--duration-lift) ease-out",
        // Hover and focus straighten and lift the card, keeping the sheet's inner edge toning under the lifted shadow.
        "data-link:hover:[rotate:0deg] data-link:hover:-translate-y-[3px] data-link:hover:[box-shadow:var(--lift-shadow),inset_0_0_48px_rgb(var(--tone-rgb)/calc(var(--paper-tone)*0.9))]",
        "has-[[data-slot=index-card-link]:focus-visible]:[rotate:0deg] has-[[data-slot=index-card-link]:focus-visible]:outline-2 has-[[data-slot=index-card-link]:focus-visible]:outline-offset-4 has-[[data-slot=index-card-link]:focus-visible]:outline-k-ink has-[[data-slot=index-card-link]:focus-visible]:outline-dashed",
        className,
      )}
      style={{ ...vars, ...style }}
      {...props}
    >
      {tape && <Tape seed={source} />}
      {cover ??
        (coverMotif && (
          <Print
            motif={coverMotif}
            seed={source}
            inks={inks}
            className="mx-auto mb-tight w-[62%] max-w-44"
          />
        ))}
      {kicker && (
        <div data-slot="index-card-kicker" className="label-mono text-k-ink">
          {kicker}
        </div>
      )}
      <div
        data-slot="index-card-title"
        className="mt-hair font-read text-lead leading-subhead font-semibold text-balance"
      >
        {href ? (
          <a
            data-slot="index-card-link"
            href={href}
            className="no-underline after:absolute after:inset-0 after:rounded-sheet after:content-[''] focus-visible:outline-none"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </div>
      {hook && (
        <p
          data-slot="index-card-hook"
          className="m-0 mt-hair text-ui leading-small text-pretty text-ink-2"
        >
          {hook}
        </p>
      )}
      {children}
    </div>
  )
}
