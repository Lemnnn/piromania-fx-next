import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import {
  exteriorPackages,
  formatEur,
  formatRon,
  interiorPackages,
  perMinuteRates,
  type ShowPackage,
} from "@/features/packages/data"
import { hasLocale, type Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { localeHref, siteConfig } from "@/lib/site-config"
import { SectionLink } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/packages">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return {
    title: dict.packagesPage.metaTitle,
    description: dict.packagesPage.metaDescription,
  }
}

const sectionTitle =
  "font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.9] font-extrabold uppercase"

export default async function PackagesPage({
  params,
}: PageProps<"/[lang]/packages">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const t = dict.packagesPage

  return (
    <main className="mx-auto max-w-[1600px] px-4 pt-36 md:px-8 md:pt-44">
      <header className="flex flex-col gap-6 pb-20 md:pb-28">
        <h1 className="font-display text-[clamp(4rem,11vw,10.5rem)] leading-[0.95] font-extrabold uppercase">
          {t.title}
        </h1>
        <p className="max-w-[44ch] text-xl text-foreground/80">{t.intro}</p>
        <p className="text-foreground/60">{t.vat}</p>
      </header>

      <section aria-labelledby="exterior-title" className="pb-28 md:pb-40">
        <h2 id="exterior-title" className={sectionTitle}>
          {t.exterior}
        </h2>
        <ol className="mt-12 divide-y divide-foreground/15 border-t border-foreground/15">
          {exteriorPackages.map((pkg) => (
            <PackageRow
              key={pkg.id}
              pkg={pkg}
              lang={lang}
              fromLabel={dict.pricing.from}
            />
          ))}
        </ol>
      </section>

      <section aria-labelledby="per-minute-title" className="pb-28 md:pb-40">
        <h2 id="per-minute-title" className={sectionTitle}>
          {t.perMinute}
        </h2>
        <p className="mt-4 text-lg text-foreground/75">{t.perMinuteIntro}</p>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="text-foreground/60">
                <th scope="col" className="pb-4 font-normal">
                  {t.perMinuteColumns.price}
                </th>
                <th scope="col" className="pb-4 font-normal">
                  {t.perMinuteColumns.shots}
                </th>
                <th scope="col" className="pb-4 font-normal">
                  {t.perMinuteColumns.height}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/15 border-t border-foreground/15">
              {perMinuteRates.map((rate) => (
                <tr
                  key={rate.priceEur}
                  className="font-display text-3xl font-bold tabular-nums md:text-5xl"
                >
                  <th
                    scope="row"
                    className="py-6 text-left font-bold text-flame"
                  >
                    {formatEur(lang, rate.priceEur)}
                  </th>
                  <td className="py-6">
                    <span className="mr-2 font-sans text-base font-normal text-foreground/60">
                      {t.about}
                    </span>
                    {rate.shotsPerMinute}
                  </td>
                  <td className="py-6">
                    {rate.maxHeight} {t.metres}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="interior-title" className="pb-28 md:pb-40">
        <h2 id="interior-title" className={sectionTitle}>
          {t.interior}
        </h2>
        <ol className="mt-12 divide-y divide-foreground/15 border-t border-foreground/15">
          {interiorPackages.map((pkg) => (
            <li
              key={pkg.id}
              className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-10"
            >
              <div className="flex items-baseline justify-between gap-6 lg:col-span-5 lg:flex-col lg:justify-start lg:gap-3">
                <h3 className="font-display text-5xl leading-none font-bold uppercase">
                  {pkg.name}
                </h3>
                <p className="font-display text-4xl leading-none font-bold text-flame tabular-nums">
                  {formatRon(lang, pkg.priceRon)}
                </p>
              </div>
              <DetailList items={pkg.details[lang]} className="lg:col-span-7" />
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="packages-cta-title"
        className="mb-28 flex flex-col items-start gap-6 border-t border-foreground/15 pt-16 md:mb-40"
      >
        <h2 id="packages-cta-title" className={sectionTitle}>
          {t.ctaTitle}
        </h2>
        <p className="max-w-[44ch] text-xl text-foreground/80">{t.ctaText}</p>
        <SectionLink
          href={localeHref(lang, siteConfig.quoteHref)}
          className={cn(buttonVariants(), "mt-2 h-14 px-8 text-base")}
        >
          {dict.nav.quote}
        </SectionLink>
      </section>
    </main>
  )
}

function PackageRow({
  pkg,
  lang,
  fromLabel,
}: {
  pkg: ShowPackage
  lang: Locale
  fromLabel: string
}) {
  return (
    <li
      id={pkg.id}
      className="grid scroll-mt-28 gap-8 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14"
    >
      <div className="flex flex-col gap-3 lg:col-span-5">
        <h3 className="font-display text-5xl leading-none font-bold uppercase md:text-6xl">
          {pkg.name}
        </h3>
        <p className="font-display text-4xl leading-none font-bold text-flame tabular-nums md:text-5xl">
          {pkg.from ? (
            <span className="mr-2 font-sans text-base font-normal text-foreground/70">
              {fromLabel}
            </span>
          ) : null}
          {formatEur(lang, pkg.priceEur)}
        </p>
      </div>

      <div className="lg:col-span-7">
        {pkg.variants ? (
          <div className="grid gap-8 sm:grid-cols-2">
            {pkg.variants.map((variant) => (
              <div key={variant.label.en}>
                <h4 className="mb-3 text-sm text-foreground/60">
                  {variant.label[lang]}
                </h4>
                <DetailList items={variant.details[lang]} />
              </div>
            ))}
          </div>
        ) : pkg.details ? (
          <DetailList items={pkg.details[lang]} />
        ) : null}
      </div>
    </li>
  )
}

function DetailList({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <ul
      className={cn(
        "flex flex-col gap-2 text-lg text-foreground/85",
        className
      )}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
