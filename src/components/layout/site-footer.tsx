import Image from "next/image"
import Link from "next/link"

import { ContactLinks } from "@/components/shared/contact-links"
import { CurrentYear } from "@/components/shared/current-year"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { localeHref, siteConfig } from "@/lib/site-config"
import { SectionLink } from "@/lib/smooth-scroll"

type SiteFooterProps = {
  lang: Locale
  dict: Dictionary
}

export function SiteFooter({ lang, dict }: SiteFooterProps) {
  return (
    <footer className="overflow-hidden border-t border-foreground/15">
      <div className="container-page flex flex-col gap-16 pt-16 md:pt-24">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <ContactLinks phoneClassName="text-4xl" />
          </div>

          <nav aria-label={dict.nav.label}>
            <ul className="flex flex-col gap-2 text-lg">
              {siteConfig.nav.map((item) => (
                <li key={item.key}>
                  <SectionLink
                    href={localeHref(lang, item.href)}
                    className="text-foreground/80 transition-colors duration-200 hover:text-foreground"
                  >
                    {dict.nav[item.key]}
                  </SectionLink>
                </li>
              ))}
              <li>
                <SectionLink
                  href={localeHref(lang, siteConfig.quoteHref)}
                  className="text-flame transition-colors duration-200 hover:text-foreground"
                >
                  {dict.nav.quote}
                </SectionLink>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col gap-3 text-foreground/60 md:items-end md:text-right">
            <p>
              © <CurrentYear buildYear={new Date().getFullYear()} />{" "}
              {siteConfig.company}
              <br />
              {dict.footer.rights}
            </p>
            <Link
              href={localeHref(lang, siteConfig.privacyHref)}
              className="w-fit underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
            >
              {dict.footer.privacy}
            </Link>
          </div>
        </div>

        {/* The brand wordmark as the page's closing image; the company name
            is already in the text above, so this is decorative. */}
        <Image
          src="/brand/wordmark.svg"
          alt=""
          aria-hidden
          width={1600}
          height={192}
          unoptimized
          className="mb-6 h-auto w-full select-none md:mb-10"
        />
      </div>
    </footer>
  )
}
