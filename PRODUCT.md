# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

All event audiences, served through separate paths rather than one blended pitch:

- **Private clients:** couples planning weddings, and families planning baptisms, birthdays and anniversaries. They compare packages and budgets and want an emotional moment that is done safely.
- **Corporate clients and event planners:** galas, product launches, venues and agencies. They need reliability, scale and a fast quote.
- **Cities and large shows:** municipal New Year's Eve, festivals and concerts that need large-scale displays.

Most visitors arrive with a date and a venue in mind. The job is to judge whether Piromania fits the event, see what it looks like, understand the cost, and ask for a quote.

## Product Purpose

The marketing and showcase site for Piromania International SRL ("Piromania – Fantezii explozive"), a Romanian pyrotechnics company. It must show the shows at their true scale, explain the services and packages, and turn interest into quote requests. Success means more qualified quote requests, from both private and corporate clients.

## Positioning

- 19+ years running pyrotechnic shows in Romania
- A licensed, certified pyrotechnician team
- Pyromusical shows choreographed to a soundtrack
- Indoor-safe cold-flame effects for venues

## Operating Context

- Services: interior fireworks, exterior fireworks, ground fireworks, special effects
- Exterior packages: Mini Piro €770, Classic Piro €990, Memo Piro €1,200, Magic Piro €1,650, "Fantezii explozive" from €2,500. Shows run 2–5 min, 20–100 m high, at 100–300 effects per minute (€275–500 per minute)
- Interior packages: Piro Basic 400 RON (4 cold-flame units), Piro Fan 1,000 RON (12 units in a fan)
- Contact: Cristian Enciu, 0722.380.636, office@piromania.ro. Based in Bucharest
- Most shows are private events, so there is no public event calendar. The primary CTA is a quote request ("Cere o ofertă")

## Capabilities and Constraints

- Next.js 16 App Router, shadcn/ui (Base UI), Tailwind v4, GSAP, bilingual RO (default) + EN under `/[lang]`
- Prices above come from the current site (piromania.ro/oferta-artificii) and must be confirmed with the client before launch
- Two pages per locale: a one-page home (`#about`, `#services`, `#shows`, `#contact` plus pricing preview and partners) and `/packages` with full prices. The menu's section links scroll within the home page
- Quote form emails office@piromania.ro through Resend (`RESEND_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL`, see `.env.example`). Without a key, development logs requests and production shows the phone/email fallback
- Undecided: CMS (currently typed data files), video hosting

## Brand Commitments

- Name "Piromania" and the tagline "Fantezii explozive"
- Brand colours must stay: the logo flame red-orange `#EB3D00` and the burgundy `#811410` of the original site (client requirement, 2026-10-06)
- Romanian is the primary language and must render diacritics correctly (ă â î ș ț)
- Logo: vector rebuild of the original in `docs/brand/` (traced from the 322 px file; the client's original vector file is still worth requesting for large print). The site uses `public/brand/` (header lockup, wordmark, disc) and `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`

## Evidence on Hand

- Real: the 4 service descriptions, the package prices, around 6 YouTube show videos per service on piromania.ro, 8+ partner venue logos, 2 testimonials from Bucharest clients
- Absent: high-resolution footage and photos (placeholders from Unsplash/stock until the client supplies them), case studies, press, certification documents. Do not invent testimonials, client names, statistics, show counts or certifications beyond the positioning facts above

## Product Principles

1. The show is the product: footage leads and the interface steps back
2. Safety and licensing reassure without dampening the spectacle
3. Every path ends in a quote request that takes under a minute
4. Prices are stated plainly, with no "contact us for pricing" walls
5. Private and corporate visitors each get proof that speaks to them

## Accessibility & Inclusion

WCAG 2.2 AA. Flashing content must stay below seizure thresholds (no more than 3 flashes per second). The home intro and hero video play for every visitor, including those with `prefers-reduced-motion` (a deliberate client decision, matching the No Art reference). Smooth scrolling, the pinned services section and the Shows photo parallax also run for everyone; only the hero video's scroll parallax respects it. Every piece of video has a still alternative.
