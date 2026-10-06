"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { StaggeredMenu } from "@/components/layout/staggered-menu"
import { buttonVariants } from "@/components/ui/button"
import { locales, type Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { localeHref, siteConfig } from "@/lib/site-config"
import { SectionLink } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

type SiteHeaderProps = {
  lang: Locale
  dict: Dictionary["nav"]
}

function swapLocale(pathname: string, locale: Locale) {
  const [, , ...rest] = pathname.split("/")
  return `/${[locale, ...rest].join("/")}`
}

export function SiteHeader({ lang, dict }: SiteHeaderProps) {
  const pathname = usePathname()
  const quoteHref = localeHref(lang, siteConfig.quoteHref)
  const { contact } = siteConfig
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Transparent over the hero; solid once content scrolls underneath. Slides
  // away while scrolling down and returns on the way back up.
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll()
        setSolid(y > window.innerHeight * 0.6)
        setHidden(self.direction === 1 && y > window.innerHeight)
      },
    })
    return () => trigger.kill()
  }, [pathname])

  return (
    <header
      data-site-header
      data-intro-hide
      data-solid={solid || undefined}
      data-hidden={hidden || undefined}
      className="fixed inset-x-0 top-0 z-30 h-[72px] border-b border-transparent transition-[translate,background-color,border-color] duration-300 ease-(--ease-out) data-hidden:-translate-y-full data-solid:border-foreground/10 data-solid:bg-background/95"
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-6 px-4 md:px-8">
        <Link
          href={`/${lang}`}
          aria-label={dict.home}
          className="relative z-50 shrink-0"
        >
          <Image
            src="/brand/logo-header.svg"
            alt=""
            width={191}
            height={40}
            preload
            unoptimized
            className="h-8 w-auto md:h-10"
          />
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          <LocaleSwitch lang={lang} pathname={pathname} label={dict.language} />

          <SectionLink
            href={quoteHref}
            className={cn(
              buttonVariants(),
              "hidden h-10 px-5 text-[0.9375rem] sm:inline-flex"
            )}
          >
            {dict.quote}
          </SectionLink>

          <StaggeredMenu
            items={siteConfig.nav.map((item) => ({
              label: dict[item.key],
              href: localeHref(lang, item.href),
            }))}
            labels={{
              menu: dict.menu,
              close: dict.close,
              openMenu: dict.openMenu,
              closeMenu: dict.closeMenu,
              nav: dict.label,
            }}
            footer={
              <>
                <p className="text-sm text-muted-foreground">{dict.contact}</p>
                <a
                  href={contact.phoneHref}
                  className="font-display text-3xl font-bold transition-colors duration-200 hover:text-flame"
                >
                  {contact.phone}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="w-fit text-lg underline decoration-foreground/40 underline-offset-[6px] transition-colors duration-200 hover:decoration-flame"
                >
                  {contact.email}
                </a>
                <SectionLink
                  href={quoteHref}
                  className={cn(
                    buttonVariants(),
                    "mt-4 h-14 w-full text-base sm:hidden"
                  )}
                >
                  {dict.quote}
                </SectionLink>
              </>
            }
          />
        </div>
      </div>
    </header>
  )
}

function LocaleSwitch({
  lang,
  pathname,
  label,
}: {
  lang: Locale
  pathname: string
  label: string
}) {
  return (
    <ul aria-label={label} className="flex items-center text-sm uppercase">
      {locales.map((locale) => (
        <li key={locale}>
          <Link
            href={swapLocale(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            aria-current={locale === lang ? "true" : undefined}
            className="grid h-10 min-w-10 place-items-center text-foreground/60 transition-colors duration-200 hover:text-foreground aria-[current=true]:text-foreground aria-[current=true]:underline aria-[current=true]:underline-offset-4"
          >
            {locale}
          </Link>
        </li>
      ))}
    </ul>
  )
}
