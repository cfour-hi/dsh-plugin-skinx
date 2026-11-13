/**
 * SkinX host half.
 *
 * Owns a small same-origin JSON API and the durable skin store:
 *
 *   GET  /skinx/api/state            -> { version, activeId, skins[] }
 *   PUT  /skinx/api/skin             -> upsert one skin (optional image upload)
 *   POST /skinx/api/delete           -> delete one skin
 *   PUT  /skinx/api/active           -> switch the active skin
 *   GET  /skinx/api/background/<f>   -> the stored wallpaper bytes
 *
 * The store lives in `${DSH_HOME:-~/.dsh}/skinx/`. Every route sits behind the
 * shipped Connection trust fence, so only the page's own session reaches it.
 *
 * @module @cfour-hi/dsh-plugin-skinx
 */

import { randomBytes } from 'node:crypto'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const API_PREFIX = '/skinx/api'
const MAX_BODY_BYTES = 16 * 1024 * 1024
const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/
const FILE_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}\.(webp|png|jpg)$/
const EXTENSIONS = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg' }
const MIME_BY_EXTENSION = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg' }
const STATE_VERSION = 1

/** Root data directory for this plugin. */
function dataDirectory() {
  const home = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
  return path.join(home, 'skinx')
}

function stateFile() {
  return path.join(dataDirectory(), 'skins.json')
}

function backgroundDirectory() {
  return path.join(dataDirectory(), 'backgrounds')
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

function plainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.setHeader('content-length', Buffer.byteLength(body))
  res.end(body)
}

function sendText(res, status, text) {
  res.statusCode = status
  res.setHeader('content-type', 'text/plain; charset=utf-8')
  res.end(text)
}

function emptyState() {
  return { version: STATE_VERSION, activeId: null, skins: [] }
}

/** Read the bounded request body as UTF-8 text, or null past the ceiling. */
async function readBoundedBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.byteLength
    if (size > MAX_BODY_BYTES) return null
    chunks.push(chunk)
  }
  return Buffer.concat(chunks, size).toString('utf8')
}

async function readJsonBody(req, res) {
  const contentType = String(req.headers['content-type'] ?? '')
    .split(';', 1)[0]
    .trim()
    .toLowerCase()
  if (contentType !== 'application/json') {
    sendJson(res, 415, {
      ok: false,
      error: { code: 'unsupported-media-type', message: 'content-type must be application/json' },
    })
    return undefined
  }
  const text = await readBoundedBody(req)
  if (text === null) {
    res.setHeader('connection', 'close')
    sendJson(res, 413, {
      ok: false,
      error: { code: 'payload-too-large', message: 'image is too large; choose a smaller picture' },
    })
    return undefined
  }
  try {
    return JSON.parse(text)
  } catch {
    sendJson(res, 400, {
      ok: false,
      error: { code: 'bad-request', message: 'body must be valid JSON' },
    })
    return undefined
  }
}

/** Validate the shape the Client sends for one skin. Returns a clean copy. */
function normalizeSkin(input, id) {
  if (!plainObject(input)) throw new TypeError('skin must be an object')
  const name = typeof input.name === 'string' ? input.name.trim().slice(0, 60) : ''
  if (name === '') throw new TypeError('skin name must be a non-empty string')

  if (!plainObject(input.tokens)) throw new TypeError('skin tokens must be an object')
  const tokens = {}
  for (const [key, value] of Object.entries(input.tokens)) {
    if (!key.startsWith('--dsw-alias-') && key !== '--dsw-specific-sidebar-fill') throw new TypeError(`unexpected token ${key}`)
    if (!plainObject(value) || typeof value.light !== 'string' || typeof value.dark !== 'string') {
      throw new TypeError(`token ${key} must be { light, dark } strings`)
    }
    tokens[key] = { light: value.light.slice(0, 64), dark: value.dark.slice(0, 64) }
  }
  if (Object.keys(tokens).length === 0) throw new TypeError('skin tokens must not be empty')

  const palette = Array.isArray(input.palette)
    ? input.palette.filter((entry) => typeof entry === 'string').slice(0, 8)
    : []

  const background = plainObject(input.background) ? input.background : {}
  const opacity = typeof background.opacity === 'number' ? background.opacity : 0.85
  const blur = typeof background.blur === 'number' ? background.blur : 0
  const scope = ['full', 'sidebar', 'hero'].includes(background.scope) ? background.scope : 'full'
  const fit = ['contain', 'cover'].includes(background.fit) ? background.fit : 'contain'
  const aspectValue = Number(background.aspect)
  const aspect =
    Number.isFinite(aspectValue) && aspectValue > 0.05 && aspectValue < 20 ? aspectValue : null

  return {
    id,
    name,
    createdAt: typeof input.createdAt === 'number' ? input.createdAt : Date.now(),
    palette,
    tokens,
    tokenVersion: typeof input.tokenVersion === 'number' ? input.tokenVersion : 0,
    brandMark: input.brandMark === true,
    background: {
      opacity: Math.min(1, Math.max(0.55, opacity)),
      blur: Math.min(24, Math.max(0, blur)),
      scope,
      fit,
      aspect,
    },
  }
}

/** One plugin-owned store with a serialized write path. */
function createStore() {
  let cached
  let chain = Promise.resolve()

  const serialize = (task) => {
    const run = chain.then(task, task)
    chain = run.catch(() => {})
    return run
  }

  async function load() {
    if (cached !== undefined) return cached
    try {
      const raw = await fs.readFile(stateFile(), 'utf8')
      const parsed = JSON.parse(raw)
      cached = normalizeState(parsed)
    } catch (error) {
      if (error && error.code !== 'ENOENT') {
        console.error('[skinx] could not read skin store:', errorMessage(error))
      }
      cached = emptyState()
    }
    return cached
  }

  function normalizeState(value) {
    const state = emptyState()
    if (!plainObject(value)) return state
    state.version = STATE_VERSION
    state.activeId = typeof value.activeId === 'string' ? value.activeId : null
    if (Array.isArray(value.skins)) {
      for (const entry of value.skins) {
        if (!plainObject(entry) || typeof entry.id !== 'string' || !ID_PATTERN.test(entry.id)) {
          continue
        }
        try {
          const skin = normalizeSkin(entry, entry.id)
          if (plainObject(entry.background) && typeof entry.background.fileName === 'string') {
            if (FILE_PATTERN.test(entry.background.fileName)) {
              skin.background.fileName = entry.background.fileName
              skin.background.mime =
                MIME_BY_EXTENSION[entry.background.fileName.split('.').pop()] ?? 'image/webp'
              skin.background.revision =
                typeof entry.background.revision === 'string'
                  ? entry.background.revision
                  : Date.now().toString(36)
            }
          }
          state.skins.push(skin)
        } catch (error) {
          console.error(`[skinx] dropped invalid stored skin ${entry.id}:`, errorMessage(error))
        }
      }
    }
    if (
      state.activeId !== null &&
      !state.skins.some((skin) => skin.id === state.activeId)
    ) {
      state.activeId = null
    }
    return state
  }

  async function persist() {
    await fs.mkdir(dataDirectory(), { recursive: true })
    await fs.mkdir(backgroundDirectory(), { recursive: true })
    const file = stateFile()
    const temporary = `${file}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`
    await fs.writeFile(temporary, `${JSON.stringify(cached, null, 2)}\n`, 'utf8')
    await fs.rename(temporary, file)
  }

  async function upsert(input, image) {
    const id = typeof input?.id === 'string' ? input.id : ''
    if (!ID_PATTERN.test(id)) throw new TypeError('skin id is invalid')
    const skin = normalizeSkin(input, id)
    const state = await load()

    if (image !== undefined) {
      const extension = EXTENSIONS[image.mime]
      if (extension === undefined) throw new TypeError('unsupported image media type')
      const fileName = `${id}.${extension}`
      await fs.mkdir(backgroundDirectory(), { recursive: true })
      await fs.writeFile(path.join(backgroundDirectory(), fileName), image.buffer)
      // Drop a previous image with a different extension for this id.
      for (const other of ['webp', 'png', 'jpg']) {
        if (other === extension) continue
        await fs.rm(path.join(backgroundDirectory(), `${id}.${other}`), { force: true })
      }
      skin.background.fileName = fileName
      skin.background.mime = image.mime
      skin.background.revision = Date.now().toString(36)
    } else {
      const existing = state.skins.find((entry) => entry.id === id)
      if (existing?.background?.fileName !== undefined) {
        skin.background.fileName = existing.background.fileName
        skin.background.mime = existing.background.mime
        skin.background.revision = existing.background.revision
      }
    }

    const index = state.skins.findIndex((entry) => entry.id === id)
    if (index >= 0) state.skins[index] = skin
    else state.skins.push(skin)
    // Saving a skin makes it active unless the caller opts out (a wallpaper
    // slider update must not steal the active skin back after a switch).
    if (input?.activate !== false) state.activeId = id
    await persist()
    return skin
  }

  async function remove(id) {
    if (!ID_PATTERN.test(id)) throw new TypeError('skin id is invalid')
    const state = await load()
    const index = state.skins.findIndex((entry) => entry.id === id)
    if (index < 0) return false
    state.skins.splice(index, 1)
    for (const extension of ['webp', 'png', 'jpg']) {
      await fs.rm(path.join(backgroundDirectory(), `${id}.${extension}`), { force: true })
    }
    if (state.activeId === id) state.activeId = null
    await persist()
    return true
  }

  async function setActive(id) {
    if (id !== null && !ID_PATTERN.test(id)) throw new TypeError('skin id is invalid')
    const state = await load()
    if (id !== null && !state.skins.some((entry) => entry.id === id)) {
      throw new TypeError('skin does not exist')
    }
    state.activeId = id
    await persist()
    return state
  }

  async function readBackground(fileName) {
    if (!FILE_PATTERN.test(fileName)) return undefined
    try {
      return await fs.readFile(path.join(backgroundDirectory(), fileName))
    } catch {
      return undefined
    }
  }

  return {
    load: () => serialize(load),
    upsert: (input, image) => serialize(() => upsert(input, image)),
    remove: (id) => serialize(() => remove(id)),
    setActive: (id) => serialize(() => setActive(id)),
    readBackground,
  }
}

/** Attach the derived background URL the Client needs. */
function project(state) {
  return {
    version: state.version,
    activeId: state.activeId,
    skins: state.skins.map((skin) => {
      const background = { ...skin.background }
      if (typeof background.fileName === 'string') {
        background.url = `${API_PREFIX}/background/${background.fileName}?v=${background.revision ?? '0'}`
      }
      delete background.fileName
      return { ...skin, background }
    }),
  }
}

/** Store error -> HTTP status and code. */
function failureFor(error) {
  const message = errorMessage(error)
  if (/does not exist/.test(message)) {
    return { status: 404, code: 'not-found', message }
  }
  if (/invalid|must|unexpected|unsupported/.test(message)) {
    return { status: 400, code: 'invalid-skin', message }
  }
  return { status: 500, code: 'internal', message }
}

/**
 * Wait for the browser carrier before registering routes: on a cold start the
 * web server may be provided after this bundle's row would otherwise apply.
 */
export const inject = ['webServer']

/**
 * Register the skin API as one owned effect.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx
 */
export function apply(ctx) {
  const webServer = ctx.get('webServer')
  const connection = ctx.get('connection')
  if (webServer === undefined) {
    console.error('[skinx] the web server is unavailable; the skin store is disabled')
    return
  }
  const store = createStore()

  const guarded = (handler) => async (req, res) => {
    try {
      if (connection !== undefined && typeof connection.requestRejection === 'function') {
        const rejection = connection.requestRejection(req)
        if (rejection !== undefined) {
          res.statusCode = rejection
          res.end()
          return
        }
      }
      await handler(req, res)
    } catch (error) {
      if (res.headersSent) {
        res.destroy()
        return
      }
      const failure = failureFor(error)
      sendJson(res, failure.status, {
        ok: false,
        error: { code: failure.code, message: failure.message },
      })
    }
  }

  const handle = guarded(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    const pathname = url.pathname
    if (pathname !== API_PREFIX && !pathname.startsWith(`${API_PREFIX}/`)) {
      sendText(res, 404, 'not found')
      return
    }
    const rest = pathname.slice(API_PREFIX.length) || '/'

    if (rest === '/state') {
      if (req.method !== 'GET') return sendText(res, 405, 'method not allowed')
      const state = await store.load()
      sendJson(res, 200, { ok: true, state: project(state) })
      return
    }

    if (rest === '/skin') {
      if (req.method !== 'PUT') return sendText(res, 405, 'method not allowed')
      const body = await readJsonBody(req, res)
      if (body === undefined) return
      if (!plainObject(body)) {
        sendJson(res, 400, {
          ok: false,
          error: { code: 'bad-request', message: 'body must be a JSON object' },
        })
        return
      }
      let image
      if (typeof body.backgroundBase64 === 'string' && body.backgroundBase64 !== '') {
        const mime = typeof body.backgroundMime === 'string' ? body.backgroundMime : 'image/webp'
        if (EXTENSIONS[mime] === undefined) {
          sendJson(res, 400, {
            ok: false,
            error: { code: 'unsupported-media-type', message: `unsupported image type ${mime}` },
          })
          return
        }
        image = { mime, buffer: Buffer.from(body.backgroundBase64, 'base64') }
        if (image.buffer.byteLength === 0) {
          sendJson(res, 400, {
            ok: false,
            error: { code: 'bad-request', message: 'image data is empty' },
          })
          return
        }
      }
      const skin = await store.upsert(body, image)
      const state = await store.load()
      sendJson(res, 200, { ok: true, skin, state: project(state) })
      return
    }

    if (rest === '/delete') {
      if (req.method !== 'POST') return sendText(res, 405, 'method not allowed')
      const body = await readJsonBody(req, res)
      if (body === undefined) return
      const id = plainObject(body) && typeof body.id === 'string' ? body.id : ''
      if (!ID_PATTERN.test(id)) {
        sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'bad skin id' } })
        return
      }
      await store.remove(id)
      const state = await store.load()
      sendJson(res, 200, { ok: true, state: project(state) })
      return
    }

    if (rest === '/active') {
      if (req.method !== 'PUT') return sendText(res, 405, 'method not allowed')
      const body = await readJsonBody(req, res)
      if (body === undefined) return
      const id =
        plainObject(body) && typeof body.id === 'string' && body.id !== '' ? body.id : null
      const state = await store.setActive(id)
      sendJson(res, 200, { ok: true, state: project(state) })
      return
    }

    if (rest.startsWith('/background/')) {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        return sendText(res, 405, 'method not allowed')
      }
      const fileName = rest.slice('/background/'.length)
      const bytes = await store.readBackground(fileName)
      if (bytes === undefined) {
        sendText(res, 404, 'not found')
        return
      }
      const extension = fileName.split('.').pop()
      res.statusCode = 200
      res.setHeader('content-type', MIME_BY_EXTENSION[extension] ?? 'application/octet-stream')
      res.setHeader('cache-control', 'public, max-age=31536000, immutable')
      res.setHeader('content-length', bytes.byteLength)
      if (req.method === 'HEAD') res.end()
      else res.end(bytes)
      return
    }

    sendText(res, 404, 'not found')
  })

  ctx.effect(() => webServer.register({ kind: 'prefix', path: API_PREFIX, handler: handle }), 'skinx: api')
}
