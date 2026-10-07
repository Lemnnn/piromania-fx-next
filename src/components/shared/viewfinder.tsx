import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const corner = "absolute size-4 border-foreground/80 md:size-5"

/**
 * Camera viewfinder corners (after No Art) framing whatever the container
 * covers. Each corner carries `data-corner` (tl, tr, bl, br) so an animation
 * can move it. By default blended with difference, so it shows on light and
 * dark footage; pass `blend={false}` inside anything that scales or moves as
 * you scroll, where re-blending every frame is expensive.
 */
export function Viewfinder({
  className,
  blend = true,
  ...props
}: ComponentProps<"div"> & { blend?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none",
        blend && "mix-blend-difference",
        className
      )}
      {...props}
    >
      <span
        data-corner="tl"
        className={cn(corner, "top-0 left-0 border-t-[1.5px] border-l-[1.5px]")}
      />
      <span
        data-corner="tr"
        className={cn(
          corner,
          "top-0 right-0 border-t-[1.5px] border-r-[1.5px]"
        )}
      />
      <span
        data-corner="bl"
        className={cn(
          corner,
          "bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]"
        )}
      />
      <span
        data-corner="br"
        className={cn(
          corner,
          "right-0 bottom-0 border-r-[1.5px] border-b-[1.5px]"
        )}
      />
    </div>
  )
}
