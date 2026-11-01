import { cn } from "@/patina/lib/utils"

// A frame of fixed proportion on a recessed paper well. Its children stack to fill it, in order, so a Print placed
// before an image holds the frame until the image paints over it, with no script. A Print covers the frame whatever
// the ratio (it is square, so it crops at the long edge); images and video cover it too.

function AspectRatio({
  ratio,
  className,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio,
        } as React.CSSProperties
      }
      className={cn(
        "relative aspect-(--ratio) overflow-hidden rounded-sheet bg-paper-2 [container-type:size] *:absolute *:inset-0 *:size-full *:[img,video]:object-cover *:data-[slot=print]:inset-auto *:data-[slot=print]:top-1/2 *:data-[slot=print]:left-1/2 *:data-[slot=print]:size-auto *:data-[slot=print]:w-[max(100cqw,100cqh)] *:data-[slot=print]:-translate-1/2",
        className,
      )}
      {...props}
    />
  )
}

export { AspectRatio }
