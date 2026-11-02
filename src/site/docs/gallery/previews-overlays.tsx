import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Glyph } from "@/patina/marks/glyph"
import { Print } from "@/patina/print/print"
import { Button } from "@/patina/ui/button"
import { MenuRow, MenuRule, PageLines, Popup, Strip } from "./parts"

// Overlays as they look open, for the Components index; each mirrors its demo's first example.

function DropdownMenuPreview() {
  return (
    <div className="flex flex-col items-center gap-hair">
      <Button variant="outline" size="sm">
        Observation <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Popup className="w-44">
        <MenuRow shortcut="E">Edit</MenuRow>
        <MenuRow active shortcut="D">
          Duplicate
        </MenuRow>
        <MenuRule />
        <MenuRow danger>Delete</MenuRow>
      </Popup>
    </div>
  )
}

function ContextMenuPreview() {
  return (
    <div className="mx-auto flex w-60 flex-col">
      <div className="rounded-sheet border border-dashed border-line/50 px-tight py-1.5 text-small leading-small">
        <span className="font-semibold">Grey heron</span>{" "}
        <span className="text-ink-2">· Tidal flats</span>
      </div>
      <Popup className="-mt-1 ms-[35%] w-40">
        <MenuRow>Open</MenuRow>
        <MenuRow active>Copy link</MenuRow>
        <MenuRow>Mark as rare</MenuRow>
        <MenuRule />
        <MenuRow danger>Delete</MenuRow>
      </Popup>
    </div>
  )
}

function DialogSheet({
  title,
  body,
  action,
  destructive,
}: {
  title: string
  body: string
  action: string
  destructive?: boolean
}) {
  return (
    <div className="sheet mx-auto grid w-64 gap-tight p-snug text-small leading-small shadow-lift">
      <p className="m-0 font-read text-lead leading-subhead font-semibold">
        {title}
      </p>
      <p className="m-0 text-ink-2">{body}</p>
      <div className="flex justify-end gap-hair">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant={destructive ? "destructive" : "default"} size="sm">
          {action}
        </Button>
      </div>
    </div>
  )
}

function SheetPreview() {
  return (
    <div className="flex h-36 w-full overflow-hidden rounded-sheet border border-rule">
      <div className="flex-1 p-tight">
        <PageLines widths={[80, 95, 60, 90, 70]} />
      </div>
      <div className="sheet w-[58%] rounded-none p-tight text-small leading-small">
        <p className="label-mono m-0 text-ink-3">Observation</p>
        <p className="m-0 font-read text-lead leading-subhead font-semibold">
          Grey heron
        </p>
        <p className="m-0 mt-hair text-ink-2">Tidal flats · 05:42</p>
        <p className="m-0 text-ink-2">Count 1 · Confirmed</p>
      </div>
    </div>
  )
}

function DrawerPreview() {
  return (
    <div className="flex h-36 w-full flex-col justify-between overflow-hidden rounded-sheet border border-rule">
      <div className="p-tight">
        <PageLines widths={[70, 90, 55]} />
      </div>
      <div className="sheet rounded-b-none px-snug pt-1.5 pb-tight text-center text-small leading-small">
        <span className="mx-auto mb-1.5 block h-1 w-10 rounded-full bg-rule" />
        <p className="m-0 font-semibold">Count Brent geese</p>
        <div className="mt-hair flex items-center justify-center gap-tight">
          <Button variant="outline" size="xs">
            −
          </Button>
          <span className="font-label text-lead tabular-nums">230</span>
          <Button variant="outline" size="xs">
            +
          </Button>
        </div>
      </div>
    </div>
  )
}

function PopoverPreview() {
  return (
    <div className="flex flex-col items-center gap-hair">
      <Button variant="outline" size="sm">
        Low tide <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Popup className="w-56 p-tight text-small leading-small">
        <p className="m-0 font-semibold">Low water 13:50</p>
        <p className="m-0 text-ink-2">
          The path past the second hide floods first; leave by 13:20.
        </p>
      </Popup>
    </div>
  )
}

function TooltipPreview() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Strip>Log sighting</Strip>
      <Button variant="outline" size="icon">
        <PlusIcon />
      </Button>
    </div>
  )
}

function SonnerPreview() {
  return (
    <div className="sheet mx-auto flex w-72 items-start gap-tight py-tight ps-snug pe-tight text-small leading-small">
      <Glyph name="check" seed="toast-success" size={20} />
      <div className="min-w-0 flex-1">
        <p className="m-0 font-semibold">Sighting saved</p>
        <p className="m-0 text-ink-2">Grey heron, Tidal flats</p>
      </div>
      <Button variant="outline" size="xs">
        Undo
      </Button>
    </div>
  )
}

function HoverCardPreview() {
  return (
    <div className="mx-auto flex w-64 flex-col text-small leading-small">
      <p className="m-0">
        Dawn from the North hide: a{" "}
        <span className="underline decoration-k-ink decoration-[1.5px] underline-offset-[0.2em]">
          Grey heron
        </span>{" "}
        on the flats.
      </p>
      <Popup className="mt-hair ms-[22%] w-48 p-tight">
        <div className="flex items-center gap-tight">
          <Print motif="horizon" seed="obs-0412" className="w-10 shrink-0" />
          <div className="min-w-0">
            <p className="m-0 font-semibold">Grey heron</p>
            <p className="m-0 text-ink-2 italic">Ardea cinerea</p>
          </div>
        </div>
        <p className="m-0 mt-1 text-ink-2">12 sightings this winter</p>
      </Popup>
    </div>
  )
}

function CommandPreview() {
  return (
    <Popup className="mx-auto w-64 overflow-hidden p-0">
      <div className="flex items-center gap-tight border-b border-rule px-tight py-1.5 text-small">
        <SearchIcon className="size-4 text-ink-3" />
        heron
      </div>
      <div className="p-1">
        <p className="label-mono m-0 px-tight py-1 text-ink-3">Species</p>
        <MenuRow active>Grey heron</MenuRow>
        <MenuRow>Night heron</MenuRow>
        <MenuRow shortcut="⌘ N">New observation</MenuRow>
      </div>
    </Popup>
  )
}

export const OVERLAY_PREVIEWS = {
  "dropdown-menu": DropdownMenuPreview,
  "context-menu": ContextMenuPreview,
  dialog: () => (
    <DialogSheet
      title="Log a sighting"
      body="Grey heron on the Tidal flats at 05:42, one bird."
      action="Save"
    />
  ),
  "alert-dialog": () => (
    <DialogSheet
      title="Delete this observation?"
      body="The heron and its two photos go for good."
      action="Delete"
      destructive
    />
  ),
  sheet: SheetPreview,
  drawer: DrawerPreview,
  popover: PopoverPreview,
  tooltip: TooltipPreview,
  sonner: SonnerPreview,
  "hover-card": HoverCardPreview,
  command: CommandPreview,
}
