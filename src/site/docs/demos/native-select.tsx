import { Label } from "@/patina/ui/label"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/patina/ui/native-select"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Native select",
  description:
    "The platform's own select in Patina's field, for long lists on phones and forms that must work before scripts load.",
  item: "native-select",
}

function Stations() {
  return (
    <>
      <NativeSelectOption value="">Choose a station</NativeSelectOption>
      <NativeSelectOptGroup label="East coast">
        <NativeSelectOption value="harwich">Harwich</NativeSelectOption>
        <NativeSelectOption value="lowestoft">Lowestoft</NativeSelectOption>
        <NativeSelectOption value="whitby">Whitby</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="South coast">
        <NativeSelectOption value="dover">Dover</NativeSelectOption>
        <NativeSelectOption value="portsmouth">Portsmouth</NativeSelectOption>
        <NativeSelectOption value="weymouth">Weymouth</NativeSelectOption>
      </NativeSelectOptGroup>
    </>
  )
}

export default function NativeSelectDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Placeholder">
          <div className="flex flex-col gap-hair">
            <Label htmlFor="tide-station">Tide station</Label>
            <NativeSelect
              id="tide-station"
              defaultValue=""
              className="w-[13rem]"
            >
              <Stations />
            </NativeSelect>
          </div>
        </StateRow>
        <StateRow label="Chosen">
          <NativeSelect
            aria-label="Tide station"
            defaultValue="portsmouth"
            className="w-[13rem]"
          >
            <Stations />
          </NativeSelect>
        </StateRow>
        <StateRow label="Invalid">
          <NativeSelect
            aria-label="Tide station"
            aria-invalid="true"
            defaultValue=""
            className="w-[13rem]"
          >
            <Stations />
          </NativeSelect>
        </StateRow>
        <StateRow label="Disabled">
          <NativeSelect
            aria-label="Tide station"
            disabled
            defaultValue="whitby"
            className="w-[13rem]"
          >
            <Stations />
          </NativeSelect>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm · default">
          <NativeSelect
            size="sm"
            aria-label="Count unit, compact"
            defaultValue="birds"
            className="w-[8rem]"
          >
            <NativeSelectOption value="birds">Birds</NativeSelectOption>
            <NativeSelectOption value="pairs">Pairs</NativeSelectOption>
            <NativeSelectOption value="nests">Nests</NativeSelectOption>
          </NativeSelect>
          <NativeSelect
            aria-label="Count unit"
            defaultValue="birds"
            className="w-[8rem]"
          >
            <NativeSelectOption value="birds">Birds</NativeSelectOption>
            <NativeSelectOption value="pairs">Pairs</NativeSelectOption>
            <NativeSelectOption value="nests">Nests</NativeSelectOption>
          </NativeSelect>
        </StateRow>
      </DemoSection>
    </>
  )
}
