import type { Dictionary } from "@/i18n/get-dictionary"
import { siteConfig } from "@/lib/site-config"

import { QuoteForm } from "./quote-form"

export function ContactSection({ dict }: { dict: Dictionary["contact"] }) {
  const { contact } = siteConfig

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto grid max-w-[1600px] gap-16 px-4 py-28 md:px-8 md:py-40 lg:grid-cols-12 lg:gap-10"
    >
      <div className="flex flex-col gap-8 lg:col-span-5">
        <h2
          id="contact-title"
          className="font-display text-[clamp(4rem,9vw,9rem)] leading-[0.9] font-extrabold uppercase"
        >
          {dict.title}
        </h2>
        <p className="max-w-[36ch] text-xl text-foreground/80">{dict.intro}</p>

        <div className="mt-auto flex flex-col gap-2 border-t border-foreground/20 pt-6">
          <p className="text-foreground/70">
            {dict.direct}, {contact.person}
          </p>
          <a
            href={contact.phoneHref}
            className="w-fit font-display text-5xl leading-none font-bold transition-colors duration-200 hover:text-flame"
          >
            {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="mt-2 w-fit text-lg underline decoration-foreground/40 underline-offset-[6px] transition-colors duration-200 hover:decoration-flame"
          >
            {contact.email}
          </a>
        </div>
      </div>

      <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
        <QuoteForm dict={dict} />
      </div>
    </section>
  )
}
