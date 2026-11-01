import { CopyIcon, MapPinIcon, SearchIcon, XIcon } from "lucide-react"
import { Label } from "@/patina/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/patina/ui/input-group"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Input group",
  description:
    "One field frame shared by an input and its units, icons or buttons, for values that need a word or an action beside them.",
  item: "input-group",
  group: "Forms",
}

export default function InputGroupDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Default">
          <div className="flex flex-col gap-hair">
            <Label htmlFor="ig-distance">Distance walked</Label>
            <InputGroup className="w-[9rem]">
              <InputGroupInput
                id="ig-distance"
                inputMode="decimal"
                placeholder="0.0"
              />
              <InputGroupAddon align="inline-end">km</InputGroupAddon>
            </InputGroup>
          </div>
        </StateRow>
        <StateRow label="Filled">
          <InputGroup className="w-[9rem]">
            <InputGroupInput
              aria-label="Water depth"
              inputMode="decimal"
              defaultValue="1.8"
            />
            <InputGroupAddon align="inline-end">m</InputGroupAddon>
          </InputGroup>
          <InputGroup className="w-[17rem]">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search observations"
              defaultValue="Little egret"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Clear search">
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
        <StateRow label="Invalid">
          <div className="flex flex-col gap-hair">
            <Label htmlFor="ig-count">Count</Label>
            <InputGroup className="w-[10rem]">
              <InputGroupInput
                id="ig-count"
                inputMode="numeric"
                defaultValue="-3"
                aria-invalid="true"
              />
              <InputGroupAddon align="inline-end">birds</InputGroupAddon>
            </InputGroup>
          </div>
        </StateRow>
        <StateRow label="Disabled">
          <InputGroup className="w-[13rem]">
            <InputGroupAddon>
              <MapPinIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Place"
              defaultValue="Sluice gate"
              disabled
            />
          </InputGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="Alignments">
        <StateRow label="inline-start">
          <InputGroup className="w-[19rem]">
            <InputGroupAddon>
              <InputGroupText>grid ref</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Grid reference"
              defaultValue="TF 7412 4471"
            />
          </InputGroup>
        </StateRow>
        <StateRow label="inline-end">
          <InputGroup className="w-[19rem]">
            <InputGroupInput
              aria-label="Share link"
              readOnly
              defaultValue="fieldbook.app/o/2026-1114"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Copy link">
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
        <StateRow label="block-start">
          <InputGroup className="w-full max-w-[24rem]">
            <InputGroupAddon align="block-start" className="border-b">
              <InputGroupText>North hide · 07:42</InputGroupText>
            </InputGroupAddon>
            <InputGroupTextarea
              aria-label="Field note"
              defaultValue="Two curlews feeding on the falling tide, flushed by a marsh harrier quartering the reed bed."
            />
          </InputGroup>
        </StateRow>
        <StateRow label="block-end">
          <InputGroup className="w-full max-w-[24rem]">
            <InputGroupTextarea
              aria-label="Field note"
              placeholder="What did you see?"
            />
            <InputGroupAddon align="block-end" className="border-t">
              <InputGroupText>0 / 280</InputGroupText>
              <InputGroupButton size="sm" variant="default" className="ml-auto">
                Save note
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
