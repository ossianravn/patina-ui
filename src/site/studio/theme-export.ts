import { defaultAppearance } from "@/patina/theme"
import type { ThemeChoices } from "./presets"

// A theme leaves the studio the way Groundwork's do: a stylesheet of resolved token values for day and night, and
// the same file as a shadcn registry:theme item that installs it beside the kit's styles and imports it after them.
// Values are read from the page's own stylesheets, in a hidden frame, so the export is exactly what the page shows
// and reading night values never repaints the page.

const DRUMS = ["blue", "violet", "pink", "green", "orange", "red"]

type Groups = [title: string, tokens: string[]][]

/** Tokens that differ between day and night. */
const MODE_TOKENS: Groups = [
  ["Paper", ["paper", "paper-2", "paper-3", "card", "rule", "line"]],
  ["Reading inks", ["ink", "ink-2", "ink-3", "ink-faint"]],
  ["Text inks", DRUMS.map((d) => `ink-${d}`)],
  ["Hand inks", DRUMS.map((d) => `hand-${d}`)],
  ["Accent drum", ["k", "k-ink", "k-hand"]],
  ["Ink set", ["print-line", "print-accent", "print-detail"]],
]

/** Tokens that hold in both. */
const SHARED_TOKENS: Groups = [
  ["Interface face", ["face-ui"]],
  [
    "Density",
    [
      "space-hair",
      "space-tight",
      "space-snug",
      "space-line",
      "space-section",
      "space-page",
      "control-height",
      "control-height-compact",
    ],
  ],
]

type Values = Record<string, string>
export interface ResolvedTheme {
  shared: Values
  day: Values
  night: Values
}

let frame: { element: HTMLIFrameElement; sheets: number } | undefined

/** A hidden, empty document carrying the page's styles, whose <html> attributes can change without a repaint. */
function probe() {
  const sheets = document.styleSheets.length
  if (frame?.element.isConnected && frame.sheets === sheets)
    return frame.element
  frame?.element.remove()
  const element = document.createElement("iframe")
  element.setAttribute("aria-hidden", "true")
  element.tabIndex = -1
  element.style.cssText =
    "position:absolute;width:0;height:0;border:0;visibility:hidden"
  document.body.append(element)
  const css = [...document.styleSheets]
    .flatMap((sheet) => {
      try {
        return [...sheet.cssRules].map((rule) => rule.cssText)
      } catch {
        return [] // a cross-origin sheet holds no Patina tokens
      }
    })
    .join("\n")
  const doc = element.contentDocument
  if (!doc) throw new Error("The theme studio could not open its probe frame.")
  const style = doc.createElement("style")
  style.textContent = css
  doc.head.append(style)
  frame = { element, sheets }
  return element
}

/** The token values a set of choices resolves to, in day and night. */
export function readTheme(choices: ThemeChoices): ResolvedTheme {
  const element = probe()
  const root = element.contentDocument!.documentElement
  for (const [key, value] of Object.entries(choices)) root.dataset[key] = value
  const read = (groups: Groups): Values => {
    const style = element.contentWindow!.getComputedStyle(root)
    return Object.fromEntries(
      groups
        .flatMap(([, tokens]) => tokens)
        .map((token) => [token, style.getPropertyValue(`--${token}`).trim()]),
    )
  }
  root.dataset.theme = "day"
  const day = read(MODE_TOKENS)
  root.dataset.theme = "night"
  const night = read(MODE_TOKENS)
  return { shared: read(SHARED_TOKENS), day, night }
}

/** A file-safe item name: "Field notes" becomes "field-notes". */
export function slugOf(name: string) {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
  return slug || "patina-theme"
}

/** One declaration, wrapped the way Prettier leaves a long one. */
const declaration = (token: string, value: string) =>
  `  --${token}: ${value};`.length > 80
    ? `  --${token}:\n    ${value};`
    : `  --${token}: ${value};`

const block = (selectors: string[], groups: Groups, values: Values) =>
  `${selectors.join(",\n")} {\n${groups
    .map(
      ([title, tokens]) =>
        `  /* ${title} */\n${tokens.map((t) => declaration(t, values[t] ?? "")).join("\n")}`,
    )
    .join("\n\n")}\n}\n`

const quoted = (value: string) => JSON.stringify(value)

/** The theme as a stylesheet that loads after patina.css. */
export function themeCss(
  name: string,
  choices: ThemeChoices,
  theme: ResolvedTheme,
) {
  const changed = (Object.keys(choices) as (keyof ThemeChoices)[]).filter(
    (key) => choices[key] !== defaultAppearance[key],
  )
  const defaults = changed.length
    ? `{ ${changed.map((key) => `${key}: ${quoted(choices[key])}`).join(", ")} }`
    : ""
  const header = [
    `/* Patina theme ${quoted(name)}, from the Patina UI theme studio.`,
    `   Load it after patina.css. It fixes the paper, inks, accent, density and interface face below, in day`,
    `   and night. Set the rest on <html>: data-stock=${quoted(choices.stock)} (its grain),`,
    `   data-variation=${quoted(choices.variation)} and data-patina=${quoted(choices.patina)}.`,
    `   With the appearance runtime, start from the same choices and offer only the rows that stay open:`,
    `     appearanceScript(${defaults})`,
    `     <AppearanceControl rows={["theme", "variation", "patina"]} /> */`,
  ].join("\n")
  return [
    header,
    // The second selector of each pair outranks the kit's attribute rules once the runtime has set them.
    block(
      [":root", ":root[data-density][data-face]"],
      SHARED_TOKENS,
      theme.shared,
    ),
    block(
      [
        ':root:not([data-theme="night"])',
        ':root:not([data-theme="night"])[data-stock]',
      ],
      MODE_TOKENS,
      theme.day,
    ),
    block(
      [':root[data-theme="night"]', ':root[data-theme="night"][data-stock]'],
      MODE_TOKENS,
      theme.night,
    ),
  ].join("\n\n")
}

/** The same stylesheet as a shadcn registry:theme item: `npx shadcn add ./<name>.json`. */
export function registryItem(name: string, css: string) {
  const slug = slugOf(name)
  const path = `styles/themes/${slug}.css`
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: slug,
    type: "registry:theme",
    title: name,
    description: `Patina theme ${quoted(name)}: paper, inks, accent, density and interface face for day and night. Installs beside patina.css, which must be the Tailwind entry, and is imported after it.`,
    files: [
      {
        path,
        type: "registry:file",
        target: `src/patina/${path}`,
        content: css,
      },
    ],
    css: { [`@import "./themes/${slug}.css"`]: {} },
  }
}

/** Saves text as a file through the browser's download. */
export function download(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
