"use client"

// Adapted from React Bits' StaggeredMenu (https://reactbits.dev): same layered
// slide-in, rebuilt with useGSAP, Next links, a body portal and keyboard support.

import { usePathname } from "next/navigation"
import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"

import { gsap, useGSAP } from "@/lib/gsap"
import { getLenis, SectionLink } from "@/lib/smooth-scroll"

import "./staggered-menu.css"

type StaggeredMenuProps = {
  items: { label: string; href: string }[]
  labels: {
    menu: string
    close: string
    openMenu: string
    closeMenu: string
    nav: string
  }
  /** Rendered at the bottom of the panel; its children reveal in sequence. */
  footer?: ReactNode
}

// Colours of the layers that sweep in ahead of the panel.
const layerColors = ["var(--flame)", "var(--burgundy)"]

const noopSubscribe = () => () => {}

const getLayers = (root: HTMLElement | null) =>
  gsap.utils.toArray<HTMLElement>(".sm-layer", root)

export function StaggeredMenu({ items, labels, footer }: StaggeredMenuProps) {
  const pathname = usePathname()
  const panelId = useId()
  // false during SSR, true in the browser: the portal needs document.body.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
  const [open, setOpen] = useState(false)
  // Until the first toggle the label shows a single "Menu" line.
  const [rolled, setRolled] = useState(false)

  const toggleRef = useRef<HTMLButtonElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const textInnerRef = useRef<HTMLSpanElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  // Park the layers and panel off-screen once the portal exists.
  const { contextSafe } = useGSAP(
    () => {
      const panel = panelRef.current
      if (!panel) return
      gsap.set([...getLayers(overlayRef.current), panel], {
        xPercent: 100,
        opacity: 1,
      })
    },
    { dependencies: [mounted] }
  )

  // Tweens made inside contextSafe belong to the useGSAP context, so they are
  // reverted on unmount; overwrite lets a new toggle take over mid-animation.
  const animate = (opening: boolean) =>
    contextSafe(() => {
      const panel = panelRef.current
      if (!panel) return
      const layers = getLayers(overlayRef.current)

      gsap.to(iconRef.current, {
        rotate: opening ? 225 : 0,
        duration: opening ? 0.8 : 0.35,
        ease: opening ? "power4.out" : "power3.inOut",
        overwrite: true,
      })

      // The label rolls through Menu/Close a few times before it settles.
      gsap.fromTo(
        textInnerRef.current,
        { yPercent: 0 },
        { yPercent: -75, duration: 0.78, ease: "power4.out", overwrite: true }
      )

      if (!opening) {
        gsap.to([...layers, panel], {
          xPercent: 100,
          duration: 0.32,
          ease: "power3.in",
          overwrite: true,
        })
        return
      }

      const itemLabels = panel.querySelectorAll(".sm-item-label")
      const reveals = panel.querySelectorAll(".sm-footer > *")
      gsap.set(itemLabels, { yPercent: 140, rotate: 10 })
      gsap.set(reveals, { y: 24, autoAlpha: 0 })

      const tl = gsap.timeline()
      layers.forEach((el, i) => {
        tl.to(
          el,
          { xPercent: 0, duration: 0.5, ease: "power4.out", overwrite: true },
          i * 0.07
        )
      })
      const panelAt = Math.max(0, layers.length - 1) * 0.07 + 0.08
      tl.to(
        panel,
        { xPercent: 0, duration: 0.65, ease: "power4.out", overwrite: true },
        panelAt
      )
        .to(
          itemLabels,
          {
            yPercent: 0,
            rotate: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.1,
          },
          panelAt + 0.1
        )
        .to(
          reveals,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.08,
          },
          panelAt + 0.26
        )
    })()

  const setMenu = (next: boolean) => {
    if (next === open) return
    setOpen(next)
    setRolled(true)
    animate(next)
  }
  // For effects and document listeners: always sees the current state.
  const closeMenu = useEffectEvent(() => setMenu(false))

  // Close on route change, e.g. browser back/forward while open. Links inside
  // the panel close it themselves.
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    closeMenu()
  }, [pathname])

  useEffect(() => {
    if (!open) return
    // The panel sits at the end of <body>, so move focus into it explicitly.
    panelRef.current
      ?.querySelector<HTMLElement>(".sm-item")
      ?.focus({ preventScroll: true })

    // Everything behind the panel goes inert, so Tab moves only between the
    // header (with the toggle) and the panel, and screen readers skip the page.
    const background = [
      ...document.querySelectorAll<HTMLElement>("body > *"),
    ].filter(
      (el) =>
        el !== overlayRef.current &&
        !el.hasAttribute("data-site-header") &&
        !el.inert
    )
    background.forEach((el) => (el.inert = true))

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      closeMenu()
      toggleRef.current?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (toggleRef.current?.contains(target)) return
      closeMenu()
    }
    const root = document.documentElement
    root.style.overflow = "hidden"
    getLenis()?.stop()
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      background.forEach((el) => (el.inert = false))
      root.style.overflow = ""
      // A section link may already have restarted it to scroll.
      const lenis = getLenis()
      if (lenis?.isStopped) lenis.start()
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  // After a toggle, four lines the label rolls through to the new state.
  const textLines = !rolled
    ? [labels.menu]
    : open
      ? [labels.menu, labels.close, labels.menu, labels.close]
      : [labels.close, labels.menu, labels.close, labels.menu]

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="sm-toggle"
        aria-label={open ? labels.closeMenu : labels.openMenu}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setMenu(!open)}
      >
        <span className="sm-toggle-textWrap" aria-hidden>
          <span ref={textInnerRef} className="sm-toggle-textInner">
            {textLines.map((line, i) => (
              <span className="sm-toggle-line" key={i}>
                {line}
              </span>
            ))}
          </span>
        </span>
        <span ref={iconRef} className="sm-icon" aria-hidden>
          <span className="sm-icon-line" />
          <span className="sm-icon-line sm-icon-line-v" />
        </span>
      </button>

      {mounted
        ? createPortal(
            <div
              ref={overlayRef}
              className="sm-overlay"
              data-open={open || undefined}
            >
              <div className="sm-layers" aria-hidden>
                {layerColors.map((color) => (
                  <div
                    key={color}
                    className="sm-layer"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <nav
                id={panelId}
                ref={panelRef}
                className="sm-panel"
                aria-label={labels.nav}
                inert={!open}
                // Any link inside the panel (items, phone, quote) closes it.
                onClick={(event) => {
                  if ((event.target as Element).closest("a")) setMenu(false)
                }}
              >
                <ul className="sm-list">
                  {items.map((item) => (
                    <li key={item.href} className="sm-item-wrap">
                      <SectionLink
                        href={item.href}
                        className="sm-item"
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                      >
                        <span className="sm-item-label">{item.label}</span>
                      </SectionLink>
                    </li>
                  ))}
                </ul>
                {footer ? <div className="sm-footer">{footer}</div> : null}
              </nav>
            </div>,
            document.body
          )
        : null}
    </>
  )
}
