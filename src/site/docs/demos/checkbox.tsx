import { Checkbox } from "@/patina/ui/checkbox"
import { Label } from "@/patina/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Checkbox",
  description:
    "A pen-drawn box that takes a hand tick, for choices that are on or off.",
  item: "checkbox",
}

export default function CheckboxDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="Unchecked">
        <Label>
          <Checkbox /> Binoculars
        </Label>
      </StateRow>
      <StateRow label="Checked">
        <Label>
          <Checkbox defaultChecked /> Hand lens
        </Label>
      </StateRow>
      <StateRow label="Invalid">
        <Label>
          <Checkbox aria-invalid="true" /> Permission to enter the reserve
        </Label>
      </StateRow>
      <StateRow label="Disabled">
        <Label>
          <Checkbox disabled /> Boat (not booked)
        </Label>
        <Label>
          <Checkbox disabled defaultChecked /> Tide table
        </Label>
      </StateRow>
    </DemoSection>
  )
}
