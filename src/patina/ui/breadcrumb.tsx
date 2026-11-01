import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { MoreHorizontalIcon } from "lucide-react"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"

// A mono trail. Links carry the page's link underline, which firms on hover; the current page is plain ink. Between
// crumbs sits a short slash drawn by hand, the same stroke each time, in the faint ink of a decorative marker.
const SLASH = sketch.line(3.5, 13, 8.5, 1, {
  seed: 17,
  stroke: "currentColor",
  strokeWidth: 1.4,
  roughness: 0.9,
})

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "label-mono m-0 flex list-none flex-wrap items-center gap-x-hair gap-y-1 p-0 wrap-break-word text-ink-2",
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "text-ink-2 underline decoration-k-ink/55 decoration-[1.5px] underline-offset-[0.25em] transition-colors hover:text-ink hover:decoration-k-ink",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-semibold text-ink", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center text-ink-faint [&>svg]:size-3.5",
        className,
      )}
      {...props}
    >
      {children ?? (
        <svg
          viewBox="0 0 12 14"
          className="h-3.5 w-3 overflow-visible"
          dangerouslySetInnerHTML={{ __html: SLASH }}
        />
      )}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
