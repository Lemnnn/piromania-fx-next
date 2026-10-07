import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { localeHref, siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

import { exteriorPackages } from "../data"
import { PackagePrice } from "./package-price"

type PricingPreviewProps = {
  lang: Locale
  dict: Dictionary["pricing"]
}

// The one brand-burgundy field on the home page: prices are the decision point.
export function PricingPreview({ lang, dict }: PricingPreviewProps) {
  const packagesHref = localeHref(lang, siteConfig.packagesHref)

  return (
    <section
      aria-labelledby="pricing-title"
      className="bg-burgundy text-foreground"
    >
      <div className="container-page grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-10">
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
            className={cn(buttonVariants({ variant: "inverse" }), "mt-2 px-6")}
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
                <PackagePrice
                  pkg={pkg}
                  lang={lang}
                  fromLabel={dict.from}
                  className="text-3xl md:text-5xl"
                />
                <span className="col-span-2 text-primary-foreground/80 transition-colors duration-200 group-hover:text-primary-foreground">
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
