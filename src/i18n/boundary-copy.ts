import { defaultLocale, hasLocale, type Locale } from "./config"

// Text for the 404 and error pages. Neither receives the [lang] params: the
// 404 renders outside the locale layout, and the error page is a client
// component Next loads with every page, which shouldn't pull in both full
// dictionaries. So their few strings live here.
export const boundaryCopy: Record<
  Locale,
  {
    notFound: { title: string; text: string; home: string; quote: string }
    error: { title: string; text: string; retry: string }
  }
> = {
  ro: {
    notFound: {
      title: "Pagina nu există",
      text: "Linkul poate fi greșit sau pagina a fost mutată.",
      home: "Înapoi la prima pagină",
      quote: "Cere ofertă",
    },
    error: {
      title: "Ceva n-a mers",
      text: "Pagina nu s-a putut încărca. Încearcă din nou sau sună-ne.",
      retry: "Încearcă din nou",
    },
  },
  en: {
    notFound: {
      title: "Page not found",
      text: "The link may be wrong, or the page has moved.",
      home: "Back to the home page",
      quote: "Get a quote",
    },
    error: {
      title: "Something went wrong",
      text: "This page couldn't load. Try again, or give us a call.",
      retry: "Try again",
    },
  },
}

/** The locale from the URL's [lang] segment, for components without params. */
export function boundaryLocale(lang: string | undefined): Locale {
  return lang && hasLocale(lang) ? lang : defaultLocale
}
