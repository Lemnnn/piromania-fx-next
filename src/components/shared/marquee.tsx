"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Endless sideways scroll. Runs only while on screen; hover and keyboard focus
 * inside pause it.
 */
export function Marquee({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    )
    if (root.current) observer.observe(root.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={root}
      className="overflow-hidden border-y border-foreground/15 py-10 md:py-12"
    >
      {/* Two identical copies: shifting by half loops seamlessly. */}
      <div className="marquee flex w-max" data-running={visible || undefined}>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0"
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
