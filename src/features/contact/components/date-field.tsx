"use client"

import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format, parseISO, startOfToday } from "date-fns"
import { useState, type ComponentProps } from "react"
import { enGB, ro } from "react-day-picker/locale"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Locale } from "@/i18n/config"
import { cn } from "@/lib/utils"

const calendarLocale = { ro, en: enGB }

/**
 * shadcn date picker (Popover + Calendar) that still submits with the form: a
 * hidden input carries the day as YYYY-MM-DD, the format the server expects.
 * Days already gone can't be picked.
 */
export function DateField({
  name,
  lang,
  defaultValue,
  placeholder,
  className,
  ...trigger
}: Omit<ComponentProps<"button">, "name" | "defaultValue"> & {
  name: string
  lang: Locale
  defaultValue?: string
  placeholder: string
}) {
  const [date, setDate] = useState<Date | undefined>(() =>
    defaultValue ? parseISO(defaultValue) : undefined
  )
  const [open, setOpen] = useState(false)
  const locale = calendarLocale[lang]

  return (
    <>
      <input
        type="hidden"
        name={name}
        value={date ? format(date, "yyyy-MM-dd") : ""}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              data-empty={!date || undefined}
              className={cn(
                // The same edge and focus/error states as the Input primitive.
                "flex w-full items-center justify-between gap-3 border text-left outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/40 data-empty:text-muted-foreground",
                className
              )}
              {...trigger}
            />
          }
        >
          {date ? format(date, "d MMMM yyyy", { locale }) : placeholder}
          <HugeiconsIcon
            icon={Calendar03Icon}
            strokeWidth={2}
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            locale={locale}
            selected={date}
            defaultMonth={date}
            disabled={{ before: startOfToday() }}
            onSelect={(day) => {
              setDate(day)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
