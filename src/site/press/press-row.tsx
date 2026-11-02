import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/patina/ui/tooltip"

// What each setting means, shown on the row's name as a term. The control is described by the same words, so a
// screen reader hears them when it reaches the control.
const TERMS = {
  motif: "The picture the press draws; the seed decides its details",
  seed: "Any word or phrase. The same seed always prints the same picture",
  inks: "The three drums a print is made in: lines, accent and detail",
  register: "How far each drum drifts off its mark, as on a real riso",
  name: "The words the monogram takes its letters from",
} as const
export const termId = (term: keyof typeof TERMS) => `press-term-${term}`

/** A setting: its name as a term that shows the definition, then the control. */
export function Row({
  label,
  term,
  htmlFor,
  children,
}: {
  label: string
  term: keyof typeof TERMS
  htmlFor?: string
  children: ReactNode
}) {
  const Name = htmlFor ? "label" : "span"
  return (
    <div className="flex flex-col items-start gap-hair">
      <Tooltip>
        <TooltipTrigger
          render={<Name {...(htmlFor ? { htmlFor } : {})} tabIndex={0} />}
          className="label-mono term text-ink-2"
        >
          {label}
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          {TERMS[term]}
        </TooltipContent>
      </Tooltip>
      <span id={termId(term)} hidden>
        {TERMS[term]}
      </span>
      {children}
    </div>
  )
}
