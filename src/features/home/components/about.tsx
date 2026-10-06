"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

import type { Dictionary } from "@/i18n/get-dictionary"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function About({ dict }: { dict: Dictionary["about"] }) {
  const root = useRef<HTMLElement>(null)

  // The statement lights up word by word as it scrolls through the viewport.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.fromTo(
        q("[data-word]"),
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: q("[data-statement]")[0],
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
          },
        }
      )
    },
    { scope: root }
  )

  return (
    <section
      id="about"
      ref={root}
      aria-labelledby="about-title"
      className="mx-auto max-w-[1600px] scroll-mt-0 px-4 py-28 md:px-8 md:py-44"
    >
      <h2 id="about-title" className="sr-only">
        {dict.title}
      </h2>
      <p
        data-statement
        className="max-w-[24ch] font-display text-[clamp(2.5rem,5.4vw,5.75rem)] leading-[0.98] font-bold tracking-[-0.01em] text-balance"
      >
        {dict.statement.split(" ").map((word, i) => (
          <span key={i} data-word>
            {word}{" "}
          </span>
        ))}
      </p>

      <ul className="mt-24 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-32 lg:grid-cols-4">
        {dict.facts.map((fact) => (
          <li key={fact.title} className="border-t border-foreground/20 pt-6">
            <h3 className="font-display text-3xl leading-none font-bold uppercase">
              {fact.title}
            </h3>
            <p className="mt-4 max-w-[30ch] text-foreground/75">{fact.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
