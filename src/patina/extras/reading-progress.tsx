"use client"

import * as React from "react"
import { stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { useSeed } from "@/patina/print/seed-scope"

// A thin strip of the drum along the top of the page (Mental Models' reading progress) that grows as you read an
// article. Its leading end is torn: a seeded clip path, with a paler fibrous layer just ahead of the ink, as torn
// paper shows. The fill moves by a transform set straight from scroll, so the page never re-renders while you read;
// the short glide between frames is dropped for people who prefer reduced motion.
//
// It is aria-hidden on purpose: it repeats the scroll position, which assistive technology already reports, and a
// progressbar whose value changed on every scroll frame would only add noise.

export interface ReadingProgressProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** The article to track. Defaults to the first <article> in the container or the document. */
  target?: React.RefObject<HTMLElement | null>
  /** A scrolling element to track instead of the window. The bar then sticks to the top of it. */
  container?: React.RefObject<HTMLElement | null>
  seed?: string | number
}

/** A torn leading edge: points down the right end of the strip, each pushed back by a seeded depth. */
function tear(seed: number, label: string, depth: number) {
  const s = stream(seed, label)
  const points: string[] = []
  for (let y = 0; y <= 100; y += 12.5) {
    const d = (s.next() * depth).toFixed(1)
    points.push(`calc(100% - ${d}px) ${y}%`)
  }
  return `polygon(0 0, ${points.join(", ")}, 0 100%)`
}

function progressOf(article: HTMLElement, scroller: HTMLElement | null) {
  const box = article.getBoundingClientRect()
  const top = scroller
    ? box.top - scroller.getBoundingClientRect().top
    : box.top
  const view = scroller ? scroller.clientHeight : window.innerHeight
  const span = box.height - view
  if (span <= 0) return top <= 0 ? 1 : 0
  return Math.min(1, Math.max(0, -top / span))
}

function ReadingProgress({
  target,
  container,
  seed,
  className,
  ...props
}: ReadingProgressProps) {
  const bar = React.useRef<HTMLDivElement>(null)
  const s = useSeed("reading-progress", seed ?? "reading-progress")
  const edges = React.useMemo(
    () => ({ ink: tear(s, "ink", 7), fibre: tear(s, "fibre", 5) }),
    [s],
  )
  const sticky = container !== undefined

  React.useEffect(() => {
    const scroller = container?.current ?? null
    const article =
      target?.current ??
      (scroller ?? document).querySelector<HTMLElement>("article")
    const el = bar.current
    if (!article || !el) return
    let frame = 0
    const update = () => {
      frame = 0
      el.style.setProperty("--read", progressOf(article, scroller).toFixed(4))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const source = scroller ?? window
    source.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    const resize = new ResizeObserver(schedule)
    resize.observe(article)
    update()
    return () => {
      cancelAnimationFrame(frame)
      source.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      resize.disconnect()
    }
  }, [target, container])

  // The fill is 10px longer than the bar, so at the end the tear has moved off the edge and the strip reads full.
  const fill =
    "absolute inset-y-0 left-0 w-[calc(100%+10px)] translate-x-[calc((var(--read,0)-1)*100%)] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"

  return (
    <div
      ref={bar}
      aria-hidden="true"
      data-slot="reading-progress"
      className={cn(
        "pointer-events-none z-40 h-1.5 overflow-hidden rtl:-scale-x-100",
        sticky ? "sticky top-0 -mb-1.5" : "fixed inset-x-0 top-0",
        className,
      )}
      {...props}
    >
      <span
        className={cn(fill, "ml-1 bg-k opacity-35")}
        style={{ clipPath: edges.fibre }}
      />
      <span className={cn(fill, "bg-k")} style={{ clipPath: edges.ink }} />
    </div>
  )
}

export { ReadingProgress }
