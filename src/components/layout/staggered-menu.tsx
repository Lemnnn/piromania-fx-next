"use client"

// Adapted from React Bits' StaggeredMenu (https://reactbits.dev): same layered
// slide-in, rebuilt with useGSAP, Next links, a body portal and keyboard support.

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { usePathname } from "next/navigation"
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"

import { getLenis, SectionLink } from "@/lib/smooth-scroll"

import "./staggered-menu.css"

gsap.registerPlugin(useGSAP)

export type StaggeredMenuItem = { label: string; href: string }

type StaggeredMenuProps = {
  items: StaggeredMenuItem[]
  labels: {
    menu: string
    close: string
    openMenu: string
    closeMenu: string
    nav: string
  }
  /** Rendered at the bottom of the panel; its children reveal in sequence. */
  footer?: ReactNode
  /** Colours of the layers that sweep in ahead of the panel. */
  layerColors?: string[]
}

const noopSubscribe = () => () => {}

const getLayers = (root: HTMLElement | null) =>
  gsap.utils.toArray<HTMLElement>(".sm-layer", root)

export function StaggeredMenu({
  items,
  labels,
  footer,
  layerColors = ["var(--flame)", "var(--burgundy)"],
}: StaggeredMenuProps) {
  const pathname = usePathname()
  const panelId = useId()
  // false during SSR, true in the browser: the portal needs document.body.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
  const [open, setOpen] = useState(false)
  const [textLines, setTextLines] = useState([labels.menu, labels.close])

  const openRef = useRef(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const textInnerRef = useRef<HTMLSpanElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const tlRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null)
  const spinRef = useRef<gsap.core.Tween | null>(null)
  const textRef = useRef<gsap.core.Tween | null>(null)

  // Park the layers and panel off-screen once the portal exists.
  useGSAP(
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

  // Open/close tweens are created from event handlers, outside any GSAP
  // context, so kill them explicitly on unmount.
  useEffect(
    () => () => {
      tlRef.current?.kill()
      spinRef.current?.kill()
      textRef.current?.kill()
    },
    []
  )

  const playOpen = useCallback(() => {
    const panel = panelRef.current
    if (!panel) return
    tlRef.current?.kill()

    const labelsEls = panel.querySelectorAll(".sm-item-label")
    const reveals = panel.querySelectorAll(".sm-footer > *")
    gsap.set(labelsEls, { yPercent: 140, rotate: 10 })
    gsap.set(reveals, { y: 24, autoAlpha: 0 })

    const sweep = getLayers(overlayRef.current)
    const tl = gsap.timeline()
    sweep.forEach((el, i) => {
      tl.to(el, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07)
    })
    const panelAt = Math.max(0, sweep.length - 1) * 0.07 + 0.08
    tl.to(panel, { xPercent: 0, duration: 0.65, ease: "power4.out" }, panelAt)
      .to(
        labelsEls,
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
    tlRef.current = tl
  }, [])

  const playClose = useCallback(() => {
    const panel = panelRef.current
    if (!panel) return
    tlRef.current?.kill()
    tlRef.current = gsap.to([...getLayers(overlayRef.current), panel], {
      xPercent: 100,
      duration: 0.32,
      ease: "power3.in",
    })
  }, [])

  const animateToggle = useCallback(
    (opening: boolean) => {
      spinRef.current?.kill()
      spinRef.current = gsap.to(iconRef.current, {
        rotate: opening ? 225 : 0,
        duration: opening ? 0.8 : 0.35,
        ease: opening ? "power4.out" : "power3.inOut",
      })

      // Roll the label through a few Menu/Close swaps before it settles.
      const from = opening ? labels.menu : labels.close
      const to = opening ? labels.close : labels.menu
      const seq = [from]
      for (let i = 0; i < 3; i++)
        seq.push(seq[i] === labels.menu ? labels.close : labels.menu)
      if (seq.at(-1) !== to) seq.push(to)
      setTextLines(seq)

      const inner = textInnerRef.current
      textRef.current?.kill()
      gsap.set(inner, { yPercent: 0 })
      textRef.current = gsap.to(inner, {
        yPercent: -((seq.length - 1) / seq.length) * 100,
        duration: 0.5 + seq.length * 0.07,
        ease: "power4.out",
      })
    },
    [labels.menu, labels.close]
  )

  const setMenu = useCallback(
    (next: boolean) => {
      if (openRef.current === next) return
      openRef.current = next
      setOpen(next)
      if (next) playOpen()
      else playClose()
      animateToggle(next)
    },
    [playOpen, playClose, animateToggle]
  )

  // Close on route change (only when the path actually changes).
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    setMenu(false)
  }, [pathname, setMenu])

  useEffect(() => {
    if (!open) return
    // The panel sits at the end of <body>, so move focus into it explicitly.
    panelRef.current
      ?.querySelector<HTMLElement>(".sm-item")
      ?.focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setMenu(false)
      toggleRef.current?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (toggleRef.current?.contains(target)) return
      setMenu(false)
    }
    const root = document.documentElement
    root.style.overflow = "hidden"
    getLenis()?.stop()
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      root.style.overflow = ""
      // A section link may already have restarted it to scroll.
      const lenis = getLenis()
      if (lenis?.isStopped) lenis.start()
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open, setMenu])

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="sm-toggle"
        aria-label={open ? labels.closeMenu : labels.openMenu}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setMenu(!openRef.current)}
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
