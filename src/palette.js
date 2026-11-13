/**
 * Image palette extraction: sample RGBA pixels, histogram-quantize, then run a
 * deterministic weighted k-means over the dominant bins.
 *
 * Pure module: the caller supplies `ImageData`-shaped data. No DOM.
 *
 * @module @cfour-hi/dsh-plugin-skinx/palette
 */

import { rgbToHex, rgbToOklch } from './color.js'

/** Brand color used when an image has no usable chroma. */
export const FALLBACK_BRAND = '#3b6ef5'

/** Two clusters closer than this RGB distance are treated as the same color. */
const MERGE_DISTANCE = 24

function binKey(r, g, b) {
  return ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)
}

function distanceSq(a, b) {
  return (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2
}

/**
 * Extract a scored palette from RGBA pixel data.
 *
 * @param {Uint8ClampedArray|Uint8Array} data - RGBA bytes, length >= width*height*4.
 * @param {number} width
 * @param {number} height
 * @param {{ maxColors?: number, sampleBudget?: number }} [options]
 * @returns {{ palette: Array<{hex: string, rgb: {r:number,g:number,b:number}, oklch: {l:number,c:number,h:number}, ratio: number, score: number}>, brand: string, sampled: number }}
 */
export function extractPalette(data, width, height, options = {}) {
  const maxColors = Math.max(1, Math.min(8, options.maxColors ?? 5))
  const sampleBudget = options.sampleBudget ?? 4096
  const area = Math.max(1, width * height)
  const step = Math.max(1, Math.floor(Math.sqrt(area / sampleBudget)))

  const bins = new Map()
  let sampled = 0
  let sumR = 0
  let sumG = 0
  let sumB = 0

  for (let y = 0; y < height; y += step) {
    const row = y * width
    for (let x = 0; x < width; x += step) {
      const i = (row + x) * 4
      if (data[i + 3] < 128) continue
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const oklch = rgbToOklch({ r, g, b })
      if (oklch.l < 0.08 || oklch.l > 0.96) continue

      const key = binKey(r, g, b)
      let bin = bins.get(key)
      if (bin === undefined) {
        bin = { count: 0, r: 0, g: 0, b: 0 }
        bins.set(key, bin)
      }
      bin.count += 1
      bin.r += r
      bin.g += g
      bin.b += b
      sumR += r
      sumG += g
      sumB += b
      sampled += 1
    }
  }

  if (sampled === 0) {
    return { palette: [], brand: FALLBACK_BRAND, sampled: 0, average: undefined }
  }

  const average = (() => {
    const r = Math.round(sumR / sampled)
    const g = Math.round(sumG / sampled)
    const b = Math.round(sumB / sampled)
    return { hex: rgbToHex(r, g, b), rgb: { r, g, b }, oklch: rgbToOklch({ r, g, b }) }
  })()

  const points = [...bins.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 32)
    .map((bin) => ({
      r: bin.r / bin.count,
      g: bin.g / bin.count,
      b: bin.b / bin.count,
      w: bin.count,
    }))

  const k = Math.min(maxColors, points.length)
  let centroids = points.slice(0, k).map((p) => ({ r: p.r, g: p.g, b: p.b }))

  for (let iteration = 0; iteration < 12; iteration += 1) {
    const sums = centroids.map(() => ({ r: 0, g: 0, b: 0, w: 0 }))
    for (const point of points) {
      let best = 0
      let bestDistance = Number.POSITIVE_INFINITY
      for (let c = 0; c < centroids.length; c += 1) {
        const d = distanceSq(point, centroids[c])
        if (d < bestDistance) {
          bestDistance = d
          best = c
        }
      }
      const bucket = sums[best]
      bucket.r += point.r * point.w
      bucket.g += point.g * point.w
      bucket.b += point.b * point.w
      bucket.w += point.w
    }
    centroids = centroids.map((centroid, index) => {
      const bucket = sums[index]
      return bucket.w > 0
        ? { r: bucket.r / bucket.w, g: bucket.g / bucket.w, b: bucket.b / bucket.w }
        : centroid
    })
  }

  // Merge near-identical centroids, keeping the heavier one.
  const merged = []
  for (const centroid of centroids) {
    const existing = merged.find((entry) => distanceSq(entry, centroid) < MERGE_DISTANCE ** 2)
    if (existing === undefined) {
      merged.push({ ...centroid, weight: 1 })
    } else {
      existing.weight += 1
      existing.r = (existing.r + centroid.r) / 2
      existing.g = (existing.g + centroid.g) / 2
      existing.b = (existing.b + centroid.b) / 2
    }
  }

  // Assign every sampled bin to its nearest merged centroid for true ratios.
  const totals = merged.map(() => 0)
  for (const point of points) {
    let best = 0
    let bestDistance = Number.POSITIVE_INFINITY
    for (let c = 0; c < merged.length; c += 1) {
      const d = distanceSq(point, merged[c])
      if (d < bestDistance) {
        bestDistance = d
        best = c
      }
    }
    totals[best] += point.w
  }

  const palette = merged
    .map((centroid, index) => {
      const r = Math.round(centroid.r)
      const g = Math.round(centroid.g)
      const b = Math.round(centroid.b)
      const ratio = totals[index] / sampled
      const oklch = rgbToOklch({ r, g, b })
      const chroma = Math.max(oklch.c, 0.0001)
      const score = Math.sqrt(Math.max(ratio, 0.0001)) * chroma ** 0.8
      return { hex: rgbToHex(r, g, b), rgb: { r, g, b }, oklch, ratio, score }
    })
    .sort((a, b) => b.score - a.score)

  return { palette, brand: pickBrand(palette), sampled, average }
}

/**
 * Choose the most usable brand color from a palette: enough chroma, middling
 * lightness, best score. Fall back to the highest-scored color, then to the
 * built-in brand.
 *
 * @param {Array<{hex: string, oklch: {l:number,c:number,h:number}, score: number}>} palette
 * @returns {string}
 */
export function pickBrand(palette) {
  if (!Array.isArray(palette) || palette.length === 0) return FALLBACK_BRAND
  const usable = palette.filter(
    (entry) => entry.oklch.c >= 0.05 && entry.oklch.l >= 0.18 && entry.oklch.l <= 0.9,
  )
  if (usable.length > 0) return usable[0].hex
  return palette[0].hex
}

/**
 * Turn one picture into a few distinct starting points, because a single
 * extracted palette is ambiguous: the most saturated color, the largest area,
 * and the picture's overall tone usually read very differently.
 *
 * Each candidate carries a brand color and a `tone` in -1..1 that shifts the
 * generated background lightness (negative = darker/moodier, positive =
 * airier).
 *
 * @param {Array<{hex: string, oklch: {l:number,c:number,h:number}, score: number}>} palette
 * @param {{hex: string, oklch: {l:number,c:number,h:number}} | undefined} average
 * @returns {Array<{id: 'vivid'|'dominant'|'tonal'|'default', brand: string, tone: number}>}
 */
export function buildCandidates(palette, average) {
  const entries = Array.isArray(palette)
    ? palette.filter((entry) => entry !== null && typeof entry === 'object' && typeof entry.hex === 'string')
    : []
  const candidates = []

  if (entries.length > 0) {
    const vivid = entries.reduce(
      (best, entry) => (entry.oklch.c > best.oklch.c ? entry : best),
      entries[0],
    )
    candidates.push({ id: 'vivid', brand: vivid.hex, tone: 0 })
    candidates.push({ id: 'dominant', brand: entries[0].hex, tone: 0 })
  }

  if (average !== undefined && average !== null && average.oklch !== undefined) {
    const rawTone = Math.max(-1, Math.min(1, average.oklch.l * 2 - 1))
    // Keep the tonal candidate visibly different from the plain one.
    const tone = rawTone >= -0.1 ? Math.max(0.25, rawTone) : Math.min(-0.25, rawTone)
    candidates.push({ id: 'tonal', brand: average.hex, tone })
  }

  const seen = new Set()
  const unique = candidates.filter((candidate) => {
    const key = `${candidate.brand.toLowerCase()}|${candidate.tone.toFixed(2)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  if (unique.length === 0) unique.push({ id: 'default', brand: FALLBACK_BRAND, tone: 0 })
  return unique.slice(0, 3)
}
