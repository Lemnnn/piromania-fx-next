import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // Placeholder media hosts (see src/lib/media.ts). Drop them once the
    // client's own footage is self-hosted.
    remotePatterns: [
      new URL("https://images.unsplash.com/**"),
      new URL("https://assets.mixkit.co/videos/**"),
    ],
  },
}

export default nextConfig
