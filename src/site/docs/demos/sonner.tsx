import { toast } from "sonner"
import { Button } from "@/patina/ui/button"
import { Toaster } from "@/patina/ui/sonner"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Sonner",
  description:
    "Brief slips that confirm what just happened, or offer to undo it, without taking the person away from their work.",
  item: "sonner",
  group: "Overlays",
}

const sync = () =>
  new Promise<{ count: number }>((resolve) =>
    setTimeout(() => resolve({ count: 12 }), 1800),
  )

export default function SonnerDemo() {
  return (
    <>
      <DemoSection title="By kind">
        <StateRow label="Success">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Sighting saved", {
                description: "Curlew · Tidal flats · 07:42",
              })
            }
          >
            Save sighting
          </Button>
        </StateRow>
        <StateRow label="Error">
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Photo not attached", {
                description: "The file is over 20 MB. Choose a smaller one.",
              })
            }
          >
            Attach photo
          </Button>
        </StateRow>
        <StateRow label="Warning">
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Tide turns in 40 minutes", {
                description: "High water at the sluice gate is 11:52.",
              })
            }
          >
            Check tide
          </Button>
        </StateRow>
        <StateRow label="Info">
          <Button
            variant="outline"
            onClick={() =>
              toast.info("North hide is closed on Mondays", {
                description: "Reed bed and sea wall paths stay open.",
              })
            }
          >
            Hide opening times
          </Button>
        </StateRow>
      </DemoSection>
      <DemoSection title="Flows">
        <StateRow label="Loading, then done">
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(sync(), {
                loading: "Syncing observations…",
                success: (data) => `${data.count} observations synced`,
                error: "Sync failed. Try again on a stronger signal.",
              })
            }
          >
            Sync notebook
          </Button>
        </StateRow>
        <StateRow label="With an action">
          <Button
            variant="outline"
            onClick={() =>
              toast("Observation deleted", {
                description: "Redshank · North hide · 10:40",
                action: {
                  label: "Undo",
                  onClick: () => toast.success("Observation restored"),
                },
              })
            }
          >
            Delete observation
          </Button>
        </StateRow>
      </DemoSection>
      <Toaster />
    </>
  )
}
