"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import Link from "next/link"
import { useEffect, type ComponentProps, type MouseEvent } from "react"

gsap.registerPlugin(ScrollTrigger)

// One Lenis instance for the whole app, driven by GSAP's ticker so
// ScrollTrigger and smooth scrolling stay in step.
let lenis: Lenis | null = null

export const getLenis = () => lenis

export function SmoothScroll() {
  useEffect(() => {
    const instance = new Lenis({ lerp: 0.1, autoRaf: false })
    instance.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenis = instance
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [])

  return null
}

export function scrollToTarget(target: string) {
  const element = document.querySelector<HTMLElement>(target)
  if (!element) return
  // A pinned section sits inside ScrollTrigger's spacer and is offset once the
  // pin has played; the spacer's top is where the section actually starts.
  const parent = element.parentElement
  const anchor = parent?.classList.contains("pin-spacer") ? parent : element

  if (lenis) {
    // The menu stops Lenis while open; restart it first, because start()
    // resets Lenis and would cancel a scroll that is already running.
    if (lenis.isStopped) lenis.start()
    lenis.scrollTo(anchor, { duration: 1.4 })
  } else {
    anchor.scrollIntoView({ behavior: "smooth" })
  }
}

/**
 * Link that smooth-scrolls when it points at a section of the current page,
 * and navigates normally otherwise.
 */
export function SectionLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey
    )
      return
    const url = new URL(href, window.location.href)
    if (!url.hash || url.pathname !== window.location.pathname) return
    event.preventDefault()
    history.replaceState(null, "", url.hash)
    scrollToTarget(url.hash)
  }

  return <Link href={href} onClick={handleClick} {...props} />
}
