import type { ReactNode } from "react"

/** What a component's docs page needs from its demo file, besides the default export. */
export interface DemoMeta {
  title: string
  /** One sentence on what the component is for. */
  description: string
  /** Registry item that installs it. */
  item: string
  /** Its group on the Components index, as in docs/components.md. */
  group?:
    | "Actions"
    | "Forms"
    | "Overlays"
    | "Navigation"
    | "Data display"
    | "Conversation"
    | "Charts"
    | "Patina extras"
}

/** A titled group of examples on a docs page. */
export function DemoSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="border-t border-dashed border-rule py-snug first:border-t-0 first:pt-0">
      <h2 className="label-mono m-0 mb-snug text-ink-2">{title}</h2>
      {children}
    </section>
  )
}

/** One labelled row in a state matrix: the state's name on the left, the example beside it. */
export function StateRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-x-section gap-y-hair py-tight md:grid-cols-[9rem_minmax(0,1fr)]">
      <span className="label-mono text-ink-3">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-tight">
        {children}
      </div>
    </div>
  )
}
