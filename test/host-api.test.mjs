import { buildTokenPairs, TOKEN_VERSION } from '../src/tokens.js'
import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import { after, test } from 'node:test'

const temporaryHome = await fs.mkdtemp(path.join(os.tmpdir(), 'skinx-host-'))
process.env.DSH_HOME = temporaryHome

const { apply } = await import('../index.js')

after(async () => {
  await fs.rm(temporaryHome, { recursive: true, force: true })
})

/** Register the Host API against a minimal Cordis-like context. */
function mount() {
  let route
  let rejection
  const webServer = {
    register(value) {
      route = value
      return () => {
        route = undefined
      }
    },
  }
  const connection = {
    requestRejection() {
      return rejection
    },
  }
  apply({
    get(name) {
      if (name === 'webServer') return webServer
      if (name === 'connection') return connection
      return undefined
    },
    effect(callback) {
      return callback()
    },
  })
  assert.ok(route, 'the API route was not registered')
  return {
    route,
    rejectWith(value) {
      rejection = value
    },
    setRoute(value) {
      route = value
    },
  }
}

function call(route, method, url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = Readable.from(body === undefined ? [] : [Buffer.from(body)])
    req.method = method
    req.url = url
    req.headers = { 'content-type': 'application/json', ...headers }
    const res = {
      statusCode: 0,
      headers: {},
      headersSent: false,
      body: undefined,
      setHeader(key, value) {
        this.headers[String(key).toLowerCase()] = value
      },
      end(chunk) {
        this.body = chunk
        this.headersSent = true
        resolve(this)
      },
      destroy() {
        resolve(this)
      },
    }
    route.handler(req, res).catch(reject)
  })
}

function parse(res) {
  return JSON.parse(String(res.body))
}

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

const SKIN = {
  id: 'skin-test',
  name: 'Test skin',
  palette: ['#cc2222', '#2233cc'],
  tokenVersion: 2,
  brandMark: true,
  tokens: {
    '--dsw-alias-bg-base': { light: '#ffffff', dark: '#111111' },
    '--dsw-alias-label-primary': { light: '#111111', dark: '#ffffff' },
  },
  background: { opacity: 0.8, blur: 2, scope: 'sidebar', fit: 'contain', aspect: 1.5 },
}

test('the API saves, serves, switches, and deletes a skin', async () => {
  const { route } = mount()

  const save = await call(
    route,
    'PUT',
    '/skinx/api/skin',
    JSON.stringify({
      ...SKIN,
      backgroundBase64: PNG.toString('base64'),
      backgroundMime: 'image/png',
    }),
  )
  assert.equal(save.statusCode, 200)
  const saved = parse(save)
  assert.equal(saved.ok, true)
  assert.equal(saved.state.activeId, 'skin-test')
  const backgroundUrl = saved.state.skins[0].background.url
  assert.match(backgroundUrl, /^\/skinx\/api\/background\/skin-test\.png/u)

  const state = parse(await call(route, 'GET', '/skinx/api/state'))
  assert.equal(state.state.skins.length, 1)
  assert.equal(state.state.skins[0].brandMark, true)
  assert.equal(state.state.skins[0].tokenVersion, 2)
  assert.equal(state.state.skins[0].background.scope, 'sidebar')
  assert.equal(state.state.skins[0].background.fit, 'contain')
  assert.equal(state.state.skins[0].background.aspect, 1.5)
  assert.equal(state.state.skins[0].background.fileName, undefined)
  assert.equal(state.state.skins[0].background.url, backgroundUrl)

  const image = await call(route, 'GET', backgroundUrl)
  assert.equal(image.statusCode, 200)
  assert.equal(image.headers['content-type'], 'image/png')
  assert.ok(Buffer.from(image.body).equals(PNG))

  const cleared = parse(
    await call(route, 'PUT', '/skinx/api/active', JSON.stringify({ id: null })),
  )
  assert.equal(cleared.state.activeId, null)

  const removed = parse(
    await call(route, 'POST', '/skinx/api/delete', JSON.stringify({ id: 'skin-test' })),
  )
  assert.equal(removed.state.skins.length, 0)
  const files = await fs.readdir(path.join(temporaryHome, 'skinx', 'backgrounds'))
  assert.deepEqual(files, [])
})

test('saving with activate:false keeps the current active skin', async () => {
  const { route } = mount()
  await call(route, 'PUT', '/skinx/api/skin', JSON.stringify({ ...SKIN, id: 'skin-a' }))
  const response = parse(
    await call(
      route,
      'PUT',
      '/skinx/api/skin',
      JSON.stringify({ ...SKIN, id: 'skin-b', activate: false }),
    ),
  )
  assert.equal(response.state.activeId, 'skin-a')
  assert.equal(response.state.skins.length, 2)
})

test('the trust fence and unknown paths are enforced', async () => {
  const { route, rejectWith } = mount()
  rejectWith(401)
  assert.equal((await call(route, 'GET', '/skinx/api/state')).statusCode, 401)

  const fresh = mount()
  assert.equal((await call(fresh.route, 'GET', '/skinx/api/nope')).statusCode, 404)
  assert.equal(
    (await call(fresh.route, 'GET', '/skinx/api/state', undefined, {
      'content-type': 'text/plain',
    })).statusCode,
    200,
  )
})

test('a malformed skin is rejected without touching the store', async () => {
  const { route } = mount()
  const response = await call(
    route,
    'PUT',
    '/skinx/api/skin',
    JSON.stringify({ id: 'bad id', name: 'x', tokens: {} }),
  )
  assert.equal(response.statusCode, 400)
  assert.equal(parse(response).ok, false)
})


test('a complete generated skin including sidebar and inverse text can be saved', async () => {
  const { route } = mount()
  const tokens = buildTokenPairs('#00ffff', { tone: 1 })
  const res = await call(route, 'PUT', '/skinx/api/skin', JSON.stringify({
    ...SKIN, id: 'skin-contrast', tokens, tokenVersion: TOKEN_VERSION,
  }))
  assert.equal(res.statusCode, 200, String(res.body))
  const saved = parse(res).state.skins.find((skin) => skin.id === 'skin-contrast')
  assert.deepEqual(saved.tokens, tokens)
  assert.equal(saved.tokenVersion, TOKEN_VERSION)
})
