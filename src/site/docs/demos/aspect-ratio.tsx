import { Print } from "@/patina/print/print"
import { AspectRatio } from "@/patina/ui/aspect-ratio"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Aspect ratio",
  description:
    "A frame that keeps its proportions as it resizes, holding a print in place until the photo it frames has loaded.",
  item: "aspect-ratio",
  group: "Data display",
}

function Plate({
  ratio,
  caption,
  motif,
  seed,
  width,
}: {
  ratio: number
  caption: string
  motif: "horizon" | "flow" | "lino"
  seed: string
  width: string
}) {
  return (
    <figure className={`m-0 flex flex-col gap-hair ${width}`}>
      <AspectRatio ratio={ratio}>
        <Print motif={motif} seed={seed} />
      </AspectRatio>
      <figcaption className="text-small leading-small text-ink-2">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function AspectRatioDemo() {
  return (
    <>
      <DemoSection title="Ratios">
        <StateRow label="3 : 2">
          <Plate
            ratio={3 / 2}
            caption="Tidal flats at first light"
            motif="horizon"
            seed="photo:tidal-flats"
            width="w-full max-w-[26rem]"
          />
        </StateRow>
        <StateRow label="1 : 1">
          <Plate
            ratio={1}
            caption="Curlew on the creek edge"
            motif="flow"
            seed="photo:curlew"
            width="w-full max-w-[16rem]"
          />
        </StateRow>
        <StateRow label="16 : 9">
          <Plate
            ratio={16 / 9}
            caption="The sea wall at high water"
            motif="lino"
            seed="photo:sea-wall"
            width="w-full max-w-[26rem]"
          />
        </StateRow>
      </DemoSection>
    </>
  )
}
