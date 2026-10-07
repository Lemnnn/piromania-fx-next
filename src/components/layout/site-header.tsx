"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, type MouseEvent } from "react"

import { StaggeredMenu } from "@/components/layout/staggered-menu"
import { ContactLinks } from "@/components/shared/contact-links"
import { Tag } from "@/components/shared/tag"
import { buttonVariants } from "@/components/ui/button"
import { localeCookie, locales, type Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { gsap, scrambleChars, ScrollTrigger } from "@/lib/gsap"
import { localeHref, siteConfig } from "@/lib/site-config"
import { SectionLink } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  lang: Locale
  dict: Dictionary["nav"]
}

/** Remembered for a year; the proxy reads it on the next bare visit to "/". */
function rememberLocale(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`
}

function swapLocale(pathname: string, locale: Locale) {
  const [, , ...rest] = pathname.split("/")
  return `/${[locale, ...rest].join("/")}`
}

export function SiteHeader({ lang, dict }: SiteHeaderProps) {
  const pathname = usePathname()
  const header = useRef<HTMLElement>(null)
  const quoteHref = localeHref(lang, siteConfig.quoteHref)

  // Transparent over the hero; solid once content scrolls underneath. Slides
  // away while scrolling down and returns on the way back up. Written straight
  // to data attributes: this runs every scroll frame, and React state would
  // re-render the header and menu each time.
  useEffect(() => {
    const el = header.current
    if (!el) return
    const toggle = (name: "solid" | "hidden", on: boolean) => {
      if (on !== name in el.dataset) el.toggleAttribute(`data-${name}`, on)
    }
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll()
        toggle("solid", y > window.innerHeight * 0.6)
        toggle("hidden", self.direction === 1 && y > window.innerHeight)
      },
    })
    return () => trigger.kill()
  }, [pathname])

  const isHome = pathname === localeHref(lang)

  // Two fixed layers that move together (see globals.css, "Site header"):
  // the logo and background below, and the links above, blended with
  // mix-blend-difference so they invert against bright footage like No Art's.
  // A fixed element isolates its children, so the blend has to sit on a layer
  // of its own, and the orange logo stays out of it so it keeps its colours.
  return (
    <header
      ref={header}
      data-site-header
      data-home={isHome || undefined}
      className="contents"
    >
      <div
        data-header-layer
        data-header-bg
        data-intro-hide
        className="fixed inset-x-0 top-0 z-30 h-[72px] border-b border-transparent"
      >
        <div className="container-page flex h-full items-center">
          <Link
            href={localeHref(lang)}
            aria-label={dict.home}
            className="shrink-0"
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
        </div>
      </div>

      <div
        data-header-layer
        data-intro-hide
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[72px] mix-blend-difference"
      >
        <div className="container-page flex h-full items-center justify-between gap-6">
          {/* Keeps the logo's place (191×40 at h-10). */}
          <span aria-hidden className="w-[153px] shrink-0 md:w-[191px]" />

          {/* Desktop: the links sit in the header; the menu is for small screens. */}
          <nav
            aria-label={dict.label}
            className="pointer-events-auto hidden flex-1 lg:block"
          >
            <ul className="flex items-center justify-center gap-8 xl:gap-10">
              {siteConfig.nav.map((item) => {
                const href = localeHref(lang, item.href)
                return (
                  <li key={item.key}>
                    <NavLink href={href} current={pathname === href}>
                      {dict[item.key]}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="pointer-events-auto flex items-center gap-3 md:gap-6">
            <LocaleSwitch
              lang={lang}
              pathname={pathname}
              label={dict.language}
            />

            {/* Hidden over the home hero, which has its own quote button. */}
            <SectionLink
              data-header-quote
              href={quoteHref}
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden sm:inline-flex"
              )}
            >
              {dict.quote}
            </SectionLink>

            <div className="lg:hidden">
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
                    <p className="text-sm text-muted-foreground">
                      {dict.contact}
                    </p>
                    <ContactLinks phoneClassName="text-3xl" />
                    <SectionLink
                      href={quoteHref}
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "mt-4 w-full sm:hidden"
                      )}
                    >
                      {dict.quote}
                    </SectionLink>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

/** Header link in the tag style; the label scrambles on hover and focus. */
function NavLink({
  href,
  current,
  children,
}: {
  href: string
  current: boolean
  children: string
}) {
  const label = useRef<HTMLSpanElement>(null)
  const scramble = () => {
    gsap.to(label.current, {
      duration: 0.5,
      scrambleText: { text: children, chars: scrambleChars, speed: 0.8 },
      overwrite: true,
    })
  }

  return (
    <SectionLink
      href={href}
      aria-current={current ? "page" : undefined}
      onPointerEnter={scramble}
      onFocus={scramble}
      className="group flex h-10 items-center text-foreground/80 transition-colors duration-200 hover:text-foreground aria-[current=page]:text-foreground"
    >
      <Tag active={current}>
        <span ref={label}>{children}</span>
      </Tag>
    </SectionLink>
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
  const router = useRouter()

  // Keep the visitor's place (same scroll position, same query) and remember
  // the choice for the next bare visit to "/". The #hash is left out on
  // purpose: it is the last section link clicked, not where the visitor is,
  // and SmoothScroll would jump back to it.
  const switchTo = (event: MouseEvent<HTMLAnchorElement>, locale: Locale) => {
    rememberLocale(locale)
    if (event.metaKey || event.ctrlKey || event.shiftKey) return
    event.preventDefault()
    router.push(`${swapLocale(pathname, locale)}${window.location.search}`, {
      scroll: false,
    })
  }

  return (
    <ul
      aria-label={label}
      className="flex items-center text-[0.8125rem] font-medium tracking-[0.08em] uppercase"
    >
      {locales.map((locale) => (
        <li key={locale}>
          <Link
            href={swapLocale(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            aria-current={locale === lang ? "true" : undefined}
            onClick={(event) => switchTo(event, locale)}
            className="grid h-10 min-w-10 place-items-center text-foreground/60 transition-colors duration-200 hover:text-foreground aria-[current=true]:text-foreground aria-[current=true]:underline aria-[current=true]:underline-offset-4"
          >
            {locale}
          </Link>
        </li>
      ))}
    </ul>
  )
}
