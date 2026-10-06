export const siteConfig = {
  name: "Piromania",
  company: "Piromania International SRL",
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
} as const

export type NavKey = (typeof siteConfig.nav)[number]["key"]

/** "/ro" + "#about" -> "/ro#about", "/ro" + "/packages" -> "/ro/packages". */
export function localeHref(lang: string, href: string) {
  return `/${lang}${href}`
}
