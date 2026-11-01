import { useState } from "react"
import {
  CopyIcon,
  DownloadIcon,
  FolderInputIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import { Print } from "@/patina/print/print"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/patina/ui/context-menu"
import {
  OBSERVATIONS,
  STATUS_LABEL,
  tally,
  when,
  type Observation,
  type Status,
} from "@/site/fieldbook/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Context Menu",
  description:
    "The actions for one thing, opened where the pointer is with a right-click or a long press.",
  item: "context-menu",
  group: "Overlays",
}

const EXPEDITIONS = ["Saltmarsh walk", "Autumn wader count", "Night moths"]
const ROWS = OBSERVATIONS.slice(0, 4)

/** One observation row; right-click it for its actions. */
function Row({
  item,
  status,
  onStatus,
  onMap,
  onMapChange,
}: {
  item: Observation
  status: Status
  onStatus: (status: Status) => void
  onMap: boolean
  onMapChange: (on: boolean) => void
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-tight border-b border-dashed border-rule px-hair py-tight data-popup-open:bg-paper-2">
        <Print motif={item.motif} seed={item.id} className="w-10" />
        <div className="min-w-0">
          <p className="m-0 truncate font-semibold leading-subhead">
            {item.species}
          </p>
          <p className="label-mono m-0 truncate text-ink-2">
            {item.place} · {when(item.seen)}
          </p>
        </div>
        <span className="font-label text-small tabular-nums">
          {tally(item.count)}
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-60">
        <ContextMenuGroup>
          <ContextMenuLabel>
            {item.species} · {item.seen.slice(11)}
          </ContextMenuLabel>
          <ContextMenuItem>
            <PencilIcon /> Edit
            <ContextMenuShortcut>E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <CopyIcon /> Duplicate
            <ContextMenuShortcut>Ctrl D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <FolderInputIcon /> Move to
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {EXPEDITIONS.map((name) => (
                <ContextMenuItem key={name}>{name}</ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Status</ContextMenuLabel>
          <ContextMenuRadioGroup
            value={status}
            onValueChange={(value) => onStatus(value as Status)}
          >
            {(Object.keys(STATUS_LABEL) as Status[]).map((key) => (
              <ContextMenuRadioItem key={key} value={key}>
                {STATUS_LABEL[key]}
              </ContextMenuRadioItem>
            ))}
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={onMap} onCheckedChange={onMapChange}>
          Show on map
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>
          <DownloadIcon /> Export (syncing)
        </ContextMenuItem>
        <ContextMenuItem variant="destructive">
          <Trash2Icon /> Delete
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default function ContextMenuDemo() {
  const [status, setStatus] = useState<Record<string, Status>>(() =>
    Object.fromEntries(ROWS.map((o) => [o.id, o.status])),
  )
  const [hidden, setHidden] = useState<string[]>([])
  return (
    <DemoSection title="Right-click or long-press a row">
      <StateRow label="Observations">
        <div className="w-full max-w-[34rem] border-t border-dashed border-rule">
          {ROWS.map((item) => (
            <Row
              key={item.id}
              item={item}
              status={status[item.id] ?? item.status}
              onStatus={(next) => setStatus((s) => ({ ...s, [item.id]: next }))}
              onMap={!hidden.includes(item.id)}
              onMapChange={(on) =>
                setHidden((h) =>
                  on ? h.filter((id) => id !== item.id) : [...h, item.id],
                )
              }
            />
          ))}
        </div>
      </StateRow>
    </DemoSection>
  )
}
