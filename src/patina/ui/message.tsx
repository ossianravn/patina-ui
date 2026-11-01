import * as React from "react"
import { cn } from "@/patina/lib/utils"

// Notes passed across the desk. The header is a mono byline (the author in ink, a fixed time beside it), the body
// reads in the serif, and the footer is a row of quiet actions. The avatar sits level with the byline, so a note
// reads top-down like a signed slip; the monogram print may spill past its circle, so the slot never clips.

function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-hair", className)}
      {...props}
    />
  )
}

function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-tight font-read text-body leading-lead text-ink data-[align=end]:flex-row-reverse",
        className,
      )}
      {...props}
    />
  )
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex w-fit min-w-8 shrink-0 items-start justify-center self-start",
        className,
      )}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-hair wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
        className,
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex max-w-full min-w-0 flex-wrap items-center gap-x-hair px-tight group-has-data-[slot=message-avatar]/message:min-h-8 font-label text-label leading-[1.45] font-medium tracking-[0.06em] text-ink-2 uppercase group-has-data-[variant=ghost]/message:px-0 [&_b,&_strong]:font-bold [&_b,&_strong]:text-ink [&_time]:tabular-nums",
        className,
      )}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex max-w-full min-w-0 items-center gap-1 px-tight font-label text-label leading-[1.45] font-medium tracking-[0.06em] text-ink-2 uppercase group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
        className,
      )}
      {...props}
    />
  )
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
}
