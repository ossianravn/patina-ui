import type { ReactNode } from "react"
import { cn } from "@/patina/lib/utils"
import { Print } from "@/patina/print/print"
import { Switch } from "@/patina/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/patina/ui/toggle-group"
import { Stage } from "./stage/stage"
import { useStage, type Act } from "./stage/use-stage"

// Scene: Fieldbook's appearance settings switching the paper stock. Beats: the cursor presses Newsprint; the control
// takes the press at once; then the window reprints on Newsprint, the new sheet sliding across the old one from the
// control's side. The two sheets are one window on two stocks (scoped by [data-scene-stock], see scene-stocks.ts), so only the
// scene changes paper, never the page. The poster frame is the window on Newsprint with Newsprint chosen.

type Stock = "archive" | "newsprint"
interface S {
  chosen: Stock
  reprinted: boolean
}
const INITIAL: S = { chosen: "archive", reprinted: false }
const POSTER: S = { chosen: "newsprint", reprinted: true }

async function script(a: Act<S>) {
  a.place({ x: 0.88, y: 0.92 })
  await a.wait(600)
  await a.move({ at: "newsprint", x: 0.9, y: 0.8 })
  await a.wait(120)
  await a.press()
  a.put({ chosen: "newsprint" })
  await a.wait(220)
  a.put({ reprinted: true })
  await a.wait(900)
  await a.move({ x: 0.9, y: 0.9 }, { ms: 900 })
  await a.wait(2000)
}

const STOCKS: { value: Stock | "field"; label: string }[] = [
  { value: "archive", label: "Archive" },
  { value: "field", label: "Field" },
  { value: "newsprint", label: "Newsprint" },
]

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-snug gap-y-hair border-b border-dashed border-rule py-tight">
      <span className="font-semibold">{label}</span>
      {children}
    </div>
  )
}

/** The settings window, printed on one stock. */
function Window({ stock, chosen }: { stock: Stock; chosen: Stock }) {
  return (
    <div
      data-scene-stock={stock}
      className="sheet absolute inset-0 px-line pt-snug text-ui @max-[30rem]:px-tight"
    >
      <p className="label-mono m-0 text-ink-2">Fieldbook · Settings</p>
      <h3 className="m-0 mt-hair text-lead leading-subhead">Appearance</h3>
      <div className="mt-tight">
        <Row label="Paper">
          <ToggleGroup variant="outline" size="sm" spacing={0} value={[chosen]}>
            {STOCKS.map(({ value, label }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                data-target={stock === "archive" ? value : undefined}
              >
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Row>
        <Row label="Patina">
          <ToggleGroup
            variant="outline"
            size="sm"
            spacing={0}
            value={["handled"]}
          >
            {["Clean", "Handled", "Worn"].map((label) => (
              <ToggleGroupItem key={label} value={label.toLowerCase()}>
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Row>
        <Row label="Lively paper">
          <Switch checked />
        </Row>
      </div>
      <div className="mt-snug flex items-center gap-tight">
        <Print motif="horizon" seed="obs-0412" className="w-11 shrink-0" />
        <div className="min-w-0">
          <p className="m-0 font-semibold leading-subhead">Grey heron</p>
          <p className="label-mono m-0 text-ink-2">Tidal flats · 05:42</p>
        </div>
      </div>
    </div>
  )
}

export function PaperStockScene() {
  const stage = useStage({ initial: INITIAL, poster: POSTER, script })
  const { chosen, reprinted } = stage.state
  const slide =
    "transition-transform duration-[850ms] ease-[cubic-bezier(0.45,0,0.1,1)]"
  return (
    <Stage stage={stage} label="the paper stock switched in settings">
      <div className="absolute top-[9%] right-[6%] left-[6%] h-[110%] @max-[30rem]:right-tight @max-[30rem]:left-tight @max-[18.5rem]:right-2 @max-[18.5rem]:left-2">
        <Window stock="archive" chosen={chosen} />
        {/* The reprint: an outer box slides in from the right, the side of the control, while its content slides
            the other way, so the new sheet is revealed in place with transforms alone; its leading edge casts a
            little shadow on the old sheet. */}
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-sheet shadow-[-12px_0_18px_-12px_rgb(var(--tone-rgb)/0.55)]",
            slide,
            reprinted ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div
            className={cn(
              "absolute inset-0",
              slide,
              reprinted ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Window stock="newsprint" chosen="newsprint" />
          </div>
        </div>
      </div>
    </Stage>
  )
}
