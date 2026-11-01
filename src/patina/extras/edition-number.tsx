import type { ComponentProps } from "react"
import { cn } from "@/patina/lib/utils"

// "No. 0012": an entry's number in the label voice, zero padded to a fixed count of digits so a run of numbers lines
// up, with tabular figures. It takes the size and colour of its context, such as a label-mono kicker; in running
// serif text, text-[0.86em] matches the mono's x-height to the serif's, as inline code does in Typography. Screen
// readers hear "Number 12 of 200" instead of the abbreviation and the padding.

export interface EditionNumberProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  value: number
  /** How many digits to pad to. */
  digits?: number
  /** The size of the edition: "No. 0012 of 0200". */
  of?: number
  /** The printed abbreviation before the number. */
  prefix?: string
  /** What assistive technology reads in place of the prefix. */
  label?: string
}

const NBSP = String.fromCharCode(0xa0)
const whole = (n: number) => Math.max(0, Math.trunc(Number.isFinite(n) ? n : 0))
const pad = (n: number, digits: number) =>
  String(whole(n)).padStart(digits, "0")

/** An entry's number, zero padded: "No. 0012" or "No. 0012 of 0200". */
export function EditionNumber({
  value,
  digits = 4,
  of,
  prefix = "No.",
  label = "Number",
  className,
  ...props
}: EditionNumberProps) {
  const total = of === undefined ? "" : `${NBSP}of${NBSP}${pad(of, digits)}`
  const spoken = `${label} ${whole(value)}${of === undefined ? "" : ` of ${whole(of)}`}`
  return (
    <span
      data-slot="edition-number"
      className={cn("font-label whitespace-nowrap tabular-nums", className)}
      {...props}
    >
      <span aria-hidden="true">
        {prefix ? `${prefix}${NBSP}` : ""}
        {pad(value, digits)}
        {total}
      </span>
      <span className="sr-only">{spoken}</span>
    </span>
  )
}
