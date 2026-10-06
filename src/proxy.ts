import { NextResponse, type NextRequest } from "next/server"

import { defaultLocale, hasLocale, locales, type Locale } from "@/i18n/config"

function getLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? ""
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=")
      return { lang: tag.split("-")[0].toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  const match = preferred.find(({ lang }) => hasLocale(lang))
  return match ? (match.lang as Locale) : defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Skip internals, API routes and files with an extension (favicon, images, sitemap.xml...)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
