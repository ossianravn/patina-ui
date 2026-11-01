import {
  INK_SETS,
  MOTIFS,
  print,
  type InkSet,
  type MotifName,
} from "@/patina/ink"

export interface PressState {
  motif: MotifName
  seed: string
  inks: InkSet
  text: string
  misregister: number
}

export const DEFAULT_PRESS: PressState = {
  motif: "sprig",
  seed: "quiet-heron",
  inks: "field",
  text: "Ossian Ravn",
  misregister: 2.2,
}

/** Reads shareable settings from the address; anything unknown keeps its default. */
export function fromSearch(search: string): Partial<PressState> {
  const p = new URLSearchParams(search)
  const out: Partial<PressState> = {}
  const motif = p.get("motif")
  const inks = p.get("inks")
  const misregister = Number(p.get("register"))
  if (motif && (MOTIFS as string[]).includes(motif))
    out.motif = motif as MotifName
  if (inks && (INK_SETS as readonly string[]).includes(inks))
    out.inks = inks as InkSet
  if (p.has("seed")) out.seed = p.get("seed") ?? ""
  if (p.get("name")) out.text = p.get("name") ?? ""
  if (p.has("register") && misregister >= 0 && misregister <= 4)
    out.misregister = misregister
  return out
}

export function toSearch(state: PressState) {
  const p = new URLSearchParams({
    motif: state.motif,
    seed: state.seed,
    inks: state.inks,
    register: String(state.misregister),
  })
  if (state.motif === "monogram") p.set("name", state.text)
  return `?${p}`
}

export function jsxFor(state: PressState) {
  const name = state.motif === "monogram" ? ` text="${state.text}"` : ""
  return `<Print motif="${state.motif}" seed="${state.seed}" inks="${state.inks}"${name} />`
}

/** Saves the print as a self-contained SVG, in the colours the page is showing it in. */
export function downloadSvg(state: PressState, from: Element) {
  const style = getComputedStyle(from)
  const ink = (name: string) => style.getPropertyValue(`--print-${name}`).trim()
  const { svg } = print({
    motif: state.motif,
    seed: state.seed,
    text: state.text,
    inks: { line: ink("line"), accent: ink("accent"), detail: ink("detail") },
    registration: state.misregister,
    standalone: true,
  })
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: `patina-${state.motif}-${state.seed}.svg`,
  })
  link.click()
  URL.revokeObjectURL(url)
}
