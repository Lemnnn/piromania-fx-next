"use client"

import Lenis from "lenis"
import "lenis/dist/lenis.css"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, type ComponentProps, type MouseEvent } from "react"

import { gsap, ScrollTrigger } from "@/lib/gsap"

// One Lenis instance for the whole app, driven by GSAP's ticker so
// ScrollTrigger and smooth scrolling stay in step.
let lenis: Lenis | null = null

export const getLenis = () => lenis

/** Length of the page-change wipe (globals.css, "Page transitions"). */
export const PAGE_TRANSITION_MS = 700

// A section on another page that a SectionLink asked for. The new page loads
// at the top, wipes in, and then glides down to it.
let pendingHash: string | null = null

export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.1,
      autoRaf: false,
      // Lenis turns every scroll the code asks for (section links) into an
      // instant jump when the OS asks for reduced motion. The site's motion
      // plays for everyone (a client decision, see PRODUCT.md), so glide.
      respectReducedMotion: false,
    })
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

  useEffect(() => {
    // From a SectionLink on another page: wait for the page wipe to finish
    // so the visitor sees where they arrived, then glide to the section.
    if (pendingHash) {
      const hash = pendingHash
      pendingHash = null
      const wait = "startViewTransition" in document ? PAGE_TRANSITION_MS : 0
      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
        history.replaceState(null, "", hash)
        scrollToTarget(hash)
      }, wait)
      return () => clearTimeout(timer)
    }

    // A full load at /ro#contact (or back/forward to one): the browser jumps
    // to the anchor before the Services pin adds its spacer, which pushes
    // every later section down. Re-measure, then land on the real position.
    const { hash } = window.location
    if (!hash) return
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      scrollToTarget(hash, { immediate: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}

function scrollToTarget(
  target: string,
  { immediate = false }: { immediate?: boolean } = {}
) {
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
    lenis.scrollTo(anchor, { duration: 1.4, immediate })
  } else {
    anchor.scrollIntoView({
      behavior: immediate ? "instant" : "smooth",
    })
  }

  // Move keyboard and screen-reader focus along with the view, as a native
  // anchor jump would.
  if (!element.hasAttribute("tabindex")) element.setAttribute("tabindex", "-1")
  element.focus({ preventScroll: true })
}

/**
 * Link that always arrives smoothly: a section of the current page glides
 * into view; a section of another page loads that page at the top (with the
 * page wipe) and then glides to it. Other links navigate normally.
 */
export function SectionLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter()

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
    if (!url.hash) return
    event.preventDefault()

    if (url.pathname === window.location.pathname) {
      history.replaceState(null, "", url.hash)
      scrollToTarget(url.hash)
      return
    }

    // Navigate without the hash, so Next.js loads the page at the top instead
    // of jumping straight to the section; SmoothScroll takes it from there.
    pendingHash = url.hash
    router.push(`${url.pathname}${url.search}`)
  }

  return <Link href={href} onClick={handleClick} {...props} />
}
