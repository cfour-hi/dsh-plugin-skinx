#!/usr/bin/env node
/**
 * Render the README example screenshots from `scripts/docs-shots/page.js`.
 *
 * Every shot is painted by the shipped palette, token and wallpaper code, so a
 * docs refresh cannot drift away from what the plugin actually does. The host
 * shell around the dialog is a light-weight stand-in, not the real Harness UI.
 *
 * Usage: node scripts/build-docs-shots.mjs [only-name-substring]
 */

import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PAGE = pathToFileURL(join(ROOT, 'scripts/docs-shots/page.html'))
const OUT = join(ROOT, 'docs/examples')
const CHROME =
  process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const SOURCE = 'docs/examples/source'
const SKIN = {
  crimson: `${SOURCE}/skin-mwdo0yl8-9u3idy.webp`,
  violet: `${SOURCE}/skin-mweb8w4g-kd0wjy.webp`,
  blue: `${SOURCE}/skin-mwep9zx6-94ksiu.webp`,
  portrait: `${SOURCE}/skin-mwef1qar-vu5fod.webp`,
  snow: `${SOURCE}/skin-mwep1hii-hwl2fa.webp`,
  frost: `${SOURCE}/skin-mwep7vwr-oulbsh.webp`,
}
const CARDS = [SKIN.crimson, SKIN.frost, SKIN.blue]

/** Every scene is rendered once per locale; names come from page.js. */
const SCENES = ['zh', 'en'].flatMap((locale) => [
  {
    file: `wallpaper.${locale}.jpg`,
    locale,
    scheme: 'dark',
    mode: 'applied',
    photo: SKIN.crimson,
    opacity: 0.8,
    blur: 0,
    scope: 'full',
    fit: 'cover',
    brandMark: '1',
  },
  {
    file: `skin-1.${locale}.jpg`,
    locale,
    scheme: 'dark',
    mode: 'applied',
    photo: SKIN.violet,
    opacity: 0.8,
    blur: 0,
    scope: 'full',
    fit: 'cover',
    brandMark: '1',
    outWidth: 1200,
  },
  {
    file: `skin-2.${locale}.jpg`,
    locale,
    scheme: 'dark',
    mode: 'applied',
    photo: SKIN.blue,
    opacity: 0.87,
    blur: 6,
    scope: 'full',
    fit: 'cover',
    brandMark: '1',
    outWidth: 1200,
  },
  {
    file: `skin-3.${locale}.jpg`,
    locale,
    scheme: 'light',
    mode: 'applied',
    photo: SKIN.snow,
    opacity: 0.82,
    blur: 4,
    scope: 'full',
    fit: 'cover',
    brandMark: '1',
    outWidth: 1200,
  },
  {
    file: `preview.${locale}.jpg`,
    locale,
    scheme: 'light',
    mode: 'preview',
    photo: SKIN.portrait,
    opacity: 0.82,
    blur: 6,
    scope: 'full',
    fit: 'cover',
    brandMark: '1',
  },
  {
    file: `saved.${locale}.jpg`,
    locale,
    scheme: 'dark',
    mode: 'saved',
    photo: SKIN.frost,
    opacity: 0.82,
    blur: 8,
    scope: 'full',
    fit: 'cover',
    brandMark: '1',
    cards: CARDS,
    active: 1,
  },
])

const filter = process.argv[2]
const scenes = filter === undefined ? SCENES : SCENES.filter((scene) => scene.file.includes(filter))

if (scenes.length === 0) {
  console.error(`No scene matches "${filter}"`)
  process.exit(1)
}
if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}; set CHROME_BIN to run this script.`)
  process.exit(1)
}

mkdirSync(OUT, { recursive: true })
const work = mkdtempSync(join(tmpdir(), 'skinx-docs-'))

function capture(scene) {
  const search = new URLSearchParams(
    Object.fromEntries(
      Object.entries(scene)
        .filter(([key]) => !['file', 'cards', 'height', 'outWidth'].includes(key))
        .map(([key, value]) => [key, String(value)]),
    ),
  )
  if (scene.cards !== undefined) search.set('cards', scene.cards.join('|'))

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const png = join(work, `${attempt}-${scene.file}.png`)
    const profile = join(work, `${attempt}-${scene.file}-profile`)

    execFileSync(
      CHROME,
      [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--no-first-run',
        '--force-device-scale-factor=2',
        `--window-size=1600,${scene.height ?? 1000}`,
        '--virtual-time-budget=20000',
        '--allow-file-access-from-files',
        `--user-data-dir=${profile}`,
        `--screenshot=${png}`,
        `${PAGE.href}?${search.toString()}`,
      ],
      { stdio: 'ignore', timeout: 60000 },
    )

    // Half-size the 2x capture and encode it as JPEG: 1600 px is what the
    // README displays, and a lossless frame of a photograph is ~5x larger.
    const encoded = join(work, `${attempt}-${scene.file}`)
    execFileSync(
      'sips',
      ['--resampleWidth', String(scene.outWidth ?? 1600), '-s', 'format', 'jpeg', '-s', 'formatOptions', '92', png, '--out', encoded],
      { stdio: 'ignore' },
    )
    // A frame captured before the page painted is a nearly blank file; retry
    // rather than ship a white rectangle into the README.
    if (statSync(encoded).size > 60000) return encoded
    console.warn(`  retrying ${scene.file}: blank frame`)
  }
  throw new Error(`Could not capture ${scene.file}`)
}

try {
  for (const scene of scenes) {
    copyFileSync(capture(scene), join(OUT, scene.file))
    console.log(`✓ docs/examples/${scene.file}`)
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
