import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageTransition } from "@/components/layout/page-transition"
import { hasLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { pageMetadata } from "@/lib/metadata"
import { siteConfig } from "@/lib/site-config"

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const t = (await getDictionary(lang)).privacy
  return pageMetadata({
    lang,
    path: siteConfig.privacyHref,
    title: t.metaTitle,
    description: t.metaDescription,
  })
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/privacy">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = (await getDictionary(lang)).privacy

  return (
    <PageTransition>
      <main id="main" className="container-page pt-36 pb-28 md:pt-44 md:pb-40">
        <header className="flex flex-col gap-6 pb-16 md:pb-20">
          <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] font-extrabold uppercase">
            {t.title}
          </h1>
          {/* Remove once a lawyer has approved the text. */}
          <p className="w-fit border border-flame/60 px-4 py-2 text-flame">
            {t.draft}
          </p>
          <p className="text-foreground/60">{t.updated}</p>
        </header>

        <div className="flex max-w-[68ch] flex-col gap-12">
          {t.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-4">
              <h2 className="font-display text-3xl leading-none font-bold uppercase md:text-4xl">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg text-foreground/85">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </PageTransition>
  )
}
