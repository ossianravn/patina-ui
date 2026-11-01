import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/patina/ui/button"
import { Input } from "@/patina/ui/input"
import { Label } from "@/patina/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/patina/ui/popover"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Popover",
  description:
    "A small sheet that opens beside its trigger for a detail or a quick edit, without leaving the page.",
  item: "popover",
}

export default function PopoverDemo() {
  return (
    <>
      <DemoSection title="Open">
        <StateRow label="Default open">
          {/* Room for the open sheet, so it does not cover the next example. */}
          <div className="min-h-[12.5rem]">
            <Popover defaultOpen>
              <PopoverTrigger render={<Button variant="outline" />}>
                Low tide <ChevronDownIcon data-icon="inline-end" />
              </PopoverTrigger>
              <PopoverContent align="start" initialFocus={false}>
                <PopoverHeader>
                  <PopoverTitle>Low tide 08:12</PopoverTitle>
                  <PopoverDescription>
                    Sat 14 Nov · Saltmarsh sluice
                  </PopoverDescription>
                </PopoverHeader>
                <p className="m-0">
                  0.6 m. The flats stay open for about three hours; leave the
                  second hide by 10:40.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Quick edit">
        <StateRow label="Focus moves in">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              Edit count
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64">
              <PopoverHeader>
                <PopoverTitle>Grey heron</PopoverTitle>
                <PopoverDescription>
                  Seen at 07:42 from the first hide
                </PopoverDescription>
              </PopoverHeader>
              <div className="flex items-end gap-tight">
                <div className="flex flex-col gap-hair">
                  <Label htmlFor="heron-count">Count</Label>
                  <Input
                    id="heron-count"
                    defaultValue="3"
                    inputMode="numeric"
                    className="w-[5rem]"
                  />
                </div>
                <Button>Save</Button>
              </div>
            </PopoverContent>
          </Popover>
        </StateRow>
        <StateRow label="Above the trigger">
          <Popover>
            <PopoverTrigger render={<Button variant="ghost" />}>
              Who recorded this?
            </PopoverTrigger>
            <PopoverContent side="top" align="start">
              <PopoverHeader>
                <PopoverTitle>Mira Okafor</PopoverTitle>
                <PopoverDescription>
                  Saltmarsh walk lead · 214 entries this season
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </StateRow>
      </DemoSection>
    </>
  )
}
