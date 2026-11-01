import { Postmark } from "@/patina/extras/postmark"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/patina/ui/card"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Postmark",
  description:
    "Dates and places a record the way a post office cancels a stamp: a circular mark with wavy lines, struck in ink.",
  item: "postmark",
  group: "Patina extras",
}

export default function PostmarkDemo() {
  return (
    <>
      <DemoSection title="On a card">
        <Card className="relative mt-snug w-full max-w-[26rem]">
          <Postmark
            place="Sluice gate"
            date="14 Nov 2026"
            size={88}
            lines={false}
            className="absolute -top-line -right-3"
          />
          <CardHeader className="pe-[5.5rem]">
            <CardTitle>Winter wader count</CardTitle>
            <CardDescription>Sat 14 Nov · 05:30 to 08:40</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="m-0 text-small leading-small">
              Fourteen curlew along the creek edge and a heron on the flats.
              Count closed as the tide turned at the sluice.
            </p>
          </CardContent>
        </Card>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="112 px">
          <Postmark place="North hide" date="20 Nov 2026" />
        </StateRow>
        <StateRow label="72 px">
          <Postmark place="North hide" date="20 Nov 2026" size={72} />
        </StateRow>
        <StateRow label="ring only">
          <Postmark place="Reed bed" date="13 Nov 2026" lines={false} />
        </StateRow>
      </DemoSection>
      <DemoSection title="Inks and variation">
        <StateRow label="blue">
          <Postmark place="Saltings" date="11 Nov 2026" ink="blue" />
        </StateRow>
        <StateRow label="orange">
          <Postmark place="Sea wall" date="12 Nov 2026" ink="orange" />
        </StateRow>
        <StateRow label="calm">
          <div data-variation="calm">
            <Postmark place="Tidal flats" date="14 Nov 2026" />
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
