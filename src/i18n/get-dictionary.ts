import "server-only"

import type { Locale } from "./config"

const dictionaries = {
  ro: () => import("./dictionaries/ro.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
}

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ro"]>>

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]()
