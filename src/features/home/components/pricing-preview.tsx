import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { exteriorPackages, formatEur } from "@/features/packages/data"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { cn } from "@/lib/utils"

type PricingPreviewProps = {
  lang: Locale
  dict: Dictionary["pricing"]
}

// The one brand-burgundy field on the page: prices are the decision point.
export function PricingPreview({ lang, dict }: PricingPreviewProps) {
  const packagesHref = `/${lang}/packages`

  return (
    <section
      aria-labelledby="pricing-title"
      className="bg-burgundy text-foreground"
    >
      <div className="mx-auto grid max-w-[1600px] gap-14 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col items-start gap-6 lg:col-span-4">
          <h2
            id="pricing-title"
            className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-[1.1] font-extrabold uppercase"
          >
            {dict.title}
          </h2>
          <p className="max-w-[34ch] text-lg">{dict.intro}</p>
          <Link
            href={packagesHref}
            className={cn(
              buttonVariants(),
              "mt-2 h-12 bg-background px-6 text-base text-foreground hover:bg-background/85 focus-visible:outline-foreground"
            )}
          >
            {dict.all}
          </Link>
        </div>

        <ol className="divide-y divide-foreground/25 lg:col-span-8">
          {exteriorPackages.map((pkg) => (
            <li key={pkg.id}>
              <Link
                href={`${packagesHref}#${pkg.id}`}
                className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 focus-visible:outline-foreground md:py-7"
              >
                <span className="font-display text-4xl leading-none font-bold uppercase md:text-5xl">
                  {pkg.name}
                </span>
                <span className="font-display text-3xl leading-none font-bold tabular-nums md:text-5xl">
                  {pkg.from ? (
                    <span className="mr-2 font-sans text-base font-normal">
                      {dict.from}
                    </span>
                  ) : null}
                  {formatEur(lang, pkg.priceEur)}
                </span>
                <span className="group-hover:text-flame-foreground col-span-2 text-primary-foreground/80 transition-colors duration-200">
                  {pkg.summary[lang]}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
