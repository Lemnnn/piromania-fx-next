# Piromania FX

Marketing / showcase site built with Next.js 16 (App Router), shadcn/ui and Tailwind v4. Bilingual: Romanian (default) and English.

## Getting started

```bash
pnpm install
pnpm dev
```

Visiting `/` redirects to `/ro` or `/en` based on the browser's `Accept-Language`.

Three pages per language: the one-page home (`/ro`), the price list (`/ro/packages`) and the privacy policy (`/ro/privacy`, a draft awaiting legal review). Unknown paths get a branded 404.

The quote form sends email through [Resend](https://resend.com). Copy `.env.example` to `.env.local` and fill in the key. Without it, `pnpm dev` prints requests to the terminal instead. Spam protection is a honeypot, a minimum fill time and an in-memory per-IP limit (5 requests per 10 minutes per server instance).

Set `NEXT_PUBLIC_SITE_URL` in production if the site is not served from `https://piromania.ro`: canonical URLs, hreflang, the sitemap and link previews are built from it.

## Project structure

```
public/                 static files (brand/, images/, videos/)
src/
  app/                  routing only — pages compose features, no business logic
    [lang]/             every route lives under the locale segment
      page.tsx          one-page home: hero, about, services, shows, pricing, partners, contact
      (site)/packages/  price list page
      (legal)/privacy/  privacy policy (draft)
      error.tsx         branded error page
      opengraph-image   link preview image per locale
    global-not-found.tsx  branded, bilingual 404 for unmatched URLs
    sitemap.ts, robots.ts
    globals.css         tokens, plus the container-page / heading-section / link-underline utilities
  features/<name>/      domain code: components/, data.ts, actions.ts, schema.ts
  components/
    ui/                 shadcn-generated components (trimmed to what the site uses)
    layout/             Header, Footer, navigation, locale switcher
    shared/             reusable non-shadcn building blocks
  i18n/                 locale config, dictionary loader, dictionaries/{ro,en}.json
  hooks/                shared client hooks
  lib/                  gsap (plugins + motion queries), smooth scroll, site config, metadata
  proxy.ts              locale detection (saved choice, then Accept-Language) + redirect
```

## Conventions

- **Imports flow one way:** `app` → `features` → `components` / `lib` / `i18n`. Features don't import from each other; move shared code to `components/shared` or `lib`.
- **Server Components by default.** Add `"use client"` only to interactive pieces (forms, lightbox, mobile nav).
- **Animation goes through `@/lib/gsap`.** It registers the plugins once and holds the shared `desktop` media query for the pin and parallax effects.
- **Text lives in dictionaries.** Add every key to both `ro.json` and `en.json`; `Dictionary` is typed from `ro.json`. The one exception is `i18n/boundary-copy.ts`, for the 404 and error pages, which can't receive the [lang] params.
- **File names are kebab-case** (`service-card.tsx`); components are PascalCase exports.
- **Route slugs and section ids are English** and shared by both locales (`/ro/packages`, `/ro#services`).

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add card
```

Components land in `src/components/ui` and are imported as `@/components/ui/card`.
