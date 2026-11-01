"use client"

import { useEffect, useRef, useState, type SyntheticEvent } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@/patina/lib/utils"
import { Paper } from "@/patina/paper/paper"
import { Print } from "@/patina/print/print"
import { Button } from "@/patina/ui/button"
import { Checkbox } from "@/patina/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/patina/ui/field"
import { Input } from "@/patina/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/patina/ui/input-group"
import { Label } from "@/patina/ui/label"

// A sign-in card on deckled paper, in a 26rem column that sits near the top on phones and in the middle on wider
// screens. Email and password are checked when the form is sent and then as you correct them; focus moves to the
// first field that needs attention. "Email me a link instead" checks only the email and turns the card into a
// check-your-email note. Wire onSignIn and onRequestLink to your auth; redirectTo sends a signed-in person on.

export const meta = {
  title: "Sign in",
  description:
    "A sign-in card on deckled paper: email and password with validation, keep me signed in, and an emailed link instead of a password.",
}

export interface SignIn01Props {
  /** The product being signed in to, in the heading. */
  product?: string
  /** One line under the heading. */
  tagline?: string
  /** Where a successful sign-in goes. Without it, the card says who signed in. */
  redirectTo?: string
  onSignIn?: (details: { email: string; remember: boolean }) => void
  onRequestLink?: (email: string) => void
  className?: string
}

const EMAIL = /^\S+@\S+\.\S+$/

export function SignIn01({
  product = "Fieldbook",
  tagline = "Your notebook is where you left it.",
  redirectTo,
  onSignIn,
  onRequestLink,
  className,
}: SignIn01Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [visible, setVisible] = useState(false)
  // Which action was tried: a password sign-in checks both fields, a link only the email.
  const [tried, setTried] = useState<"password" | "link" | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const emailField = useRef<HTMLInputElement>(null)
  const passwordField = useRef<HTMLInputElement>(null)
  const sentHeading = useRef<HTMLHeadingElement>(null)
  const returning = useRef(false)

  const errors = {
    email:
      tried && !EMAIL.test(email)
        ? "Enter the email address you signed up with, like mira@example.com."
        : "",
    password: tried === "password" && !password ? "Enter your password." : "",
  }

  // Moving between the form and the sent note keeps focus with the person: on the note's heading, then back on the
  // email they may want to change.
  useEffect(() => {
    if (sentTo) sentHeading.current?.focus()
    else if (returning.current) emailField.current?.focus()
    returning.current = false
  }, [sentTo])

  function signIn(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setTried("password")
    if (!EMAIL.test(email)) return emailField.current?.focus()
    if (!password) return passwordField.current?.focus()
    onSignIn?.({ email, remember })
    if (redirectTo) window.location.assign(redirectTo)
    else setStatus(`Signed in as ${email}.`)
  }

  function requestLink() {
    if (tried !== "password") setTried("link")
    if (!EMAIL.test(email)) return emailField.current?.focus()
    onRequestLink?.(email)
    setStatus("")
    setSentTo(email)
  }

  return (
    <div className={cn("@container flex min-h-dvh flex-col", className)}>
      <div className="flex flex-1 items-start justify-center px-snug py-section @min-[36rem]:items-center">
        <Paper
          seed="sign-in"
          edge="deckle"
          dogEar
          className="w-[26rem] max-w-full px-line pt-line pb-section"
        >
          <Print motif="sprig" seed="fieldbook" className="w-14" />
          {sentTo ? (
            <>
              <h1
                ref={sentHeading}
                tabIndex={-1}
                className="m-0 mt-tight text-h2 focus-visible:outline-offset-4"
              >
                Check your email
              </h1>
              <p className="m-0 mt-hair text-small leading-small text-ink-2">
                We sent a sign-in link to{" "}
                <strong className="font-semibold [overflow-wrap:anywhere] text-ink">
                  {sentTo}
                </strong>
                . Open it on this device to sign in.
              </p>
              <div className="mt-line flex flex-wrap items-center gap-snug">
                <Button
                  variant="outline"
                  onClick={() => {
                    onRequestLink?.(sentTo)
                    setStatus(`Sent another link to ${sentTo}.`)
                  }}
                >
                  Send again
                </Button>
                <Button
                  variant="link"
                  onClick={() => {
                    returning.current = true
                    setStatus("")
                    setSentTo(null)
                  }}
                >
                  Use a password
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="m-0 mt-tight text-h2">Sign in to {product}</h1>
              <p className="m-0 mt-hair text-small leading-small text-ink-2">
                {tagline}
              </p>
              <form onSubmit={signIn} noValidate className="mt-snug">
                <FieldGroup>
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                    <Input
                      ref={emailField}
                      id="sign-in-email"
                      type="email"
                      autoComplete="username email"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "sign-in-email-error" : undefined
                      }
                      className="w-full"
                    />
                    {errors.email && (
                      <FieldError id="sign-in-email-error">
                        {errors.email}
                      </FieldError>
                    )}
                  </Field>
                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        ref={passwordField}
                        id="sign-in-password"
                        type={visible ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={!!errors.password}
                        aria-describedby={
                          errors.password ? "sign-in-password-error" : undefined
                        }
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          size="icon-xs"
                          aria-label="Show password"
                          aria-pressed={visible}
                          onClick={() => setVisible((v) => !v)}
                        >
                          {visible ? <EyeOffIcon /> : <EyeIcon />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.password && (
                      <FieldError id="sign-in-password-error">
                        {errors.password}
                      </FieldError>
                    )}
                  </Field>
                  <Label>
                    <Checkbox
                      checked={remember}
                      onCheckedChange={(on) => setRemember(on)}
                    />
                    Keep me signed in on this device
                  </Label>
                </FieldGroup>
                <div className="mt-line flex flex-wrap items-center gap-snug">
                  <Button type="submit">Sign in</Button>
                  <Button variant="link" type="button" onClick={requestLink}>
                    Email me a link instead
                  </Button>
                </div>
              </form>
            </>
          )}
          <p
            aria-live="polite"
            className="m-0 text-small leading-small text-ink-2 not-empty:mt-snug"
          >
            {status}
          </p>
        </Paper>
      </div>
    </div>
  )
}

export default SignIn01
