import { Checkbox } from "@/patina/ui/checkbox"
import { Input } from "@/patina/ui/input"
import { Label } from "@/patina/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Label",
  description:
    "The name of a control, set in the reading voice beside or above what it names.",
  item: "label",
  group: "Forms",
}

export default function LabelDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="Above a field">
        <div className="flex flex-col gap-hair">
          <Label htmlFor="label-site">Site</Label>
          <Input
            id="label-site"
            placeholder="Blakeney Freshes"
            className="w-[16rem]"
          />
        </div>
      </StateRow>
      <StateRow label="Beside a control">
        <Label>
          <Checkbox defaultChecked /> Ringed bird
        </Label>
      </StateRow>
      <StateRow label="Disabled">
        <div data-disabled="true" className="group flex flex-col gap-hair">
          <Label htmlFor="label-boat">Boat</Label>
          <Input
            id="label-boat"
            disabled
            defaultValue="Not booked"
            className="w-[10rem]"
          />
        </div>
      </StateRow>
    </DemoSection>
  )
}
