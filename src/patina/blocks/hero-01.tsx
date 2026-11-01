"use client"

import { useState, type ReactNode } from "react"
import { DicesIcon } from "lucide-react"
import type { MotifName } from "@/patina/ink"
import { seedOf, stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { Highlight } from "@/patina/marks/highlight"
import { MarginNote } from "@/patina/marks/notes"
import { Paper } from "@/patina/paper/paper"
import { Print } from "@/patina/print/print"
import { Button, buttonVariants } from "@/patina/ui/button"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
} from "@/patina/ui/code-block"

// A landing hero: the headline, a lead, the install command in a code block and the page's actions on the left; a
// large print on a torn sheet on the right, with its seed in mono and a reroll button, so the first thing a visitor
// does is watch the randomness work. Rerolls walk a seeded stream from the starting seed, so every visitor meets the
// same sequence of prints; each new seed is a readable word pair and picks the next motif. On phones the sheet follows
// the text. Every prop has a default (Patina's own landing copy), so the block renders as a finished page as it is.

export const meta = {
  title: "Hero",
  description:
    "A landing hero: a serif headline, the install command and two actions beside a large print that rerolls from its seed.",
}

export interface Hero01Props {
  /** The headline, in the serif. Wrap one phrase in a Highlight. */
  headline?: ReactNode
  /** One or two sentences under the headline. */
  lead?: ReactNode
  /** A mono line above the headline. */
  kicker?: ReactNode
  /** The install command, with a copy button. */
  command?: string
  /** The page's actions, usually two links styled with buttonVariants. */
  actions?: ReactNode
  /** The print's starting seed; rerolls continue from it. */
  seed?: string
  /** The starting print's motif. */
  motif?: MotifName
  /** The motifs a reroll picks from, by the new seed. */
  motifs?: MotifName[]
  /** A handwritten aside under the print. */
  note?: ReactNode
  className?: string
}

const ADJECTIVES = [
  "quiet",
  "salt",
  "copper",
  "tidal",
  "faded",
  "north",
  "linen",
  "inky",
  "slow",
  "winter",
  "hollow",
  "still",
  "amber",
  "low",
  "folded",
  "early",
]
const NOUNS = [
  "heron",
  "marsh",
  "creek",
  "reed",
  "tide",
  "curlew",
  "sluice",
  "flats",
  "egret",
  "dune",
  "harbour",
  "plover",
  "shingle",
  "teal",
  "ledger",
  "lantern",
]

const COVER_MOTIFS: MotifName[] = [
  "lino",
  "halftone",
  "contours",
  "horizon",
  "flow",
]

/** The print after this one: a word-pair seed drawn from a stream forked from the current seed (never the same
 *  twice), and a motif the new seed picks. */
export function nextPrint(seed: string, motifs: MotifName[] = COVER_MOTIFS) {
  const words = stream(seedOf(seed), "hero:reroll")
  let next = seed
  while (next === seed) next = `${words.pick(ADJECTIVES)}-${words.pick(NOUNS)}`
  return { seed: next, motif: stream(seedOf(next), "hero:motif").pick(motifs) }
}

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const HEADLINE = (
  <>
    shadcn/ui, with <Highlight>a patina.</Highlight>
  </>
)
const LEAD =
  "Components that look printed, cut and handled: overprinted ink on real-feeling paper, a serif to read, a hand to annotate, a mono to label, and wear that deepens the longer a page is used."
// Links styled as buttons: they navigate, so they stay links for assistive technology. cn() resolves the variant's
// classes against the base ones, as Button itself does.
const ACTIONS = (
  <>
    <a href="/docs" className={cn(buttonVariants())}>
      Get started
    </a>
    <a href="/press" className={cn(buttonVariants({ variant: "outline" }))}>
      Open the Press
    </a>
  </>
)

export function Hero01({
  headline = HEADLINE,
  lead = LEAD,
  kicker,
  command = "npx shadcn add @patina/patina",
  actions = ACTIONS,
  seed: initial = "salt-marsh",
  motif: firstMotif = "lino",
  motifs = COVER_MOTIFS,
  note = "same seed, same print",
  className,
}: Hero01Props) {
  const [{ seed, motif }, setPrint] = useState({
    seed: initial,
    motif: firstMotif,
  })

  return (
    <section
      data-slot="hero"
      className={cn(
        "mx-auto grid max-w-[76rem] items-center gap-x-page gap-y-section px-snug pt-section pb-section sm:px-line md:grid-cols-[minmax(0,1fr)_minmax(0,25rem)]",
        className,
      )}
    >
      <div className="min-w-0">
        {kicker && <p className="label-mono m-0 text-ink-2">{kicker}</p>}
        <h1 className="mt-tight mb-snug font-read text-display leading-display">
          {headline}
        </h1>
        {lead && (
          <p className="m-0 max-w-measure text-body leading-body text-ink-2 sm:text-lead sm:leading-lead">
            {lead}
          </p>
        )}
        {command && (
          <CodeBlock className="mt-line w-fit max-w-full flex-row items-center">
            {/* Wraps at a space only when the column is too narrow for the whole command. */}
            <CodeBlockContent wrap className="flex-1">
              {command}
            </CodeBlockContent>
            {/* Not CodeBlockActions: as a direct child it would only show on hover, and the hero's copy stays put. */}
            <div className="shrink-0 pe-1.5">
              <CodeBlockCopyButton value={command} />
            </div>
          </CodeBlock>
        )}
        {actions && (
          <div className="mt-line flex flex-wrap items-center gap-tight">
            {actions}
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-[22rem] md:max-w-none">
        <Paper
          seed={initial}
          edge="torn"
          tilt
          className="px-line pt-line pb-snug"
        >
          <Print
            key={seed}
            motif={motif}
            seed={seed}
            title={`A ${motif} print from the seed ${seed}`}
            className="mx-auto w-full animate-in duration-300 fade-in"
          />
          <div className="mt-tight flex items-center justify-between gap-tight">
            <p className="label-mono m-0 min-w-0 text-ink-2" aria-live="polite">
              {capital(motif)} · seed{" "}
              <span className="text-ink normal-case">{seed}</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrint(nextPrint(seed, motifs))}
            >
              <DicesIcon data-icon="inline-start" />
              Reroll
            </Button>
          </div>
        </Paper>
        {note && (
          <MarginNote className="mt-snug ms-tight" decorative>
            {note}
          </MarginNote>
        )}
      </div>
    </section>
  )
}

export default Hero01
