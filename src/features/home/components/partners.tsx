import Image from "next/image"
import type { CSSProperties } from "react"

import { Marquee } from "@/components/shared/marquee"
import type { Dictionary } from "@/i18n/get-dictionary"

import { partners } from "../data"

export function Partners({ dict }: { dict: Dictionary["partners"] }) {
  return (
    <section aria-labelledby="partners-title" className="pt-28 md:pt-40">
      <h2
        id="partners-title"
        className="container-page font-display text-3xl font-bold uppercase"
      >
        {dict.title}
      </h2>

      <div className="mt-10">
        <Marquee>
          <ul className="flex items-center gap-20 pr-20 md:gap-28 md:pr-28">
            {partners.map((partner) => (
              <li key={partner.logo} className="shrink-0">
                <Image
                  src={`/partners/${partner.logo}.png`}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  // Per-logo height (see data.ts); 70% of it on phones.
                  style={
                    { "--logo-h": `${partner.display}px` } as CSSProperties
                  }
                  className="h-[calc(var(--logo-h)*0.7)] w-auto opacity-85 md:h-(--logo-h)"
                />
              </li>
            ))}
          </ul>
        </Marquee>
      </div>
    </section>
  )
}

export function Testimonials({ dict }: { dict: Dictionary["partners"] }) {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="container-page pt-24 pb-28 md:pt-32 md:pb-40"
    >
      <h2
        id="testimonials-title"
        className="font-display text-3xl font-bold uppercase"
      >
        {dict.testimonialsTitle}
      </h2>
      <div className="mt-10 grid gap-14 lg:grid-cols-2 lg:gap-10">
        {dict.testimonials.map((item) => (
          <figure key={item.author} className="flex flex-col gap-6">
            <blockquote className="max-w-[24ch] font-display text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02] font-semibold text-balance">
              “{item.quote}”
            </blockquote>
            <figcaption className="text-foreground/70">
              {item.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
