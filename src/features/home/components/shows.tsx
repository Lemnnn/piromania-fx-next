import type { Dictionary } from "@/i18n/get-dictionary"
import { photos } from "@/lib/media"

import { ShowPanels } from "./show-panels"

const order = ["weddings", "corporate", "cities"] as const

export function Shows({ dict }: { dict: Dictionary["shows"] }) {
  const panels = order.map((key) => ({
    key,
    title: dict.items[key].title,
    text: dict.items[key].text,
    src: photos[key].src,
  }))

  return (
    <section id="shows" aria-labelledby="shows-title">
      <div className="container-page flex flex-col gap-4 pt-28 pb-14 md:pt-40 md:pb-20">
        <h2 id="shows-title" className="heading-section">
          {dict.title}
        </h2>
        <p className="text-xl text-foreground/80">{dict.intro}</p>
      </div>
      <ShowPanels panels={panels} label={dict.title} />
    </section>
  )
}
