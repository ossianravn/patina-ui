import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { INK_SETS, MOTIFS } from "@/patina/ink"
import { Print } from "@/patina/print/print"
import { MOTIF_INFO } from "@/site/data/motifs"
import { rerollSeed, sheetSeeds } from "./seeds"
import { downloadSvg, jsxFor, type PressState } from "./state"
import { usePressState } from "./use-press-state"

const field =
  "h-control rounded-sheet border-[1.5px] border-line bg-card px-tight text-ui text-ink"
const button =
  "label-mono inline-flex h-control items-center rounded-sheet px-snug font-semibold tracking-[0.08em] cursor-pointer"

function Row({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: ReactNode
}) {
  const Tag = htmlFor ? "label" : "div"
  return (
    <div className="flex flex-col gap-hair">
      <Tag {...(htmlFor ? { htmlFor } : {})} className="label-mono text-ink-2">
        {label}
      </Tag>
      {children}
    </div>
  )
}

/** The Press: choose a motif, a seed and inks, reroll, and take the print away. */
export function Press() {
  const [state, set] = usePressState()
  const [copied, setCopied] = useState<"seed" | "jsx" | null>(null)
  const sheetRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(null), 1600)
    return () => clearTimeout(t)
  }, [copied])

  const sheet = useMemo(
    () => sheetSeeds(state.seed || "quiet-heron", 24),
    [state.seed],
  )
  const copy = (what: "seed" | "jsx") =>
    navigator.clipboard
      .writeText(what === "seed" ? state.seed : jsxFor(state))
      .then(() => setCopied(what))
  const text = state.motif === "monogram" ? state.text : undefined
  const register = {
    "--misregister": `${state.misregister}px`,
  } as CSSProperties

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-x-section gap-y-line lg:grid-cols-[minmax(0,1fr)_22rem]">
      <figure
        ref={sheetRef}
        data-inks={state.inks}
        style={register}
        className="m-0 flex flex-col items-center"
      >
        <div
          className="w-full max-w-[34rem] rounded-sheet bg-card p-line shadow-sheet"
          style={{
            backgroundImage: "var(--paper-texture)",
            backgroundSize: "var(--paper-texture-size)",
          }}
        >
          <Print
            motif={state.motif}
            seed={state.seed}
            inks={state.inks}
            text={text}
            title={`${state.motif} print from the seed ${state.seed}`}
          />
        </div>
        <figcaption className="mt-tight flex w-full max-w-[34rem] flex-wrap items-center justify-between gap-tight">
          <span className="label-mono text-ink-2">
            {state.motif} · {state.seed}
          </span>
          <span className="flex flex-wrap gap-hair">
            <button
              type="button"
              className={`${button} border-[1.5px] border-line text-ink hover:bg-paper-3`}
              onClick={() => copy("seed")}
            >
              {copied === "seed" ? "Copied" : "Copy seed"}
            </button>
            <button
              type="button"
              className={`${button} border-[1.5px] border-line text-ink hover:bg-paper-3`}
              onClick={() => copy("jsx")}
            >
              {copied === "jsx" ? "Copied" : "Copy JSX"}
            </button>
            <button
              type="button"
              className={`${button} border-[1.5px] border-line text-ink hover:bg-paper-3`}
              onClick={() =>
                sheetRef.current && downloadSvg(state, sheetRef.current)
              }
            >
              Download SVG
            </button>
          </span>
        </figcaption>
        <p className="sr-only" aria-live="polite">
          {copied ? `Copied the ${copied === "seed" ? "seed" : "JSX"}` : ""}
        </p>
      </figure>

      <form
        className="flex flex-col gap-snug"
        aria-label="Print settings"
        onSubmit={(e) => e.preventDefault()}
      >
        <Row label="Motif" htmlFor="press-motif">
          <select
            id="press-motif"
            className={`${field} w-fit`}
            value={state.motif}
            onChange={(e) =>
              set({ motif: e.target.value as PressState["motif"] })
            }
          >
            {MOTIFS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <span className="text-small leading-small text-ink-2">
            {MOTIF_INFO[state.motif].picture}
          </span>
        </Row>
        <Row label="Seed" htmlFor="press-seed">
          <span className="flex gap-hair">
            <input
              id="press-seed"
              className={`${field} w-[calc(18ch+1.5rem)] font-label`}
              value={state.seed}
              spellCheck={false}
              onChange={(e) => set({ seed: e.target.value })}
            />
            <button
              type="button"
              className={`${button} bg-ink text-paper hover:bg-print-violet`}
              onClick={() => set({ seed: rerollSeed() })}
            >
              Reroll
            </button>
          </span>
        </Row>
        {state.motif === "monogram" && (
          <Row label="Name" htmlFor="press-name">
            <input
              id="press-name"
              className={`${field} w-[calc(20ch+1.5rem)]`}
              value={state.text}
              onChange={(e) => set({ text: e.target.value })}
            />
          </Row>
        )}
        <Row label="Inks">
          <span className="flex items-center gap-tight">
            <div
              role="radiogroup"
              aria-label="Inks"
              className="inline-flex w-fit rounded-sheet border-[1.5px] border-line"
            >
              {INK_SETS.map((inks) => (
                <label
                  key={inks}
                  data-inks={inks}
                  title={inks}
                  className="flex h-control cursor-pointer items-center px-tight hover:bg-paper-2 has-checked:bg-ink has-focus-visible:outline-2 has-focus-visible:outline-dashed has-focus-visible:outline-k-ink"
                >
                  <input
                    type="radio"
                    name="press-inks"
                    aria-label={inks}
                    className="sr-only"
                    checked={state.inks === inks}
                    onChange={() => set({ inks })}
                  />
                  <span aria-hidden="true" className="flex -space-x-1">
                    {["line", "accent", "detail"].map((d) => (
                      <span
                        key={d}
                        className="size-2.5 rounded-full"
                        style={{ background: `var(--print-${d})` }}
                      />
                    ))}
                  </span>
                </label>
              ))}
            </div>
            <span className="label-mono text-ink-2">{state.inks}</span>
          </span>
        </Row>
        <Row label="Misregistration" htmlFor="press-register">
          <span className="flex items-center gap-tight">
            <input
              id="press-register"
              type="range"
              min={0}
              max={4}
              step={0.1}
              value={state.misregister}
              className="w-44 accent-ink"
              onChange={(e) => set({ misregister: Number(e.target.value) })}
            />
            <output
              htmlFor="press-register"
              className="label-mono w-12 text-ink"
            >
              {state.misregister.toFixed(1)} px
            </output>
          </span>
        </Row>
      </form>

      <section aria-labelledby="press-sheet" className="lg:col-span-2">
        <h2 id="press-sheet" className="label-mono m-0 text-ink-2">
          Neighbouring seeds
        </h2>
        <ul
          data-inks={state.inks}
          style={register}
          className="mt-tight grid list-none grid-cols-4 gap-tight p-0 sm:grid-cols-6 lg:grid-cols-8"
        >
          {sheet.map((seed) => (
            <li key={seed} className="min-w-0">
              <button
                type="button"
                aria-label={`Use the seed ${seed}`}
                onClick={() => set({ seed })}
                className="flex w-full cursor-pointer flex-col items-center gap-hair rounded-sheet p-hair hover:bg-paper-2"
              >
                <Print
                  motif={state.motif}
                  seed={seed}
                  inks={state.inks}
                  text={text}
                  className="w-full"
                />
                <span className="label-mono max-w-full truncate text-ink-2">
                  {seed}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
