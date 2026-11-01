import { Fragment } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/patina/ui/combobox"
import { FieldError } from "@/patina/ui/field"
import { Label } from "@/patina/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Combobox",
  description:
    "A field that filters a list as you type, for picking species from a checklist too long to scroll.",
  item: "combobox",
  group: "Forms",
}

const LATIN: Record<string, string> = {
  "Grey heron": "Ardea cinerea",
  "Little egret": "Egretta garzetta",
  Curlew: "Numenius arquata",
  Redshank: "Tringa totanus",
  Avocet: "Recurvirostra avosetta",
  Dunlin: "Calidris alpina",
  "Brent goose": "Branta bernicla",
  Shelduck: "Tadorna tadorna",
  "Marsh harrier": "Circus aeruginosus",
  Glasswort: "Salicornia europaea",
  "Sea lavender": "Limonium vulgare",
}
const SPECIES = Object.keys(LATIN)
const GROUPS = [
  {
    value: "Waders",
    items: [
      "Curlew",
      "Redshank",
      "Avocet",
      "Dunlin",
      "Grey heron",
      "Little egret",
    ],
  },
  { value: "Wildfowl", items: ["Brent goose", "Shelduck"] },
  { value: "Raptors", items: ["Marsh harrier"] },
  { value: "Plants", items: ["Glasswort", "Sea lavender"] },
]

function SpeciesItem({ name }: { name: string }) {
  return (
    <ComboboxItem value={name}>
      <span className="shrink-0 whitespace-nowrap">{name}</span>
      <span className="min-w-0 truncate text-small text-ink-3 italic">
        {LATIN[name]}
      </span>
    </ComboboxItem>
  )
}

function SpeciesList() {
  return (
    <ComboboxContent>
      <ComboboxEmpty>No species by that name.</ComboboxEmpty>
      <ComboboxList>
        {(name: string) => <SpeciesItem key={name} name={name} />}
      </ComboboxList>
    </ComboboxContent>
  )
}

function Single(
  props: React.ComponentProps<typeof ComboboxInput> & {
    defaultValue?: string
  },
) {
  const { defaultValue, ...input } = props
  return (
    <Combobox items={SPECIES} defaultValue={defaultValue}>
      <ComboboxInput placeholder="Choose a species" {...input} />
      <SpeciesList />
    </Combobox>
  )
}

function Multiple() {
  const anchor = useComboboxAnchor()
  return (
    <Combobox
      multiple
      autoHighlight
      items={SPECIES}
      defaultValue={["Avocet", "Brent goose", "Dunlin"]}
    >
      <ComboboxChips ref={anchor} className="w-full max-w-[26rem]">
        <ComboboxValue>
          {(values: string[]) => (
            <Fragment>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="Species seen"
                placeholder={values.length ? "" : "Add species"}
              />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No species by that name.</ComboboxEmpty>
        <ComboboxList>
          {(name: string) => <SpeciesItem key={name} name={name} />}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function Grouped() {
  return (
    <Combobox items={GROUPS}>
      <ComboboxInput
        aria-label="Species, by group"
        placeholder="Choose a species"
        className="w-[16rem]"
      />
      <ComboboxContent>
        <ComboboxEmpty>No species by that name.</ComboboxEmpty>
        <ComboboxList>
          {(group: (typeof GROUPS)[number], index: number) => (
            <ComboboxGroup key={group.value} items={group.items}>
              {index > 0 && <ComboboxSeparator />}
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(name: string) => <SpeciesItem key={name} name={name} />}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function ComboboxDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Placeholder">
          <div className="flex flex-col gap-hair">
            <Label htmlFor="cb-species">Species</Label>
            <Single id="cb-species" className="w-[16rem]" />
          </div>
        </StateRow>
        <StateRow label="Chosen">
          <Single
            aria-label="Species"
            defaultValue="Little egret"
            className="w-[16rem]"
            showClear
          />
        </StateRow>
        <StateRow label="Invalid">
          <div className="flex flex-col gap-hair">
            <Single
              aria-label="Species"
              aria-invalid="true"
              aria-describedby="cb-error"
              className="w-[16rem]"
            />
            <FieldError id="cb-error">Choose the species you saw.</FieldError>
          </div>
        </StateRow>
        <StateRow label="Disabled">
          <Single
            aria-label="Species"
            defaultValue="Curlew"
            disabled
            className="w-[16rem]"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Multiple">
          <Multiple />
        </StateRow>
        <StateRow label="Groups">
          <Grouped />
        </StateRow>
      </DemoSection>
    </>
  )
}
