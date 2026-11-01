import { useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { FieldError } from "@/patina/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/patina/ui/input-otp"
import { Label } from "@/patina/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Input OTP",
  description:
    "One box per digit for a short one-time code, such as the sign-in code Fieldbook sends by email.",
  item: "input-otp",
  group: "Forms",
}

// Controlled: input-otp forwards defaultValue to its own controlled <input>, which React rejects.
function Code({
  invalid,
  defaultValue = "",
  ...props
}: {
  id?: string
  invalid?: boolean
  defaultValue?: string
  disabled?: boolean
  autoComplete?: string
  "aria-label"?: string
  "aria-describedby"?: string
}) {
  const [value, setValue] = useState(defaultValue)
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      aria-invalid={invalid || undefined}
      value={value}
      onChange={setValue}
      {...props}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

export default function InputOTPDemo() {
  return (
    <>
      <DemoSection title="Sign-in code">
        <div className="flex max-w-[22rem] flex-col gap-hair">
          <Label htmlFor="otp-sign-in">Sign-in code</Label>
          <Code id="otp-sign-in" autoComplete="one-time-code" />
          <p className="m-0 text-small leading-small text-ink-2">
            Sent to mira@fieldbook.app. It works for ten minutes.
          </p>
        </div>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Partly filled">
          <Code aria-label="Sign-in code" defaultValue="418" />
        </StateRow>
        <StateRow label="Filled">
          <Code aria-label="Sign-in code" defaultValue="418205" />
        </StateRow>
        <StateRow label="Invalid">
          <div className="flex flex-col gap-hair">
            <Code
              aria-label="Sign-in code"
              defaultValue="418250"
              invalid
              aria-describedby="otp-error"
            />
            <FieldError id="otp-error">
              That code does not match. Check the latest email.
            </FieldError>
          </div>
        </StateRow>
        <StateRow label="Disabled">
          <Code aria-label="Sign-in code" defaultValue="418205" disabled />
        </StateRow>
      </DemoSection>
    </>
  )
}
