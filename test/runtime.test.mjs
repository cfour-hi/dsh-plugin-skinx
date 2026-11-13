import assert from 'node:assert/strict'
import { test } from 'node:test'

import { contrastRatio, hexToOklch } from '../src/color.js'
import { tokensForSkin } from '../src/runtime.js'
import { TOKEN_VERSION } from '../src/tokens.js'

test('stored skins at the current token version keep their exact tokens', () => {
  const tokens = {
    '--dsw-alias-label-primary': { light: '#111111', dark: '#eeeeee' },
  }
  assert.equal(tokensForSkin({ tokenVersion: TOKEN_VERSION, tokens }), tokens)
})

test('older stored skins are rebuilt with tinted, readable labels', () => {
  const legacy = {
    tokenVersion: 0,
    palette: ['#c2410c'],
    tokens: {
      '--dsw-alias-brand-primary': { light: '#c2410c', dark: '#fb923c' },
      '--dsw-alias-label-primary': { light: '#1a1a1a', dark: '#f5f5f5' },
    },
  }
  const rebuilt = tokensForSkin(legacy)
  const label = rebuilt['--dsw-alias-label-primary']
  assert.notEqual(label.light, '#1a1a1a')
  assert.ok(hexToOklch(label.light).c >= 0.04)
  assert.ok(contrastRatio(label.light, rebuilt['--dsw-alias-bg-base'].light) >= 4.5)
  assert.ok(contrastRatio(label.dark, rebuilt['--dsw-alias-bg-base'].dark) >= 4.5)
})

test('a stored skin without tokens falls back to its palette', () => {
  const rebuilt = tokensForSkin({ palette: ['#1f9d55'] })
  assert.match(rebuilt['--dsw-alias-brand-primary'].light, /^#[0-9a-f]{6}$/u)
})
