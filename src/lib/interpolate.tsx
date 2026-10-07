import { Fragment, type ReactNode } from "react"

/** Fills "{name}" placeholders in a dictionary string with text or elements. */
export function interpolate(
  template: string,
  values: Record<string, ReactNode>
): ReactNode {
  return template.split(/\{(\w+)\}/).map((part, i) =>
    // Odd indexes are the placeholder names captured by the split.
    i % 2 ? <Fragment key={i}>{values[part] ?? `{${part}}`}</Fragment> : part
  )
}
