"use client"

import { useSyncExternalStore } from "react"

const noopSubscribe = () => () => {}

/**
 * The current year. Pages are prerendered, so the server renders `buildYear`
 * (passed in, so hydration matches the HTML); the browser then swaps in
 * today's year, and the © line is never stale.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => buildYear
  )
  return <>{year}</>
}
