import { useState } from "react"
import {
  BinocularsIcon,
  CompassIcon,
  LayoutGridIcon,
  MapPinIcon,
  NotebookTabsIcon,
  PlusIcon,
  SettingsIcon,
  WavesIcon,
  type LucideIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/patina/ui/avatar"
import { Separator } from "@/patina/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/patina/ui/sidebar"
import { ToggleGroup, ToggleGroupItem } from "@/patina/ui/toggle-group"
import { OBSERVATIONS, PLACES, tally, when } from "@/site/fieldbook/data"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Sidebar",
  description:
    "An app's main navigation in a column beside the page, which folds to icons on a desktop and becomes a sheet on a phone.",
  item: "sidebar",
  group: "Navigation",
}

const NOTEBOOK = [
  { key: "Overview", icon: LayoutGridIcon },
  { key: "Observations", icon: BinocularsIcon, count: OBSERVATIONS.length },
  { key: "Expeditions", icon: CompassIcon, count: 3 },
  { key: "Tides", icon: WavesIcon },
] as const

type Variant = "sidebar" | "floating" | "inset"
type Collapse = "icon" | "offcanvas"

/** A segmented control that always keeps one choice. */
function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: [T, string][]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-tight">
      <span className="label-mono text-ink-3">{label}</span>
      <ToggleGroup
        aria-label={label}
        variant="outline"
        size="sm"
        spacing={0}
        value={[value]}
        onValueChange={(next) => next[0] && onChange(next[0] as T)}
      >
        {options.map(([key, name]) => (
          <ToggleGroupItem key={key} value={key}>
            {name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

/** One page in the sidebar; choosing it on a phone also closes the sheet. */
function NavItem({
  name,
  icon: Icon,
  count,
  open,
  onOpen,
}: {
  name: string
  icon: LucideIcon
  count?: number
  open: string
  onOpen: (name: string) => void
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={open === name}
        aria-current={open === name ? "page" : undefined}
        tooltip={name}
        onClick={() => {
          onOpen(name)
          setOpenMobile(false)
        }}
      >
        <Icon />
        <span>{name}</span>
      </SidebarMenuButton>
      {count !== undefined && <SidebarMenuBadge>{count}</SidebarMenuBadge>}
    </SidebarMenuItem>
  )
}

/** The page beside the sidebar: the open section, or the entries for one place. */
function Page({ open }: { open: string }) {
  const place = (PLACES as readonly string[]).includes(open)
  const rows = place ? OBSERVATIONS.filter((o) => o.place === open) : []
  const list = open === "Observations" ? OBSERVATIONS.slice(0, 5) : rows
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-snug overflow-y-auto p-snug">
      {list.length ? (
        <ul className="m-0 flex max-w-[38rem] list-none flex-col p-0">
          {list.map((o) => (
            <li
              key={o.id}
              className="flex flex-col gap-0.5 border-b border-dashed border-rule py-hair sm:flex-row sm:items-baseline sm:justify-between sm:gap-tight"
            >
              <span className="min-w-0 truncate">
                <span className="font-semibold">{o.species}</span>{" "}
                <span className="text-small text-ink-2 italic">{o.latin}</span>
              </span>
              <span className="label-mono shrink-0 text-ink-2">
                {when(o.seen)} · {tally(o.count)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 max-w-measure text-ink-2">
          Nothing to show in {open} on this demo clock.
        </p>
      )}
    </div>
  )
}

export default function SidebarDemo() {
  const [variant, setVariant] = useState<Variant>("sidebar")
  const [collapse, setCollapse] = useState<Collapse>("icon")
  const [open, setOpen] = useState("Observations")
  return (
    <DemoSection title="Fieldbook shell">
      <div className="mb-snug flex flex-wrap gap-x-line gap-y-tight">
        <Choice
          label="Variant"
          value={variant}
          onChange={setVariant}
          options={[
            ["sidebar", "Sidebar"],
            ["floating", "Floating"],
            ["inset", "Inset"],
          ]}
        />
        <Choice
          label="Collapse"
          value={collapse}
          onChange={setCollapse}
          options={[
            ["icon", "To icons"],
            ["offcanvas", "Off canvas"],
          ]}
        />
      </div>
      <SidebarProvider className="relative isolate h-[39rem] min-h-0 overflow-hidden rounded-sheet border border-rule">
        <Sidebar
          variant={variant}
          collapsible={collapse}
          className="absolute h-full"
        >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Fieldbook">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-sheet bg-ink text-paper">
                    <NotebookTabsIcon />
                  </span>
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="font-semibold">Fieldbook</span>
                    <span className="label-mono text-ink-3">
                      Saltmarsh reserve
                    </span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Notebook</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NOTEBOOK.map((item) => (
                    <NavItem
                      key={item.key}
                      name={item.key}
                      icon={item.icon}
                      count={"count" in item ? item.count : undefined}
                      open={open}
                      onOpen={setOpen}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Places</SidebarGroupLabel>
              <SidebarGroupAction title="Add place">
                <PlusIcon />
                <span className="sr-only">Add place</span>
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PLACES.map((place) => (
                    <NavItem
                      key={place}
                      name={place}
                      icon={MapPinIcon}
                      count={
                        OBSERVATIONS.filter((o) => o.place === place).length
                      }
                      open={open}
                      onOpen={setOpen}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <NavItem
                name="Settings"
                icon={SettingsIcon}
                open={open}
                onOpen={setOpen}
              />
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Mira Okafor">
                  <Avatar size="sm" className="size-8!">
                    <AvatarFallback name="Mira Okafor">MO</AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="font-semibold">Mira Okafor</span>
                    <span className="label-mono text-ink-3">Warden</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-w-0">
          <header className="flex h-12 shrink-0 items-center gap-tight border-b border-dashed border-rule px-tight">
            <SidebarTrigger />
            <Separator orientation="vertical" className="my-3.5" />
            <h3 className="m-0 truncate font-read text-body leading-subhead">
              {open}
            </h3>
            <span className="label-mono ml-auto shrink-0 text-ink-3">
              Sat 14 Nov
            </span>
          </header>
          <Page open={open} />
        </SidebarInset>
      </SidebarProvider>
    </DemoSection>
  )
}
