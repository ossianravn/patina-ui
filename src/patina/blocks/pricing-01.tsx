"use client"

import { useState } from "react"
import { cn } from "@/patina/lib/utils"
import { MarginNote } from "@/patina/marks/notes"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/patina/ui/accordion"
import { ToggleGroup, ToggleGroupItem } from "@/patina/ui/toggle-group"
import {
  PLAN_ROWS,
  PlanCard,
  type Billing,
  type Plan,
} from "@/patina/blocks/pricing-01-plan"

// Plans for a field notebook: a Monthly/Yearly segmented control above three cards whose prices follow it, the
// recommended plan taped and stamped, and a short FAQ in an accordion. The cards sit side by side when their
// container is wide enough and stack in one readable column when it is not.

export const meta = {
  title: "Pricing",
  description:
    "Three plans with a monthly or yearly price, the recommended one stamped, drawn ticks for what each includes and a short FAQ.",
}

const PLANS: Plan[] = [
  {
    name: "Volunteer",
    audience: "For one person logging their own patch.",
    monthly: 0,
    yearly: 0,
    action: "Start free",
    features: [
      "Unlimited observations",
      "A print for every record",
      "Works offline in the field",
      "Export to CSV whenever you like",
    ],
  },
  {
    name: "Reserve",
    audience: "For a reserve team that counts together.",
    monthly: 900,
    yearly: 9000,
    action: "Try it for 30 days",
    recommended: true,
    features: [
      "Everything in Volunteer",
      "Up to 25 volunteers",
      "Shared expeditions and surveys",
      "Tide alerts for your sites",
      "A weekly digest every Monday",
    ],
  },
  {
    name: "County",
    audience: "For recorders who gather many reserves.",
    monthly: 3000,
    yearly: 30000,
    action: "Talk to us",
    features: [
      "Everything in Reserve",
      "Unlimited reserves and volunteers",
      "The county report in one export",
      "A review queue for rarities",
      "Help from a person within a day",
    ],
  },
]

const FAQ = [
  {
    q: "Can I change plans later?",
    a: "Yes. Moving up starts straight away; moving down takes effect at the end of the period you have paid for.",
  },
  {
    q: "What happens to my records if I stop paying?",
    a: "Nothing is deleted. The notebook drops to Volunteer, and every record stays yours to read and export.",
  },
  {
    q: "Does every volunteer need an account?",
    a: "Each volunteer signs in with their own email, so every record carries the name of whoever made it.",
  },
  {
    q: "Is there a price for charities and schools?",
    a: "Registered charities and schools pay half for Reserve. Write to us with your number and we will switch it over.",
  },
]

export interface Pricing01Props {
  plans?: Plan[]
  defaultBilling?: Billing
  onChoose?: (plan: Plan, billing: Billing) => void
  className?: string
}

export function Pricing01({
  plans = PLANS,
  defaultBilling = "monthly",
  onChoose,
  className,
}: Pricing01Props) {
  const [billing, setBilling] = useState<Billing>(defaultBilling)
  return (
    <div className={cn("@container", className)}>
      <div className="mx-auto max-w-[68rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <p className="label-mono m-0 text-ink-2">Fieldbook · Plans</p>
        <h1 className="m-0 mt-hair max-w-[20em] text-h1 text-balance">
          A notebook for every size of patch
        </h1>
        <p className="m-0 mt-tight max-w-measure text-body leading-body text-ink-2">
          Every plan keeps your records yours. Pay by the month, or by the year
          and get two months free.
        </p>

        <div className="mt-line flex flex-wrap items-center gap-x-snug gap-y-hair">
          <ToggleGroup
            aria-label="Billing period"
            variant="outline"
            spacing={0}
            value={[billing]}
            onValueChange={(next: unknown[]) =>
              next[0] && setBilling(next[0] as Billing)
            }
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
          </ToggleGroup>
          <MarginNote seed="two-months">two months free</MarginNote>
        </div>

        <div
          className={cn(
            "mt-line grid max-w-[28rem] gap-snug @min-[54rem]:max-w-none @min-[54rem]:grid-cols-3 @min-[54rem]:gap-y-0",
            PLAN_ROWS,
          )}
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              billing={billing}
              onChoose={onChoose}
            />
          ))}
        </div>

        <section
          aria-labelledby="pricing-faq"
          className="mt-page max-w-measure"
        >
          <h2 id="pricing-faq" className="m-0 text-h2">
            Questions
          </h2>
          <Accordion className="mt-snug">
            {FAQ.map(({ q, a }) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>
                  <p className="m-0">{a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  )
}

export default Pricing01
