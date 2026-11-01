import { Label } from "@/patina/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/patina/ui/select"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Select",
  description:
    "A calm field that opens a sheet of options, for choosing one value from a list too long for radios.",
  item: "select",
  group: "Forms",
}

const WADERS = {
  "grey-heron": "Grey heron",
  "little-egret": "Little egret",
  curlew: "Curlew",
  redshank: "Redshank",
}
const GULLS = {
  "herring-gull": "Herring gull",
  "black-headed-gull": "Black-headed gull",
  kittiwake: "Kittiwake",
}
const SPECIES = { ...WADERS, ...GULLS }

const HABITATS = {
  saltmarsh: "Saltmarsh",
  mudflat: "Mudflat",
  shingle: "Shingle",
  dune: "Dune",
}

function SpeciesList() {
  return (
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Waders</SelectLabel>
        {Object.entries(WADERS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Gulls</SelectLabel>
        {Object.entries(GULLS).map(([value, label]) => (
          <SelectItem
            key={value}
            value={value}
            disabled={value === "kittiwake"}
          >
            {label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  )
}

function HabitatList() {
  return (
    <SelectContent>
      <SelectGroup>
        {Object.entries(HABITATS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  )
}

export default function SelectDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Placeholder">
          <div className="flex flex-col gap-hair">
            <Label id="species-label">Species</Label>
            <Select items={SPECIES}>
              <SelectTrigger
                aria-labelledby="species-label"
                className="w-[13.5rem]"
              >
                <SelectValue placeholder="Choose a species" />
              </SelectTrigger>
              <SpeciesList />
            </Select>
          </div>
        </StateRow>
        <StateRow label="Chosen">
          <Select items={SPECIES} defaultValue="little-egret">
            <SelectTrigger aria-label="Species" className="w-[13.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SpeciesList />
          </Select>
        </StateRow>
        <StateRow label="Invalid">
          <Select items={HABITATS}>
            <SelectTrigger
              aria-label="Habitat"
              aria-invalid="true"
              className="w-[10rem]"
            >
              <SelectValue placeholder="Habitat" />
            </SelectTrigger>
            <HabitatList />
          </Select>
        </StateRow>
        <StateRow label="Disabled">
          <Select items={HABITATS} defaultValue="saltmarsh" disabled>
            <SelectTrigger aria-label="Habitat" className="w-[10rem]">
              <SelectValue />
            </SelectTrigger>
            <HabitatList />
          </Select>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm · default">
          <Select items={HABITATS} defaultValue="mudflat">
            <SelectTrigger
              size="sm"
              aria-label="Habitat, compact"
              className="w-[10rem]"
            >
              <SelectValue />
            </SelectTrigger>
            <HabitatList />
          </Select>
          <Select items={HABITATS} defaultValue="mudflat">
            <SelectTrigger aria-label="Habitat" className="w-[10rem]">
              <SelectValue />
            </SelectTrigger>
            <HabitatList />
          </Select>
        </StateRow>
      </DemoSection>
    </>
  )
}
