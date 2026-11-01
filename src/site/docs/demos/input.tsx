import { Input } from "@/patina/ui/input"
import { Label } from "@/patina/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Input",
  description:
    "A calm pen-line field for a short value, as wide as the value it holds.",
  item: "input",
}

export default function InputDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="Default">
        <div className="flex flex-col gap-hair">
          <Label htmlFor="species">Species</Label>
          <Input id="species" placeholder="Grey heron" className="w-[18rem]" />
        </div>
      </StateRow>
      <StateRow label="Filled">
        <Input
          aria-label="Count"
          defaultValue="42"
          inputMode="numeric"
          className="w-[6rem]"
        />
      </StateRow>
      <StateRow label="Invalid">
        <Input
          aria-label="Date"
          aria-invalid="true"
          defaultValue="31/02/2026"
          className="w-[10rem]"
        />
      </StateRow>
      <StateRow label="Disabled">
        <Input
          aria-label="Recorder"
          disabled
          defaultValue="Mira Okafor"
          className="w-[14rem]"
        />
      </StateRow>
    </DemoSection>
  )
}
