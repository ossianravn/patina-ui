import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

import { Glyph } from "@/patina/marks/glyph"
import { Label } from "@/patina/ui/label"
import { Separator } from "@/patina/ui/separator"

// Label, control, description and error in one column of readable width. Children keep the widths they are given
// (a short field stays short); the error prints in the red text ink beside a hand-drawn bang.

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-snug has-[>[data-slot=checkbox-group]]:gap-tight has-[>[data-slot=radio-group]]:gap-tight",
        className,
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-hair font-semibold text-ink data-[variant=label]:text-small data-[variant=label]:leading-small data-[variant=legend]:font-read data-[variant=legend]:text-body data-[variant=legend]:leading-subhead",
        className,
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-snug data-[slot=checkbox-group]:gap-tight",
        className,
      )}
      {...props}
    />
  )
}

const fieldVariants = cva("group/field flex w-full gap-hair", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal:
        "flex-row items-center gap-tight has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive:
        "flex-col @md/field-group:flex-row @md/field-group:items-center @md/field-group:gap-tight @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-small",
        className,
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-tight leading-small group-data-[disabled=true]/field:cursor-not-allowed group-data-[disabled=true]/field:text-ink-faint has-[>[data-slot=field]]:rounded-sheet has-[>[data-slot=field]]:border-[1.5px] has-[>[data-slot=field]]:border-rule has-[>[data-slot=field]]:bg-card has-[>[data-slot=field]]:transition-colors has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:cursor-pointer has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:border-line has-[>[data-slot=field]]:has-data-checked:border-line has-[>[data-slot=field]]:has-data-checked:bg-paper-2 has-[>[data-slot=field]]:has-[[data-disabled]]:border-dashed *:data-[slot=field]:p-tight",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className,
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-tight text-small leading-small font-semibold text-ink group-data-[disabled=true]/field:text-ink-faint",
        className,
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-left text-small leading-small font-normal text-ink-2 group-has-data-[orientation=horizontal]/field:text-balance group-data-[disabled=true]/field:text-ink-faint [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        className,
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-small leading-small group-data-[variant=outline]/field-group:-mb-2",
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="label-mono relative mx-auto block w-fit bg-card paper-texture px-tight text-ink-3"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="m-0 flex list-disc flex-col gap-0.5 pl-4">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "flex items-start gap-hair text-small leading-small font-normal text-ink-red",
        className,
      )}
      {...props}
    >
      <Glyph name="bang" seed="field-error" size={16} className="mt-[0.15em]" />
      <div className="min-w-0">{content}</div>
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
