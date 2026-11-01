"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { useSeed } from "@/patina/print/seed-scope"

import { Skeleton } from "@/patina/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/patina/ui/tooltip"
import { useSidebar } from "@/patina/ui/sidebar-provider"

// The sidebar's menu. Rows read in the reading voice and tint the paper on hover; the active row's label (its last
// span, shadcn's convention) carries the highlighter stroke, and in the icon rail the stroke runs under the icon
// instead. Badges are mono counts; submenus hang off a dashed rule. Split from sidebar.tsx to keep each file small;
// import everything from "@/patina/ui/sidebar".

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        "m-0 flex w-full min-w-0 list-none flex-col gap-0 p-0",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button relative isolate flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-sheet p-2 text-left text-ink no-underline transition-[width,height,padding,background-color] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! before:pointer-events-none before:absolute before:inset-x-1 before:inset-y-1.5 before:-z-10 hover:bg-paper-3 active:bg-paper-3 disabled:pointer-events-none disabled:text-ink-faint aria-disabled:pointer-events-none aria-disabled:text-ink-faint data-open:hover:bg-paper-3 data-active:[&>span:last-child]:highlight group-data-[collapsible=icon]:data-active:before:highlight [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "",
        outline:
          "bg-card shadow-[0_0_0_1px_var(--rule)] hover:shadow-[0_0_0_1px_var(--line)]",
      },
      size: {
        default: "h-8 text-small",
        sm: "h-7 text-small",
        lg: "h-12 text-small group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { isMobile, state } = useSidebar()
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      },
      props,
    ),
    render: !tooltip ? render : <TooltipTrigger render={render} />,
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      size,
      active: isActive,
    },
  })

  if (!tooltip) {
    return comp
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
  }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute top-1.5 right-1 flex aspect-square w-5 cursor-pointer items-center justify-center rounded-sheet p-0 text-ink-2 transition-colors group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-ink peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-3.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-paper-3 hover:text-ink md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-ink aria-expanded:opacity-100 md:opacity-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-action",
      sidebar: "menu-action",
    },
  })
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-sheet px-1 font-label text-label text-ink-2 tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-ink peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-3.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-ink",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // A seeded width between 50 and 90 %, the same on the server and in the browser.
  const seed = useSeed("sidebar-menu-skeleton")
  const width = `${Math.floor(stream(seed, "width").between(50, 90))}%`

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(
        "flex h-8 items-center gap-2 rounded-sheet px-2",
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-sheet"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-3.5 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 my-0 flex min-w-0 translate-x-px list-none flex-col gap-0.5 border-l border-dashed border-rule px-2.5 py-0.5 group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}: useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    size?: "sm" | "md"
    isActive?: boolean
  }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "flex h-7 min-w-0 -translate-x-px cursor-pointer items-center gap-2 overflow-hidden rounded-sheet px-2 text-small text-ink no-underline transition-colors group-data-[collapsible=icon]:hidden hover:bg-paper-3 active:bg-paper-3 disabled:pointer-events-none disabled:text-ink-faint aria-disabled:pointer-events-none aria-disabled:text-ink-faint data-active:[&>span:last-child]:highlight [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-ink-2",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      sidebar: "menu-sub-button",
      size,
      active: isActive,
    },
  })
}

export {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
}
