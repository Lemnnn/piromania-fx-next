import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    // The root layout sits under [lang], so a not-found.tsx there can't
    // server-render unmatched URLs; app/global-not-found.tsx handles them.
    globalNotFound: true,
  },
  images: {
    // AVIF is ~20% smaller than WebP; browsers without it still get WebP.
    formats: ["image/avif", "image/webp"],
    // Remote originals are multi-MB: keep optimized variants for 30 days
    // instead of re-fetching them every 4 hours.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Placeholder media hosts (see src/lib/media.ts). Drop them once the
    // client's own footage is self-hosted.
    remotePatterns: [new URL("https://images.unsplash.com/**")],
  },
}

export default nextConfig
