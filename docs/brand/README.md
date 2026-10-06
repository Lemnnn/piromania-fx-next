# Piromania logo

Vector rebuild of the original Piromania logo (2026-10-06). The originals on
piromania.ro are only 322×89 px; see `original/`.

## Files

`vector/` (SVG, scale to any size):

| File | Use |
|---|---|
| `piromania-mark.svg` | Flame disc, brand red. Favicon, app icon, avatar |
| `piromania-mark-white.svg` | Disc in white, for red or burgundy backgrounds |
| `piromania-mark-ink.svg` | Disc in near-black, for one-colour print |
| `piromania-logo-horizontal.svg` | Disc and wordmark side by side, dark text, for light backgrounds (the original layout) |
| `piromania-logo-horizontal-on-dark.svg` | Same with white text, for dark backgrounds (this website) |
| `piromania-logo-horizontal-white.svg` | All white, for red or burgundy backgrounds |
| `piromania-logo-stacked*.svg` | Disc above the wordmark, in the same three colourways |

`png/`: transparent PNG exports (mark at 512/1024/2048 px, horizontal at 2400 px,
stacked at 1600 px) for tools that don't accept SVG.

Open `vector/_preview.html` in a browser to see every version on its background.

Colours: flame `#EB3D00` (sampled from the original disc), ink `#1A1A1A`, white.

## How it was made, and its limits

The disc and the wordmark were traced from the original 322×89 PNG: enlarged
16×, softened slightly, traced into curves, then smoothed so the long curves
lose their pixel steps while the star tips and corners stay sharp. An overlay
check matches the original's shape closely.

- Up to around 1000 px, the result is clean.
- At very large sizes (2000 px+, signage, large print), the long curves still
  show slight facets from the tiny source. For those jobs, ask the client for
  the original vector file (`.ai`/`.eps`/`.pdf`/`.cdr`), or have a designer do
  a polish pass on these SVGs.
- "FANTEZII EXPLOZIVE" was only about 9 px tall in the source, so its letters
  are softer than the original typeface. For print, reset it in a matching bold
  geometric sans.
