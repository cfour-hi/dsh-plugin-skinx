import assert from 'node:assert/strict'
import { test } from 'node:test'

import { contrastRatio, hexToOklch, rgbToHex, mixHex } from '../src/color.js'
import { TOKEN_NAMES, buildTokenPairs, withWallpaperAlpha, wallpaperSurfaceOpacity, wallpaperStrength, opacityForStrength } from '../src/tokens.js'

const BRANDS = ['#3b6ef5', '#e0463c', '#1f9d55', '#d97706', '#8b5cf6', '#0ea5e9']

test('every brand produces the complete light/dark token set', () => {
  for (const brand of BRANDS) {
    const pairs = buildTokenPairs(brand)
    assert.deepEqual(Object.keys(pairs).sort(), [...TOKEN_NAMES].sort())
    for (const name of TOKEN_NAMES) {
      assert.match(pairs[name].light, /^#[0-9a-f]{6}$/u, `${brand} ${name} light`)
      assert.match(pairs[name].dark, /^#[0-9a-f]{6}$/u, `${brand} ${name} dark`)
    }
  }
})

test('label tokens meet WCAG targets in both schemes', () => {
  for (const brand of BRANDS) {
    const pairs = buildTokenPairs(brand)
    const lightBg = pairs['--dsw-alias-bg-base'].light
    const darkBg = pairs['--dsw-alias-bg-base'].dark
    assert.ok(
      contrastRatio(pairs['--dsw-alias-label-primary'].light, lightBg) >= 4.5,
      `${brand}: light primary label`,
    )
    assert.ok(
      contrastRatio(pairs['--dsw-alias-label-secondary'].light, lightBg) >= 3,
      `${brand}: light secondary label`,
    )
    assert.ok(
      contrastRatio(pairs['--dsw-alias-label-primary'].dark, darkBg) >= 4.5,
      `${brand}: dark primary label`,
    )
    assert.ok(
      contrastRatio(pairs['--dsw-alias-label-secondary'].dark, darkBg) >= 3,
      `${brand}: dark secondary label`,
    )
  }
})

test('brand token stays distinguishable from the base background', () => {
  for (const brand of BRANDS) {
    const pairs = buildTokenPairs(brand)
    assert.ok(
      contrastRatio(
        pairs['--dsw-alias-brand-primary'].light,
        pairs['--dsw-alias-bg-base'].light,
      ) >= 2.5,
      `${brand}: light brand`,
    )
    assert.ok(
      contrastRatio(
        pairs['--dsw-alias-brand-primary'].dark,
        pairs['--dsw-alias-bg-base'].dark,
      ) >= 2.5,
      `${brand}: dark brand`,
    )
  }
})

test('state colors keep their semantic values regardless of the picture', () => {
  const a = buildTokenPairs('#3b6ef5')['--dsw-alias-state-error-primary']
  const b = buildTokenPairs('#1f9d55')['--dsw-alias-state-error-primary']
  assert.deepEqual(a, b)
})

test('wallpaper preserves already-safe primary text', () => {
  const pairs = buildTokenPairs('#3b6ef5')
  const layered = withWallpaperAlpha(pairs, 0.8)
  assert.match(
    layered['--dsw-alias-bg-base'].light,
    /^rgba\(\d+, \d+, \d+, 0\)$/u,
  )
  assert.match(layered['--dsw-alias-label-primary'].light, /^#[0-9a-f]{6}$/u)
  assert.equal(
    layered['--dsw-alias-label-primary'].light,
    pairs['--dsw-alias-label-primary'].light,
  )
})

test('tone shifts the background family but keeps labels readable', () => {
  const base = buildTokenPairs('#3b6ef5')
  const darker = buildTokenPairs('#3b6ef5', { tone: -1 })
  const lighter = buildTokenPairs('#3b6ef5', { tone: 1 })
  const lightL = (pairs) => hexToOklch(pairs['--dsw-alias-bg-base'].light).l
  const darkL = (pairs) => hexToOklch(pairs['--dsw-alias-bg-base'].dark).l

  assert.ok(lightL(darker) < lightL(base))
  assert.ok(lightL(lighter) > lightL(base))
  assert.ok(darkL(darker) < darkL(base))
  assert.ok(darkL(lighter) > darkL(base))

  for (const pairs of [darker, lighter]) {
    assert.ok(
      contrastRatio(pairs['--dsw-alias-label-primary'].light, pairs['--dsw-alias-bg-base'].light) >= 4.5,
    )
    assert.ok(
      contrastRatio(pairs['--dsw-alias-label-primary'].dark, pairs['--dsw-alias-bg-base'].dark) >= 4.5,
    )
  }
})

test('an unknown tone is treated as zero', () => {
  assert.deepEqual(buildTokenPairs('#3b6ef5', { tone: Number.NaN }), buildTokenPairs('#3b6ef5'))
})

test('label tokens carry a visible brand tint', () => {
  const brand = '#d9480f'
  const brandHue = hexToOklch(brand).h
  const pairs = buildTokenPairs(brand)
  const hueGap = (a, b) => {
    const diff = Math.abs(a - b) % 360
    return diff > 180 ? 360 - diff : diff
  }
  for (const scheme of ['light', 'dark']) {
    const primary = hexToOklch(pairs['--dsw-alias-label-primary'][scheme])
    const secondary = hexToOklch(pairs['--dsw-alias-label-secondary'][scheme])
    assert.ok(primary.c >= 0.045, `${scheme} primary chroma ${primary.c}`)
    assert.ok(secondary.c >= 0.035, `${scheme} secondary chroma ${secondary.c}`)
    assert.ok(hueGap(primary.h, brandHue) <= 12, `${scheme} primary hue drifted`)
    assert.ok(hueGap(secondary.h, brandHue) <= 12, `${scheme} secondary hue drifted`)
  }
})

test('tertiary, caption and link text are themed too', () => {
  const pairs = buildTokenPairs('#d9480f')
  for (const name of [
    '--dsw-alias-label-tertiary',
    '--dsw-alias-label-caption',
    '--dsw-alias-link',
  ]) {
    for (const scheme of ['light', 'dark']) {
      assert.ok(hexToOklch(pairs[name][scheme]).c >= 0.028, `${name} ${scheme}`)
    }
  }
  assert.ok(
    contrastRatio(
      pairs['--dsw-alias-link'].light,
      pairs['--dsw-alias-bg-base'].light,
    ) >= 4.5,
  )
  assert.ok(
    contrastRatio(
      pairs['--dsw-alias-link'].dark,
      pairs['--dsw-alias-bg-base'].dark,
    ) >= 4.5,
  )
})

test('tone shifts the labels, not just the background', () => {
  const darker = buildTokenPairs('#3b6ef5', { tone: -1 })
  const lighter = buildTokenPairs('#3b6ef5', { tone: 1 })
  const lightL = (pairs) => hexToOklch(pairs['--dsw-alias-label-primary'].light).l
  const darkL = (pairs) => hexToOklch(pairs['--dsw-alias-label-primary'].dark).l
  assert.ok(lightL(darker) < lightL(lighter))
  assert.ok(darkL(darker) < darkL(lighter))
})

test('uses the sidebar token name DSH actually defines', () => {
  assert.ok(TOKEN_NAMES.includes('--dsw-specific-sidebar-fill'))
  assert.ok(!TOKEN_NAMES.includes('--dsw-alias-specific-sidebar-fill'))
  assert.ok(Object.hasOwn(buildTokenPairs('#3b6ef5'), '--dsw-specific-sidebar-fill'))
})

test('a grey picture still gives a slightly tinted, readable label', () => {
  const pairs = buildTokenPairs('#8a8a8a')
  assert.ok(hexToOklch(pairs['--dsw-alias-label-primary'].light).c >= 0.04)
  assert.ok(
    contrastRatio(pairs['--dsw-alias-label-primary'].light, pairs['--dsw-alias-bg-base'].light) >= 4.5,
  )
  assert.ok(
    contrastRatio(pairs['--dsw-alias-label-primary'].dark, pairs['--dsw-alias-bg-base'].dark) >= 4.5,
  )
})


// Independent browser-style alpha compositing, including nested surfaces.
function composite(css, backdrop) {
  if (css.startsWith('#')) return css
  const [r, g, b, a] = css.match(/[\d.]+/g).map(Number)
  const channels = backdrop.slice(1).match(/../g).map((v) => parseInt(v, 16))
  return rgbToHex(...[r, g, b].map((v, i) => v * a + channels[i] * (1 - a)))
}

test('all text stays readable across tones, surfaces and extreme wallpaper pixels', () => {
  const surfaces = TOKEN_NAMES.filter((name) => name.includes('-bg-') || name.endsWith('sidebar-fill'))
  const text = TOKEN_NAMES.filter((name) =>
    (name.includes('-label-') && !name.endsWith('-inverted')) || name.includes('-state-') ||
    name.endsWith('-link') || name.endsWith('-brand-primary'))
  const pixels = ['#000000', '#ffffff', '#888888', '#ff0000', '#00ff00', '#0000ff']
  for (const brand of [...BRANDS, '#ffffff', '#000000', '#888888', '#ffff00', '#00ffff']) {
    for (const tone of [-1, 0, 1]) {
      const original = buildTokenPairs(brand, { tone })
      for (const opacity of [null, 0.55, 0.72, 0.85, 1]) {
        const pairs = opacity === null ? original : withWallpaperAlpha(original, opacity)
        for (const scheme of ['light', 'dark']) {
          for (const pixel of pixels) {
            const protectedPixel = opacity === null ? pixel : mixHex(pixel, pairs['--dsw-alias-bg-overlay'][scheme], wallpaperSurfaceOpacity(opacity))
            const base = composite(pairs['--dsw-alias-bg-base'][scheme], protectedPixel)
            for (const surface of surfaces) {
              for (const bg of [composite(pairs[surface][scheme], protectedPixel), composite(pairs[surface][scheme], base)]) {
                for (const name of text) {
                  const tinted = mixHex(bg, scheme === 'light' ? '#000000' : '#ffffff', 0.12)
                  const ratio = Math.min(contrastRatio(pairs[name][scheme], bg), contrastRatio(pairs[name][scheme], tinted))
                  assert.ok(ratio >= 4.5, `${brand} tone=${tone} opacity=${opacity} ${scheme} ${name} on ${surface}/${pixel}: ${ratio}`)
                }
              }
            }
          }
          assert.ok(contrastRatio(pairs['--dsw-alias-brand-primary'][scheme], pairs['--dsw-alias-label-primary-inverted'][scheme]) >= 4.5)
        }
      }
      assert.deepEqual(original, buildTokenPairs(brand, { tone }), 'wallpaper must not mutate saved tokens')
    }
  }
})

test('wallpaper keeps overlays opaque and normalizes unsafe opacity', () => {
  const pairs = buildTokenPairs('#3b6ef5')
  for (const opacity of [0, 0.55, NaN, Infinity]) {
    const output = withWallpaperAlpha(pairs, opacity)
    assert.deepEqual(output['--dsw-alias-bg-overlay'], pairs['--dsw-alias-bg-overlay'])
    assert.ok(!output['--dsw-alias-bg-base'].light.includes('NaN'))
  }
})


test('wallpaper remains visible through nested content surfaces', () => {
  const pairs = withWallpaperAlpha(buildTokenPairs('#3b6ef5'), 0.85)
  for (const scheme of ['light', 'dark']) {
    // White/black pixel separation measures retained image detail after paint.
    const paint = (pixel) => {
      let color = mixHex(pixel, pairs['--dsw-alias-bg-overlay'][scheme], 0.85)
      for (const name of ['--dsw-alias-bg-base', '--dsw-alias-bg-base', '--dsw-alias-bg-layer-1']) {
        color = composite(pairs[name][scheme], color)
      }
      return parseInt(color.slice(1, 3), 16)
    }
    assert.ok(paint('#ffffff') - paint('#000000') >= 35,
      'nested surfaces must retain roughly 14% of image contrast, not mask it repeatedly')
  }
})

 test('wallpaper strength increases visibility without weakening the safety floor', () => {
 assert.equal(opacityForStrength(0),1)
 assert.equal(opacityForStrength(100),0.8)
 for(const strength of [0,25,50,75,100]) assert.equal(wallpaperStrength(opacityForStrength(strength)),strength)
 })
