"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useRef } from "react"

import type { Dictionary } from "@/i18n/get-dictionary"
import { photos } from "@/lib/media"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const order = ["exterior", "interior", "ground", "effects"] as const

export function Services({ dict }: { dict: Dictionary["services"] }) {
  const root = useRef<HTMLElement>(null)

  // Desktop: the section pins and the four panels pan sideways with scroll.
  // Below lg the panels simply stack.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(min-width: 1024px)", () => {
        const section = root.current!
        const track = section.querySelector<HTMLElement>("[data-track]")!
        const distance = () => track.scrollWidth - window.innerWidth

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      })
    },
    { scope: root }
  )

  return (
    <section
      id="services"
      ref={root}
      aria-labelledby="services-title"
      className="relative lg:h-[100dvh] lg:overflow-hidden"
    >
      <div
        data-track
        className="flex flex-col gap-20 px-4 py-24 md:px-8 lg:h-full lg:w-max lg:flex-row lg:gap-10 lg:pt-[104px] lg:pb-10"
      >
        <header className="flex flex-col justify-end gap-6 lg:w-[30vw] lg:shrink-0 lg:pb-2">
          <h2
            id="services-title"
            className="font-display text-[clamp(4rem,9vw,9rem)] leading-[0.9] font-extrabold uppercase"
          >
            {dict.title}
          </h2>
          <p className="max-w-[26ch] text-xl text-foreground/80">
            {dict.intro}
          </p>
        </header>

        {order.map((key) => {
          const item = dict.items[key]
          return (
            <article
              key={key}
              className="flex flex-col gap-6 lg:w-[60vw] lg:shrink-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-card lg:aspect-auto lg:flex-1">
                <Image
                  src={photos[key].src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  // Off-screen sideways in the pinned track; lazy loading pops in late.
                  loading="eager"
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-10">
                <h3 className="font-display text-5xl leading-[0.9] font-bold uppercase md:text-6xl">
                  {item.title}
                </h3>
                <p className="max-w-[46ch] text-lg text-foreground/80">
                  {item.text}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
