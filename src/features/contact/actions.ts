"use server"

import { Resend } from "resend"

import ro from "@/i18n/dictionaries/ro.json"

import {
  quoteSchema,
  type FieldErrorCode,
  type QuoteField,
  type QuoteInput,
} from "./schema"

export type QuoteState = {
  status: "idle" | "success" | "error"
  fieldErrors?: Partial<Record<QuoteField, FieldErrorCode>>
  /** Submitted values, so the form can restore them after an error. */
  values?: Record<string, string>
  /** Changes on every failed attempt so the form remounts with `values`. */
  attempt?: number
}

const labels: Record<keyof QuoteInput, string> = {
  name: "Nume",
  phone: "Telefon",
  email: "Email",
  eventType: "Tip eveniment",
  date: "Data",
  location: "Localitate",
  message: "Detalii",
}

export async function submitQuote(
  _prev: QuoteState,
  formData: FormData
): Promise<QuoteState> {
  // Skip Next's internal $ACTION_* fields.
  const values = Object.fromEntries(
    [...formData.entries()]
      .filter(([key]) => !key.startsWith("$"))
      .map(([key, value]) => [key, String(value)])
  )
  const attempt = Date.now()

  // Honeypot: real visitors never see or fill this field.
  if (values.company) return { status: "success" }

  const parsed = quoteSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors: QuoteState["fieldErrors"] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as QuoteField
      fieldErrors[field] ??= (
        ["required", "phone", "email"].includes(issue.message)
          ? issue.message
          : "required"
      ) as FieldErrorCode
    }
    return { status: "error", fieldErrors, values, attempt }
  }

  const quote = parsed.data
  const text = (Object.keys(labels) as (keyof QuoteInput)[])
    .filter((key) => quote[key])
    .map((key) => {
      // The office reads Romanian: show the event type label, not its code.
      const value =
        key === "eventType"
          ? ro.contact.eventTypes[quote.eventType]
          : quote[key]
      return `${labels[key]}: ${value}`
    })
    .join("\n")

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[quote] RESEND_API_KEY not set; request not emailed:\n" + text
      )
      return { status: "success" }
    }
    console.error("[quote] RESEND_API_KEY is not configured")
    return { status: "error", values, attempt }
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.QUOTE_FROM_EMAIL ?? "Piromania <onboarding@resend.dev>",
    to: process.env.QUOTE_TO_EMAIL ?? "office@piromania.ro",
    replyTo: quote.email || undefined,
    subject: `Cerere ofertă: ${quote.name}`,
    text,
  })

  if (error) {
    console.error("[quote] Resend error", error)
    return { status: "error", values, attempt }
  }

  return { status: "success" }
}
