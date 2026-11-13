import assert from 'node:assert/strict'
import { test } from 'node:test'

import { FALLBACK_BRAND, buildCandidates, extractPalette, pickBrand } from '../src/palette.js'

function paint(width, height, painter) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = painter(x, y)
      const i = (y * width + x) * 4
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = a
    }
  }
  return data
}

test('a mostly-red picture yields a reddish brand', () => {
  const data = paint(32, 32, (x) => (x < 24 ? [204, 34, 34, 255] : [34, 51, 204, 255]))
  const result = extractPalette(data, 32, 32)
  assert.ok(result.palette.length > 0)
  assert.ok(result.sampled > 0)
  const brand = result.palette.find((entry) => entry.hex === result.brand) ?? result.palette[0]
  const rgb = brand.rgb
  assert.ok(rgb.r > rgb.b, `expected red-dominant brand, got ${brand.hex}`)
})

test('extraction is deterministic', () => {
  const data = paint(24, 24, (x, y) => [(x * 9) % 256, (y * 11) % 256, ((x + y) * 7) % 256, 255])
  const first = extractPalette(data, 24, 24)
  const second = extractPalette(data, 24, 24)
  assert.deepEqual(first.palette, second.palette)
})

test('fully transparent pixels fall back to the built-in brand', () => {
  const data = new Uint8ClampedArray(8 * 8 * 4)
  const result = extractPalette(data, 8, 8)
  assert.equal(result.palette.length, 0)
  assert.equal(result.brand, FALLBACK_BRAND)
  assert.equal(pickBrand([]), FALLBACK_BRAND)
})

test('near-black and near-white pixels are ignored', () => {
  const data = paint(16, 16, (x) => (x < 8 ? [255, 255, 255, 255] : [0, 0, 0, 255]))
  const result = extractPalette(data, 16, 16)
  assert.equal(result.palette.length, 0)
})

test('candidates are distinct and carry a usable tone', () => {
  const data = paint(40, 40, (x, y) => {
    if (x < 24) return [200, 40, 40, 255] // 60% warm red
    if (x < 34) return [40, 60, 200, 255] // 25% blue
    return [235, 235, 235, 255] // 15% light neutral
  })
  const { palette, average } = extractPalette(data, 40, 40)
  const candidates = buildCandidates(palette, average)
  assert.ok(candidates.length >= 1 && candidates.length <= 3)
  for (const candidate of candidates) {
    assert.match(candidate.brand, /^#[0-9a-f]{6}$/u)
    assert.ok(Math.abs(candidate.tone) <= 1)
  }
  const keys = candidates.map((candidate) => `${candidate.brand}|${candidate.tone}`)
  assert.equal(new Set(keys).size, keys.length, 'candidates must not repeat')
  const tonal = candidates.find((candidate) => candidate.id === 'tonal')
  if (tonal !== undefined) assert.ok(Math.abs(tonal.tone) >= 0.25)
})

test('an empty palette still offers the fallback candidate', () => {
  const candidates = buildCandidates([], undefined)
  assert.deepEqual(candidates, [{ id: 'default', brand: FALLBACK_BRAND, tone: 0 }])
})
