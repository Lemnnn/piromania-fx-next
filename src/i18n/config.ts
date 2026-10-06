export const locales = ["ro", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "ro"

export function hasLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale)
}
