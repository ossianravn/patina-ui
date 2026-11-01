"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"
import { SearchIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/patina/ui/dialog"
import { InputGroup, InputGroupAddon } from "@/patina/ui/input-group"

// An index card for searching: the query sits on the card's header rule, the results below as a typeset list. The
// active row gets the highlighter stroke, which is also its keyboard focus mark (cmdk keeps focus in the input and
// moves the selection with the arrows), so rows draw no dashed ring. While the input has focus the header rule
// firms into the drum's colour. Group headings and shortcuts are mono; an empty search says so in the reading voice.
const TICK = sketch.curve(
  [
    [4, 13],
    [10, 20],
    [22, 3],
  ],
  { seed: 24, stroke: "var(--k)", strokeWidth: 2.6, roughness: 0.8 },
)

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "sheet flex size-full flex-col overflow-hidden text-ink in-data-[slot=dialog-content]:rounded-none in-data-[slot=dialog-content]:bg-transparent! in-data-[slot=dialog-content]:bg-none! in-data-[slot=dialog-content]:shadow-none!",
        className,
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command palette",
  description = "Search for a command to run…",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("top-1/4 translate-y-0 gap-0 p-0 sm:max-w-lg", className)}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="border-b-[1.5px] border-line transition-[border-color,box-shadow] duration-150 has-[input:focus-visible]:border-k has-[input:focus-visible]:shadow-[inset_0_-1.5px_0_var(--k)]"
    >
      <InputGroup className="rounded-none border-0! bg-transparent! shadow-none! hover:border-0">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "h-full w-full min-w-0 flex-1 bg-transparent pr-tight pl-hair font-ui text-ui text-ink outline-none placeholder:text-ink-3 disabled:cursor-not-allowed disabled:text-ink-faint",
            className,
          )}
          {...props}
        />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 text-ink-2" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[18rem] scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain p-1 outline-none",
        className,
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "px-snug py-line text-center text-small leading-small text-ink-2",
        className,
      )}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-ink **:[[cmdk-group-heading]]:px-tight **:[[cmdk-group-heading]]:pt-hair **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:font-label **:[[cmdk-group-heading]]:text-label **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:tracking-[0.06em] **:[[cmdk-group-heading]]:text-ink-3 **:[[cmdk-group-heading]]:uppercase",
        className,
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(
        "-mx-1 my-1 h-0 border-t border-dashed border-rule",
        className,
      )}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative isolate flex cursor-default items-center gap-tight rounded-sheet px-tight py-hair text-ui leading-ui text-ink outline-none select-none before:pointer-events-none before:absolute before:inset-x-1 before:inset-y-0 before:-z-10 data-[disabled=true]:pointer-events-none data-[disabled=true]:text-ink-faint data-[selected=true]:before:highlight [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg]:text-ink-2",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="ml-auto hidden size-4 overflow-visible group-has-data-[slot=command-shortcut]/command-item:hidden! group-data-[checked=true]/command-item:block"
        dangerouslySetInnerHTML={{ __html: TICK }}
      />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto pl-snug font-label text-label tracking-[0.06em] text-ink-3",
        className,
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
