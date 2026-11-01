"use client"

import { Glyph } from "@/patina/marks/glyph"
import { Tape } from "@/patina/marks/paper-marks"
import { Stamp } from "@/patina/marks/stamp"
import { Button } from "@/patina/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/patina/ui/card"

// One plan as a card: name and who it is for, the price for the chosen period, the action, and what it includes
// with a drawn tick per line. The recommended plan is taped down and stamped. Inside a grid with subgrid rows
// (PLAN_ROWS on the cards' parent), the three parts line up across neighbouring cards.

export type Billing = "monthly" | "yearly"

export interface Plan {
  name: string
  audience: string
  /** Pence a month when paid monthly; 0 for a free plan. */
  monthly: number
  /** Pence for a year paid at once. */
  yearly: number
  action: string
  features: string[]
  recommended?: boolean
}

const money = (pence: number) =>
  `£${pence % 100 ? (pence / 100).toFixed(2) : pence / 100}`

/** The price line for a plan and period: the amount a month, and how it is billed. */
function price(plan: Plan, billing: Billing) {
  if (!plan.monthly) return { amount: "£0", basis: "Free for good" }
  return billing === "monthly"
    ? { amount: money(plan.monthly), basis: "Billed monthly" }
    : {
        amount: money(Math.round(plan.yearly / 12)),
        basis: `${money(plan.yearly)} billed yearly`,
      }
}

/** Classes for the cards' parent at the width where they sit side by side. */
export const PLAN_ROWS = "@min-[54rem]:grid-rows-[auto_auto_1fr]"

export function PlanCard({
  plan,
  billing,
  onChoose,
}: {
  plan: Plan
  billing: Billing
  onChoose?: (plan: Plan, billing: Billing) => void
}) {
  const { amount, basis } = price(plan, billing)
  return (
    <Card className="@min-[54rem]:row-span-3 @min-[54rem]:grid @min-[54rem]:grid-rows-subgrid">
      {plan.recommended && <Tape seed={`plan-${plan.name}`} />}
      {/* content-start: a header in a taller row keeps its lines together at the top. */}
      <CardHeader className="content-start">
        <CardTitle className="text-h2 leading-heading">{plan.name}</CardTitle>
        <CardDescription
          className={plan.recommended ? "col-span-2" : undefined}
        >
          {plan.audience}
        </CardDescription>
        {plan.recommended && (
          <CardAction className="row-span-1 self-center">
            <Stamp seed={`stamp-${plan.name}`}>Recommended</Stamp>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <p className="m-0 flex items-baseline gap-hair">
          <span className="font-read text-title leading-heading font-semibold tabular-nums">
            {amount}
          </span>
          <span className="text-small text-ink-2">a month</span>
        </p>
        <p className="m-0 text-small leading-small text-ink-2">{basis}</p>
        <Button
          variant={plan.recommended ? "default" : "outline"}
          className="mt-snug"
          onClick={() => onChoose?.(plan, billing)}
        >
          {plan.action}
        </Button>
      </CardContent>
      <CardContent className="border-t border-dashed border-rule pt-snug">
        <ul
          aria-label={`${plan.name} includes`}
          className="m-0 flex list-none flex-col gap-hair p-0"
        >
          {plan.features.map((feature, i) => (
            <li
              key={feature}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-tight text-small leading-small"
            >
              <Glyph
                name="check"
                seed={`${plan.name}-${i}`}
                size={18}
                className="text-k"
              />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
