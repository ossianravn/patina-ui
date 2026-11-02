import type { ReactNode } from "react"
import { cn } from "@/patina/lib/utils"

// Pieces for drawing an open overlay on the Components index. A real popup opens in a portal, and only in the
// browser, so the index draws it with the kit's own utilities and item classes (float-sheet, the menu item's
// highlighter, the tooltip's ink strip) instead.

export function Popup({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("float-sheet p-1 text-start", className)}>
      {children}
    </div>
  )
}

/** A menu item; `active` takes the highlighter stroke a highlighted item gets. */
export function MenuRow({
  children,
  active,
  shortcut,
  danger,
}: {
  children: ReactNode
  active?: boolean
  shortcut?: string
  danger?: boolean
}) {
  return (
    <div
      className={cn(
        "relative isolate flex items-center gap-tight rounded-sheet px-tight py-1.5 text-small leading-small",
        danger ? "text-ink-red" : "text-ink",
        active &&
          "before:pointer-events-none before:absolute before:inset-x-1 before:inset-y-0 before:-z-10 before:highlight",
      )}
    >
      {children}
      {shortcut && (
        <span className="ms-auto ps-snug font-label text-label tracking-[0.06em] text-ink-3">
          {shortcut}
        </span>
      )}
    </div>
  )
}

export function MenuRule() {
  return <div className="-mx-1 my-1 h-0 border-t border-dashed border-rule" />
}

/** The tooltip's label-maker strip, with its point underneath. */
export function Strip({ children }: { children: ReactNode }) {
  return (
    <span className="flex flex-col items-center">
      <span className="label-mono relative z-10 rounded-sheet bg-ink px-tight py-1 text-paper">
        {children}
      </span>
      <span className="-mt-1.5 size-2.5 rotate-45 rounded-[1px] bg-ink" />
    </span>
  )
}

/** Grey lines standing for a page's text behind a sheet or drawer. */
export function PageLines({ widths }: { widths: number[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {widths.map((w, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full bg-rule"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  )
}
