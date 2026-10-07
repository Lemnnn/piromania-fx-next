import type { Metadata } from "next"
import { Big_Shoulders, Geist } from "next/font/google"
import { notFound } from "next/navigation"

import "../globals.css"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { hasLocale, locales } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { pageMetadata } from "@/lib/metadata"
import { siteConfig } from "@/lib/site-config"
import { SmoothScroll } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

const display = Big_Shoulders({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-display",
})

const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-sans" })

// Runs before first paint on every full load of the home page. In-site
// navigation back to Home never sets it, so the intro is not repeated while
// browsing, and a deep link to a section (/ro#contact) skips it.
const introScript = `(function(){try{var d=document.documentElement;if(/^\\/(${locales.join("|")})?\\/?$/.test(location.pathname)&&!location.hash)d.dataset.intro="pending"}catch(e){}})()`

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: Omit<LayoutProps<"/[lang]">, "children">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  return {
    metadataBase: new URL(siteConfig.url),
    ...pageMetadata({
      lang,
      path: "",
      title: dict.meta.title,
      description: dict.meta.description,
    }),
  }
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn("dark", display.variable, sans.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-50 -translate-y-24 bg-primary px-4 py-3 text-primary-foreground focus-visible:translate-y-0"
        >
          {dict.nav.skip}
        </a>
        <SmoothScroll />
        <SiteHeader lang={lang} dict={dict.nav} />
        {children}
        <SiteFooter lang={lang} dict={dict} />
      </body>
    </html>
  )
}
