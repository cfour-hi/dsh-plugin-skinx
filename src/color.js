/**
 * Pure color math for SkinX: sRGB, OKLab/OKLCH and WCAG contrast.
 *
 * No DOM and no package imports, so the same code runs in the browser bundle
 * and in `node --test`.
 *
 * @module @cfour-hi/dsh-plugin-skinx/color
 */

export function clamp(value, lo, hi) {
  return value < lo ? lo : value > hi ? hi : value
}

/** Parse `#rgb` or `#rrggbb` into 0..255 channels. */
export function hexToRgb(hex) {
  let h = String(hex).trim().replace(/^#/, '')
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new TypeError(`invalid hex color: ${String(hex)}`)
  return {
    r: Number.parseInt(h.slice(0, 2), 16),
    g: Number.parseInt(h.slice(2, 4), 16),
    b: Number.parseInt(h.slice(4, 6), 16),
  }
}

/** Format 0..255 channels as `#rrggbb`. */
export function rgbToHex(r, g, b) {
  const to = (v) =>
    Math.round(clamp(v, 0, 255))
      .toString(16)
      .padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

/** sRGB channel (0..255) to linear light (0..1). */
export function srgbToLinear(channel) {
  const v = channel / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

/** Linear light (0..1) to sRGB channel (0..255). */
export function linearToSrgb(value) {
  const v = value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055
  return clamp(v * 255, 0, 255)
}

/** sRGB 0..255 to OKLab (L 0..1, a/b roughly -0.4..0.4). */
export function rgbToOklab(r, g, b) {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  }
}

/** OKLab to sRGB 0..255 (clamped into gamut). */
export function oklabToRgb({ L, a, b }) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  return {
    r: linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  }
}

/** sRGB 0..255 to OKLCH (l 0..1, c >= 0, h degrees 0..360). */
export function rgbToOklch({ r, g, b }) {
  const lab = rgbToOklab(r, g, b)
  const c = Math.hypot(lab.a, lab.b)
  let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: lab.L, c, h }
}

/** OKLCH to sRGB 0..255 (clamped into gamut). */
export function oklchToRgb({ l, c, h }) {
  const rad = (h * Math.PI) / 180
  return oklabToRgb({ L: l, a: c * Math.cos(rad), b: c * Math.sin(rad) })
}

/** OKLCH to `#rrggbb`. */
export function oklchToHex(oklch) {
  const rgb = oklchToRgb(oklch)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

/** `#rrggbb` to OKLCH. */
export function hexToOklch(hex) {
  return rgbToOklch(hexToRgb(hex))
}

/** WCAG relative luminance of a hex color. */
export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

/** WCAG contrast ratio between two hex colors (>= 1). */
export function contrastRatio(a, b) {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const hi = Math.max(la, lb)
  const lo = Math.min(la, lb)
  return (hi + 0.05) / (lo + 0.05)
}

/** A hex color as a CSS `rgba(...)` string. */
export function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`
}

/** Linear sRGB-space mix between two hex colors, t in 0..1. */
export function mixHex(a, b, t) {
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  const k = clamp(t, 0, 1)
  return rgbToHex(A.r + (B.r - A.r) * k, A.g + (B.g - A.g) * k, A.b + (B.b - A.b) * k)
}

/**
 * Nudge a foreground color in OKLCH lightness until it reaches `target`
 * contrast against `background`, or fall back to black/white at the extremes.
 */
export function ensureContrast(foreground, background, target) {
  if (contrastRatio(foreground, background) >= target) return foreground
  const darkBackground = contrastRatio('#ffffff', background) >= contrastRatio('#000000', background)
  const direction = darkBackground ? 1 : -1
  let color = hexToOklch(foreground)
  for (let i = 0; i < 80; i += 1) {
    color = { ...color, l: clamp(color.l + direction * 0.01, 0, 1) }
    const candidate = oklchToHex(color)
    if (contrastRatio(candidate, background) >= target) return candidate
    if (color.l <= 0 || color.l >= 1) break
  }
  return darkBackground ? '#ffffff' : '#000000'
}
