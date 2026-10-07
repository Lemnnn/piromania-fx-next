import { NextResponse, type NextRequest } from "next/server"

import {
  defaultLocale,
  hasLocale,
  localeCookie,
  type Locale,
} from "@/i18n/config"

function getLocale(request: NextRequest): Locale {
  // A language picked in the switcher wins over the browser's preference.
  const saved = request.cookies.get(localeCookie)?.value
  if (saved && hasLocale(saved)) return saved

  const header = request.headers.get("accept-language") ?? ""
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=")
      return { lang: tag.split("-")[0].toLowerCase(), q: q ? Number(q) : 1 }
    })
    // q=0 means "not acceptable".
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q)

  const match = preferred.find(({ lang }) => hasLocale(lang))
  return match ? (match.lang as Locale) : defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, first = "", ...rest] = pathname.split("/")

  if (hasLocale(first)) return

  // /RO/packages -> /ro/packages, rather than /ro/RO/packages.
  const lower = first.toLowerCase()
  request.nextUrl.pathname = hasLocale(lower)
    ? `/${[lower, ...rest].join("/")}`
    : `/${getLocale(request)}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Skip internals, API routes and files with an extension (favicon, images, sitemap.xml...)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
