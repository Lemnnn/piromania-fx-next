import type { Metadata, Viewport } from "next"
import { Big_Shoulders, Geist } from "next/font/google"
import Link from "next/link"

import "./globals.css"
import { buttonVariants } from "@/components/ui/button"
import { boundaryCopy } from "@/i18n/boundary-copy"
import { defaultLocale, locales } from "@/i18n/config"
import { siteViewport } from "@/lib/metadata"
import { localeHref, siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

// Served for any URL no route matches. It renders outside the [lang] layout,
// so it can't know the visitor's language: Romanian leads, English follows.

const display = Big_Shoulders({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-display",
})

const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-sans" })

export const viewport: Viewport = siteViewport

export const metadata: Metadata = {
  title: `404 | ${siteConfig.name}`,
  robots: { index: false },
}

export default function GlobalNotFound() {
  return (
    <html
      lang={defaultLocale}
      className={cn("dark", display.variable, sans.variable)}
    >
      <body>
        <main className="container-page flex min-h-[100dvh] flex-col justify-center gap-16 py-28">
          <p className="font-display text-2xl font-bold text-flame">404</p>
          {locales.map((lang, i) => {
            const t = boundaryCopy[lang].notFound
            return (
              <section
                key={lang}
                lang={lang}
                className="flex flex-col gap-6 border-t border-foreground/15 pt-8 first-of-type:border-0 first-of-type:pt-0"
              >
                {i === 0 ? (
                  <h1 className="max-w-[14ch] heading-section">{t.title}</h1>
                ) : (
                  <h2 className="font-display text-4xl leading-none font-bold uppercase">
                    {t.title}
                  </h2>
                )}
                <p className="max-w-[40ch] text-xl text-foreground/80">
                  {t.text}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    href={localeHref(lang, siteConfig.quoteHref)}
                    className={buttonVariants()}
                  >
                    {t.quote}
                  </Link>
                  <Link
                    href={localeHref(lang)}
                    className="text-base link-underline"
                  >
                    {t.home}
                  </Link>
                </div>
              </section>
            )
          })}
        </main>
      </body>
    </html>
  )
}
