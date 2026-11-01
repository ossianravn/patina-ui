import { useState } from "react"
import {
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  FolderInputIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import { Button } from "@/patina/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/patina/ui/dropdown-menu"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Dropdown Menu",
  description:
    "A list of actions or view options that opens from a button and closes once one is chosen.",
  item: "dropdown-menu",
}

const EXPEDITIONS = ["Saltmarsh walk", "Lichen survey", "Night moths"]

/** The actions on one observation: items with icons and shortcuts, a submenu, a toggle, disabled and destructive. */
function ObservationItems() {
  const [onMap, setOnMap] = useState(true)
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel>Grey heron · 07:42</DropdownMenuLabel>
        <DropdownMenuItem>
          <PencilIcon /> Edit
          <DropdownMenuShortcut>E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon /> Duplicate
          <DropdownMenuShortcut>Ctrl D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FolderInputIcon /> Move to
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {EXPEDITIONS.map((name) => (
              <DropdownMenuItem key={name}>{name}</DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        inset
        checked={onMap}
        onCheckedChange={setOnMap}
      >
        Show on map
      </DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>
        <DownloadIcon /> Export (syncing)
      </DropdownMenuItem>
      <DropdownMenuItem variant="destructive">
        <Trash2Icon /> Delete
        <DropdownMenuShortcut>Del</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  )
}

export default function DropdownMenuDemo() {
  const [sort, setSort] = useState("date")
  const [photos, setPhotos] = useState(true)
  const [weather, setWeather] = useState(false)
  return (
    <>
      <DemoSection title="Menu">
        <StateRow label="Trigger">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Observation <ChevronDownIcon data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                <ObservationItems />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Open with the trigger">
        <StateRow label="Actions">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Observation <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              <ObservationItems />
            </DropdownMenuContent>
          </DropdownMenu>
        </StateRow>
        <StateRow label="View options">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" />}>
              View <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Sort entries</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  <DropdownMenuRadioItem value="date">
                    By date
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="species">
                    By species
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="count">
                    By count
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Show</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={photos}
                  onCheckedChange={setPhotos}
                >
                  Photos
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={weather}
                  onCheckedChange={setWeather}
                >
                  Weather
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem disabled>
                  Tide height
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </StateRow>
      </DemoSection>
    </>
  )
}
