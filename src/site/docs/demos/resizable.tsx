import { Fragment } from "react"
import { Print } from "@/patina/print/print"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/patina/ui/resizable"
import { OBSERVATIONS, when } from "@/site/fieldbook/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Resizable",
  description:
    "Panels side by side or stacked, divided by a pen line you can drag to give one of them more room.",
  item: "resizable",
  group: "Data display",
}

const FRAME = "rounded-sheet border border-rule"
// The group fills its parent (react-resizable-panels sets height: 100% inline), so the parent sets the size.
const BOX = "w-full max-w-[44rem]"
const LIST = OBSERVATIONS.slice(0, 6)
const HERON = OBSERVATIONS[0]!

function Notes() {
  return (
    <div className="flex h-full flex-col gap-hair overflow-auto p-snug">
      <p className="label-mono m-0 text-ink-3">
        {HERON.place} · {when(HERON.seen)}
      </p>
      <h3 className="m-0 text-lead leading-subhead">{HERON.species}</h3>
      <p className="m-0 max-w-measure text-ui leading-small text-ink-2">
        {HERON.notes} It stood in the shallow channel below the sluice with the
        tide falling, took a small flatfish and flew north towards the hide.
      </p>
    </div>
  )
}

export default function ResizableDemo() {
  return (
    <>
      <DemoSection title="Orientation">
        <StateRow label="Horizontal">
          <div className={`${BOX} h-64`}>
            <ResizablePanelGroup orientation="horizontal" className={FRAME}>
              <ResizablePanel defaultSize="38%" minSize="25%">
                <ul className="m-0 h-full list-none overflow-auto p-0 py-hair">
                  {LIST.map((o, i) => (
                    <li
                      key={o.id}
                      aria-current={i === 0 ? "true" : undefined}
                      className="flex flex-col px-snug py-1.5 aria-current:bg-paper-3"
                    >
                      <span className="truncate text-ui leading-ui font-semibold">
                        {o.species}
                      </span>
                      <span className="label-mono truncate text-ink-3">
                        {o.place}
                      </span>
                    </li>
                  ))}
                </ul>
              </ResizablePanel>
              <ResizableHandle withHandle aria-label="Resize the list" />
              <ResizablePanel defaultSize="62%" minSize="35%">
                <Notes />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </StateRow>
        <StateRow label="Vertical">
          <div className={`${BOX} h-[24rem]`}>
            <ResizablePanelGroup orientation="vertical" className={FRAME}>
              <ResizablePanel defaultSize="55%" minSize="25%">
                <div className="relative h-full overflow-hidden bg-paper-2">
                  <Print
                    motif="horizon"
                    seed={HERON.id}
                    title="Print of the tidal flats"
                    className="absolute top-1/2 left-1/2 w-[max(100%,24rem)] -translate-1/2"
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle aria-label="Resize the print" />
              <ResizablePanel defaultSize="45%" minSize="25%">
                <Notes />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </StateRow>
        <StateRow label="Line only">
          <div className={`${BOX} h-40`}>
            <ResizablePanelGroup orientation="horizontal" className={FRAME}>
              {["Tidal flats", "Saltings", "Reed bed"].map((place, i) => (
                <Fragment key={place}>
                  {i > 0 ? (
                    <ResizableHandle aria-label={`Resize ${place}`} />
                  ) : null}
                  <ResizablePanel defaultSize="33%" minSize="20%">
                    <div className="flex h-full flex-col justify-between p-snug">
                      <span className="label-mono text-ink-3">{place}</span>
                      <span className="text-h2 leading-heading font-semibold tabular-nums">
                        {[284, 61, 3][i]}
                      </span>
                    </div>
                  </ResizablePanel>
                </Fragment>
              ))}
            </ResizablePanelGroup>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
