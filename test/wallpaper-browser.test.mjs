import assert from 'node:assert/strict'
import { test } from 'node:test'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { setReact } from '../src/react.js'
import { WallpaperStyle } from '../src/ui/components.js'
import { buildTokenPairs, withWallpaperAlpha } from '../src/tokens.js'

const chrome = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
setReact({ createElement: (type, props, ...children) => ({ children }) })

test('real browser paints wallpaper above opaque body and below text', {
  skip: existsSync(chrome) ? false : 'Set CHROME_BIN to enable browser screenshot regression',
  timeout: 120000,
}, () => {
  const directory = mkdtempSync(join(tmpdir(), 'skinx-wallpaper-browser-'))
  try {
    const url = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><path fill="red" d="M0 0h200v400H0z"/><path fill="blue" d="M200 0h200v400H200z"/></svg>',
    )
    const css = WallpaperStyle({ wallpaper: { url, opacity: 0.8, scope: 'full', fit: 'cover' } }).children.join('')
    const pairs = withWallpaperAlpha(buildTokenPairs('#3b6ef5'), 0.8)
    for (const scheme of ['light', 'dark']) {
      const variables = Object.entries(pairs).map(([name, pair]) => `${name}:${pair[scheme]}`).join(';')
      const shots = {}
      for (const [state, extra] of [
        ['visible', ''],
        ['hidden', 'body::before,body::after{display:none}'],
        ['reviewA', ''],
        ['reviewB', ''],
      ]) {
        const html = join(directory, `${scheme}-${state}.html`)
        const png = join(directory, `${scheme}-${state}.png`)
        const content = state.startsWith('review')
          ? `<main>${state === 'reviewA' ? 'UNDERLYING CHAT TEXT '.repeat(800) : 'DIFFERENT CONTENT '.repeat(800)}</main><div data-changes-hover-preview style="position:fixed;inset:0"><header>README.md</header><div data-review-view="unified"><div>153 unchanged context line</div><div style="background:#e2f4e7">154 + added line</div><div style="background:#fde5e5">155 - removed line</div></div></div>`
          : '<main>Readable text</main>'
        writeFileSync(html, `<style>html{background:${pairs['--dsw-alias-bg-overlay'][scheme]}!important}body{${variables}}html,body{margin:0;min-height:100vh}main{height:100vh;overflow:hidden;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}${css}${extra}</style>${content}`)
        execFileSync(chrome, [
          '--headless', '--no-sandbox', '--disable-gpu', '--no-first-run', '--virtual-time-budget=1000', '--run-all-compositor-stages-before-draw',
          `--user-data-dir=${join(directory, 'profile')}`, '--window-size=800,600',
          `--screenshot=${png}`, pathToFileURL(html).href,
        ], { stdio: 'ignore', timeout: 30000 })
        shots[state] = readFileSync(png)
        if (process.env.SKINX_DEBUG_SCREENSHOTS) writeFileSync(join(tmpdir(), `skinx-${scheme}-${state}.png`), shots[state])
      }
      assert.ok(shots.reviewA.equals(shots.reviewB), `${scheme}: underlying chat must not bleed through change previews`)
      assert.ok(!shots.visible.equals(shots.hidden), `${scheme}: wallpaper must actually change rendered pixels`)
    }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
