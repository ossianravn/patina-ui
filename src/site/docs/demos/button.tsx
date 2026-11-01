import { ArrowRightIcon, PlusIcon } from "lucide-react"
import { Button } from "@/patina/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Button",
  description:
    "A stamped label that starts an action: solid ink for the main one, a pen-line frame or less for the rest.",
  item: "button",
  group: "Actions",
}

const VARIANTS = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const

export default function ButtonDemo() {
  return (
    <>
      <DemoSection title="Variants">
        {VARIANTS.map((variant) => (
          <StateRow key={variant} label={variant}>
            <Button variant={variant}>Log sighting</Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="xs · sm · default · lg">
          <Button size="xs">Tag</Button>
          <Button size="sm">Save</Button>
          <Button>Save entry</Button>
          <Button size="lg">Start survey</Button>
        </StateRow>
        <StateRow label="With icon">
          <Button>
            <PlusIcon data-icon="inline-start" /> New entry
          </Button>
          <Button variant="outline">
            Next <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Add entry">
            <PlusIcon />
          </Button>
        </StateRow>
      </DemoSection>
    </>
  )
}
