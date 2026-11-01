import { PullQuote } from "@/patina/extras/pull-quote"
import { Typography, TypographyKicker } from "@/patina/ui/typography"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Pull quote",
  description:
    "Lifts one line out of an article and sets it large, with a hand-drawn mark and who said it.",
  item: "pull-quote",
  group: "Patina extras",
}

export default function PullQuoteDemo() {
  return (
    <>
      <DemoSection title="In a field note">
        <Typography>
          <TypographyKicker>Field note · Sat 14 Nov 2026</TypographyKicker>
          <h2>The heron at the sluice</h2>
          <p>
            The wader count started at half past five with the tide already
            falling. By six the flats below the sluice gate were open mud, and a
            single grey heron had taken the channel edge, where the outflow
            keeps a strip of water moving even at low tide.
          </p>
          <PullQuote cite="Mira Okafor, wader count">
            It stood so still for so long that the tide came back to meet it.
          </PullQuote>
          <p>
            Eleven minutes by the watch, then one strike and a flounder. The
            curlew along the creek edge never lifted, which says more about the
            heron&rsquo;s patience than any count will.
          </p>
        </Typography>
      </DemoSection>
      <DemoSection title="Marks and variation">
        <StateRow label="bracket">
          <PullQuote
            mark="bracket"
            cite="Jo Lindqvist, reed bed log"
            className="max-w-measure"
          >
            Two booms after dusk, then nothing but the rail.
          </PullQuote>
        </StateRow>
        <StateRow label="calm">
          <div data-variation="calm">
            <PullQuote cite="Tom Achterberg, warden">
              The saltings only look empty from the sea wall.
            </PullQuote>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
