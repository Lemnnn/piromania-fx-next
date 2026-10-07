import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/**
 * The small uppercase label with a square marker (after No Art): loader,
 * hero metadata, header links, the video readout. The square lights up in
 * flame when `active`, or when a parent with the `group` class is hovered or
 * focused.
 */
export function Tag({
  active,
  className,
  children,
  ...props
}: ComponentProps<"span"> & { active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[0.8125rem] leading-none font-medium tracking-[0.08em] whitespace-nowrap uppercase",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "size-[7px] shrink-0 bg-foreground/45 transition-colors duration-200 group-hover:bg-flame group-focus-visible:bg-flame",
          active && "bg-flame"
        )}
      />
      {children}
    </span>
  )
}
