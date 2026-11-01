import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cn } from "@/patina/lib/utils"
import { Print } from "@/patina/print/print"

// An image in a pen circle. Give the fallback a `name` and it becomes a monogram print seeded by that name: the same
// person gets the same ring, blob and initials everywhere. The print draws its own ring, so the pen circle steps
// aside for it.

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border-[1.5px] after:border-line has-data-monogram:after:hidden data-[size=lg]:size-10 data-[size=sm]:size-6",
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  name,
  children,
  ...props
}: AvatarPrimitive.Fallback.Props & {
  /** Prints a monogram seeded by this name; the children stay as the accessible text. */
  name?: string
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      data-monogram={name ? "" : undefined}
      className={cn(
        "relative flex size-full items-center justify-center rounded-full bg-paper-3 font-read text-small leading-none font-semibold text-ink group-data-[size=lg]/avatar:text-body group-data-[size=sm]/avatar:text-label data-monogram:bg-card",
        className,
      )}
      {...props}
    >
      {name ? (
        <>
          <Print
            motif="monogram"
            seed={name}
            text={name}
            className="pointer-events-none absolute top-1/2 left-1/2 w-[143%] -translate-x-1/2 -translate-y-1/2"
          />
          {children ? <span className="sr-only">{children}</span> : null}
        </>
      ) : (
        children
      )}
    </AvatarPrimitive.Fallback>
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-k text-paper shadow-[0_0_0_2px_var(--paper)] select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:shadow-[0_0_0_2px_var(--paper)]",
        className,
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-paper-3 font-label text-label font-bold text-ink shadow-[0_0_0_2px_var(--paper)] group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
