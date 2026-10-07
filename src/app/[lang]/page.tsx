import { notFound } from "next/navigation"

import { PageTransition } from "@/components/layout/page-transition"
import { ContactSection } from "@/features/contact/components/contact-section"
import { About } from "@/features/home/components/about"
import { Hero } from "@/features/home/components/hero"
import { Partners, Testimonials } from "@/features/home/components/partners"
import { Services } from "@/features/home/components/services"
import { Shows } from "@/features/home/components/shows"
import { PricingPreview } from "@/features/packages/components/pricing-preview"
import { hasLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <main id="main">
        <Hero lang={lang} dict={dict.hero} quoteLabel={dict.nav.quote} />
        <About dict={dict.about} />
        <Services dict={dict.services} />
        <Shows dict={dict.shows} />
        <PricingPreview lang={lang} dict={dict.pricing} />
        <Partners dict={dict.partners} />
        <Testimonials dict={dict.partners} />
        <ContactSection lang={lang} dict={dict.contact} />
      </main>
    </PageTransition>
  )
}
