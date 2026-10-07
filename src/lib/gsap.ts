"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register once for the whole app; import GSAP from here, not from "gsap".
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin)

/** Letters for scramble effects; uppercase to match the tag labels. */
export const scrambleChars = "ABCDEFGHIJKLMNOPRSTUVZ0123456789"

/** Desktop layouts, where the pin and the parallax effects run. */
export const desktop = "(min-width: 1024px)"

export { gsap, ScrollTrigger, useGSAP }
