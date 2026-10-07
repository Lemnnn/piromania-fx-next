"use client"

import Image from "next/image"
import { Fragment, useEffect, useRef, useState } from "react"

import { Tag } from "@/components/shared/tag"
import { Viewfinder } from "@/components/shared/viewfinder"
import { buttonVariants } from "@/components/ui/button"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { gsap, scrambleChars, useGSAP } from "@/lib/gsap"
import { heroMedia } from "@/lib/media"
import { localeHref, siteConfig } from "@/lib/site-config"
import { SectionLink } from "@/lib/smooth-scroll"

// The logo disc's circle fills ~97% of its square image.
const DISC_FILL = 0.97
// Space between the corner marks and whatever they frame during the intro.
const MARK_GAP = 14

type HeroProps = {
  lang: Locale
  dict: Dictionary["hero"]
  quoteLabel: string
}

type Rect = { l: number; t: number; r: number; b: number }

/** clip-path leaving a centred w×h window (corner radius r) open in a W×H box. */
function windowInset(W: number, H: number, w: number, h: number, r = 0) {
  const x = Math.max(0, (W - w) / 2)
  const y = Math.max(0, (H - h) / 2)
  return `inset(${y}px ${x}px ${y}px ${x}px round ${r}px)`
}

/** The rectangle the corner marks take around a centred w×h window. */
function around(W: number, H: number, w: number, h: number): Rect {
  return {
    l: (W - w) / 2 - MARK_GAP,
    t: (H - h) / 2 - MARK_GAP,
    r: (W + w) / 2 + MARK_GAP,
    b: (H + h) / 2 + MARK_GAP,
  }
}

const pad = (n: number) => String(n).padStart(2, "0")

export function Hero({ lang, dict, quoteLabel }: HeroProps) {
  const root = useRef<HTMLElement>(null)
  // Read once per mount: Strict Mode runs effects twice in development, and
  // the first run clears the flag before the second one sees it.
  const playIntro = useRef<boolean | null>(null)
  const video = useRef<HTMLVideoElement>(null)
  const clipIndex = useRef<HTMLSpanElement>(null)
  const clipLabel = useRef<HTMLSpanElement>(null)
  const timecode = useRef<HTMLSpanElement>(null)
  // Paused by the button; the poster image then stands in for the footage.
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const section = root.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting)
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Play only while the hero is on screen and not paused. There is no
  // autoplay attribute, so nothing downloads before this first runs.
  useEffect(() => {
    const el = video.current
    if (!el) return
    if (inView && !paused) el.play().catch(() => {})
    else el.pause()
  }, [inView, paused])

  // The camera readout: which cut of the montage is playing, and a timecode.
  // Written straight to the DOM, since it changes with the video's frames.
  useEffect(() => {
    const el = video.current
    const index = clipIndex.current
    const label = clipLabel.current
    const time = timecode.current
    if (!el || !index || !label || !time) return

    let current = 0
    let second = 0
    const update = () => {
      const t = el.currentTime
      let next = 0
      heroMedia.cues.forEach((cue, i) => {
        if (t >= cue.at) next = i
      })
      if (Math.floor(t) !== second) {
        second = Math.floor(t)
        time.textContent = `00:${pad(second)}`
      }
      if (next !== current) {
        current = next
        index.textContent = pad(next + 1)
        gsap.to(label, {
          duration: 0.6,
          scrambleText: {
            text: dict.clips[heroMedia.cues[next].clip],
            chars: scrambleChars,
            speed: 0.6,
          },
          overwrite: true,
        })
      }
    }

    // Per decoded frame where supported, so the label changes on the cut.
    let handle = 0
    const onFrame = () => {
      update()
      handle = el.requestVideoFrameCallback(onFrame)
    }
    // Older Safari and Firefox lack it, whatever the DOM types say.
    const frameSync = Boolean(
      (el as Partial<HTMLVideoElement>).requestVideoFrameCallback
    )
    if (frameSync) handle = el.requestVideoFrameCallback(onFrame)
    else el.addEventListener("timeupdate", update)
    return () => {
      if (frameSync) el.cancelVideoFrameCallback(handle)
      else el.removeEventListener("timeupdate", update)
      gsap.killTweensOf(label)
    }
  }, [dict.clips])

  useGSAP(
    () => {
      const section = root.current!
      const q = gsap.utils.selector(section)

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

      const html = document.documentElement
      playIntro.current ??= html.dataset.intro === "pending"
      if (!playIntro.current) return
      // On a slow load the CSS failsafe (3 s) has already opened the frame;
      // hiding the page again to play the intro would only flash.
      const frame = section.querySelector<HTMLElement>("[data-intro-frame]")!
      if (getComputedStyle(frame).clipPath !== "inset(50%)") {
        delete html.dataset.intro
        return
      }

      // The header lives outside this component's scope, so query the document:
      // a selector string here would only search the hero.
      const header = [
        ...document.querySelectorAll<HTMLElement>("[data-header-layer]"),
      ]
      const loader = q("[data-loader]")
      const count = section.querySelector<HTMLElement>("[data-count]")
      const bar = q("[data-bar]")
      const wordmark = q("[data-wordmark]")
      const disc = section.querySelector<HTMLElement>("[data-disc]")!
      const words = q("[data-word]")
      const reveals = q("[data-reveal]")
      const marks = section.querySelector<HTMLElement>("[data-marks]")!
      const scrambles = q<HTMLElement>("[data-scramble]")

      // Measured once: the intro is too short for a resize to matter.
      const W = section.clientWidth
      const H = section.clientHeight
      const mid =
        W < 768 ? { w: W * 0.65, h: W * 0.65 } : { w: W * 0.45, h: W * 0.25 }

      // Tween the window size and rebuild the clip-path each frame. Tweening
      // the clip-path string directly breaks, because browsers normalise
      // inset(a b a b) to inset(a b) and the numbers no longer line up.
      const win = { w: 0, h: 0, r: 0 }
      const applyWindow = () => {
        frame.style.clipPath = windowInset(W, H, win.w, win.h, win.r)
      }
      // The footage first opens as a circle exactly over the logo's disc.
      const spark = disc.offsetWidth * DISC_FILL

      // Corner marks: they frame the logo, follow the window as it opens, and
      // settle on their place around the hero. Each corner is moved from its
      // final CSS position, so clearing the transforms leaves it there.
      const box = section.getBoundingClientRect()
      const end = marks.getBoundingClientRect()
      const final: Rect = {
        l: end.left - box.left,
        t: end.top - box.top,
        r: end.right - box.left,
        b: end.bottom - box.top,
      }
      const corners = (["tl", "tr", "bl", "br"] as const).map((key) => {
        const el = marks.querySelector<HTMLElement>(`[data-corner=${key}]`)!
        return {
          key,
          x: gsap.quickSetter(el, "x", "px"),
          y: gsap.quickSetter(el, "y", "px"),
          el,
        }
      })
      const mk: Rect = around(W, H, spark, spark)
      const applyMarks = () => {
        for (const corner of corners) {
          const left = corner.key[1] === "l"
          const top = corner.key[0] === "t"
          corner.x(left ? mk.l - final.l : mk.r - final.r)
          corner.y(top ? mk.t - final.t : mk.b - final.b)
        }
      }

      // Hand the hidden state from CSS to GSAP in the same frame.
      applyWindow()
      applyMarks()
      gsap.set(q("[data-intro-hide]"), { autoAlpha: 1 })
      gsap.set(marks, { autoAlpha: 0 })
      gsap.set(words, { yPercent: 130 })
      gsap.set(reveals, { autoAlpha: 0, y: 20 })
      gsap.set(wordmark, { autoAlpha: 0, scale: 0.86 })
      gsap.set(disc, { autoAlpha: 0, scale: 0.7, rotate: -40 })
      gsap.set(loader, { autoAlpha: 0 })
      gsap.set(bar, { scaleX: 0 })
      gsap.set(header, { autoAlpha: 0, y: -24 })
      delete html.dataset.intro

      const progress = { value: 0 }
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          frame.style.clipPath = ""
          gsap.set(
            corners.map((corner) => corner.el),
            { clearProps: "transform" }
          )
        },
      })

      // About 2.5 s from the first spark to the open sky; the headline lands
      // as the frame finishes opening.
      tl.to(loader, { autoAlpha: 1, duration: 0.35, ease: "power2.out" })
        .to(
          progress,
          {
            value: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count) count.textContent = `${Math.round(progress.value)}%`
            },
          },
          0
        )
        .to(bar, { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0)
        // The logo lights up in the dark, framed by the marks...
        .to(
          disc,
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.8,
            ease: "expo.out",
          },
          0.1
        )
        .to(marks, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.25)
        // ...then becomes the spark: footage opens inside the disc as it fades.
        .to(
          win,
          {
            w: spark,
            h: spark,
            r: spark / 2,
            duration: 0.55,
            ease: "expo.out",
            onUpdate: applyWindow,
          },
          0.55
        )
        .to(
          disc,
          {
            autoAlpha: 0,
            scale: 1.06,
            duration: 0.55,
            ease: "power2.out",
            // Drop it from rendering: a faded layer can linger as a ghost.
            onComplete: () => gsap.set(disc, { display: "none" }),
          },
          "<"
        )
        // The circle widens into the frame and the name rises behind it.
        .to(win, { ...mid, r: 0, duration: 0.6, onUpdate: applyWindow }, ">")
        .to(
          mk,
          {
            ...around(W, H, mid.w, mid.h),
            duration: 0.6,
            onUpdate: applyMarks,
          },
          "<"
        )
        .to(wordmark, { autoAlpha: 1, scale: 1, duration: 0.7 }, "<")
        // The whole sky; the marks settle around the hero.
        .to(win, { w: W, h: H, duration: 0.7, onUpdate: applyWindow }, ">0.1")
        .to(mk, { ...final, duration: 0.7, onUpdate: applyMarks }, "<")
        .to(
          loader,
          { autoAlpha: 0, y: 12, duration: 0.45, ease: "power2.in" },
          "<"
        )
        .to(
          words,
          { yPercent: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" },
          "-=0.4"
        )
        .to(
          reveals,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: "expo.out",
          },
          "<0.12"
        )

      // The small labels type themselves in as they appear.
      scrambles.forEach((el, i) => {
        tl.from(
          el,
          {
            duration: 0.8,
            scrambleText: { text: "", chars: scrambleChars, speed: 0.6 },
            ease: "none",
          },
          `<${i === 0 ? 0 : 0.05}`
        )
      })

      tl.to(
        header,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          clearProps: "transform",
        },
        "<"
      )

      // The clip-path is set by hand, so context.revert() won't undo it.
      return () => {
        frame.style.clipPath = ""
      }
    },
    { scope: root }
  )

  const words = dict.title.split(" ")
  const firstClip = dict.clips[heroMedia.cues[0].clip]

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
          {/* No poster attribute: the image underneath already shows that frame. */}
          <video
            ref={video}
            className="absolute inset-0 size-full object-cover"
            muted
            loop
            playsInline
            preload="none"
            aria-label={dict.videoLabel}
          >
            <source media="(max-width: 767px)" src={heroMedia.videoSmall} />
            <source src={heroMedia.video} />
          </video>
        </div>
        {/* Shade only behind the headline; elsewhere the light text inverts
            against the footage (mix-blend-difference) to stay readable. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-background via-background/45 via-30% to-transparent to-65%"
        />
      </div>

      {/* Viewfinder corners, aligned with the header's edges. */}
      <Viewfinder
        data-marks
        data-intro-hide
        className="absolute inset-x-4 top-[84px] bottom-4 z-10 md:inset-x-8 md:bottom-8"
      />

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
        <Tag className="tabular-nums">
          <span data-count>0%</span>
        </Tag>
        <span className="h-px w-full bg-foreground/20">
          <span data-bar className="block h-full origin-left bg-flame" />
        </span>
      </div>

      {/* Camera readout: the cut that is playing, a timecode, pause. */}
      <div
        data-intro-hide
        className="absolute inset-x-0 top-[108px] z-10 flex items-start justify-between gap-4 px-8 mix-blend-difference md:top-[112px] md:px-14"
      >
        <span
          data-reveal
          className="flex items-center gap-3 text-foreground/85"
        >
          <Tag active>
            <span ref={clipIndex} className="tabular-nums">
              01
            </span>
            <span className="hidden text-foreground/50 sm:inline">
              / {pad(heroMedia.cues.length)}
            </span>
          </Tag>
          <span
            ref={clipLabel}
            className="text-[0.8125rem] leading-none font-medium tracking-[0.08em] whitespace-nowrap uppercase"
          >
            {firstClip}
          </span>
        </span>
        <span data-reveal className="flex items-center gap-4">
          <span
            ref={timecode}
            aria-hidden
            className="hidden text-[0.8125rem] leading-none font-medium tracking-[0.08em] text-foreground/60 tabular-nums sm:inline"
          >
            00:00
          </span>
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-pressed={paused}
            className="group -my-3 flex py-3 text-foreground/80 transition-colors duration-200 hover:text-foreground"
          >
            <Tag active={paused}>
              {/* Phones: a symbol, so the readout fits on one line. */}
              <span aria-hidden className="sm:hidden">
                {paused ? "▶" : "II"}
              </span>
              <span className="max-sm:sr-only">
                {paused ? dict.playVideo : dict.pauseVideo}
              </span>
            </Tag>
          </button>
        </span>
      </div>

      <div
        data-intro-hide
        className="absolute inset-x-0 bottom-0 grid gap-6 px-8 pb-12 md:px-14 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-10"
      >
        <div className="flex flex-col gap-5 lg:col-span-7">
          <Tag
            data-reveal
            data-scramble
            className="text-foreground/85 mix-blend-difference"
          >
            {dict.tag}
          </Tag>
          <h1
            id="hero-title"
            className="font-display text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.86] font-extrabold tracking-[-0.01em] text-balance uppercase mix-blend-difference"
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
        </div>

        <div className="flex max-w-[30rem] flex-col gap-5 lg:col-span-4 lg:col-start-9 lg:pb-1">
          <p
            data-reveal
            className="hidden text-[0.9375rem] leading-relaxed text-pretty text-foreground/80 mix-blend-difference sm:block"
          >
            {dict.pitch}
          </p>
          <div data-reveal className="flex">
            <SectionLink
              href={localeHref(lang, siteConfig.quoteHref)}
              className={buttonVariants({ size: "lg" })}
            >
              {quoteLabel}
            </SectionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
