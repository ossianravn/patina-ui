"use client"

import { useRef } from "react"
import { EditionNumber } from "@/patina/extras/edition-number"
import { Postmark } from "@/patina/extras/postmark"
import { PullQuote } from "@/patina/extras/pull-quote"
import { ReadingProgress } from "@/patina/extras/reading-progress"
import { Sidenote, SidenoteLayout, SidenoteRef } from "@/patina/extras/sidenote"
import { cn } from "@/patina/lib/utils"
import { Print } from "@/patina/print/print"
import { Badge } from "@/patina/ui/badge"
import { Typography } from "@/patina/ui/typography"

// A long-form field note: a reading-progress strip, a numbered kicker, the headline and standfirst, prose with a drop
// cap held to the reading measure, a pull quote, numbered sidenotes in the margin (after their paragraph on narrow
// screens), a figure with a print and caption, and a postmark with the tags it was filed under. Swap the copy for
// yours; the structure is the block.

export const meta = {
  title: "Article",
  description:
    "A long-form field note: reading progress, a numbered kicker, prose with a drop cap, a pull quote, margin sidenotes, a printed figure and a postmark.",
}

const TAGS = ["Grey heron", "Tidal flats", "Wader count"]

export function Article01({ className }: { className?: string }) {
  const article = useRef<HTMLElement>(null)
  return (
    <div className={cn("@container", className)}>
      <ReadingProgress target={article} />
      <article
        ref={article}
        className="mx-auto max-w-[60rem] px-snug pt-section pb-page @min-[40rem]:px-line"
      >
        <header className="max-w-measure">
          <p className="label-mono m-0 text-k-ink">
            <EditionNumber value={412} /> · Field note
          </p>
          <h1 className="m-0 mt-hair text-h1 leading-heading text-balance @min-[40rem]:text-title">
            The heron at the sluice
          </h1>
          <p className="m-0 mt-tight text-body leading-body text-ink-2 @min-[40rem]:text-lead @min-[40rem]:leading-lead">
            A falling tide, the winter wader count, and eleven minutes of
            stillness on the tidal flats.
          </p>
          <p className="label-mono m-0 mt-snug text-ink-2">
            Mira Okafor · Sat 14 Nov 2026 · 5 min read
          </p>
        </header>

        <Typography dropCap className="mt-line">
          <p>
            We started the count at half past five, with the tide already on its
            way out and the sky over the sea wall only just separating from the
            water. By six the flats below the sluice gate were open mud, silver
            where the light caught the runnels, and a single grey heron had
            taken the edge of the channel.
          </p>
          <SidenoteLayout>
            <p>
              It is the same spot most mornings. The outflow from the sluice
              keeps a strip of water moving even at the bottom of the tide
              <SidenoteRef to="note-outflow" />, and the flounder that come in
              with it have nowhere much to go. The heron knows this better than
              we do.
            </p>
            <Sidenote id="note-outflow">
              The gate is opened on the ebb to drain the grazing marsh behind
              the wall, so the channel runs hardest just as the flats empty.
            </Sidenote>
            <p>
              I had the scope on it for the curlew beyond, and kept coming back.
              It did not move. Not the head, not the neck, not the long patience
              of the legs. The curlew fed in a loose line along the creek edge,
              the redshank called whenever anything passed over, and the heron
              stood.
            </p>
            <PullQuote cite="Mira Okafor, wader count" className="my-tight">
              It stood so still for so long that the tide came back to meet it.
            </PullQuote>
            <p>
              Eleven minutes by the watch. Then one strike, so quick that the
              first thing I saw was the fish already crosswise in the bill, and
              the bird walking off up the channel as if nothing had happened.
            </p>
            <figure className="m-0">
              <div className="flex aspect-[3/2] items-center justify-center rounded-sheet bg-paper-2 p-tight">
                <Print
                  motif="horizon"
                  seed="heron-at-the-sluice"
                  title="A riso print of the tidal flats at dawn"
                  className="aspect-square h-full"
                />
              </div>
              <figcaption>
                The flats below the sluice gate at 06:10, from the sea wall.
                Print seed heron-at-the-sluice.
              </figcaption>
            </figure>
            <h2>What the count found</h2>
            <p>
              Six sectors, two of us, three hours. The tidal flats carried most
              of the birds, as they do every November: 230 brent geese
              <SidenoteRef to="note-brent" />, 48 redshank and the heron, which
              we logged as record number 412.
            </p>
            <Sidenote id="note-brent">
              Dark-bellied brent, all of them. The flock lifted once when the
              tide turned and settled again on the far side of the channel.
            </Sidenote>
            <p>
              Fourteen curlew on the saltings, thirty-six avocet in the pool
              behind the sea wall. We closed the count as the tide turned at the
              sluice, and the heron was back at its post before we had packed
              the scope away.
            </p>
          </SidenoteLayout>
        </Typography>

        <footer className="mt-section flex max-w-measure flex-wrap items-center gap-x-line gap-y-snug border-t border-dashed border-rule pt-snug">
          <Postmark place="Sluice gate" date="14 Nov 2026" size={88} />
          <div className="min-w-0">
            <p className="label-mono m-0 text-ink-2">Filed under</p>
            <ul className="m-0 mt-hair flex list-none flex-wrap gap-hair p-0">
              {TAGS.map((tag) => (
                <li key={tag}>
                  <Badge variant="outline">{tag}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </article>
    </div>
  )
}

export default Article01
