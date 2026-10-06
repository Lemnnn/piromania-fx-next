import { ParallaxBlock } from "@/components/shared/parallax-block"
import { ParallaxImage } from "@/components/shared/parallax-image"
import type { Dictionary } from "@/i18n/get-dictionary"
import { photos } from "@/lib/media"

const tiles = [
  {
    key: "weddings",
    className: "lg:col-span-7 lg:row-span-2",
    media: "aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[640px]",
    sizes: "(min-width: 1024px) 58vw, 100vw",
    strength: 24,
    travel: 60,
  },
  {
    key: "corporate",
    className: "lg:col-span-5",
    media: "aspect-[16/10]",
    sizes: "(min-width: 1024px) 42vw, 100vw",
    strength: 18,
    travel: 170,
  },
  {
    key: "cities",
    className: "lg:col-span-5",
    media: "aspect-[16/10]",
    sizes: "(min-width: 1024px) 42vw, 100vw",
    strength: 20,
    travel: 170,
  },
] as const

export function Shows({ dict }: { dict: Dictionary["shows"] }) {
  return (
    <section
      id="shows"
      aria-labelledby="shows-title"
      className="mx-auto max-w-[1600px] px-4 py-28 md:px-8 md:py-40"
    >
      <div className="mb-14 flex flex-col gap-4 md:mb-20">
        <h2
          id="shows-title"
          className="font-display text-[clamp(4rem,9vw,9rem)] leading-[0.9] font-extrabold uppercase"
        >
          {dict.title}
        </h2>
        <p className="text-xl text-foreground/80">{dict.intro}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-x-10 lg:gap-y-12">
        {tiles.map((tile) => {
          const item = dict.items[tile.key]
          return (
            // Whole tiles move up at different speeds on desktop, so the
            // columns slide past each other; the photo also drifts in its frame.
            <ParallaxBlock
              key={tile.key}
              distance={tile.travel}
              className={tile.className}
            >
              <article className="flex h-full flex-col gap-5">
                <ParallaxImage
                  src={photos[tile.key].src}
                  alt=""
                  sizes={tile.sizes}
                  strength={tile.strength}
                  className={tile.media}
                />
                <div>
                  <h3 className="font-display text-4xl leading-none font-bold uppercase md:text-5xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[42ch] text-lg text-foreground/75">
                    {item.text}
                  </p>
                </div>
              </article>
            </ParallaxBlock>
          )
        })}
      </div>
    </section>
  )
}
