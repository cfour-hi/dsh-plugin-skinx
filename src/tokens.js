/**
 * Turn a brand color into the alias tokens DSH exposes, as light/dark pairs.
 * Pure module, no DOM.
 *
 * The token list mirrors the Client `Theme` inspect provider; every value is a
 * CSS color so `theme.overrideTokens` accepts it. State colors keep their
 * semantic meaning instead of following the picture.
 *
 * @module @cfour-hi/dsh-plugin-skinx/tokens
 */

import { clamp, contrastRatio, ensureContrast, hexToOklch, mixHex, oklchToHex, relativeLuminance, withAlpha } from './color.js'

/** Bumped when the token generator changes, so stored skins can be rebuilt. */
export const TOKEN_VERSION = 4

/** The alias tokens this plugin writes. */
export const TOKEN_NAMES = [
  '--dsw-alias-bg-base',
  '--dsw-alias-bg-layer-1',
  '--dsw-alias-bg-layer-2',
  '--dsw-alias-bg-overlay',
  '--dsw-alias-border-l1',
  '--dsw-alias-border-l2',
  '--dsw-alias-brand-primary',
  '--dsw-alias-label-primary',
  '--dsw-alias-label-primary-inverted',
  '--dsw-alias-label-dimmed',
  '--dsw-alias-label-primary-bluish',
  '--dsw-alias-label-secondary',
  '--dsw-alias-label-tertiary',
  '--dsw-alias-label-caption',
  '--dsw-alias-link',
  '--dsw-alias-state-error-primary',
  '--dsw-alias-state-idle-primary',
  '--dsw-alias-state-success-primary',
  '--dsw-alias-state-warn-primary',
  '--dsw-specific-sidebar-fill',
]

/** Background-family tokens that become translucent when a wallpaper is on. */
const SURFACE_TOKENS = [
  '--dsw-alias-bg-base',
  '--dsw-alias-bg-layer-1',
  '--dsw-alias-bg-layer-2',
  '--dsw-alias-bg-overlay',
  '--dsw-specific-sidebar-fill',
]

const STATE_LIGHT = {
  error: '#d93036',
  idle: '#6b7280',
  success: '#1f9d55',
  warn: '#b7791f',
}

const STATE_DARK = {
  error: '#ff6369',
  idle: '#8b8d98',
  success: '#3dd68c',
  warn: '#f5a524',
}

function hex(l, c, h) {
  return oklchToHex({ l: clamp(l, 0, 1), c: Math.max(0, c), h })
}

function brandFor(brand, lightnessRange, chromaRange, background, target) {
  const color = hexToOklch(brand)
  const hue = Number.isFinite(color.h) ? color.h : 250
  const value = hex(
    clamp(color.l, lightnessRange[0], lightnessRange[1]),
    clamp(color.c, chromaRange[0], chromaRange[1]),
    hue,
  )
  return ensureContrast(value, background, target)
}

/**
 * Build `{ token: { light, dark } }` from one brand color.
 *
 * @param {string} brandHex
 * @param {{ tone?: number }} [options] - tone in -1..1 shifts the background
 *   lightness; negative gives a darker/moodier scheme, positive an airier one.
 * @returns {Record<string, { light: string, dark: string }>}
 */
export function buildTokenPairs(brandHex, options = {}) {
  const base = hexToOklch(brandHex)
  // A near-neutral picture has an unstable hue; pin it to the neutral bluish
  // family instead of tinting text with rounding noise.
  const h = base.c >= 0.01 && Number.isFinite(base.h) ? base.h : 250
  const tone = clamp(Number(options.tone) || 0, -1, 1)
  const lightShift = tone < 0 ? 0.045 * tone : 0.012 * tone
  const darkShift = tone < 0 ? 0.035 * tone : 0.07 * tone
  const lightL = (value) => clamp(value + lightShift, 0, 1)
  const darkL = (value) => clamp(value + darkShift, 0, 1)
  // Text follows the picture too, and by as much as surfaces, so a tone shift
  // visibly moves the labels instead of only the background.
  const labelLightL = (value) => clamp(value + lightShift, 0, 1)
  // Very light text cannot hold chroma in sRGB, so the dark labels stop short
  // of pure white and keep their tint.
  const labelDarkL = (value) => clamp(value + darkShift, 0, 0.94)

  const lightBg = hex(lightL(0.985), 0.006, h)
  const lightLayer1 = hex(lightL(0.998), 0.003, h)
  const lightLayer2 = hex(lightL(0.955), 0.01, h)
  const lightOverlay = hex(lightL(0.998), 0.004, h)

  const darkBg = hex(darkL(0.15), 0.012, h)
  const darkLayer1 = hex(darkL(0.185), 0.012, h)
  const darkLayer2 = hex(darkL(0.225), 0.014, h)
  const darkOverlay = hex(darkL(0.21), 0.012, h)

  // Text keeps the brand hue at a chroma the eye actually reads on a screen.
  // The floor matters more than the ceiling: a neutral label makes the
  // picture-driven recolor invisible on text, so even a grey picture gets a
  // tint, and the ladder (primary > secondary > tertiary > caption) keeps the
  // hierarchy readable while all four stay colored.
  const brandChroma = clamp(base.c, 0, 0.2)
  const labelChroma = (factor, min, max) => clamp(brandChroma * factor, min, max)

  const light = {
    '--dsw-alias-bg-base': lightBg,
    '--dsw-alias-bg-layer-1': lightLayer1,
    '--dsw-alias-bg-layer-2': lightLayer2,
    '--dsw-alias-bg-overlay': lightOverlay,
    '--dsw-alias-border-l1': hex(lightL(0.9), 0.008, h),
    '--dsw-alias-border-l2': hex(lightL(0.82), 0.012, h),
    '--dsw-alias-brand-primary': brandFor(brandHex, [0.44, 0.6], [0.08, 0.19], lightBg, 3),
    '--dsw-alias-label-primary': ensureContrast(
      hex(labelLightL(0.3), labelChroma(1.5, 0.055, 0.115), h),
      lightBg,
      4.5,
    ),
    '--dsw-alias-label-secondary': ensureContrast(
      hex(labelLightL(0.46), labelChroma(1.3, 0.05, 0.1), h),
      lightBg,
      3,
    ),
    '--dsw-alias-label-tertiary': hex(labelLightL(0.58), labelChroma(1.1, 0.045, 0.09), h),
    '--dsw-alias-label-caption': hex(labelLightL(0.67), labelChroma(0.95, 0.04, 0.08), h),
    '--dsw-alias-link': brandFor(brandHex, [0.44, 0.6], [0.1, 0.19], lightBg, 4.5),
    '--dsw-alias-state-error-primary': STATE_LIGHT.error,
    '--dsw-alias-state-idle-primary': STATE_LIGHT.idle,
    '--dsw-alias-state-success-primary': STATE_LIGHT.success,
    '--dsw-alias-state-warn-primary': STATE_LIGHT.warn,
    '--dsw-specific-sidebar-fill': hex(lightL(0.962), 0.01, h),
  }

  const dark = {
    '--dsw-alias-bg-base': darkBg,
    '--dsw-alias-bg-layer-1': darkLayer1,
    '--dsw-alias-bg-layer-2': darkLayer2,
    '--dsw-alias-bg-overlay': darkOverlay,
    '--dsw-alias-border-l1': hex(darkL(0.3), 0.012, h),
    '--dsw-alias-border-l2': hex(darkL(0.38), 0.014, h),
    '--dsw-alias-brand-primary': brandFor(brandHex, [0.6, 0.76], [0.1, 0.2], darkBg, 3),
    '--dsw-alias-label-primary': ensureContrast(
      hex(labelDarkL(0.91), labelChroma(1.2, 0.045, 0.075), h),
      darkBg,
      4.5,
    ),
    '--dsw-alias-label-secondary': ensureContrast(
      hex(labelDarkL(0.74), labelChroma(1.15, 0.042, 0.09), h),
      darkBg,
      3,
    ),
    '--dsw-alias-label-tertiary': hex(labelDarkL(0.62), labelChroma(1.0, 0.038, 0.08), h),
    '--dsw-alias-label-caption': hex(labelDarkL(0.52), labelChroma(0.9, 0.034, 0.07), h),
    '--dsw-alias-link': brandFor(brandHex, [0.62, 0.78], [0.1, 0.2], darkBg, 4.5),
    '--dsw-alias-state-error-primary': STATE_DARK.error,
    '--dsw-alias-state-idle-primary': STATE_DARK.idle,
    '--dsw-alias-state-success-primary': STATE_DARK.success,
    '--dsw-alias-state-warn-primary': STATE_DARK.warn,
    '--dsw-specific-sidebar-fill': hex(darkL(0.175), 0.014, h),
  }

  const pairs = {}
  for (const name of TOKEN_NAMES) {
    pairs[name] = { light: light[name], dark: dark[name] }
  }
  return protectText(pairs)
}

/**
 * Prepare content surfaces for an already protected wallpaper. The base is
 * transparent; deeper layers add a small tint and overlays remain opaque.
 *
 * @param {Record<string, { light: string, dark: string }>} pairs
 * @param {number} opacity - 0.55..1, where 1 keeps opaque tokens.
 * @returns {Record<string, { light: string, dark: string }>}
 */
// The wallpaper tint must protect text even over pure white/black image pixels.
// Below this floor, dark-mode surfaces cannot reliably support light text.
export const MIN_SURFACE_ALPHA = 0.8

const TEXT_TOKENS = TOKEN_NAMES.filter((name) =>
  (name.includes('-label-') && !name.endsWith('-inverted')) ||
  name.includes('-state-') || name === '--dsw-alias-link' || name === '--dsw-alias-brand-primary',
)

function protectText(pairs, alpha = 1) {
  const output = Object.fromEntries(Object.entries(pairs).map(([name, value]) => [name, { ...value }]))
  for (const scheme of ['light', 'dark']) {
    const backgrounds = SURFACE_TOKENS.map((name) =>
      mixHex(mixHex(scheme === 'light' ? '#000000' : '#ffffff', pairs[name][scheme], alpha),
        scheme === 'light' ? '#000000' : '#ffffff', 0.12),
    )
    // Reserve another 12% for badge/hover tints used by the UI.
    // All surfaces stay on the same side of the text. The extreme luminance
    // bounds every image pixel, every surface, and further nested surfaces.
    const worst = backgrounds.reduce((a, b) =>
      (scheme === 'light' ? relativeLuminance(a) < relativeLuminance(b) : relativeLuminance(a) > relativeLuminance(b)) ? a : b,
    )
    for (const name of TEXT_TOKENS) {
      const source = pairs[name]?.[scheme] ?? pairs['--dsw-alias-label-secondary'][scheme]
      output[name] ??= {}
      output[name][scheme] = ensureContrast(source, worst, 4.5)
    }
    const brand = output['--dsw-alias-brand-primary'][scheme]
    output['--dsw-alias-label-primary-inverted'] ??= {}
    output['--dsw-alias-label-primary-inverted'][scheme] =
      contrastRatio('#ffffff', brand) >= contrastRatio('#000000', brand) ? '#ffffff' : '#000000'
  }
  return output
}

export function wallpaperSurfaceOpacity(opacity) {
  return clamp(Number.isFinite(opacity) ? opacity : 0.85, MIN_SURFACE_ALPHA, 1)
}

export function withWallpaperAlpha(pairs, opacity) {
  const baseAlpha = wallpaperSurfaceOpacity(opacity)
  const output = protectText(pairs, baseAlpha)
  // Menus/dialogs are opaque: their backdrop can itself include a dark modal
  // scrim or unrelated content, beyond the wallpaper surface model.
  const extra = {
    '--dsw-alias-bg-base': 0,
    '--dsw-alias-bg-layer-1': 0.06,
    '--dsw-alias-bg-layer-2': 0.1,
    '--dsw-specific-sidebar-fill': 0.03,
  }
  for (const name of SURFACE_TOKENS) {
    if (name === '--dsw-alias-bg-overlay') continue
    // The wallpaper itself supplies the protective tint once. Content surfaces
    // only add a small depth tint, rather than repeating the full mask.
    const alpha = extra[name]
    output[name] = {
      light: withAlpha(pairs[name].light, alpha),
      dark: withAlpha(pairs[name].dark, alpha),
    }
  }
  return output
}

// UI strength increases image visibility while stored opacity remains compatible.
export function wallpaperStrength(opacity) {
  return Math.round((1 - wallpaperSurfaceOpacity(opacity)) / (1 - MIN_SURFACE_ALPHA) * 100)
}
export function opacityForStrength(strength) {
  return 1 - clamp(Number(strength) || 0, 0, 100) / 100 * (1 - MIN_SURFACE_ALPHA)
}
