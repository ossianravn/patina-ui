// A print is a seeded riso illustration: drums of ink, each grained and slightly out of register, overprinted.
import { grainFilter } from "./filters"
import { CSS_INKS, type InkSet, type PrintInks } from "./inks"
import { motifs, type MotifName } from "./motifs"
import { seedOf, stream } from "./seed"

export interface PrintOptions {
  motif: MotifName
  seed: string | number
  /** A named ink set (re-inked by CSS), or plain colours for renders without a stylesheet. */
  inks?: InkSet | PrintInks
  /** Text the motif prints, such as a monogram's name. */
  text?: string
  /**
   * How far drums drift out of register. "css" scales a seeded direction by the --misregister custom property,
   * so the variation level controls it; a number bakes the offset in user units (for share images).
   */
  registration?: "css" | number
  /** Makes the print meaningful to assistive technology; without it the print is decorative. */
  title?: string
  /** A self-contained file: size and namespace on the root, overprinting inline. Pair with plain-colour inks. */
  standalone?: boolean
}

const DRUMS = ["line", "detail", "accent"] as const

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)

export function print({
  motif,
  seed,
  inks,
  text,
  registration = "css",
  title,
  standalone = false,
}: PrintOptions) {
  const n = typeof seed === "number" ? seed >>> 0 : seedOf(seed)
  const colours = typeof inks === "object" ? inks : CSS_INKS
  const drawing = motifs[motif](n, colours, {
    ...(text === undefined ? {} : { text }),
  })
  const drift = stream(n, "print:register")
  const id = `patina-print-${motif}-${n.toString(36)}`

  const filters = DRUMS.map((drum, i) =>
    grainFilter(`${id}-${drum}`, n + i * 3),
  ).join("")
  const groups = DRUMS.map((drum) => {
    const dx = drift.signed().toFixed(2)
    const dy = drift.signed().toFixed(2)
    const blend = standalone ? "mix-blend-mode:multiply" : ""
    const offset =
      registration === "css"
        ? ` style="translate:calc(var(--misregister, 1px) * ${dx}) calc(var(--misregister, 1px) * ${dy});${blend}"`
        : ` transform="translate(${(Number(dx) * registration).toFixed(2)} ${(Number(dy) * registration).toFixed(2)})"${blend ? ` style="${blend}"` : ""}`
    return `<g class="patina-drum" data-drum="${drum}" filter="url(#${id}-${drum})"${offset}>${drawing[drum]}</g>`
  }).join("")

  const set = typeof inks === "string" ? ` data-inks="${inks}"` : ""
  const label = title
    ? ` role="img" aria-label="${escape(title)}"`
    : ` aria-hidden="true"`
  const file = standalone
    ? ` xmlns="http://www.w3.org/2000/svg" width="560" height="560"`
    : ""
  const svg = `<svg${file} class="patina-print" data-motif="${motif}"${set} viewBox="-20 -20 280 280"${label}><defs>${filters}</defs>${groups}</svg>`
  return { svg, seed: n }
}
