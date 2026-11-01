import { useState, type ReactNode } from "react"
import { APPEARANCE, useAppearance, type Appearance } from "@/patina/theme"
import { Button } from "@/patina/ui/button"
import { Input } from "@/patina/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/patina/ui/select"
import { Switch } from "@/patina/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/patina/ui/toggle-group"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/patina/ui/alert-dialog"

const LABEL: Record<string, string> = {
  system: "System",
  day: "Day",
  night: "Night",
  archive: "Archive",
  field: "Field",
  newsprint: "Newsprint",
  clean: "Clean",
  handled: "Handled",
  worn: "Worn",
}
const stocks = APPEARANCE.stock.map((s) => ({ value: s, label: LABEL[s] ?? s }))

/** One setting: its name and an optional hint on the left, the control beside it. */
function Row({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="grid items-center gap-x-section gap-y-hair border-b border-dashed border-rule py-snug sm:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        <label htmlFor={htmlFor} className="font-semibold">
          {label}
        </label>
        {hint && (
          <p className="m-0 text-small leading-small text-ink-2">{hint}</p>
        )}
      </div>
      <div className="sm:justify-self-end">{children}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-section" aria-labelledby={`settings-${title}`}>
      <h2 id={`settings-${title}`} className="label-mono m-0 text-ink-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Segmented<K extends keyof Appearance>({
  name,
  value,
  onChange,
}: {
  name: K
  value: Appearance[K]
  onChange: (v: Appearance[K]) => void
}) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(v) => v[0] && onChange(v[0] as Appearance[K])}
      aria-label={name}
    >
      {APPEARANCE[name].map((option) => (
        <ToggleGroupItem key={option} value={option}>
          {LABEL[option] ?? option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

/** Fieldbook's settings, in one narrow column: profile, appearance, notifications and account. */
export function Settings() {
  const [appearance, update] = useAppearance()
  const [name, setName] = useState("Mira Okafor")
  const [saved, setSaved] = useState("")
  const [alerts, setAlerts] = useState({
    tides: true,
    digest: false,
    rare: true,
  })

  return (
    <div className="mx-auto max-w-[42rem] px-snug pb-page pt-section sm:px-line">
      <h1 className="m-0 text-h1">Settings</h1>

      <Section title="Profile">
        <Row label="Name" htmlFor="name">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[16rem]"
          />
        </Row>
        <Row
          label="Email"
          hint="Used for sign-in and the weekly digest."
          htmlFor="email"
        >
          <Input
            id="email"
            type="email"
            defaultValue="mira@example.com"
            className="w-[18rem]"
          />
        </Row>
        <div className="flex items-center gap-snug pt-snug">
          <Button onClick={() => setSaved("Profile saved.")}>
            Save profile
          </Button>
          <p className="m-0 text-small text-ink-2" aria-live="polite">
            {saved}
          </p>
        </div>
      </Section>

      <Section title="Appearance">
        <Row label="Theme">
          <Segmented
            name="theme"
            value={appearance.theme}
            onChange={(theme) => update({ theme })}
          />
        </Row>
        <Row label="Paper" htmlFor="stock">
          <Select
            items={stocks}
            value={appearance.stock}
            onValueChange={(stock) =>
              update({ stock: stock as Appearance["stock"] })
            }
          >
            <SelectTrigger id="stock" className="w-[10rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stocks.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>
        <Row
          label="Lively paper"
          hint="Tilted cards, tape and stronger misregistration."
          htmlFor="lively"
        >
          <Switch
            id="lively"
            checked={appearance.variation === "lively"}
            onCheckedChange={(on) =>
              update({ variation: on ? "lively" : "calm" })
            }
          />
        </Row>
        <Row label="Patina">
          <Segmented
            name="patina"
            value={appearance.patina}
            onChange={(patina) => update({ patina })}
          />
        </Row>
      </Section>

      <Section title="Notifications">
        {(
          [
            [
              "tides",
              "Tide alerts",
              "An hour before high tide at your saved sites.",
            ],
            ["digest", "Weekly digest", "Every Monday: your week's sightings."],
            [
              "rare",
              "Rare sightings nearby",
              "When someone records a rarity within 20 km.",
            ],
          ] as const
        ).map(([key, label, hint]) => (
          <Row key={key} label={label} hint={hint} htmlFor={`alert-${key}`}>
            <Switch
              id={`alert-${key}`}
              checked={alerts[key]}
              onCheckedChange={(on) => setAlerts((a) => ({ ...a, [key]: on }))}
            />
          </Row>
        ))}
      </Section>

      <Section title="Account">
        <Row
          label="Delete account"
          hint="Removes your notebook and every observation in it."
        >
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              Delete account
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This demo keeps nothing, so nothing is deleted; a real account
                  would be gone for good.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my account</AlertDialogCancel>
                <AlertDialogAction variant="destructive">
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Row>
      </Section>
    </div>
  )
}
