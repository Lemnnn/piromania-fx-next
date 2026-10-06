import type { Locale } from "@/i18n/config"

// Prices and specs from piromania.ro/oferta-artificii. Confirm with the client
// before launch. All prices exclude VAT and local council fees.

type Localized<T> = Record<Locale, T>

export type PackageVariant = {
  label: Localized<string>
  details: Localized<string[]>
}

export type ShowPackage = {
  id: string
  name: string
  priceEur: number
  /** Price is a starting point, not fixed. */
  from?: boolean
  summary: Localized<string>
  details?: Localized<string[]>
  variants?: PackageVariant[]
}

export const exteriorPackages: ShowPackage[] = [
  {
    id: "mini",
    name: "Mini Piro",
    priceEur: 770,
    summary: {
      ro: "Un moment la sol sau 2-3 minute pe cer",
      en: "A ground moment or 2-3 minutes in the sky",
    },
    variants: [
      {
        label: { ro: "La sol", en: "Ground" },
        details: {
          ro: [
            "6 jerbe de scântei, 1 minut, 3 metri înălțime",
            "2 stroboscoape",
            "Inimă pirotehnică de 1,5 metri",
          ],
          en: [
            "6 spark fountains, 1 minute, 3 metres high",
            "2 strobes",
            "1.5 metre pyrotechnic heart",
          ],
        },
      },
      {
        label: { ro: "Pe cer", en: "Sky" },
        details: {
          ro: [
            "2-3 minute",
            "300-400 de focuri",
            "Evoluție între 20 și 50 de metri",
          ],
          en: [
            "2-3 minutes",
            "300-400 shots",
            "Bursts between 20 and 50 metres",
          ],
        },
      },
    ],
  },
  {
    id: "clasic",
    name: "Clasic Piro",
    priceEur: 990,
    summary: {
      ro: "Până la 700 de focuri, între 20 și 70 de metri",
      en: "Up to 700 shots, between 20 and 70 metres",
    },
    variants: [
      {
        label: { ro: "La sol", en: "Ground" },
        details: {
          ro: [
            "3 minute de efecte combinate",
            "Jerbe de scântei de 5 metri",
            "Cascadă pirotehnică și stroboscoape",
          ],
          en: [
            "3 minutes of combined effects",
            "5 metre spark fountains",
            "Pyrotechnic waterfall and strobes",
          ],
        },
      },
      {
        label: { ro: "Pe cer", en: "Sky" },
        details: {
          ro: [
            "2-3 minute",
            "500-700 de focuri",
            "Evoluție între 20 și 70 de metri",
          ],
          en: [
            "2-3 minutes",
            "500-700 shots",
            "Bursts between 20 and 70 metres",
          ],
        },
      },
    ],
  },
  {
    id: "memo",
    name: "Memo Piro",
    priceEur: 1200,
    summary: {
      ro: "3-5 minute, cu final în V și W",
      en: "3-5 minutes with a V and W finale",
    },
    details: {
      ro: [
        "3-5 minute",
        "700-900 de focuri, cadență medie",
        "Efecte pe cer la înălțime medie și mare",
        "Final de 20 de secunde în V și W",
      ],
      en: [
        "3-5 minutes",
        "700-900 shots at a medium pace",
        "Effects at medium and high altitude",
        "20 second finale in V and W shapes",
      ],
    },
  },
  {
    id: "magic",
    name: "Magic Piro",
    priceEur: 1650,
    summary: {
      ro: "Efecte la sol, la joasă și la mare înălțime",
      en: "Ground, low and high altitude effects",
    },
    details: {
      ro: [
        "3-5 minute",
        "Efecte la sol, la joasă și la mare înălțime",
        "Final cu simbolistică opțională",
      ],
      en: [
        "3-5 minutes",
        "Ground, low and high altitude effects",
        "Finale with optional symbols",
      ],
    },
  },
  {
    id: "fantezii",
    name: "Fantezii explozive",
    priceEur: 2500,
    from: true,
    summary: {
      ro: "Spectacol creat împreună cu tine",
      en: "A show designed together with you",
    },
    details: {
      ro: [
        "Stabilit de specialiștii noștri, împreună cu tine, după evenimentul tău",
      ],
      en: ["Planned by our specialists together with you, around your event"],
    },
  },
]

export const perMinuteRates = [
  { priceEur: 275, shotsPerMinute: 100, maxHeight: 50 },
  { priceEur: 385, shotsPerMinute: 200, maxHeight: 70 },
  { priceEur: 500, shotsPerMinute: 300, maxHeight: 100 },
]

export const interiorPackages = [
  {
    id: "basic",
    name: "Piro Basic",
    priceRon: 400,
    details: {
      ro: [
        "4 artificii de interior fără fum",
        "2-3 metri înălțime",
        "20 de secunde",
      ],
      en: ["4 smokeless indoor fountains", "2-3 metres high", "20 seconds"],
    },
  },
  {
    id: "fan",
    name: "Piro Fan",
    priceRon: 1000,
    details: {
      ro: [
        "12 artificii de interior fără fum",
        "Așezate în evantai, în 4 locuri",
      ],
      en: ["12 smokeless indoor fountains", "Set out in a fan, in 4 spots"],
    },
  },
]

// Currency symbols are placed by hand: Node and browsers disagree on the
// Romanian currency format ("770 EUR" vs "770 €"), which breaks hydration.
const amount = (lang: Locale, value: number) =>
  new Intl.NumberFormat(lang === "ro" ? "ro-RO" : "en-GB").format(value)

export function formatEur(lang: Locale, value: number) {
  return lang === "ro" ? `${amount(lang, value)} €` : `€${amount(lang, value)}`
}

export function formatRon(lang: Locale, value: number) {
  return lang === "ro"
    ? `${amount(lang, value)} lei`
    : `${amount(lang, value)} RON`
}
