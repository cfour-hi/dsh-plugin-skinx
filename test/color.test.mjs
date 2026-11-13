import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  contrastRatio,
  ensureContrast,
  hexToOklch,
  hexToRgb,
  mixHex,
  oklchToHex,
  relativeLuminance,
  rgbToHex,
  rgbToOklch,
  withAlpha,
} from '../src/color.js'

test('hex parsing and formatting round-trips', () => {
  assert.deepEqual(hexToRgb('#3b6ef5'), { r: 59, g: 110, b: 245 })
  assert.deepEqual(hexToRgb('#fff'), { r: 255, g: 255, b: 255 })
  assert.equal(rgbToHex(59, 110, 245), '#3b6ef5')
  assert.throws(() => hexToRgb('nope'), TypeError)
})

test('white and black are the OKLCH extremes with no chroma', () => {
  const white = hexToOklch('#ffffff')
  assert.ok(white.l > 0.99)
  assert.ok(white.c < 0.001)
  const black = hexToOklch('#000000')
  assert.ok(black.l < 0.001)
})

test('OKLCH conversion round-trips within one byte', () => {
  for (const hex of ['#3b6ef5', '#d93036', '#1f9d55', '#8a6d3b', '#e5e7eb']) {
    const rgb = hexToRgb(hex)
    const back = hexToOklch(hex)
    const rebuilt = oklchToHex(back)
    const expected = rgbToHex(rgb.r, rgb.g, rgb.b)
    assert.equal(rebuilt, expected, `${hex} -> ${rebuilt} !== ${expected}`)
  }
})

test('WCAG contrast landmarks hold', () => {
  assert.ok(Math.abs(contrastRatio('#ffffff', '#000000') - 21) < 0.01)
  assert.ok(Math.abs(contrastRatio('#ffffff', '#ffffff') - 1) < 1e-9)
  assert.ok(Math.abs(relativeLuminance('#ffffff') - 1) < 1e-9)
  assert.ok(Math.abs(relativeLuminance('#000000')) < 1e-9)
})

test('ensureContrast reaches the requested ratio', () => {
  const fixed = ensureContrast('#888888', '#ffffff', 4.5)
  assert.ok(contrastRatio(fixed, '#ffffff') >= 4.5, `${fixed} is still too light`)
  const onDark = ensureContrast('#333333', '#111111', 4.5)
  assert.ok(contrastRatio(onDark, '#111111') >= 4.5, `${onDark} is still too dark`)
})

test('withAlpha emits a usable rgba color', () => {
  assert.equal(withAlpha('#3b6ef5', 0.5), 'rgba(59, 110, 245, 0.5)')
})

test('mixHex walks toward the second color', () => {
  assert.equal(mixHex('#000000', '#ffffff', 0), '#000000')
  assert.equal(mixHex('#000000', '#ffffff', 1), '#ffffff')
})


test('contrast correction chooses a reachable direction on middle grey', () => {
  for (const background of ['#777777', '#888888', '#999999', '#aaaaaa']) {
    const result = ensureContrast(background, background, 4.5)
    assert.ok(contrastRatio(result, background) >= 4.5, `${background}: ${result}`)
  }
})
