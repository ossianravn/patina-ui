import { Button } from "@/patina/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/patina/ui/card"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Card",
  description:
    "A sheet of card stock that groups one subject: a header, its content and its actions.",
  item: "card",
}

export default function CardDemo() {
  return (
    <DemoSection title="Default and small">
      <div className="grid items-start gap-section md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saltmarsh walk</CardTitle>
            <CardDescription>
              Sat 14 Nov · 07:00 at the sluice gate
            </CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="m-0 max-w-measure">
              Low tide at 08:12. Bring boots; the path floods past the second
              hide.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Join walk</Button>
            <Button size="sm" variant="outline">
              Share
            </Button>
          </CardFooter>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Lichen survey</CardTitle>
            <CardDescription>23 specimens · north face</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="m-0 text-small leading-small">
              Crustose and foliose only. Photograph before sampling.
            </p>
          </CardContent>
        </Card>
      </div>
    </DemoSection>
  )
}
