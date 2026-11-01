import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/patina/lib/utils"

// A typeset index entry (Mental Models' ModelRow): an optional mono number, an optional small Glyph or Print, the
// serif title and its hook in the second ink, which runs on the same line when it fits and wraps beneath when it
// does not. A trailing `meta` (a page or record number, a count) sits at the end of a dotted leader, as in a book's
// index. Entries sit on dashed rules inside an IndexList.
//
// With `href` the title becomes a link whose hit area stretches over the whole row, so the link's name is the title;
// hovering lays a highlighter stroke under the title, and focus draws the dashed ring around the row.

/** A list of index entries. */
export function IndexList({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="index-list"
      className={cn("m-0 flex list-none flex-col p-0", className)}
      {...props}
    />
  )
}

export interface IndexRowProps extends Omit<ComponentProps<"li">, "title"> {
  title: ReactNode
  /** One line about the entry, in the second ink. */
  hook?: ReactNode
  /** A mono number before the title, such as an EditionNumber or "07". */
  number?: ReactNode
  /** A small Glyph or Print beside the title. */
  media?: ReactNode
  /** A trailing value at the end of a dotted leader. */
  meta?: ReactNode
  /** Makes the whole row a link to this address. */
  href?: string
}

/** One entry in an index: number, title, hook and an optional leader to a trailing value. */
export function IndexRow({
  title,
  hook,
  number,
  media,
  meta,
  href,
  className,
  ...props
}: IndexRowProps) {
  return (
    <li
      data-slot="index-row"
      data-link={href ? "" : undefined}
      className={cn(
        "group/index-row relative flex items-baseline gap-x-tight border-b border-dashed border-rule px-1 py-tight",
        "has-[[data-slot=index-row-link]:focus-visible]:outline-2 has-[[data-slot=index-row-link]:focus-visible]:outline-offset-2 has-[[data-slot=index-row-link]:focus-visible]:outline-k-ink has-[[data-slot=index-row-link]:focus-visible]:outline-dashed",
        className,
      )}
      {...props}
    >
      {number !== undefined && (
        <span
          data-slot="index-row-number"
          className="label-mono me-hair shrink-0 leading-none text-ink-3 tabular-nums"
        >
          {number}
        </span>
      )}
      {media && (
        <span
          data-slot="index-row-media"
          aria-hidden="true"
          // Centred on the title's first line: (line height 1.3 × 18 px − 32 px) / 2 above the content top.
          className="flex size-8 shrink-0 -translate-y-[0.27rem] items-center justify-center self-start overflow-hidden rounded-sheet text-k-ink *:data-[slot=print]:w-[150%] *:data-[slot=print]:max-w-none *:data-[slot=print]:shrink-0"
        >
          {media}
        </span>
      )}
      <span
        className={cn(
          "flex min-w-0 flex-wrap items-baseline gap-x-tight",
          meta === undefined && "flex-1",
        )}
      >
        <span
          data-slot="index-row-title"
          className="font-read text-body leading-subhead font-semibold text-ink"
        >
          {href ? (
            <a
              data-slot="index-row-link"
              href={href}
              className="no-underline group-hover/index-row:highlight after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </span>
        {hook && (
          <span
            data-slot="index-row-hook"
            className="min-w-0 text-ui leading-small text-ink-2"
          >
            {hook}
          </span>
        )}
      </span>
      {meta !== undefined && (
        <>
          {/* Empty, so its baseline is its bottom edge: the dots sit on the text's baseline. */}
          <span
            aria-hidden="true"
            className="min-w-snug flex-1 self-baseline border-b-2 border-dotted border-ink-faint"
          />
          <span
            data-slot="index-row-meta"
            className="shrink-0 font-label text-small text-ink-2 tabular-nums"
          >
            {meta}
          </span>
        </>
      )}
    </li>
  )
}
