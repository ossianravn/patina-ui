import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"

import { Button } from "@/patina/ui/button"

// Mono page numbers as ghost buttons; the current page is ringed by hand in the region's drum, the same ring every
// time, so the control stays calm. Previous and next are ghost buttons with a chevron; their labels drop away on
// phones. A link with aria-disabled (no previous page on page one) fades to the faint ink and takes no pointer.
const RING = sketch.ellipse(22, 22.5, 34, 30, {
  seed: 41,
  stroke: "var(--k)",
  strokeWidth: 1.7,
  roughness: 1.1,
})

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("m-0 flex list-none items-center gap-1 p-0", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        "relative text-ink-2 no-underline tabular-nums hover:text-ink aria-disabled:pointer-events-none aria-disabled:text-ink-faint data-active:text-ink",
        className,
      )}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    >
      {children}
      {isActive ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 44 44"
          className="pointer-events-none absolute inset-0 m-auto size-[2.75rem] overflow-visible"
          dangerouslySetInnerHTML={{ __html: RING }}
        />
      ) : null}
    </Button>
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("max-sm:w-control max-sm:px-0!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" className="rtl:-scale-x-100" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("max-sm:w-control max-sm:px-0!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-control items-center justify-center text-ink-3 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
