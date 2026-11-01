"use client"

import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { cn } from "@/patina/lib/utils"

import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "@/patina/ui/dropdown-menu"

// Exactly the dropdown menu's sheet, opened at the pointer: card stock, a highlighter stroke on the highlighted item,
// mono labels and shortcuts, dashed separators, a hand tick and an inked dot for checked and chosen items. Base UI's
// context menu shares its items with the menu, so every part but the root, trigger and popup is the dropdown menu's
// own component under a context-menu data-slot; only the positioner differs, since it anchors to the pointer.

function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuPortal({ ...props }: ContextMenuPrimitive.Portal.Props) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn("select-none", className)}
      {...props}
    />
  )
}

function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            "float-sheet z-50 max-h-(--available-height) min-w-40 origin-(--transform-origin) overflow-x-hidden overflow-y-auto p-1 outline-none duration-150 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="context-menu-group" {...props} />
}

function ContextMenuLabel({
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel data-slot="context-menu-label" {...props} />
}

function ContextMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      data-slot="context-menu-item"
      className={cn("group/context-menu-item", className)}
      {...props}
    />
  )
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="context-menu-sub" {...props} />
}

function ContextMenuSubTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTrigger>) {
  return (
    <DropdownMenuSubTrigger data-slot="context-menu-sub-trigger" {...props} />
  )
}

function ContextMenuSubContent({
  className,
  alignOffset = -3,
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className={cn("min-w-36", className)}
      side="right"
      alignOffset={alignOffset}
      {...props}
    />
  )
}

function ContextMenuCheckboxItem({
  ...props
}: React.ComponentProps<typeof DropdownMenuCheckboxItem>) {
  return (
    <DropdownMenuCheckboxItem
      data-slot="context-menu-checkbox-item"
      {...props}
    />
  )
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return (
    <DropdownMenuRadioGroup data-slot="context-menu-radio-group" {...props} />
  )
}

function ContextMenuRadioItem({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioItem>) {
  return (
    <DropdownMenuRadioItem data-slot="context-menu-radio-item" {...props} />
  )
}

function ContextMenuSeparator({
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator data-slot="context-menu-separator" {...props} />
}

function ContextMenuShortcut({
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut data-slot="context-menu-shortcut" {...props} />
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
