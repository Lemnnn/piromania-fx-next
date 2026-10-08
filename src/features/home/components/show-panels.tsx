"use client"

import Image from "next/image"
import { useRef } from "react"

import { Tag } from "@/components/shared/tag"
import { Viewfinder } from "@/components/shared/viewfinder"
import { desktop, gsap, useGSAP } from "@/lib/gsap"

export type ShowPanel = {
  key: string
  title: string
  text: string
  src: string
}

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * Full-screen photo panels that stack: each sticks to the top (CSS sticky,
 * which the browser keeps in place on the compositor, so it never jumps) while
 * the next slides up over it, shrinking and dimming as it is covered. The
 * photo inside travels against the scroll the whole time.
 */
export function ShowPanels({
  panels,
  label,
}: {
  panels: ShowPanel[]
  /** Section name shown on each panel ("Spectacole"). */
  label: string
}) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const container = root.current!
      const items = gsap.utils.toArray<HTMLElement>("[data-panel]")
      // The panels are sticky, so their own position changes as they stick.
      // Every trigger is measured from the container instead: panel i starts
      // i panel-heights below its top.
      const height = () => items[0].offsetHeight
      const at = (i: number, viewport: string) => () =>
        `top+=${i * height()} ${viewport}`
      const mm = gsap.matchMedia()

      items.forEach((panel, i) => {
        const media = panel.querySelector("[data-panel-media]")
        const inner = panel.querySelector("[data-panel-inner]")
        const shade = panel.querySelector("[data-panel-shade]")

        // As the next panel slides over this one, it shrinks and dims.
        if (i < items.length - 1) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: container,
                start: at(i + 1, "bottom"),
                end: at(i + 1, "top"),
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .to(inner, { scale: 0.9, ease: "none" }, 0)
            .to(shade, { opacity: 0.75, ease: "none" }, 0)
        }

        // From the moment the panel enters until it is covered (or, for the
        // last one, scrolled away): two panel-heights of travel. Desktop only:
        // on phones it means four oversized full-screen layers in GPU memory.
        mm.add(desktop, () => {
          gsap.fromTo(
            media,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: at(i, "bottom"),
                end: () => `+=${height() * 2}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          )
        })

        // Plays once: hiding and replaying it on the way back up reads as a flicker.
        gsap.from(panel.querySelectorAll("[data-panel-reveal]"), {
          yPercent: 30,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: container,
            start: at(i, "55%"),
            once: true,
            invalidateOnRefresh: true,
          },
        })
      })
    },
    { scope: root }
  )

  return (
    <div ref={root}>
      {panels.map((panel, i) => (
        <article
          key={panel.key}
          data-panel
          aria-labelledby={`show-${panel.key}`}
          // Later panels paint over the ones stuck beneath them.
          style={{ zIndex: i + 1 }}
          className="sticky top-0 h-[100dvh] min-h-[560px] overflow-hidden bg-background"
        >
          <div
            data-panel-inner
            className="absolute inset-0 overflow-hidden will-change-transform"
          >
            {/* Desktop: oversized by 14% each way; the ±10% travel never shows
                an edge. Phones have no travel. */}
            <div
              data-panel-media
              className="absolute inset-0 lg:-inset-y-[14%] lg:will-change-transform"
            >
              <Image
                src={panel.src}
                alt=""
                fill
                sizes="100vw"
                // Fetched ahead, at low priority, so a panel never arrives
                // black while its photo is still loading.
                loading="eager"
                fetchPriority="low"
                className="object-cover"
              />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-background/90 via-background/25 via-45% to-transparent"
            />
            {/* Text here is not blended (the card scales as you scroll, and
                re-blending a full-screen layer every frame drops frames), so a
                light shade keeps the top labels readable on bright photos. */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-background/55 to-transparent"
            />
            <div
              data-panel-shade
              aria-hidden
              className="absolute inset-0 bg-background opacity-0"
            />

            {/* Same frame as the hero: below the header, at its edges. */}
            <Viewfinder
              blend={false}
              className="absolute inset-x-4 top-[84px] bottom-4 md:inset-x-8 md:bottom-8"
            />

            <div className="absolute inset-x-0 top-[108px] flex items-center justify-between px-8 md:top-[112px] md:px-14">
              <Tag active>
                <span className="tabular-nums">{pad(i + 1)}</span>
                <span className="text-foreground/50">
                  / {pad(panels.length)}
                </span>
              </Tag>
              <Tag className="text-foreground/80">{label}</Tag>
            </div>

            <div className="absolute inset-x-0 bottom-0 grid gap-5 px-8 pb-12 md:px-14 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
              <h3
                id={`show-${panel.key}`}
                data-panel-reveal
                className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.88] font-extrabold text-balance uppercase lg:col-span-8"
              >
                {panel.title}
              </h3>
              <p
                data-panel-reveal
                className="max-w-[34ch] text-lg text-foreground/85 lg:col-span-4 lg:pb-2"
              >
                {panel.text}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
