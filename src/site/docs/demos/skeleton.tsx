import { Avatar, AvatarFallback } from "@/patina/ui/avatar"
import { Skeleton } from "@/patina/ui/skeleton"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Skeleton",
  description: "Toned paper in the shape of content that is still loading.",
  item: "skeleton",
}

export default function SkeletonDemo() {
  return (
    <DemoSection title="In the content's own geometry">
      <StateRow label="Loading">
        <div
          className="flex w-[20rem] max-w-full items-center gap-tight"
          aria-busy="true"
          aria-label="Loading observation"
        >
          <Skeleton className="size-8 shrink-0 rounded-full" />
          {/* Bars centred in the line boxes of the text they stand in for, so nothing moves when it loads. */}
          <div className="flex flex-1 flex-col">
            <Skeleton className="my-[0.2rem] h-4 w-28" />
            <Skeleton className="my-[0.29rem] h-3 w-52" />
          </div>
        </div>
      </StateRow>
      <StateRow label="Loaded">
        <div className="flex w-[20rem] max-w-full items-center gap-tight">
          <Avatar>
            <AvatarFallback name="Mira Okafor" />
          </Avatar>
          <div className="flex flex-col">
            <span className="text-ui leading-ui font-semibold">Grey heron</span>
            <span className="text-small leading-small text-ink-2">
              07:42 · first hide · Mira Okafor
            </span>
          </div>
        </div>
      </StateRow>
      <StateRow label="Paragraph">
        <div
          className="flex w-full max-w-measure flex-col gap-2.5"
          aria-busy="true"
          aria-label="Loading notes"
        >
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-[94%]" />
          <Skeleton className="h-3.5 w-[58%]" />
        </div>
      </StateRow>
      <StateRow label="Print">
        <Skeleton className="aspect-[4/3] w-48" aria-label="Loading print" />
      </StateRow>
    </DemoSection>
  )
}
