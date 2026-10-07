// Kept free of zod so the client form can import it without bundling the
// validator, which only runs in the server action.

export const eventTypes = [
  "wedding",
  "baptism",
  "birthday",
  "corporate",
  "city",
  "other",
] as const

// Error messages are codes; the form maps them to localized text.
export const fieldErrorCodes = ["required", "phone", "email", "date"] as const

export type FieldErrorCode = (typeof fieldErrorCodes)[number]
