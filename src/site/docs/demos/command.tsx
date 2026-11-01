import { useEffect, useState } from "react"
import {
  BirdIcon,
  CalendarPlusIcon,
  FileDownIcon,
  MapPinIcon,
  NotebookPenIcon,
  WavesIcon,
} from "lucide-react"
import { Button } from "@/patina/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/patina/ui/command"
import { Kbd } from "@/patina/ui/kbd"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Command",
  description:
    "A searchable index of everything in the notebook, for jumping to a species, a place or an action by typing.",
  item: "command",
  group: "Overlays",
}

const SPECIES = [
  ["Grey heron", "Ardea cinerea"],
  ["Little egret", "Egretta garzetta"],
  ["Curlew", "Numenius arquata"],
  ["Redshank", "Tringa totanus"],
]
const PLACES = ["Tidal flats", "Sluice gate", "North hide", "Reed bed"]

function NotebookIndex() {
  return (
    <>
      <CommandEmpty>No entries match. Try the Latin name.</CommandEmpty>
      <CommandGroup heading="Species">
        {SPECIES.map(([name, latin]) => (
          <CommandItem key={name} value={`${name} ${latin}`}>
            <BirdIcon />
            <span>{name}</span>
            <span className="text-small text-ink-3 italic">{latin}</span>
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Places">
        {PLACES.map((place) => (
          <CommandItem
            key={place}
            value={place}
            data-checked={place === "North hide"}
          >
            <MapPinIcon />
            {place}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Actions">
        <CommandItem value="Log sighting">
          <NotebookPenIcon />
          Log sighting
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem value="New expedition">
          <CalendarPlusIcon />
          New expedition
          <CommandShortcut>⌘E</CommandShortcut>
        </CommandItem>
        <CommandItem value="Tide table">
          <WavesIcon />
          Tide table
          <CommandShortcut>⌘T</CommandShortcut>
        </CommandItem>
        <CommandItem value="Export GPX" disabled>
          <FileDownIcon />
          Export GPX
        </CommandItem>
      </CommandGroup>
    </>
  )
}

function PaletteDialog() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Search notebook
        <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search the notebook"
        description="Species, places and actions"
      >
        <Command>
          <CommandInput placeholder="Species, place or action" />
          <CommandList>
            <NotebookIndex />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default function CommandDemo() {
  const [query, setQuery] = useState("spoonbill")
  return (
    <>
      <DemoSection title="Inline">
        <Command className="h-auto max-w-[26rem]" label="Search the notebook">
          <CommandInput placeholder="Species, place or action" />
          <CommandList>
            <NotebookIndex />
          </CommandList>
        </Command>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Dialog">
          <PaletteDialog />
        </StateRow>
        <StateRow label="Empty">
          <Command className="h-auto max-w-[26rem]" label="Search species">
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Species"
            />
            <CommandList>
              <CommandEmpty>No entries match. Try the Latin name.</CommandEmpty>
              <CommandGroup heading="Species">
                {SPECIES.map(([name, latin]) => (
                  <CommandItem key={name} value={`${name} ${latin}`}>
                    {name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </StateRow>
      </DemoSection>
    </>
  )
}
