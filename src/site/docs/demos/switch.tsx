import { Label } from "@/patina/ui/label"
import { Switch } from "@/patina/ui/switch"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Switch",
  description:
    "A pill track for a setting that is on or off and takes effect at once.",
  item: "switch",
}

const SETTINGS = [
  {
    id: "offline-maps",
    label: "Offline maps",
    hint: "Keep the survey area's tiles on this device.",
    on: true,
  },
  {
    id: "gps-track",
    label: "Record GPS track",
    hint: "Draw your route between observations.",
    on: false,
  },
  {
    id: "share-location",
    label: "Share location",
    hint: "Let the expedition lead see where you are.",
    on: false,
  },
]

export default function SwitchDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Off">
          <Label>
            <Switch /> Record GPS track
          </Label>
        </StateRow>
        <StateRow label="On">
          <Label>
            <Switch defaultChecked /> Offline maps
          </Label>
        </StateRow>
        <StateRow label="Invalid">
          <Label>
            <Switch aria-invalid="true" /> Accept the reserve's access rules
          </Label>
        </StateRow>
        <StateRow label="Disabled">
          <Label>
            <Switch disabled /> Satellite sync
          </Label>
          <Label>
            <Switch disabled defaultChecked /> Tide alerts
          </Label>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm · default">
          <Label>
            <Switch size="sm" defaultChecked /> Compact
          </Label>
          <Label>
            <Switch defaultChecked /> Default
          </Label>
        </StateRow>
      </DemoSection>
      <DemoSection title="Settings rows">
        <div className="max-w-[42rem]">
          {SETTINGS.map(({ id, label, hint, on }) => (
            <div
              key={id}
              className="flex items-center justify-between gap-snug border-b border-dashed border-rule py-tight last:border-b-0"
            >
              <div className="flex flex-col">
                <Label htmlFor={id}>{label}</Label>
                <span
                  id={`${id}-hint`}
                  className="text-small leading-small text-ink-2"
                >
                  {hint}
                </span>
              </div>
              <Switch
                id={id}
                aria-describedby={`${id}-hint`}
                defaultChecked={on}
              />
            </div>
          ))}
        </div>
      </DemoSection>
    </>
  )
}
