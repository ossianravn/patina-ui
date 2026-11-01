import * as React from "react"
import { cn } from "@/patina/lib/utils"

// Long-form prose, styled through its children so plain HTML or Markdown output reads as typeset text: serif
// headings on the heading leading tokens, body paragraphs held to the reading measure, list markers in the third ink,
// a blockquote set off by a margin bar in the region's drum, inline code in mono on a recessed well, dashed rules and
// small ledger tables. Selectors sit inside :where(), so a class on a child still wins. `dropCap` sets the first
// paragraph's opening letter three lines deep in the region's text ink. shadcn ships typography as a docs page, not a
// component; Patina ships it as one.

const flow = [
  // Vertical rhythm between direct children: a paragraph gap, more room above headings, little below them.
  "[&>*]:my-0 [&>*+*]:mt-snug [&>:first-child]:mt-0",
  "[&>h1]:mt-section [&>h2]:mt-section [&>h3]:mt-line [&>h4]:mt-snug [&>hr]:my-line",
  "[&>:is(h1,h2)+*]:mt-tight [&>:is(h3,h4)+*]:mt-hair",
  "[&>*+[data-slot=typography-kicker]]:mt-section [&>[data-slot=typography-kicker]+*]:mt-hair",
]

const type = [
  "font-read text-body leading-body text-ink",
  "[&_:where(h1,h2,h3,h4)]:max-w-measure [&_:where(h1,h2,h3,h4)]:font-read [&_:where(h1,h2,h3,h4)]:font-semibold [&_:where(h1,h2,h3,h4)]:text-balance [&_:where(h1,h2,h3,h4)]:text-ink",
  "[&_:where(h1)]:text-h1 [&_:where(h1,h2)]:leading-heading [&_:where(h2)]:text-h2",
  "[&_:where(h3)]:text-lead [&_:where(h3,h4)]:leading-subhead [&_:where(h4)]:text-body",
  "[&_:where(p,ul,ol,blockquote)]:max-w-measure [&_:where(strong,b)]:font-semibold",
  // Lists: markers in the third ink; numbered lists count in mono.
  "[&_:where(ul)]:list-disc [&_:where(ol)]:list-decimal [&_:where(ul,ol)]:pl-snug",
  "[&_:where(li)]:pl-1 [&_:where(li+li)]:mt-hair [&_:where(li>ul,li>ol)]:mt-hair",
  "[&_:where(li)]:marker:text-ink-3 [&_:where(ol>li)]:marker:font-label [&_:where(ol>li)]:marker:text-small",
  // A quotation set off by a bar in the margin.
  "[&_:where(blockquote)]:border-l-[3px] [&_:where(blockquote)]:border-k [&_:where(blockquote)]:pl-snug [&_:where(blockquote)]:text-ink-2 [&_:where(blockquote)]:italic",
  // Code: inline in mono on a recessed well; blocks scroll sideways rather than wrap.
  "[&_:where(:not(pre)>code)]:rounded-sheet [&_:where(:not(pre)>code)]:bg-paper-2 [&_:where(:not(pre)>code)]:px-[0.3em] [&_:where(:not(pre)>code)]:py-[0.1em] [&_:where(:not(pre)>code)]:font-label [&_:where(:not(pre)>code)]:text-[0.84em]",
  "[&_:where(pre)]:overflow-x-auto [&_:where(pre)]:rounded-sheet [&_:where(pre)]:bg-paper-2 [&_:where(pre)]:px-snug [&_:where(pre)]:py-tight [&_:where(pre)]:font-label [&_:where(pre)]:text-small [&_:where(pre)]:leading-small",
  "[&_:where(hr)]:max-w-measure [&_:where(hr)]:h-0 [&_:where(hr)]:border-0 [&_:where(hr)]:border-t [&_:where(hr)]:border-dashed [&_:where(hr)]:border-rule",
  // Links: the page's underline, firming on hover.
  "[&_:where(a)]:underline [&_:where(a)]:decoration-k-ink/55 [&_:where(a)]:decoration-[1.5px] [&_:where(a)]:underline-offset-[0.2em] [&_:where(a:hover)]:decoration-k-ink",
  // Small tables: a ledger in miniature.
  "[&_:where(table)]:w-full [&_:where(table)]:max-w-measure [&_:where(table)]:border-collapse [&_:where(table)]:text-small [&_:where(table)]:leading-small [&_:where(table)]:tabular-nums",
  "[&_:where(th)]:label-mono [&_:where(th)]:pb-hair [&_:where(th)]:text-left [&_:where(th)]:text-ink-2 [&_:where(th)]:shadow-[inset_0_-1.5px_0_var(--line)]",
  "[&_:where(td)]:border-b [&_:where(td)]:border-dashed [&_:where(td)]:border-rule [&_:where(td)]:py-hair [&_:where(th,td)]:pr-snug [&_:where(th,td):last-child]:pr-0",
  "[&_:where(figcaption)]:mt-hair [&_:where(figcaption)]:text-small [&_:where(figcaption)]:leading-small [&_:where(figcaption)]:text-ink-2",
]

// Sized so the letter's cap height runs from the first line's cap height to the third line's baseline.
const dropCapClasses =
  "[&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mt-[0.05em] [&>p:first-of-type]:first-letter:mr-[0.06em] [&>p:first-of-type]:first-letter:font-read [&>p:first-of-type]:first-letter:text-[6.2em] [&>p:first-of-type]:first-letter:leading-[0.74] [&>p:first-of-type]:first-letter:font-semibold [&>p:first-of-type]:first-letter:text-k-ink"

function Typography({
  className,
  dropCap = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Sets the first paragraph's opening letter three lines deep. */
  dropCap?: boolean
}) {
  return (
    <div
      data-slot="typography"
      data-drop-cap={dropCap || undefined}
      className={cn(...type, ...flow, dropCap && dropCapClasses, className)}
      {...props}
    />
  )
}

/** A mono label above a heading: the section, series or kind the heading belongs to. */
function TypographyKicker({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="typography-kicker"
      className={cn("label-mono text-k-ink", className)}
      {...props}
    />
  )
}

export { Typography, TypographyKicker }
