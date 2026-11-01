import base from "@/patina/styles/base.css?raw"
import roles from "@/patina/styles/roles.css?raw"
import stocks from "@/patina/styles/stocks.css?raw"
import textures from "@/patina/styles/textures.generated.css?raw"
import tokens from "@/patina/styles/tokens.css?raw"

// The paper-stock scene shows one Fieldbook window on two stocks at once. The kit applies a stock only on <html>
// (:root[data-stock]), so this re-scopes the kit's own stock rules to [data-scene-stock="…"] containers at build
// time, reading the kit's CSS sources rather than copying values: a stock's paper and inks, its tinted grain layers,
// and the variables the kit derives from them on :root (roles, the accent's text inks, the paper texture stack),
// which would otherwise arrive already resolved for the page's own stock.

type Declaration = [name: string, value: string]
interface Rule {
  selector: string
  body: Declaration[]
}

const SCOPE = "[data-scene-stock]"

/** Top-level rules of a stylesheet; at-rule blocks are skipped. Values may hold quoted data URIs with semicolons. */
function parse(css: string): Rule[] {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "")
  const rules: Rule[] = []
  let i = 0
  while (i < source.length) {
    const open = source.indexOf("{", i)
    if (open < 0) break
    const selector = source.slice(i, open).trim()
    let depth = 1
    let quote = ""
    let j = open + 1
    for (; j < source.length && depth > 0; j++) {
      const c = source[j]
      if (quote) quote = c === quote ? "" : quote
      else if (c === '"' || c === "'") quote = c
      else if (c === "{") depth++
      else if (c === "}") depth--
    }
    const inner = source.slice(open + 1, j - 1)
    if (!selector.startsWith("@") && !inner.includes("{"))
      rules.push({ selector, body: declarations(inner) })
    i = j
  }
  return rules
}

function declarations(body: string): Declaration[] {
  const out: Declaration[] = []
  let quote = ""
  let parens = 0
  let start = 0
  const push = (text: string) => {
    const colon = text.indexOf(":")
    if (colon > 0)
      out.push([text.slice(0, colon).trim(), text.slice(colon + 1).trim()])
  }
  for (let k = 0; k < body.length; k++) {
    const c = body[k]
    if (quote) quote = c === quote ? "" : quote
    else if (c === '"' || c === "'") quote = c
    else if (c === "(") parens++
    else if (c === ")") parens--
    else if (c === ";" && parens === 0) {
      push(body.slice(start, k))
      start = k + 1
    }
  }
  push(body.slice(start))
  return out
}

const same = (a: string, b: string) =>
  a.replace(/\s+/g, " ").trim() === b.replace(/\s+/g, " ").trim()
const find = (rules: Rule[], selector: string, has?: string) =>
  rules.filter(
    (r) =>
      same(r.selector, selector) && (!has || r.body.some(([n]) => n === has)),
  )
const block = (selector: string, body: Declaration[]) =>
  body.length
    ? `${selector}{${body.map(([n, v]) => `${n}:${v}`).join(";")}}`
    : ""
const only = (body: Declaration[], names: Set<string>) =>
  body.filter(([n]) => names.has(n))

const TOKENS = parse(tokens)
const STOCKS = parse(stocks)
const TEXTURES = parse(textures)
const BASE = parse(base)
const ROLES = parse(roles)

/** The variables a stock sets: whatever stocks.css declares for one of its stocks. */
const STOCK_VARS = new Set(
  STOCKS.find((r) => r.selector.includes("data-stock"))?.body.map(([n]) => n),
)
const ACCENT_VARS = new Set(["--k", "--k-ink", "--k-hand"])
const TEXTURE_VARS = new Set(["--paper-texture", "--paper-texture-size"])

function stockRules(stock: string) {
  const day = `:root[data-stock="${stock}"]`
  const night = `${day}[data-theme="night"]`
  const pane = `[data-scene-stock="${stock}"]`
  const nightPane = `:root[data-theme="night"] ${pane}`
  // Archive's values are tokens.css's defaults; its grain sits under ":root, :root[data-stock=archive]".
  const paper =
    stock === "archive"
      ? [find(TOKENS, ":root"), find(TOKENS, ':root[data-theme="night"]')]
      : [find(STOCKS, day), find(STOCKS, night)]
  const grain =
    stock === "archive"
      ? [
          TEXTURES.filter((r) => r.selector.includes(`data-stock="archive"`)),
          find(TEXTURES, ':root[data-theme="night"]', "--tex-mottle"),
        ]
      : [find(TEXTURES, day), find(TEXTURES, night)]
  const [dayPaper, nightPaper] = paper.map((rules) =>
    rules.flatMap((r) => only(r.body, STOCK_VARS)),
  )
  const [dayGrain, nightGrain] = grain.map((rules) =>
    rules.flatMap((r) => r.body),
  )
  return (
    block(pane, [...(dayPaper ?? []), ...(dayGrain ?? [])]) +
    block(nightPane, [...(nightPaper ?? []), ...(nightGrain ?? [])])
  )
}

/** Re-declares, inside each pane, the kit's :root variables that are built from stock variables. */
function derivedRules() {
  const scoped = (rules: Rule[], names?: Set<string>) =>
    rules
      .map((r) => {
        const inner = same(r.selector, ":root")
          ? SCOPE
          : `${r.selector} ${SCOPE}`
        return block(inner, names ? only(r.body, names) : r.body)
      })
      .join("")
  const accents = TOKENS.filter((r) =>
    r.selector.startsWith(":root[data-accent="),
  )
  const patina = BASE.filter((r) =>
    /^:root(\[data-patina=[^\]]+\])?$/.test(r.selector),
  )
  return (
    scoped(find(ROLES, ":root")) +
    scoped(find(TOKENS, ":root"), ACCENT_VARS) +
    scoped(accents, ACCENT_VARS) +
    scoped(patina, TEXTURE_VARS) +
    `${SCOPE}{color:var(--ink)}` +
    `@media (prefers-contrast: more),(forced-colors: active){${SCOPE}{--paper-texture:none}}`
  )
}

/** CSS that lets [data-scene-stock="archive" | …] containers carry a paper stock of their own. */
export function sceneStockCss(names: readonly string[]) {
  return names.map(stockRules).join("") + derivedRules()
}
