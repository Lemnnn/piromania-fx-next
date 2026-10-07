import type { MetadataRoute } from "next"

import { locales } from "@/i18n/config"
import { localeHref, siteConfig } from "@/lib/site-config"

const paths = ["", siteConfig.packagesHref, siteConfig.privacyHref]

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (locale: string, path: string) =>
    new URL(localeHref(locale, path), siteConfig.url).toString()

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: url(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])),
      },
    }))
  )
}
