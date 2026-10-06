"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { Fragment, useEffect, useRef } from "react"

import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { heroMedia } from "@/lib/media"
import { localeHref, siteConfig } from "@/lib/site-config"
import { SectionLink } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// The logo disc's circle fills ~97% of its square image.
const DISC_FILL = 0.97

type HeroProps = {
  lang: Locale
  dict: Dictionary["hero"]
  quoteLabel: string
}

/** clip-path leaving a centred w×h window (corner radius r) open in the hero. */
function windowInset(root: HTMLElement, w: number, h: number, r = 0) {
  const x = Math.max(0, (root.clientWidth - w) / 2)
  const y = Math.max(0, (root.clientHeight - h) / 2)
  return `inset(${y}px ${x}px ${y}px ${x}px round ${r}px)`
}

export function Hero({ lang, dict, quoteLabel }: HeroProps) {
  const root = useRef<HTMLElement>(null)
  // Read once per mount: Strict Mode runs effects twice in development, and
  // the first run clears the flag before the second one sees it.
  const playIntro = useRef<boolean | null>(null)
  const video = useRef<HTMLVideoElement>(null)

  // Stop decoding the footage while the hero is scrolled out of view.
  useEffect(() => {
    const section = root.current
    const el = video.current
    if (!section || !el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {})
      else el.pause()
    })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useGSAP(
    () => {
      const section = root.current!
      const q = gsap.utils.selector(section)

      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(q("[data-media]"), {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      })

      const html = document.documentElement
      playIntro.current ??= html.dataset.intro === "pending"
      if (!playIntro.current) return

      const header = document.querySelector<HTMLElement>("[data-site-header]")
      const frame = section.querySelector<HTMLElement>("[data-intro-frame]")!
      const loader = q("[data-loader]")
      const count = section.querySelector<HTMLElement>("[data-count]")
      const bar = q("[data-bar]")
      const wordmark = q("[data-wordmark]")
      const disc = section.querySelector<HTMLElement>("[data-disc]")!
      const words = q("[data-word]")
      const reveals = q("[data-reveal]")

      const w = section.clientWidth
      const narrow = w < 768
      const mid = narrow
        ? { w: w * 0.65, h: w * 0.65 }
        : { w: w * 0.45, h: w * 0.25 }

      // Tween the window size and rebuild the clip-path each frame. Tweening
      // the clip-path string directly breaks, because browsers normalise
      // inset(a b a b) to inset(a b) and the numbers no longer line up.
      const win = { w: 0, h: 0, r: 0 }
      const applyWindow = () => {
        frame.style.clipPath = windowInset(section, win.w, win.h, win.r)
      }
      // The footage first opens as a circle exactly over the logo's disc.
      const spark = disc.offsetWidth * DISC_FILL

      // Hand the hidden state from CSS to GSAP in the same frame.
      applyWindow()
      gsap.set(q("[data-intro-hide]"), { autoAlpha: 1 })
      gsap.set(words, { yPercent: 130 })
      gsap.set(reveals, { autoAlpha: 0, y: 20 })
      gsap.set(wordmark, { autoAlpha: 0, scale: 0.86, filter: "blur(12px)" })
      gsap.set(disc, { autoAlpha: 0, scale: 0.7, rotate: -40 })
      gsap.set(loader, { autoAlpha: 0 })
      gsap.set(bar, { scaleX: 0 })
      if (header) gsap.set(header, { autoAlpha: 0, y: -24 })
      delete html.dataset.intro

      const progress = { value: 0 }
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          frame.style.clipPath = ""
        },
      })

      tl.to(loader, { autoAlpha: 1, duration: 0.5, ease: "power2.out" })
        .to(
          progress,
          {
            value: 100,
            duration: 2.2,
            ease: "power2.inOut",
            onUpdate: () => {
              const value = Math.round(progress.value)
              if (count) count.textContent = `${value}%`
              gsap.set(bar, { scaleX: value / 100 })
            },
          },
          0
        )
        // The logo lights up in the dark...
        .to(
          disc,
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            ease: "expo.out",
          },
          0.1
        )
        // ...then becomes the spark: footage opens inside the disc as it fades.
        .to(
          win,
          {
            w: spark,
            h: spark,
            r: spark / 2,
            duration: 0.6,
            ease: "expo.out",
            onUpdate: applyWindow,
          },
          1.05
        )
        .to(
          disc,
          {
            autoAlpha: 0,
            scale: 1.06,
            duration: 0.6,
            ease: "power2.out",
            // Drop it from rendering: a faded layer can linger as a ghost.
            onComplete: () => gsap.set(disc, { display: "none" }),
          },
          "<"
        )
        // The circle widens into the frame and the name rises behind it.
        .to(
          win,
          { ...mid, r: 0, duration: 0.95, onUpdate: applyWindow },
          ">0.15"
        )
        .to(
          wordmark,
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.95 },
          "<"
        )
        // The whole sky.
        .to(
          win,
          {
            w: section.clientWidth,
            h: section.clientHeight,
            duration: 0.95,
            onUpdate: applyWindow,
          },
          ">0.25"
        )
        .to(
          loader,
          { autoAlpha: 0, y: 12, duration: 0.5, ease: "power2.in" },
          "<"
        )
        .to(
          words,
          { yPercent: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" },
          "-=0.25"
        )
        .to(
          reveals,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "expo.out",
          },
          "<0.15"
        )

      if (header) {
        tl.to(
          header,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            clearProps: "transform",
          },
          "<"
        )
      }

      // The clip-path is set by hand, so context.revert() won't undo it.
      return () => {
        frame.style.clipPath = ""
      }
    },
    { scope: root }
  )

  const words = dict.title.split(" ")

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate h-[100dvh] min-h-[600px] overflow-hidden"
    >
      <div
        data-wordmark
        data-intro-hide
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid place-items-center overflow-hidden"
      >
        <Image
          src="/brand/wordmark.svg"
          alt=""
          width={1600}
          height={192}
          unoptimized
          className="h-auto w-[84vw] max-w-none"
        />
      </div>

      {/* Own GPU layer: without it Chromium leaves a stale, darker circle
          where the spark-sized clip was while the frame grows. */}
      <div
        data-intro-frame
        className="absolute inset-0 [transform:translateZ(0)] overflow-hidden"
      >
        <div data-media className="absolute inset-x-0 -inset-y-[8%]">
          <Image
            src={heroMedia.poster}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <video
            ref={video}
            className="absolute inset-0 size-full object-cover"
            src={heroMedia.video}
            poster={heroMedia.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={dict.videoLabel}
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-background via-background/55 via-40% to-background/30 to-100%"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
      >
        <Image
          data-disc
          src="/brand/mark.svg"
          alt=""
          width={112}
          height={112}
          preload
          unoptimized
          className="invisible size-22 opacity-0 md:size-28"
        />
      </div>

      <div
        data-loader
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 bottom-[14%] mx-auto flex w-40 flex-col items-center gap-3 opacity-0"
      >
        <span
          data-count
          className="font-display text-2xl leading-none font-semibold tabular-nums"
        >
          0%
        </span>
        <span className="h-px w-full bg-foreground/20">
          <span data-bar className="block h-full origin-left bg-flame" />
        </span>
      </div>

      <div
        data-intro-hide
        className="absolute inset-x-0 bottom-0 mx-auto grid max-w-[1600px] gap-8 px-4 pb-10 md:px-8 md:pb-14 lg:grid-cols-12 lg:items-end lg:gap-10"
      >
        <h1
          id="hero-title"
          className="font-display text-[clamp(4.25rem,12vw,10.5rem)] leading-[0.84] font-extrabold tracking-[-0.01em] text-balance uppercase lg:col-span-8"
        >
          {words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 ? " " : null}
              <span className="inline-block overflow-hidden pb-[0.04em] align-bottom">
                <span data-word className="inline-block">
                  {word}
                </span>
              </span>
            </Fragment>
          ))}
        </h1>

        <div className="flex max-w-[34rem] flex-col gap-6 lg:col-span-4 lg:pb-3">
          <p
            data-reveal
            className="text-lg leading-relaxed text-pretty text-foreground/85"
          >
            {dict.pitch}
          </p>
          <div
            data-reveal
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <SectionLink
              href={localeHref(lang, siteConfig.quoteHref)}
              className={cn(buttonVariants(), "h-12 px-7 text-base")}
            >
              {quoteLabel}
            </SectionLink>
            <Link
              href={`/${lang}/packages`}
              className="text-base underline decoration-foreground/40 underline-offset-[6px] transition-colors duration-200 hover:decoration-flame"
            >
              {dict.packages}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
