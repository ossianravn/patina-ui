import type { ComponentType } from "react"
import { IndexCard } from "@/patina/extras/index-card"
import { TooltipProvider } from "@/patina/ui/tooltip"
import { DemoPreview, previewClaim, type DemoMeta } from "../demo-kit"
import { PREVIEWS } from "./previews"

// One component on the Components index: an index card whose cover is a live preview, rendered on the server from
// the component's own demo (its first example row) or from a preview made for the index where that row would not
// show the part well (overlays, which open in a portal). The preview is a picture: hidden from assistive technology
// and inert, so the card's title link is its one target. The index's script scales each preview to fit its plate,
// down to half size, and marks the plate data-cropped when even that is too tall.

type DemoModule = { default: ComponentType; meta: DemoMeta }
const modules = import.meta.glob<DemoModule>("../demos/*.tsx", { eager: true })
const demos = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.replace(/^.*\/(.+)\.tsx$/, "$1"),
    mod,
  ]),
)

export function GalleryCard({ name }: { name: string }) {
  const demo = demos[name]
  if (!demo) return null
  const Preview = PREVIEWS[name] ?? demo.default
  return (
    <IndexCard
      title={demo.meta.title}
      hook={demo.meta.description}
      href={`/docs/components/${name}`}
      seed={name}
      className="h-full"
      cover={
        <div
          aria-hidden="true"
          inert
          data-preview-plate
          className="pointer-events-none relative mb-snug grid h-44 place-items-center overflow-hidden rounded-sheet bg-paper-2 bg-[radial-gradient(var(--rule)_1px,transparent_1.5px)] bg-size-[14px_14px] p-snug select-none data-cropped:items-start data-cropped:after:absolute data-cropped:after:inset-x-0 data-cropped:after:bottom-0 data-cropped:after:h-10 data-cropped:after:bg-linear-to-t data-cropped:after:from-paper-2 data-cropped:after:content-['']"
        >
          <div className="w-full min-w-0">
            <TooltipProvider>
              <DemoPreview.Provider value={previewClaim()}>
                <Preview />
              </DemoPreview.Provider>
            </TooltipProvider>
          </div>
        </div>
      }
    />
  )
}
