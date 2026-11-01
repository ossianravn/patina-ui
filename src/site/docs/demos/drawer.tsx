import { cn } from "@/patina/lib/utils"
import { Button } from "@/patina/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/patina/ui/drawer"
import { Input } from "@/patina/ui/input"
import { Label } from "@/patina/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Drawer",
  description:
    "A sheet pulled up from the bottom of the screen for a quick task on a phone, dismissed by swiping it back down.",
  item: "drawer",
  group: "Overlays",
}

const TIDES = [
  ["Low", "05:31", "0.8 m"],
  ["High", "11:48", "6.1 m"],
  ["Low", "17:59", "0.6 m"],
  ["High", "00:14", "5.9 m"],
] as const

/** The quick count form: how many, and a short note. */
function QuickCount() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <DrawerHeader>
        <DrawerTitle>Count Brent geese</DrawerTitle>
        <DrawerDescription>Tidal flats · Sat 14 Nov, 09:12</DrawerDescription>
      </DrawerHeader>
      <div className="flex flex-wrap items-end gap-tight px-snug pt-snug">
        <div className="flex flex-col gap-hair">
          <Label htmlFor="drawer-count">Count</Label>
          <Input
            id="drawer-count"
            inputMode="numeric"
            defaultValue="230"
            className="w-[6rem]"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-hair">
          <Label htmlFor="drawer-note">Note</Label>
          <Input
            id="drawer-note"
            placeholder="Dark-bellied"
            className="w-full min-w-[12rem]"
          />
        </div>
      </div>
      <DrawerFooter>
        <DrawerClose render={<Button />}>Save count</DrawerClose>
        <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
      </DrawerFooter>
    </div>
  )
}

/** Today's tides as a short table; centred under the centred title of a top drawer. */
function TideTable({ centered = false }: { centered?: boolean }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col">
      <DrawerHeader>
        <DrawerTitle>Tides today</DrawerTitle>
        <DrawerDescription>Sat 14 Nov · Sluice gate gauge</DrawerDescription>
      </DrawerHeader>
      <ul
        className={cn(
          "mx-snug mt-tight mb-snug flex w-fit list-none flex-col p-0",
          centered && "self-center",
        )}
      >
        {TIDES.map(([kind, time, height]) => (
          <li
            key={time}
            className="grid grid-cols-[3.5rem_4rem_3.5rem] items-baseline border-b border-dashed border-rule py-hair"
          >
            <span className="label-mono text-ink-3">{kind}</span>
            <span className="font-label text-small tabular-nums">{time}</span>
            <span className="text-right font-label text-small tabular-nums">
              {height}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DrawerDemo() {
  return (
    <>
      <DemoSection title="Open with the trigger">
        <StateRow label="Bottom, with handle">
          <Drawer showSwipeHandle>
            <DrawerTrigger render={<Button />}>Count Brent geese</DrawerTrigger>
            <DrawerContent>
              <QuickCount />
            </DrawerContent>
          </Drawer>
        </StateRow>
        <StateRow label="Without handle">
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>
              Quick count
            </DrawerTrigger>
            <DrawerContent>
              <QuickCount />
            </DrawerContent>
          </Drawer>
        </StateRow>
      </DemoSection>
      <DemoSection title="Directions">
        <StateRow label="Swipe">
          <Drawer showSwipeHandle swipeDirection="right">
            <DrawerTrigger render={<Button variant="outline" />}>
              From the right
            </DrawerTrigger>
            <DrawerContent>
              <TideTable />
            </DrawerContent>
          </Drawer>
          <Drawer showSwipeHandle swipeDirection="left">
            <DrawerTrigger render={<Button variant="outline" />}>
              From the left
            </DrawerTrigger>
            <DrawerContent>
              <TideTable />
            </DrawerContent>
          </Drawer>
          <Drawer showSwipeHandle swipeDirection="up">
            <DrawerTrigger render={<Button variant="outline" />}>
              From the top
            </DrawerTrigger>
            <DrawerContent>
              <TideTable centered />
            </DrawerContent>
          </Drawer>
        </StateRow>
      </DemoSection>
    </>
  )
}
