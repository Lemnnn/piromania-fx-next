"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { ContactLinks } from "@/components/shared/contact-links"
import { boundaryCopy, boundaryLocale } from "@/i18n/boundary-copy"

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  const params = useParams<{ lang?: string }>()
  const lang = boundaryLocale(params.lang)
  const t = boundaryCopy[lang].error

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      id="main"
      className="container-page flex min-h-[100dvh] flex-col justify-center gap-8 pt-36 pb-28"
    >
      <h1 className="max-w-[14ch] heading-section">{t.title}</h1>
      <p className="max-w-[40ch] text-xl text-foreground/80">{t.text}</p>
      <Button onClick={() => retry()} className="w-fit">
        {t.retry}
      </Button>
      <div className="flex flex-col gap-2">
        <ContactLinks phoneClassName="text-4xl" />
      </div>
    </main>
  )
}
