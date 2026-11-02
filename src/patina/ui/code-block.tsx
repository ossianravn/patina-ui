"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon, CopyIcon } from "lucide-react"
import { cn } from "@/patina/lib/utils"
import { Button } from "@/patina/ui/button"

// Mono on a recessed paper-2 well, left untextured so every syntax ink keeps its contrast. The header is a mono strip
// (file name in ink, language in the label voice) on a dashed rule; line numbers sit in a ruled gutter; the copy
// button is stamped, a mono label in a doubled rough frame that inks in the drum once copied. Syntax colours come
// from useHighlightedCode, which maps Shiki's CSS-variables theme to text inks. The well clips, so its focus ring is
// the page's dashed ring drawn on the frame.

const FOCUS =
  "has-[>[data-slot=code-block-content]:focus-visible]:outline-2 has-[>[data-slot=code-block-content]:focus-visible]:outline-offset-4 has-[>[data-slot=code-block-content]:focus-visible]:outline-k-ink has-[>[data-slot=code-block-content]:focus-visible]:outline-dashed"

const codeBlockVariants = cva(
  `group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-sheet border text-small data-[size=sm]:text-label ${FOCUS}`,
  {
    variants: {
      variant: {
        default: "border-rule bg-paper-2 text-ink",
        destructive:
          "border-ink-red/40 bg-[color-mix(in_srgb,var(--print-red)_8%,var(--paper-2))] text-ink-red",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function CodeBlock({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof codeBlockVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="code-block"
      data-variant={variant}
      data-size={size}
      className={cn(codeBlockVariants({ variant }), className)}
      {...props}
    />
  )
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "flex min-h-10 min-w-0 shrink-0 items-center gap-hair border-b border-dashed border-rule ps-tight pe-1.5 font-label text-label leading-[1.45] tracking-[0.06em] text-ink-3 uppercase group-data-[size=sm]/code-block:min-h-9 group-data-[size=sm]/code-block:ps-2.5 group-data-[variant=destructive]/code-block:border-ink-red/30 group-data-[variant=destructive]/code-block:text-ink-red *:has-[>[data-slot=code-block-title]]:min-w-0",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "min-w-0 truncate font-label text-label font-semibold tracking-normal text-ink normal-case group-data-[variant=destructive]/code-block:text-ink-red [&_svg]:pointer-events-none [&_svg]:inline-block [&_svg]:align-[-0.2em] [&_svg:not([class*='size-'])]:size-3.5 *:[svg]:me-1.5",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn(
        "ms-auto flex shrink-0 items-center gap-1 [[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:end-1.5 [[data-slot=code-block]>&]:top-1.5 [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100 [[data-slot=code-block]>&]:pointer-coarse:opacity-100",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockCopyButton({
  value,
  variant = "outline",
  size = "xs",
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { value: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <>
      <Button
        data-slot="code-block-copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size}
        aria-label={copied ? "Copied" : "Copy"}
        className={cn(
          "relative isolate min-w-[6.25rem] border-transparent bg-card text-ink-2 hover:bg-paper-3 hover:text-ink data-copied:text-k-ink",
          "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-sheet before:border-2 before:border-current before:opacity-70 before:[filter:var(--rough-2)] after:pointer-events-none after:absolute after:inset-[3px] after:-z-10 after:rounded-sheet after:border after:border-current after:opacity-40 after:[filter:var(--rough-2)] data-copied:before:opacity-100 data-copied:after:opacity-60",
          className,
        )}
        onClick={(event) => {
          onClick?.(event)
          navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .catch(() => {})
        }}
        {...props}
      >
        {copied ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <CopyIcon data-icon="inline-start" />
        )}
        <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </>
  )
}

function CodeBlockContent({
  className,
  children,
  style,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  ...props
}: React.ComponentProps<"pre"> & {
  wrap?: boolean
  lineNumbers?: boolean
  startLine?: number
}) {
  return (
    <pre
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      data-numbered={lineNumbers || undefined}
      dir="ltr"
      tabIndex={0}
      style={{ counterReset: `line ${startLine - 1}`, ...style }}
      className={cn(
        "m-0 min-h-0 min-w-0 overflow-auto px-tight py-tight text-start font-label leading-[1.7] font-normal focus-visible:outline-none group-has-data-[slot=code-block-footer]/code-block:pb-hair group-has-data-[slot=code-block-header]/code-block:pt-hair group-data-[size=sm]/code-block:px-2.5 group-data-[size=sm]/code-block:py-2 data-wrap:wrap-break-word data-wrap:whitespace-pre-wrap",
        className,
      )}
      {...props}
    >
      <code
        data-slot="code-block-code"
        className="grid min-h-lh min-w-max content-start font-[inherit] in-data-numbered:grid-cols-[auto_1fr] in-data-wrap:min-w-0"
      >
        {lineNumbers && typeof children === "string"
          ? children
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))
          : children}
      </code>
    </pre>
  )
}

const codeBlockLineVariants = cva(
  "relative -mx-tight block min-h-lh px-tight group-data-[size=sm]/code-block:-mx-2.5 group-data-[size=sm]/code-block:px-2.5 before:min-w-6 before:text-end before:text-ink-3 before:tabular-nums after:absolute after:start-1 after:top-0 after:select-none in-data-numbered:col-span-2 in-data-numbered:grid in-data-numbered:grid-cols-subgrid in-data-numbered:gap-x-tight in-data-numbered:[counter-increment:line] in-data-numbered:before:border-e in-data-numbered:before:border-rule in-data-numbered:before:pe-hair in-data-numbered:before:content-[counter(line)] in-data-numbered:before:select-none in-data-numbered:supports-[content:counter(line)_/_'']:before:content-[counter(line)_/_'']",
  {
    variants: {
      variant: {
        default: "",
        added:
          "bg-print-green/12 after:text-ink-green after:content-['+'] night:bg-print-green/10",
        removed:
          "bg-print-red/9 after:text-ink-red after:content-['−'] night:bg-print-red/11",
        highlighted: "bg-print-yellow/22 night:bg-print-yellow/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function CodeBlockLine({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof codeBlockLineVariants>) {
  // An empty line holds a newline so copying a selection keeps blank lines.
  const empty =
    children === undefined ||
    children === null ||
    children === "" ||
    (Array.isArray(children) && children.length === 0)

  return (
    <span
      data-slot="code-block-line"
      data-variant={variant}
      className={cn(codeBlockLineVariants({ variant }), className)}
      {...props}
    >
      <span data-slot="code-block-line-content" className="min-w-0">
        {empty ? "\n" : children}
      </span>
    </span>
  )
}

function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn(
        "flex min-h-9 min-w-0 shrink-0 items-center gap-hair border-t border-dashed border-rule px-tight font-label text-label leading-[1.45] tracking-[0.06em] text-ink-2 uppercase group-data-[size=sm]/code-block:px-2.5 group-data-[variant=destructive]/code-block:border-ink-red/30",
        className,
      )}
      {...props}
    />
  )
}

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
  CodeBlockFooter,
}
