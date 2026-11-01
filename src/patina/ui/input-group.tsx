"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

import { Button } from "@/patina/ui/button"
import { Input } from "@/patina/ui/input"
import { Textarea } from "@/patina/ui/textarea"

// One control-field frame shared by an input or textarea and its addons. The frame takes the pen line, the invalid
// underline, the dashed disabled line and the page's dashed focus ring (moved here from the inner control, which
// drops its own frame). Addons speak in the mono voice: units, counts, prefixes; icons sit at 16px.

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group control-field relative flex h-control w-full min-w-0 items-center",
        "has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-offset-4 has-[[data-slot=input-group-control]:focus-visible]:outline-k-ink has-[[data-slot=input-group-control]:focus-visible]:outline-dashed",
        "has-[[data-slot][aria-invalid=true]]:border-ink-red has-[[data-slot][aria-invalid=true]]:shadow-[inset_0_-2px_0_var(--ink-red)]",
        "has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:border-dashed has-[[data-slot=input-group-control]:disabled]:bg-transparent has-[[data-slot=input-group-control]:disabled]:text-ink-faint has-[[data-slot=input-group-control]:disabled]:hover:border-input",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto",
        "has-[>[data-align=block-end]]:[&>input]:pt-tight has-[>[data-align=block-start]]:[&>input]:pb-tight has-[>[data-align=inline-end]]:[&>input]:pr-hair has-[>[data-align=inline-start]]:[&>input]:pl-hair",
        className,
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-hair py-hair font-label text-small leading-small text-ink-2 select-none group-has-[[data-slot=input-group-control]:disabled]/input-group:text-ink-faint [&>kbd]:rounded-sheet [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-tight has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-tight has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-tight pt-tight [.border-b]:border-dashed [.border-b]:border-rule [.border-b]:pb-hair",
        "block-end":
          "order-last w-full justify-start px-tight pb-tight [.border-t]:border-dashed [.border-t]:border-rule [.border-t]:pt-hair",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLElement>("[data-slot=input-group-control]")
          ?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva("flex items-center gap-hair", {
  variants: {
    size: {
      xs: "h-7 gap-1 px-hair [&>svg:not([class*='size-'])]:size-3.5",
      sm: "px-tight",
      "icon-xs": "size-7 p-0 has-[>svg]:p-0",
      "icon-sm": "size-control-compact p-0 has-[>svg]:p-0",
    },
  },
  defaultVariants: {
    size: "xs",
  },
})

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      size={size}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-hair font-label text-small leading-small text-ink-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

// The inner control keeps its type, caret and placeholder but hands its frame to the group.
const bare =
  "flex-1 rounded-none border-0! bg-transparent! shadow-none! focus-visible:outline-none disabled:bg-transparent"

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(bare, "h-full", className)}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(bare, "resize-none py-tight", className)}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
