import { useState } from "react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/patina/ui/menubar"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Menubar",
  description:
    "A desktop app's row of menus, each holding the commands for one area, moved through with the arrow keys.",
  item: "menubar",
  group: "Navigation",
}

const RECENT = ["Saltmarsh walk", "Autumn wader count", "Night moths"]

export default function MenubarDemo() {
  const [prints, setPrints] = useState(true)
  const [weather, setWeather] = useState(false)
  const [sort, setSort] = useState("date")
  return (
    <DemoSection title="Fieldbook">
      <StateRow label="Menus">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New observation <MenubarShortcut>Ctrl N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                New expedition <MenubarShortcut>Shift Ctrl N</MenubarShortcut>
              </MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger>Open recent</MenubarSubTrigger>
                <MenubarSubContent>
                  {RECENT.map((name) => (
                    <MenubarItem key={name}>{name}</MenubarItem>
                  ))}
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>Export as CSV</MenubarItem>
              <MenubarItem>
                Print field sheet <MenubarShortcut>Ctrl P</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">Sign out</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Undo <MenubarShortcut>Ctrl Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>
                Redo <MenubarShortcut>Shift Ctrl Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Copy entry <MenubarShortcut>Ctrl C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Paste entry <MenubarShortcut>Ctrl V</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Find species… <MenubarShortcut>Ctrl F</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarLabel>Show</MenubarLabel>
                <MenubarCheckboxItem
                  checked={prints}
                  onCheckedChange={setPrints}
                >
                  Prints
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={weather}
                  onCheckedChange={setWeather}
                >
                  Weather
                </MenubarCheckboxItem>
                <MenubarCheckboxItem disabled>Tide line</MenubarCheckboxItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarLabel>Sort entries</MenubarLabel>
                <MenubarRadioGroup value={sort} onValueChange={setSort}>
                  <MenubarRadioItem value="date">By date</MenubarRadioItem>
                  <MenubarRadioItem value="species">
                    By species
                  </MenubarRadioItem>
                  <MenubarRadioItem value="place">By place</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Field guide</MenubarItem>
              <MenubarItem>
                Keyboard shortcuts <MenubarShortcut>?</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>About Fieldbook</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </StateRow>
    </DemoSection>
  )
}
