// Placeholder media until Piromania supplies its own footage and photos.
// Every entry records its source so it can be swapped or credited.

// Hero montage: five stock clips cut together with ffmpeg, 13 s, looping,
// 1080p from 1440p/4K sources. Pexels License: #34425749 fireworks display,
// #38734188 wedding with spark fountains, #27806812 and #27806813 Correfoc
// Badalona (ground fountains; red smoke and sparks), #33528725 fireworks over
// a river city. Replace with an edit of Piromania's own shows; keep `cues` in
// step with the cuts.
export const heroMedia = {
  video: "/videos/hero-1080.mp4", // 4.9 MB
  // 3.3 MB, portrait phones: a centred 608×1080 crop of the 1080p cut, so the
  // tall hero shows the footage at full resolution instead of a 540p strip
  // stretched ~5×. ffmpeg -vf crop=608:1080 -crf 24 -preset slower.
  videoPortrait: "/videos/hero-portrait.mp4",
  poster: "/images/hero-poster.jpg", // first frame
  /** Start time (s) of each cut and the label shown while it plays. */
  cues: [
    { at: 0, clip: "exterior" },
    { at: 2.6, clip: "weddings" },
    { at: 5.4, clip: "ground" },
    { at: 8.0, clip: "cities" },
    { at: 10.6, clip: "effects" },
  ],
} as const

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`

// Unsplash License, free tier only
export const photos = {
  exterior: {
    src: unsplash("1531150436398-cfc45278ec51"),
    credit: "Sharosh Rajasekher",
  },
  interior: {
    src: unsplash("1763429756703-926f0054f215"),
    credit: "Ilya Semenov",
  },
  ground: {
    src: unsplash("1561393967-3cc53de80fc0"),
    credit: "Briana Tozour",
  },
  effects: {
    src: unsplash("1593573969589-c416b9c926de"),
    credit: "Wan San Yip",
  },
  weddings: {
    src: unsplash("1659735726409-f019111e4820"),
    credit: "Jonathan Borba",
  },
  corporate: {
    // A stage under spark showers; no logos or readable text.
    src: unsplash("1754492885592-34e5fe3f0093"),
    credit: "Unsplash photo 7k9O6VV6_q8",
  },
  cities: {
    src: unsplash("1498931299472-f7a63a5a1cfa"),
    credit: "Ray Hennessy",
  },
} as const
