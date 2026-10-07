export const siteConfig = {
  name: "Piromania",
  company: "Piromania International SRL",
  /** Canonical origin for metadata, sitemap and Open Graph URLs. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://piromania.ro",
  contact: {
    person: "Cristian Enciu",
    phone: "0722 380 636",
    phoneHref: "tel:+40722380636",
    email: "office@piromania.ro",
  },
  // Hash links point at sections of the home page; paths are separate pages.
  nav: [
    { key: "about", href: "#about" },
    { key: "services", href: "#services" },
    { key: "shows", href: "#shows" },
    { key: "packages", href: "/packages" },
  ],
  quoteHref: "#contact",
  packagesHref: "/packages",
  privacyHref: "/privacy",
} as const

/** "/ro" + "#about" -> "/ro#about", "/ro" + "/packages" -> "/ro/packages". */
export function localeHref(lang: string, href = "") {
  return `/${lang}${href}`
}
