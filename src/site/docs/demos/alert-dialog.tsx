import { useState } from "react"
import { Glyph } from "@/patina/marks/glyph"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/patina/ui/alert-dialog"
import { Button } from "@/patina/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Alert Dialog",
  description:
    "A calm sheet that asks for a decision before something that cannot be undone.",
  item: "alert-dialog",
  group: "Overlays",
}

// The action button does the work and then closes the dialog itself, as a real handler would.
function useConfirm() {
  const [open, setOpen] = useState(false)
  return { root: { open, onOpenChange: setOpen }, done: () => setOpen(false) }
}

export default function AlertDialogDemo() {
  const remove = useConfirm()
  const leave = useConfirm()
  const discard = useConfirm()
  return (
    <DemoSection title="Open with the trigger">
      <StateRow label="Destructive">
        <AlertDialog {...remove.root}>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Delete observation
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="text-ink-red">
                <Glyph name="bang" size={24} />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete this observation?</AlertDialogTitle>
              <AlertDialogDescription>
                The grey heron at 07:42 and its two photos leave the Saltmarsh
                walk. This can’t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={remove.done}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </StateRow>
      <StateRow label="Without media">
        <AlertDialog {...leave.root}>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            Leave expedition
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave the lichen survey?</AlertDialogTitle>
              <AlertDialogDescription>
                Your 14 entries stay with the survey. Tomas can invite you back.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Stay</AlertDialogCancel>
              <AlertDialogAction onClick={leave.done}>Leave</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </StateRow>
      <StateRow label="Small">
        <AlertDialog {...discard.root}>
          <AlertDialogTrigger render={<Button variant="ghost" />}>
            Discard draft
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Discard draft?</AlertDialogTitle>
              <AlertDialogDescription>
                Your notes on the moth trap aren’t saved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={discard.done}>
                Discard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </StateRow>
    </DemoSection>
  )
}
