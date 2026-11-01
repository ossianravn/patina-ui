import { HighlighterIcon, PenLineIcon } from "lucide-react"
import { cn } from "@/patina/lib/utils"
import { MarginNote } from "@/patina/marks/notes"
import { Print } from "@/patina/print/print"
import { Button } from "@/patina/ui/button"
import { Stage } from "./stage/stage"
import { useStage, type Act } from "./stage/use-stage"

// Scene: a Fieldbook entry receiving a margin note. Beats: the cursor selects a phrase in the field journal and the
// highlighter follows it; a small toolbar offers Add note; the note is written into the margin beside the line,
// with an arrow back to the phrase. The poster frame is the entry with both marks in place. On a narrow stage the
// margin moves under the paragraph, as Fieldbook's own notes do on phones.

const NOTE = "same bird as Thursday?"

interface S {
  marked: boolean
  toolbar: boolean
  note: string
}
const INITIAL: S = { marked: false, toolbar: false, note: "" }
const POSTER: S = { marked: true, toolbar: false, note: NOTE }

async function script(a: Act<S>) {
  a.place({ x: 0.86, y: 0.9 })
  await a.wait(500)
  a.kind("text")
  await a.move({ at: "phrase", x: 0, y: 0.6 })
  await a.wait(180)
  a.put({ marked: true })
  await a.move({ at: "phrase", x: 1, y: 0.6 }, { ms: 720, easing: "linear" })
  a.kind("arrow")
  await a.wait(160)
  a.put({ toolbar: true })
  await a.wait(420)
  await a.move({ at: "add-note", x: 0.82, y: 0.62 })
  await a.press()
  a.put({ toolbar: false })
  await a.wait(260)
  for (let i = 1; i <= NOTE.length; i++) {
    a.put({ note: NOTE.slice(0, i) })
    await a.wait(NOTE[i - 1] === " " ? 90 : 48)
  }
  await a.move({ x: 0.9, y: 0.88 }, { ms: 900 })
  await a.wait(2200)
}

export function MarginNoteScene() {
  const stage = useStage({ initial: INITIAL, poster: POSTER, script })
  const { marked, toolbar, note } = stage.state
  return (
    <Stage stage={stage} label="a margin note added to an entry">
      <article className="sheet absolute top-[9%] right-[6%] left-[6%] h-[110%] px-line pt-snug @max-[30rem]:right-tight @max-[30rem]:left-tight @max-[18.5rem]:right-2 @max-[18.5rem]:left-2 @max-[30rem]:px-tight">
        <header className="flex items-center gap-tight">
          <Print motif="horizon" seed="obs-0412" className="w-14 shrink-0" />
          <div className="min-w-0">
            <p className="label-mono m-0 text-ink-2">
              Tidal flats · Sat 14 Nov, 05:42
            </p>
            <h3 className="m-0 text-lead leading-subhead">Grey heron</h3>
          </div>
        </header>
        <p className="label-mono m-0 mt-snug text-ink-2">Field journal</p>
        <div className="mt-hair grid grid-cols-[minmax(0,1fr)_11rem] gap-x-snug @max-[30rem]:grid-cols-1">
          <p className="m-0 text-ui leading-[1.65]">
            Tide out by six. The heron was already there, standing in the
            shallows{" "}
            <span className="relative whitespace-nowrap">
              <span
                aria-hidden="true"
                className={cn(
                  "highlight absolute inset-0 origin-left transition-transform ease-linear rtl:origin-right",
                  marked
                    ? "scale-x-100 duration-[720ms]"
                    : "scale-x-0 duration-300",
                )}
              />
              <span data-target="phrase" className="relative">
                as if it had waited for us
              </span>
              <span
                className={cn(
                  "float-sheet absolute bottom-full left-0 z-10 mb-hair flex gap-0.5 p-0.5 transition-[opacity,translate] duration-150 ease-out",
                  toolbar
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0",
                )}
              >
                <Button variant="ghost" size="xs">
                  <HighlighterIcon data-icon="inline-start" />
                  Highlight
                </Button>
                <Button data-target="add-note" variant="ghost" size="xs">
                  <PenLineIcon data-icon="inline-start" />
                  Add note
                </Button>
              </span>
            </span>
            . It held still for eleven minutes, then a single strike, and an
            eel.
          </p>
          <MarginNote
            seed="obs-0412"
            className={cn(
              "mt-[2.6rem] min-h-[3.2rem] transition-opacity duration-200 @max-[30rem]:mt-tight",
              note ? "opacity-100" : "opacity-0",
            )}
          >
            {note || " "}
          </MarginNote>
          <p className="m-0 mt-tight text-ui leading-[1.65] @max-[30rem]:mt-hair">
            It walked the creek edge north towards the sluice and lifted when
            the first dog walkers came along the sea wall.
          </p>
        </div>
      </article>
    </Stage>
  )
}
