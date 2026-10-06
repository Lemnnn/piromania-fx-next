# Piromania FX

Marketing / showcase site built with Next.js 16 (App Router), shadcn/ui and Tailwind v4. Bilingual: Romanian (default) and English.

## Getting started

```bash
pnpm install
pnpm dev
```

Visiting `/` redirects to `/ro` or `/en` based on the browser's `Accept-Language`.

Two pages per language: the one-page home (`/ro`) and the price list (`/ro/packages`).

The quote form sends email through [Resend](https://resend.com). Copy `.env.example` to `.env.local` and fill in the key. Without it, `pnpm dev` prints requests to the terminal instead.

## Project structure

```
public/                 static files (images/, videos/)
src/
  app/                  routing only — pages compose features, no business logic
    [lang]/             every route lives under the locale segment
      page.tsx          one-page home: hero, about, services, shows, pricing, partners, contact
      (site)/packages/  price list page
      (legal)/          privacy, terms, cookies (later)
    globals.css
  features/<name>/      domain code: components/, data.ts, types.ts, actions.ts, schema.ts
  components/
    ui/                 shadcn-generated components
    layout/             Header, Footer, navigation, locale switcher
    shared/             reusable non-shadcn building blocks
  i18n/                 locale config, dictionary loader, dictionaries/{ro,en}.json
  hooks/                shared client hooks
  lib/                  utilities, site config, SEO helpers
  types/                global shared types
  proxy.ts              locale detection + redirect
```

## Conventions

- **Imports flow one way:** `app` → `features` → `components` / `lib` / `i18n`. Features don't import from each other; move shared code to `components/shared` or `lib`.
- **Server Components by default.** Add `"use client"` only to interactive pieces (forms, lightbox, mobile nav).
- **Text lives in dictionaries.** Add every key to both `ro.json` and `en.json`; `Dictionary` is typed from `ro.json`.
- **File names are kebab-case** (`service-card.tsx`); components are PascalCase exports.
- **Route slugs and section ids are English** and shared by both locales (`/ro/packages`, `/ro#services`).

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add card
```

Components land in `src/components/ui` and are imported as `@/components/ui/card`.
