import { z } from "zod"

export const eventTypes = [
  "wedding",
  "baptism",
  "birthday",
  "corporate",
  "city",
  "other",
] as const

export type EventType = (typeof eventTypes)[number]

// Error messages are codes; the form maps them to localized text.
export type FieldErrorCode = "required" | "phone" | "email"

const optionalText = (max: number) => z.string().trim().max(max).optional()

export const quoteSchema = z.object({
  name: z.string().trim().min(1, "required").max(120),
  phone: z
    .string()
    .trim()
    .min(1, "required")
    .regex(/^\+?[\d\s().-]{8,20}$/, "phone"),
  email: z.union([z.literal(""), z.email("email").max(200)]).optional(),
  eventType: z.enum(eventTypes, "required"),
  date: optionalText(20),
  location: optionalText(120),
  message: optionalText(2000),
})

export type QuoteInput = z.infer<typeof quoteSchema>
export type QuoteField = keyof QuoteInput
