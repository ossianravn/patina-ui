import { Print } from "@/patina/print/print"
import { Badge } from "@/patina/ui/badge"
import { Button } from "@/patina/ui/button"
import { Input } from "@/patina/ui/input"
import { Label } from "@/patina/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/patina/ui/sheet"
import { OBSERVATIONS, PLACES, tally, when } from "@/site/fieldbook/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Sheet",
  description:
    "A page that slides in from an edge of the window to show a record or a short task beside the page it came from.",
  item: "sheet",
  group: "Overlays",
}

const heron = OBSERVATIONS[0]!

/** One observation as a page of facts: its print, where and when, the count and the field note. */
function ObservationSheet() {
  const facts = [
    ["Place", heron.place],
    ["Seen", when(heron.seen)],
    ["Count", tally(heron.count)],
  ]
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{heron.species}</SheetTitle>
        <SheetDescription className="italic">{heron.latin}</SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-snug overflow-y-auto px-snug">
        <Print motif={heron.motif} seed={heron.id} className="w-44" />
        <dl className="m-0 grid grid-cols-[5rem_minmax(0,1fr)] gap-x-tight gap-y-hair">
          {facts.map(([term, value]) => (
            <div key={term} className="contents">
              <dt className="label-mono pt-0.5 text-ink-3">{term}</dt>
              <dd className="m-0">{value}</dd>
            </div>
          ))}
          <dt className="label-mono pt-0.5 text-ink-3">Status</dt>
          <dd className="m-0">
            <Badge variant="secondary">Confirmed</Badge>
          </dd>
        </dl>
        <p className="m-0 text-body leading-body">{heron.notes}</p>
      </div>
      <SheetFooter>
        <Button>Edit observation</Button>
        <SheetClose render={<Button variant="outline" />}>Done</SheetClose>
      </SheetFooter>
    </SheetContent>
  )
}

export default function SheetDemo() {
  return (
    <>
      <DemoSection title="Open with the trigger">
        <StateRow label="Right (default)">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Grey heron
            </SheetTrigger>
            <ObservationSheet />
          </Sheet>
        </StateRow>
        <StateRow label="Left">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Places
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Places</SheetTitle>
                <SheetDescription>
                  Saltmarsh reserve · 6 places
                </SheetDescription>
              </SheetHeader>
              <ul className="m-0 flex list-none flex-col p-0 px-snug">
                {PLACES.map((place) => {
                  const seen = OBSERVATIONS.filter((o) => o.place === place)
                  return (
                    <li
                      key={place}
                      className="flex items-baseline justify-between gap-tight border-b border-dashed border-rule py-tight"
                    >
                      <span className="text-body">{place}</span>
                      <span className="label-mono text-ink-2 tabular-nums">
                        {seen.length} {seen.length === 1 ? "entry" : "entries"}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </SheetContent>
          </Sheet>
        </StateRow>
        <StateRow label="Top">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Tide warning
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>High tide 11:48 · 6.1 m</SheetTitle>
                <SheetDescription>
                  Sat 14 Nov · Sluice gate gauge
                </SheetDescription>
              </SheetHeader>
              <p className="m-0 max-w-measure px-snug text-body leading-body">
                The causeway to the North hide floods from 11:10. Leave the
                Saltings by 10:50 and come back along the sea wall.
              </p>
              <SheetFooter className="sm:flex-row">
                <SheetClose render={<Button className="w-fit" />}>
                  Understood
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </StateRow>
        <StateRow label="Bottom">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Share expedition
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Share “Saltmarsh walk”</SheetTitle>
                <SheetDescription>
                  Anyone with the link can read the entries, not edit them.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-wrap items-end gap-tight px-snug pb-snug">
                <div className="flex flex-col gap-hair">
                  <Label htmlFor="share-link">Link</Label>
                  <Input
                    id="share-link"
                    readOnly
                    defaultValue="fieldbook.app/e/saltmarsh-walk"
                    className="w-[19rem] max-w-full"
                  />
                </div>
                <Button variant="outline">Copy link</Button>
              </div>
            </SheetContent>
          </Sheet>
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Footer close only">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" />}>
              Field note
            </SheetTrigger>
            <SheetContent showCloseButton={false}>
              <SheetHeader>
                <SheetTitle>Bittern at the reed edge</SheetTitle>
                <SheetDescription>Fri 13 Nov · Mira Okafor</SheetDescription>
              </SheetHeader>
              <p className="m-0 px-snug text-body leading-body">
                Heard booming twice from the east end of the Reed bed, then a
                brief view at the edge before it walked back in. Worth a dawn
                watch from the North hide tomorrow.
              </p>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Close
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </StateRow>
      </DemoSection>
    </>
  )
}
