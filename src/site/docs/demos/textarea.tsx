import { Label } from "@/patina/ui/label"
import { Textarea } from "@/patina/ui/textarea"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Textarea",
  description:
    "A calm pen-line field for a few lines of notes that grows with what is written.",
  item: "textarea",
}

const NOTE =
  "Two little egrets feeding along the creek edge on the falling tide. Both flew north-east when the dog walkers reached the sea wall."

export default function TextareaDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Default">
          <div className="flex w-full max-w-[34rem] flex-col gap-hair">
            <Label htmlFor="notes">Field notes</Label>
            <Textarea
              id="notes"
              placeholder="Behaviour, weather, anything unusual"
            />
          </div>
        </StateRow>
        <StateRow label="Filled">
          <Textarea
            aria-label="Field notes"
            defaultValue={NOTE}
            className="max-w-[34rem]"
          />
        </StateRow>
        <StateRow label="Invalid">
          <Textarea
            aria-label="Reason for the late entry"
            aria-invalid="true"
            defaultValue="Late"
            className="max-w-[34rem]"
          />
        </StateRow>
        <StateRow label="Disabled">
          <Textarea
            aria-label="Reviewer's note"
            disabled
            defaultValue="Checked against the county list on 30 October."
            className="max-w-[34rem]"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Ruled">
        <StateRow label="data-ruled">
          <Textarea
            aria-label="Field notes, ruled"
            data-ruled="true"
            defaultValue={NOTE}
            className="max-w-[34rem]"
          />
        </StateRow>
      </DemoSection>
    </>
  )
}
