"use client"

import Link from "next/link"
import {
  cloneElement,
  useActionState,
  useEffect,
  useRef,
  type ReactElement,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { interpolate } from "@/lib/interpolate"
import { localeHref, siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

import { submitQuote, type QuoteState } from "../actions"
import { eventTypes } from "../constants"
import type { QuoteField } from "../schema"
import { DateField } from "./date-field"

type QuoteFormProps = {
  lang: Locale
  dict: Dictionary["contact"]
}

// A visible edge: foreground at 40% is ~3.4:1 against the page (WCAG 1.4.11
// asks 3:1 for a control's boundary); the old fill alone was ~1.1:1 and
// vanished on phones. Focus turns it flame, errors coral (from the primitives).
const control =
  "h-12 border-foreground/40 bg-foreground/[0.07] px-4 text-base transition-colors hover:border-foreground/60 md:text-base"

export function QuoteForm({ lang, dict }: QuoteFormProps) {
  const [state, formAction, pending] = useActionState<QuoteState, FormData>(
    submitQuote,
    { status: "idle" }
  )
  const successRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const startedAt = useRef<HTMLInputElement>(null)

  // When the visitor started: the server drops forms sent faster than a
  // person could fill them in.
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now())
  }, [state.attempt])

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
  const { contact } = siteConfig
  const contactLinks = {
    phone: (
      <a href={contact.phoneHref} className="underline underline-offset-4">
        {contact.phone}
      </a>
    ),
    email: (
      <a
        href={`mailto:${contact.email}`}
        className="underline underline-offset-4"
      >
        {contact.email}
      </a>
    ),
  }

  return (
    // Remount after each failed attempt: Base UI fields don't pick up new
    // default values, so a fresh form restores what the visitor typed.
    <form key={state.attempt ?? 0} ref={formRef} action={formAction} noValidate>
      <input type="hidden" name="lang" value={lang} />
      <input ref={startedAt} type="hidden" name="startedAt" />
      <FieldGroup className="gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            name="name"
            label={dict.fields.name}
            error={errorFor("name")}
          >
            <Input
              autoComplete="name"
              defaultValue={value("name")}
              required
              className={control}
            />
          </FormField>
          <FormField
            name="phone"
            label={dict.fields.phone}
            error={errorFor("phone")}
          >
            <Input
              type="tel"
              autoComplete="tel"
              defaultValue={value("phone")}
              required
              className={control}
            />
          </FormField>
          <FormField
            name="email"
            label={optional(dict.fields.email)}
            error={errorFor("email")}
          >
            <Input
              type="email"
              autoComplete="email"
              defaultValue={value("email")}
              className={control}
            />
          </FormField>
          <FormField
            name="eventType"
            label={dict.fields.eventType}
            error={errorFor("eventType")}
          >
            <EventTypeSelect
              defaultValue={value("eventType")}
              placeholder={dict.fields.eventTypePlaceholder}
              items={eventTypes.map((type) => ({
                value: type,
                label: dict.eventTypes[type],
              }))}
              className={control}
            />
          </FormField>
          <FormField
            name="date"
            label={optional(dict.fields.date)}
            error={errorFor("date")}
          >
            <DateField
              name="date"
              lang={lang}
              defaultValue={value("date")}
              placeholder={dict.fields.datePlaceholder}
              className={control}
            />
          </FormField>
          <FormField
            name="location"
            label={optional(dict.fields.location)}
            error={errorFor("location")}
          >
            <Input
              autoComplete="address-level2"
              defaultValue={value("location")}
              className={control}
            />
          </FormField>
        </div>

        <FormField
          name="message"
          label={optional(dict.fields.message)}
          error={errorFor("message")}
        >
          <Textarea
            rows={4}
            defaultValue={value("message")}
            className={cn(control, "h-auto min-h-32 py-3")}
          />
        </FormField>

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

        {state.formError ? (
          <p role="alert" className="text-destructive">
            {interpolate(
              state.formError === "rateLimit"
                ? dict.errors.rateLimit
                : dict.errors.server,
              contactLinks
            )}
          </p>
        ) : null}

        <p className="text-sm text-muted-foreground">
          {interpolate(dict.privacyNotice, {
            link: (
              <Link
                href={localeHref(lang, siteConfig.privacyHref)}
                className="underline underline-offset-4 transition-colors duration-200 hover:text-foreground"
              >
                {dict.privacyLink}
              </Link>
            ),
          })}
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="w-full sm:w-fit"
        >
          {pending ? dict.sending : dict.submit}
        </Button>
      </FieldGroup>
    </form>
  )
}

/**
 * shadcn Select for the event type. Base UI renders a hidden input from
 * `name`, so the choice submits with the form; the trigger takes the id and
 * error wiring so the label and error message point at it.
 */
function EventTypeSelect({
  name,
  defaultValue,
  placeholder,
  items,
  className,
  ...trigger
}: ControlProps & {
  defaultValue: string
  placeholder: string
  items: { value: string; label: string }[]
  className?: string
}) {
  return (
    <Select name={name} items={items} defaultValue={defaultValue || null}>
      <SelectTrigger
        {...trigger}
        // data-[size] sets the primitive's height; match the other fields.
        className={cn("w-full data-[size=default]:h-12", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      {/* Opens below the field like a dropdown (the default overlays the
          trigger, which on phones runs off the bottom of the screen), on a
          solid background so the fields behind don't show through. */}
      <SelectContent alignItemWithTrigger={false} className="bg-popover">
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

type ControlProps = {
  id?: string
  name?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

/**
 * Label, control and error for one quote field. The control (input, select or
 * textarea) gets its id, name and error wiring from here.
 */
function FormField({
  name,
  label,
  error,
  children,
}: {
  name: QuoteField
  label: ReactNode
  error?: string
  children: ReactElement<ControlProps>
}) {
  const id = `quote-${name}`
  const errorId = `${id}-error`
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {cloneElement(children, {
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  )
}
