"use client"

import {
  useActionState,
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import type { Dictionary } from "@/i18n/get-dictionary"
import { cn } from "@/lib/utils"

import { submitQuote, type QuoteState } from "../actions"
import { eventTypes, type QuoteField } from "../schema"

type QuoteFormProps = {
  dict: Dictionary["contact"]
}

const control = "h-12 bg-foreground/[0.06] px-4 text-base md:text-base"

export function QuoteForm({ dict }: QuoteFormProps) {
  const [state, formAction, pending] = useActionState<QuoteState, FormData>(
    submitQuote,
    { status: "idle" }
  )
  const successRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Move focus to the confirmation, or to the first field that needs fixing.
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus()
    else if (state.fieldErrors) {
      formRef.current
        ?.querySelector<HTMLElement>("[aria-invalid=true]")
        ?.focus()
    }
  }, [state])

  if (state.status === "success") {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="font-display text-4xl leading-tight font-bold outline-none md:text-5xl"
      >
        {dict.success}
      </p>
    )
  }

  const errors = state.fieldErrors ?? {}
  const value = (field: string) => state.values?.[field] ?? ""
  const errorFor = (field: QuoteField) =>
    errors[field] ? dict.errors[errors[field]] : undefined
  const optional = (label: string) => (
    <>
      {label} <span className="text-muted-foreground">({dict.optional})</span>
    </>
  )

  return (
    // Remount after each failed attempt: Base UI fields don't pick up new
    // default values, so a fresh form restores what the visitor typed.
    <form key={state.attempt ?? 0} ref={formRef} action={formAction} noValidate>
      <FieldGroup className="gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            name="name"
            label={dict.fields.name}
            autoComplete="name"
            defaultValue={value("name")}
            error={errorFor("name")}
            required
          />
          <TextField
            name="phone"
            type="tel"
            label={dict.fields.phone}
            autoComplete="tel"
            defaultValue={value("phone")}
            error={errorFor("phone")}
            required
          />
          <TextField
            name="email"
            type="email"
            label={optional(dict.fields.email)}
            autoComplete="email"
            defaultValue={value("email")}
            error={errorFor("email")}
          />
          <Field data-invalid={errors.eventType ? true : undefined}>
            <FieldLabel htmlFor="quote-eventType">
              {dict.fields.eventType}
            </FieldLabel>
            <NativeSelect
              id="quote-eventType"
              name="eventType"
              defaultValue={value("eventType")}
              required
              aria-invalid={errors.eventType ? true : undefined}
              aria-describedby={
                errors.eventType ? "quote-eventType-error" : undefined
              }
              className="w-full [&_select]:h-12 [&_select]:bg-foreground/[0.06] [&_select]:px-4 [&_select]:text-base"
            >
              <NativeSelectOption value="" disabled>
                {dict.fields.eventTypePlaceholder}
              </NativeSelectOption>
              {eventTypes.map((type) => (
                <NativeSelectOption key={type} value={type}>
                  {dict.eventTypes[type]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError id="quote-eventType-error">
              {errorFor("eventType")}
            </FieldError>
          </Field>
          <TextField
            name="date"
            type="date"
            label={optional(dict.fields.date)}
            defaultValue={value("date")}
            className="[color-scheme:dark]"
          />
          <TextField
            name="location"
            label={optional(dict.fields.location)}
            autoComplete="address-level2"
            defaultValue={value("location")}
          />
        </div>

        <Field>
          <FieldLabel htmlFor="quote-message">
            {optional(dict.fields.message)}
          </FieldLabel>
          <Textarea
            id="quote-message"
            name="message"
            rows={4}
            defaultValue={value("message")}
            className="min-h-32 bg-foreground/[0.06] px-4 py-3 text-base md:text-base"
          />
        </Field>

        {/* Honeypot for bots; hidden from people and assistive tech. */}
        <div
          aria-hidden
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label>
            Company
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        {state.status === "error" && !state.fieldErrors ? (
          <p role="alert" className="text-destructive">
            {dict.errors.server}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="h-14 w-full px-8 text-base sm:w-fit"
        >
          {pending ? dict.sending : dict.submit}
        </Button>
      </FieldGroup>
    </form>
  )
}

function TextField({
  name,
  label,
  error,
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "name"> & {
  name: QuoteField
  label: ReactNode
  error?: string
}) {
  const id = `quote-${name}`
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(control, className)}
        {...props}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </Field>
  )
}
