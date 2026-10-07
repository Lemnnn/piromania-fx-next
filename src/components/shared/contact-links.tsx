import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/** The office phone (large, display type) and email, used in header, contact and footer. */
export function ContactLinks({
  phoneClassName,
  emailClassName,
}: {
  phoneClassName?: string
  emailClassName?: string
}) {
  const { contact } = siteConfig
  return (
    <>
      <a
        href={contact.phoneHref}
        className={cn(
          "w-fit font-display leading-none font-bold transition-colors duration-200 hover:text-flame",
          phoneClassName
        )}
      >
        {contact.phone}
      </a>
      <a
        href={`mailto:${contact.email}`}
        className={cn("w-fit text-lg link-underline", emailClassName)}
      >
        {contact.email}
      </a>
    </>
  )
}
