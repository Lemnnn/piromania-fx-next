"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ReactNode } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ParallaxBlockProps = {
  children: ReactNode
  className?: string
  /** Vertical travel in px each way: starts `distance` low, ends `distance` high. */
  distance: number
  /** Media query the effect runs under (default: desktop layouts). */
  media?: string
}

/**
 * Moves a whole block up as the page scrolls, at its own speed. Blocks with
 * different distances drift past each other. The parent is the trigger, so
 * the moving block never affects its own start and end points.
 */
export function ParallaxBlock({
  children,
  className,
  distance,
  media = "(min-width: 1024px)",
}: ParallaxBlockProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current!
      const mm = gsap.matchMedia()
      mm.add(media, () => {
        gsap.fromTo(
          el,
          { y: distance },
          {
            y: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      })
    },
    { scope: ref, dependencies: [distance, media] }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
