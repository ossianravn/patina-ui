import { Button } from "@/patina/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/patina/ui/dialog"
import { Input } from "@/patina/ui/input"
import { Label } from "@/patina/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Dialog",
  description:
    "A sheet pinned over the dimmed page for a task that needs full attention before returning to it.",
  item: "dialog",
  group: "Overlays",
}

export default function DialogDemo() {
  return (
    <DemoSection title="Open with the trigger">
      <StateRow label="Form">
        <Dialog>
          <DialogTrigger render={<Button />}>Log sighting</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a sighting</DialogTitle>
              <DialogDescription>
                Saltmarsh walk · Sat 14 Nov · first hide
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-tight">
              <div className="flex flex-col gap-hair">
                <Label htmlFor="sighting-species">Species</Label>
                <Input
                  id="sighting-species"
                  placeholder="Grey heron"
                  className="w-[16rem] max-w-full"
                />
              </div>
              <div className="flex flex-wrap gap-tight">
                <div className="flex flex-col gap-hair">
                  <Label htmlFor="sighting-count">Count</Label>
                  <Input
                    id="sighting-count"
                    defaultValue="1"
                    inputMode="numeric"
                    className="w-[5rem]"
                  />
                </div>
                <div className="flex flex-col gap-hair">
                  <Label htmlFor="sighting-time">Time</Label>
                  <Input
                    id="sighting-time"
                    type="time"
                    defaultValue="07:42"
                    className="w-[8rem]"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <DialogClose render={<Button />}>Save sighting</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </StateRow>
      <StateRow label="Footer close only">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Expedition notes
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Lichen survey, north face</DialogTitle>
              <DialogDescription>
                23 specimens · led by Tomas Lund
              </DialogDescription>
            </DialogHeader>
            <p className="m-0 max-w-measure text-body leading-body">
              Crustose and foliose only. Photograph each specimen with the scale
              card before sampling, and leave anything growing on the waymarked
              stones.
            </p>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      </StateRow>
      <StateRow label="Long title">
        <Dialog>
          <DialogTrigger render={<Button variant="ghost" />}>
            Rename expedition
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Rename “Autumn wader count at the Saltmarsh sluice”
              </DialogTitle>
              <DialogDescription>
                Members see the new name on their next sync.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-hair">
              <Label htmlFor="expedition-name">Name</Label>
              <Input
                id="expedition-name"
                defaultValue="Autumn wader count"
                className="w-[18rem] max-w-full"
              />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <DialogClose render={<Button />}>Rename</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </StateRow>
    </DemoSection>
  )
}
