#!/usr/bin/env node
/**
 * Build the browser half of the SkinX plugin.
 *
 * The shipped artifact `client.js` must be a single JavaScript file that calls
 * `window.__ModuleLoader__.load({ id, factory })`. esbuild bundles `src/entry.js`
 * into an IIFE; React is never bundled — it arrives through the factory's
 * `require("react")` seed.
 *
 * Usage:
 *   node scripts/build-client.mjs           # (re)generate client.js
 *   node scripts/build-client.mjs --check   # verify client.js is current
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const here = dirname(fileURLToPath(import.meta.url))
const root = dirname(here)
const check = process.argv.includes('--check')
const outfile = join(root, 'client.js')

const result = await build({
  entryPoints: [join(root, 'src', 'entry.js')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  legalComments: 'none',
  write: false,
  banner: {
    js: '/* skinx client — generated from src/ by scripts/build-client.mjs. Do not edit. */',
  },
})

const code = result.outputFiles[0].text.replace(/\r\n/g, '\n')

// The bundle may only ask the loader for the platform seed ("react").
const reactLiterals = (code.match(/"react"/g) ?? []).length
const seedCalls = [...code.matchAll(/[A-Za-z0-9_$]+\(\s*"react"\s*\)/g)].length
const otherRequests = code.match(/(?:__require|require\d*)\(\s*["']/g) ?? []
if (reactLiterals !== 1 || seedCalls !== 1 || otherRequests.length > 0) {
  console.error(
    `REFUSING TO WRITE: unexpected platform seed requests (${JSON.stringify({
      reactLiterals,
      seedCalls,
      otherRequests: otherRequests.length,
    })})`,
  )
  process.exit(1)
}
if (!code.includes('__ModuleLoader__.load')) {
  console.error('REFUSING TO WRITE: bundle does not register with __ModuleLoader__.load')
  process.exit(1)
}

if (check) {
  const current = existsSync(outfile) ? readFileSync(outfile, 'utf8').replace(/\r\n/g, '\n') : ''
  if (current !== code) {
    console.error('client.js is stale; run node scripts/build-client.mjs')
    process.exit(1)
  }
  console.log('client.js is current')
} else {
  writeFileSync(outfile, code)
  console.log(`wrote ${outfile} (${Buffer.byteLength(code)} bytes)`)
}
