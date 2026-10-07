"use server"

import { headers } from "next/headers"
import { Resend } from "resend"

import { hasLocale } from "@/i18n/config"
import ro from "@/i18n/dictionaries/ro.json"
import { siteConfig } from "@/lib/site-config"

import { fieldErrorCodes, type FieldErrorCode } from "./constants"
import { quoteSchema, type QuoteField, type QuoteInput } from "./schema"

export type QuoteState = {
  status: "idle" | "success" | "error"
  fieldErrors?: Partial<Record<QuoteField, FieldErrorCode>>
  /** Set when the request failed as a whole rather than on a field. */
  formError?: "server" | "rateLimit"
  /** Submitted values, so the form can restore them after an error. */
  values?: Record<string, string>
  /** Changes on every failed attempt so the form remounts with `values`. */
  attempt?: number
}

// The office reads Romanian: reuse the form's own labels so they never drift.
const labels: Record<keyof QuoteInput, string> = ro.contact.fields
const fields = Object.keys(quoteSchema.shape) as QuoteField[]

// Anything filled in faster than this is a script, not a person.
const MIN_FILL_MS = 3000

// Per-IP limit. Kept in memory, so it resets with each server instance: it
// slows a flood down rather than stopping a determined attacker.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const recent = new Map<string, number[]>()

function isRateLimited(ip: string, now: number) {
  const hits = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS)
  hits.push(now)
  recent.set(ip, hits)
  // Drop stale entries now and then so the map can't grow without bound.
  if (recent.size > 1000) {
    for (const [key, times] of recent) {
      if (times.every((time) => now - time >= WINDOW_MS)) recent.delete(key)
    }
  }
  return hits.length > MAX_PER_WINDOW
}

export async function submitQuote(
  _prev: QuoteState,
  formData: FormData
): Promise<QuoteState> {
  const now = Date.now()
  const read = (key: string) => String(formData.get(key) ?? "")
  // Only the form's own fields go back to the browser.
  const values = Object.fromEntries(fields.map((key) => [key, read(key)]))
  const attempt = now

  // Honeypot and fill time: answer bots as if they succeeded. A missing
  // timestamp means the form was sent before JavaScript ran, so let it through.
  const startedAt = Number(read("startedAt"))
  if (read("company") || (startedAt && now - startedAt < MIN_FILL_MS)) {
    return { status: "success" }
  }

  const parsed = quoteSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors: QuoteState["fieldErrors"] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as QuoteField
      const code = issue.message as FieldErrorCode
      fieldErrors[field] ??= fieldErrorCodes.includes(code) ? code : "required"
    }
    return { status: "error", fieldErrors, values, attempt }
  }

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
  if (isRateLimited(ip, now)) {
    return { status: "error", formError: "rateLimit", values, attempt }
  }

  const quote = parsed.data
  const lang = read("lang")
  const text = [
    ...fields
      .filter((key) => quote[key])
      .map((key) => {
        // Show the event type label, not its code.
        const value =
          key === "eventType"
            ? ro.contact.eventTypes[quote.eventType]
            : quote[key]
        return `${labels[key]}: ${value}`
      }),
    // So the office knows which language to answer in.
    `Limba site-ului: ${hasLocale(lang) ? lang.toUpperCase() : "?"}`,
  ].join("\n")

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[quote] RESEND_API_KEY not set; request not emailed:\n" + text
      )
      return { status: "success" }
    }
    console.error("[quote] RESEND_API_KEY is not configured")
    return { status: "error", formError: "server", values, attempt }
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.QUOTE_FROM_EMAIL ?? "Piromania <onboarding@resend.dev>",
    to: process.env.QUOTE_TO_EMAIL ?? siteConfig.contact.email,
    replyTo: quote.email || undefined,
    subject: `Cerere ofertă: ${quote.name}`,
    text,
  })

  if (error) {
    console.error("[quote] Resend error", error)
    return { status: "error", formError: "server", values, attempt }
  }

  return { status: "success" }
}
