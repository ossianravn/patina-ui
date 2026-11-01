import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/patina/ui/navigation-menu"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Navigation menu",
  description:
    "A product's main links, with panels that open to show the pages in each section.",
  item: "navigation-menu",
  group: "Navigation",
}

type Page = { title: string; href: string; about: string; current?: boolean }

const OBSERVATIONS: Page[] = [
  { title: "Today", href: "#today", about: "Sightings logged since dawn" },
  {
    title: "All entries",
    href: "#entries",
    about: "Every observation, newest first",
    current: true,
  },
  {
    title: "Species",
    href: "#species",
    about: "The reserve list, first to last",
  },
  { title: "Map", href: "#map", about: "Sightings plotted by place" },
]

const EXPEDITIONS: Page[] = [
  { title: "Saltmarsh walk", href: "#walk", about: "Sat 14 Nov · six members" },
  {
    title: "Autumn wader count",
    href: "#count",
    about: "Sun 15 Nov · from the Sluice gate",
  },
  {
    title: "Night moths",
    href: "#moths",
    about: "Fri 20 Nov · Reed bed traps",
  },
]

/** A panel's short list of pages, each with a one-line description. */
function Pages({ pages }: { pages: Page[] }) {
  return (
    <ul className="m-0 grid w-[19rem] list-none gap-0.5 p-0">
      {pages.map((page) => (
        <li key={page.href}>
          <NavigationMenuLink
            href={page.href}
            active={page.current}
            className="flex-col items-start gap-0"
          >
            <span className="font-semibold">{page.title}</span>
            <span className="text-ink-2">{page.about}</span>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  )
}

/** Fieldbook's main navigation, on the Overview page; Reports is not open yet. */
function FieldbookNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap justify-start">
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#overview"
            active
            className={navigationMenuTriggerStyle()}
          >
            Overview
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Observations</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Pages pages={OBSERVATIONS} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Expeditions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Pages pages={EXPEDITIONS} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#tides"
            className={navigationMenuTriggerStyle()}
          >
            Tides
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#reports"
            className={navigationMenuTriggerStyle()}
            aria-disabled="true"
            tabIndex={-1}
          >
            Reports
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default function NavigationMenuDemo() {
  return (
    <DemoSection title="Fieldbook">
      <StateRow label="On Overview">
        <FieldbookNav />
      </StateRow>
    </DemoSection>
  )
}
