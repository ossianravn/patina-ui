import { useState, type FormEvent } from "react"
import { Paper } from "@/patina/paper/paper"
import { Print } from "@/patina/print/print"
import { Button } from "@/patina/ui/button"
import { Checkbox } from "@/patina/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/patina/ui/field"
import { Input } from "@/patina/ui/input"
import { Label } from "@/patina/ui/label"

/** Fieldbook's sign-in: a demo, so any well-formed email and a password open the notebook. */
export function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tried, setTried] = useState(false)
  const errors = {
    email: /^\S+@\S+\.\S+$/.test(email)
      ? ""
      : "Enter the email address you signed up with, like mira@example.com.",
    password: password ? "" : "Enter your password.",
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    setTried(true)
    if (!errors.email && !errors.password) window.location.assign("/fieldbook")
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-snug py-section">
      <Paper
        seed="sign-in"
        edge="deckle"
        dogEar
        className="w-[25rem] max-w-full px-line pt-line pb-section"
      >
        <Print motif="sprig" seed="fieldbook" className="w-14" />
        <h1 className="m-0 mt-tight text-h2">Sign in to Fieldbook</h1>
        <p className="m-0 mt-hair text-small leading-small text-ink-2">
          Your notebook is where you left it.
        </p>
        <form onSubmit={submit} noValidate className="mt-snug">
          <FieldGroup>
            <Field data-invalid={tried && !!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={tried && !!errors.email}
                className="w-full"
              />
              {tried && errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>
            <Field data-invalid={tried && !!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={tried && !!errors.password}
                className="w-full"
              />
              {tried && errors.password && (
                <FieldError>{errors.password}</FieldError>
              )}
            </Field>
            <Label>
              <Checkbox defaultChecked /> Keep me signed in on this device
            </Label>
          </FieldGroup>
          <div className="mt-line flex flex-wrap items-center gap-snug">
            <Button type="submit">Sign in</Button>
            <Button variant="link" type="button" onClick={() => setTried(true)}>
              Email me a link instead
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  )
}
