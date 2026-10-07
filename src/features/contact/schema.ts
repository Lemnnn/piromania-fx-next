import { z } from "zod"

import { eventTypes } from "./constants"

const optionalText = (max: number) => z.string().trim().max(max).optional()

// <input type="date"> sends YYYY-MM-DD. Today is allowed; a day already gone
// is not (compared as strings, which sort like dates in this format).
const today = () => new Date().toISOString().slice(0, 10)
const eventDate = z
  .union([
    z.literal(""),
    z.iso.date("date").refine((value) => value >= today(), "date"),
  ])
  .optional()

export const quoteSchema = z.object({
  name: z.string().trim().min(1, "required").max(120),
  phone: z
    .string()
    .trim()
    .min(1, "required")
    .regex(/^\+?[\d\s().-]{8,20}$/, "phone"),
  email: z.union([z.literal(""), z.email("email").max(200)]).optional(),
  eventType: z.enum(eventTypes, "required"),
  date: eventDate,
  location: optionalText(120),
  message: optionalText(2000),
})

export type QuoteInput = z.infer<typeof quoteSchema>
export type QuoteField = keyof QuoteInput
