import type { Locale } from "@/i18n/config"
import { cn } from "@/lib/utils"

import { formatEur, type ShowPackage } from "../data"

/** A package's price, with the "from" label when it is a starting point. */
export function PackagePrice({
  pkg,
  lang,
  fromLabel,
  className,
  fromClassName,
}: {
  pkg: ShowPackage
  lang: Locale
  fromLabel: string
  className?: string
  fromClassName?: string
}) {
  return (
    <span
      className={cn(
        "font-display leading-none font-bold tabular-nums",
        className
      )}
    >
      {pkg.from ? (
        <span
          className={cn("mr-2 font-sans text-base font-normal", fromClassName)}
        >
          {fromLabel}
        </span>
      ) : null}
      {formatEur(lang, pkg.priceEur)}
    </span>
  )
}
