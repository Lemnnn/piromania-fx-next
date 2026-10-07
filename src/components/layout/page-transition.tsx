import { ViewTransition, type ReactNode } from "react"

/**
 * Wraps a page's content so navigations animate between pages: the old page
 * dims and lifts away while the new one wipes up over it (globals.css, "Page
 * transitions"). Goes in each page, not the layout: layouts persist across
 * navigations, so enter and exit would never fire there. Browsers without
 * view transitions simply swap pages.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  )
}
