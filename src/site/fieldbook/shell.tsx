import type { ReactNode } from "react"
import {
  BinocularsIcon,
  CompassIcon,
  LayoutGridIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"
import { Print } from "@/patina/print/print"
import { Avatar, AvatarFallback } from "@/patina/ui/avatar"
import { Separator } from "@/patina/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
} from "@/patina/ui/sidebar"
import { OBSERVATIONS } from "./data"
import { EXPEDITIONS } from "./expeditions"

export type Section = "overview" | "observations" | "expeditions" | "settings"

const NOTEBOOK: {
  key: Section
  label: string
  href: string
  icon: LucideIcon
  count?: number
}[] = [
  {
    key: "overview",
    label: "Overview",
    href: "/fieldbook/overview",
    icon: LayoutGridIcon,
  },
  {
    key: "observations",
    label: "Observations",
    href: "/fieldbook",
    icon: BinocularsIcon,
    count: OBSERVATIONS.length,
  },
  {
    key: "expeditions",
    label: "Expeditions",
    href: "/fieldbook/expeditions",
    icon: CompassIcon,
    count: EXPEDITIONS.filter((e) => e.status !== "done").length,
  },
]

const LABEL: Record<Section, string> = {
  overview: "Overview",
  observations: "Observations",
  expeditions: "Expeditions",
  settings: "Settings",
}

/** Fieldbook's frame: the notebook's sections in a sidebar (a sheet on phones) beside the page. */
export function FieldbookShell({
  current,
  children,
}: {
  current: Section
  children?: ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                tooltip="Fieldbook"
                render={<a href="/fieldbook" />}
              >
                <Print
                  motif="sprig"
                  seed="fieldbook"
                  className="w-8 shrink-0"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="font-hand text-h2 leading-none font-bold">
                    Fieldbook
                  </span>
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
                {NOTEBOOK.map(({ key, label, href, icon: Icon, count }) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      isActive={key === current}
                      tooltip={label}
                      render={
                        <a
                          href={href}
                          aria-current={key === current ? "page" : undefined}
                        />
                      }
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {count !== undefined && (
                      <SidebarMenuBadge>{count}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={current === "settings"}
                tooltip="Settings"
                render={
                  <a
                    href="/fieldbook/settings"
                    aria-current={current === "settings" ? "page" : undefined}
                  />
                }
              >
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Mira Okafor">
                <Avatar size="sm" className="size-8!">
                  <AvatarFallback name="Mira Okafor">MO</AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold">Mira Okafor</span>
                  <span className="label-mono truncate text-ink-3">
                    Volunteer
                  </span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset id="main" className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-tight border-b border-dashed border-rule px-snug sm:px-line">
          <SidebarTrigger className="-ms-2" />
          <Separator orientation="vertical" className="my-4" />
          <span className="label-mono text-ink-2">{LABEL[current]}</span>
          <a href="/" className="label-mono ms-auto text-ink-3 max-sm:hidden">
            Demo · Patina UI
          </a>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
