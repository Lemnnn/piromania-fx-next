export const locales = ["ro", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "ro"

/** Intl / Open Graph locale for each app locale. */
export const intlLocale: Record<Locale, string> = {
  ro: "ro-RO",
  en: "en-GB",
}

/** Remembers a language picked in the switcher (read by the proxy). */
export const localeCookie = "NEXT_LOCALE"

export function hasLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale)
}
