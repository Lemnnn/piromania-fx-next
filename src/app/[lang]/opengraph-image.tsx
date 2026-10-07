import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { hasLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"

// The link preview for WhatsApp, Facebook and search: the brand wordmark and
// tagline on the night-sky background.
export const alt = "Piromania"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : "ro")
  const wordmark = await readFile(
    join(process.cwd(), "public/brand/wordmark.svg"),
    "base64"
  )

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 80px",
        gap: 40,
        background: "#140808",
        color: "#f4ece8",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/svg+xml;base64,${wordmark}`}
        width={1040}
        height={125}
        alt=""
      />
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 64, height: 6, background: "#eb3d00" }} />
        <div style={{ fontSize: 44, letterSpacing: 2 }}>
          {dict.hero.title.toUpperCase()}
        </div>
      </div>
    </div>,
    size
  )
}
