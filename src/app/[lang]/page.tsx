import { notFound } from "next/navigation"

import { ContactSection } from "@/features/contact/components/contact-section"
import { About } from "@/features/home/components/about"
import { Hero } from "@/features/home/components/hero"
import { Partners } from "@/features/home/components/partners"
import { PricingPreview } from "@/features/home/components/pricing-preview"
import { Services } from "@/features/home/components/services"
import { Shows } from "@/features/home/components/shows"
import { hasLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <main>
      <Hero lang={lang} dict={dict.hero} quoteLabel={dict.nav.quote} />
      <About dict={dict.about} />
      <Services dict={dict.services} />
      <Shows dict={dict.shows} />
      <PricingPreview lang={lang} dict={dict.pricing} />
      <Partners dict={dict.partners} />
      <ContactSection dict={dict.contact} />
    </main>
  )
}
