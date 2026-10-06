import Image from "next/image"

import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { SectionLink } from "@/lib/smooth-scroll"
import { localeHref, siteConfig } from "@/lib/site-config"

type SiteFooterProps = {
  lang: Locale
  dict: Dictionary
}

export function SiteFooter({ lang, dict }: SiteFooterProps) {
  const { contact } = siteConfig

  return (
    <footer className="overflow-hidden border-t border-foreground/15">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-16 px-4 pt-16 md:px-8 md:pt-24">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <a
              href={contact.phoneHref}
              className="w-fit font-display text-4xl leading-none font-bold transition-colors duration-200 hover:text-flame"
            >
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="w-fit text-lg underline decoration-foreground/40 underline-offset-[6px] transition-colors duration-200 hover:decoration-flame"
            >
              {contact.email}
            </a>
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

          <p className="text-foreground/60 md:text-right">
            © {new Date().getFullYear()} {siteConfig.company}
            <br />
            {dict.footer.rights}
          </p>
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
