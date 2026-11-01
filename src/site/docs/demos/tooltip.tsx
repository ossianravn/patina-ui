import { BinocularsIcon, MapPinIcon, PlusIcon, WavesIcon } from "lucide-react"
import { Button } from "@/patina/ui/button"
import { Kbd } from "@/patina/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/patina/ui/tooltip"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Tooltip",
  description:
    "A label-maker strip that names a control when it is hovered or focused.",
  item: "tooltip",
}

const SIDES = [
  { side: "top", label: "Binoculars", icon: BinocularsIcon },
  { side: "right", label: "Pin location", icon: MapPinIcon },
  { side: "bottom", label: "Tide table", icon: WavesIcon },
  { side: "left", label: "New entry", icon: PlusIcon },
] as const

export default function TooltipDemo() {
  return (
    <>
      <DemoSection title="Open">
        <StateRow label="Default open">
          <Tooltip defaultOpen>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Log sighting"
                />
              }
            >
              <PlusIcon />
            </TooltipTrigger>
            <TooltipContent side="right">Log sighting</TooltipContent>
          </Tooltip>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sides">
        <StateRow label="Hover or focus">
          {SIDES.map(({ side, label, icon: Icon }) => (
            <Tooltip key={side}>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon" aria-label={label} />
                }
              >
                <Icon />
              </TooltipTrigger>
              <TooltipContent side={side}>{label}</TooltipContent>
            </Tooltip>
          ))}
        </StateRow>
      </DemoSection>
      <DemoSection title="Content">
        <StateRow label="With shortcut">
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" />}>
              Log sighting
            </TooltipTrigger>
            <TooltipContent>
              New sighting <Kbd>N</Kbd>
            </TooltipContent>
          </Tooltip>
        </StateRow>
        <StateRow label="Long label">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Lower hide
            </TooltipTrigger>
            <TooltipContent>
              Spring tides flood the path; check the table before crossing
            </TooltipContent>
          </Tooltip>
        </StateRow>
      </DemoSection>
    </>
  )
}
