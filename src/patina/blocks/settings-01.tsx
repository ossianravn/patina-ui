"use client"

import { useId, useState, type ReactNode } from "react"
import { AppearanceControl } from "@/patina/extras/appearance-control"
import { cn } from "@/patina/lib/utils"
import type { Appearance } from "@/patina/theme"
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
import { Button } from "@/patina/ui/button"
import { FieldError } from "@/patina/ui/field"
import { Input } from "@/patina/ui/input"
import { Switch } from "@/patina/ui/switch"

// A settings page in one narrow column (42rem): profile fields sized to their values, the appearance rows, switches
// for notifications and a danger zone whose delete asks first. Every row puts its name and hint on the left and the
// control beside it, under it when the column is too narrow for both (the same rows as AppearanceControl's).

export const meta = {
  title: "Settings",
  description:
    "A settings page in a narrow column: profile fields, the appearance rows, notifications as switches and a danger zone that asks before deleting.",
}

/** One setting: its name and an optional hint on the left, the control beside it, or under it when there is no room. */
export function SettingsRow({
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
    <div className="flex flex-wrap items-center justify-between gap-x-snug gap-y-hair border-b border-dashed border-rule py-snug">
      <div className="min-w-0 flex-[1_1_6rem]">
        <label htmlFor={htmlFor} className="font-semibold">
          {label}
        </label>
        {hint && (
          <p className="m-0 text-small leading-small text-ink-2">{hint}</p>
        )}
      </div>
      <div className="max-w-full">{children}</div>
    </div>
  )
}

/** A group of rows under a mono heading. */
export function SettingsSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const id = useId()
  return (
    <section className="mt-section" aria-labelledby={id}>
      <h2 id={id} className="label-mono m-0 text-ink-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

const ALERTS = [
  ["tides", "Tide alerts", "An hour before high tide at your saved sites."],
  ["digest", "Weekly digest", "Every Monday: your week's sightings."],
  [
    "rare",
    "Rare sightings nearby",
    "When someone records a rarity within 20 km.",
  ],
] as const

type Alert = (typeof ALERTS)[number][0]

export interface Settings01Props {
  name?: string
  email?: string
  /** What deleting the account means, in the confirmation dialog. */
  deleteNote?: string
  onSaveProfile?: (profile: { name: string; email: string }) => void
  onDeleteAccount?: () => void
  /** The defaults the page's appearanceScript uses, so the appearance rows render the right choices on the server. */
  appearanceDefaults?: Appearance
  className?: string
}

const EMAIL = /^\S+@\S+\.\S+$/

export function Settings01({
  name: initialName = "Mira Okafor",
  email: initialEmail = "mira@example.com",
  deleteNote = "Your notebook and every observation in it will be deleted. This can't be undone.",
  onSaveProfile,
  onDeleteAccount,
  appearanceDefaults,
  className,
}: Settings01Props) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [saved, setSaved] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [alerts, setAlerts] = useState<Record<Alert, boolean>>({
    tides: true,
    digest: false,
    rare: true,
  })

  function save() {
    if (!EMAIL.test(email)) {
      setInvalid(true)
      document.getElementById("settings-email")?.focus()
      return
    }
    onSaveProfile?.({ name, email })
    setSaved(true)
  }

  return (
    <div className={cn("@container", className)}>
      <div className="mx-auto max-w-[42rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <h1 className="m-0 text-h1">Settings</h1>

        <SettingsSection title="Profile">
          <SettingsRow label="Name" htmlFor="settings-name">
            <Input
              id="settings-name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setSaved(false)
              }}
              className="w-[16rem] max-w-full"
            />
          </SettingsRow>
          <SettingsRow
            label="Email"
            hint="Used for sign-in and the weekly digest."
            htmlFor="settings-email"
          >
            <Input
              id="settings-email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setSaved(false)
                if (invalid) setInvalid(!EMAIL.test(e.target.value))
              }}
              aria-invalid={invalid}
              aria-describedby={invalid ? "settings-email-error" : undefined}
              className="w-[18rem] max-w-full"
            />
            {invalid && (
              <FieldError
                id="settings-email-error"
                className="mt-hair w-[18rem] max-w-full"
              >
                Enter an email address, like mira@example.com.
              </FieldError>
            )}
          </SettingsRow>
          <div className="pt-snug">
            {/* Saving turns the button's label to Saved, in the same footprint, instead of adding a message. */}
            <Button onClick={save}>
              <span className="grid *:col-start-1 *:row-start-1">
                <span className={cn(saved && "invisible")}>Save profile</span>
                <span className={cn(!saved && "invisible")}>Saved</span>
              </span>
            </Button>
            <span aria-live="polite" className="sr-only">
              {saved ? "Profile saved." : ""}
            </span>
          </div>
        </SettingsSection>

        <SettingsSection title="Appearance">
          <AppearanceControl hints defaults={appearanceDefaults} />
        </SettingsSection>

        <SettingsSection title="Notifications">
          {ALERTS.map(([key, label, hint]) => (
            <SettingsRow
              key={key}
              label={label}
              hint={hint}
              htmlFor={`settings-alert-${key}`}
            >
              <Switch
                id={`settings-alert-${key}`}
                checked={alerts[key]}
                onCheckedChange={(on) =>
                  setAlerts((all) => ({ ...all, [key]: on }))
                }
              />
            </SettingsRow>
          ))}
        </SettingsSection>

        <SettingsSection title="Danger zone">
          <SettingsRow
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
                  <AlertDialogDescription>{deleteNote}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my account</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onDeleteAccount?.()}
                  >
                    Delete account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsRow>
        </SettingsSection>
      </div>
    </div>
  )
}

export default Settings01
