// Placeholder media until Piromania supplies its own footage and photos.
// Every entry records its source so it can be swapped or credited.

export const heroMedia = {
  // Mixkit "Fireworks in the sky" (#4151), Mixkit License
  video: "https://assets.mixkit.co/videos/4151/4151-720.mp4",
  poster: "https://assets.mixkit.co/videos/4151/4151-thumb-720-0.jpg",
  width: 1280,
  height: 720,
}

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
    src: unsplash("1768396855390-0728fa9c21e1"),
    credit: "Andy Wang",
  },
  cities: {
    src: unsplash("1498931299472-f7a63a5a1cfa"),
    credit: "Ray Hennessy",
  },
} as const

export type PhotoKey = keyof typeof photos
