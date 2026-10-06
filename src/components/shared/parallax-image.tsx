"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useRef } from "react"

import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ParallaxImageProps = {
  src: string
  alt: string
  sizes: string
  /** Classes for the visible frame (size, aspect ratio). */
  className?: string
  /** Classes for the image itself (e.g. hover zoom). */
  imageClassName?: string
  /**
   * Travel as a percentage of the frame height, applied both ways. The image
   * layer is oversized by this much on each side so no edge ever shows.
   */
  strength?: number
}

/** An image that drifts against the scroll inside its frame. */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  strength = 10,
}: ParallaxImageProps) {
  const frame = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // The layer is (100 + 2 * strength)% of the frame, so moving it by
      // strength / that size (in its own %) shifts it +-strength% of the frame.
      const travel = (strength / (100 + 2 * strength)) * 100
      gsap.fromTo(
        layer.current,
        { yPercent: -travel },
        {
          yPercent: travel,
          ease: "none",
          scrollTrigger: {
            trigger: frame.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      )
    },
    { scope: frame, dependencies: [strength] }
  )

  return (
    <div
      ref={frame}
      className={cn("relative overflow-hidden bg-card", className)}
    >
      <div
        ref={layer}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `-${strength}%`, bottom: `-${strength}%` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    </div>
  )
}
