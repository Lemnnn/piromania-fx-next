import type { Dictionary } from "@/i18n/get-dictionary"

// From piromania.ro. Names only until the client supplies logo files.
const partners = [
  "Complex Herăstrău",
  "Solange Ballroom",
  "Salon du Mariage Săftica",
  "Ambasador Events",
  "Soul 2 Soul",
  "Eventure",
  "Brave",
  "Perfect Event",
]

export function Partners({ dict }: { dict: Dictionary["partners"] }) {
  return (
    <section aria-labelledby="partners-title" className="py-28 md:py-40">
      <h2
        id="partners-title"
        className="mx-auto max-w-[1600px] px-4 font-display text-3xl font-bold uppercase md:px-8"
      >
        {dict.title}
      </h2>

      <div className="mt-10 overflow-hidden border-y border-foreground/15 py-8">
        <div className="marquee flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center gap-16 pr-16"
            >
              {partners.map((name) => (
                <li
                  key={name}
                  className="font-display text-5xl leading-none font-bold whitespace-nowrap text-foreground/85 uppercase md:text-7xl"
                >
                  {name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-28 max-w-[1600px] px-4 md:mt-36 md:px-8">
        <h2 className="font-display text-3xl font-bold uppercase">
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
      </div>
    </section>
  )
}
