import type { Metadata } from "next"

import { defaultLocale, intlLocale, locales, type Locale } from "@/i18n/config"
import { localeHref, siteConfig } from "@/lib/site-config"

/**
 * Title, description, canonical URL, hreflang alternates and Open Graph for
 * one page. `path` is the route after the locale ("" for home, "/packages").
 * URLs are relative; the root layout sets metadataBase.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
}: {
  lang: Locale
  path: string
  title: string
  description: string
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: localeHref(lang, path),
      languages: {
        ...Object.fromEntries(
          locales.map((locale) => [locale, localeHref(locale, path)])
        ),
        "x-default": localeHref(defaultLocale, path),
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: localeHref(lang, path),
      locale: intlLocale[lang].replace("-", "_"),
      alternateLocale: locales
        .filter((locale) => locale !== lang)
        .map((locale) => intlLocale[locale].replace("-", "_")),
    },
    twitter: { card: "summary_large_image", title, description },
  }
}
