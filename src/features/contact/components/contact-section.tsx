import { ContactLinks } from "@/components/shared/contact-links"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { siteConfig } from "@/lib/site-config"

import { QuoteForm } from "./quote-form"

export function ContactSection({
  lang,
  dict,
}: {
  lang: Locale
  dict: Dictionary["contact"]
}) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="container-page grid gap-16 py-28 md:py-40 lg:grid-cols-12 lg:gap-10"
    >
      <div className="flex flex-col gap-8 lg:col-span-5">
        <h2 id="contact-title" className="heading-section">
          {dict.title}
        </h2>
        <p className="max-w-[36ch] text-xl text-foreground/80">{dict.intro}</p>

        <div className="mt-auto flex flex-col gap-2 border-t border-foreground/20 pt-6">
          <p className="text-foreground/70">
            {dict.direct}, {siteConfig.contact.person}
          </p>
          <ContactLinks phoneClassName="text-5xl" emailClassName="mt-2" />
        </div>
      </div>

      <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
        <QuoteForm lang={lang} dict={dict} />
      </div>
    </section>
  )
}
