import { Button } from "@/patina/ui/button"
import { Kbd, KbdGroup } from "@/patina/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/patina/ui/tooltip"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Kbd",
  description: "A mono keycap that names a key or a shortcut.",
  item: "kbd",
}

export default function KbdDemo() {
  return (
    <DemoSection title="Keys">
      <StateRow label="Single">
        <Kbd>N</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
      </StateRow>
      <StateRow label="Group">
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>E</Kbd>
        </KbdGroup>
      </StateRow>
      <StateRow label="In text">
        <p className="m-0 text-small leading-small text-ink-2">
          Press <Kbd>N</Kbd> to log a sighting, or <Kbd>Esc</Kbd> to close the
          form without saving.
        </p>
      </StateRow>
      <StateRow label="In a tooltip">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Search entries
          </TooltipTrigger>
          <TooltipContent>
            Search
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </StateRow>
    </DemoSection>
  )
}
