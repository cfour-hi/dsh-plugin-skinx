/**
 * Renderer for the README example shots.
 *
 * The page is opened by `scripts/build-docs-shots.mjs` in headless Chrome with
 * query parameters; it decodes a sample picture, runs the real `extractPalette`
 * and `buildTokenPairs` code, paints the picture with the real `WallpaperStyle`,
 * and lays out a host-like shell plus the SkinX dialog using the shipped CSS.
 *
 * Nothing here ships with the plugin — it only exists so the documentation
 * screenshots stay in sync with the palette and token code.
 */

import { extractPalette } from '../../src/palette.js'
import { buildTokenPairs, withWallpaperAlpha } from '../../src/tokens.js'
import { CSS } from '../../src/ui/styles.js'
import { zh, en } from '../../src/dicts.js'
import { setReact } from '../../src/react.js'
import { WallpaperStyle } from '../../src/ui/components.js'
import * as Icons from '../../src/ui/icons.js'

/* -------------------------------------------------------------------------- */
/* Element helpers                                                            */
/* -------------------------------------------------------------------------- */

setReact({ createElement: (type, props, ...children) => ({ type, props, children }) })

function attrs(props) {
  const out = []
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value === undefined || value === null || value === false) continue
    const name = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    const text = value === true ? 'true' : String(value)
    out.push(`${name}="${text.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`)
  }
  return out.length === 0 ? '' : ' ' + out.join(' ')
}

function render(node) {
  if (node === null || node === undefined || node === false || node === true) return ''
  if (Array.isArray(node)) return node.map(render).join('')
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  const tag = typeof node.type === 'string' ? node.type : 'span'
  return `<${tag}${attrs(node.props)}>${render(node.children)}</${tag}>`
}

const icon = (component, size) => render(component({ size }))

/* -------------------------------------------------------------------------- */
/* Copy                                                                       */
/* -------------------------------------------------------------------------- */

const COPY = {
  zh: {
    workspace: '工作区 · dsh-plugin-skinx',
    newChat: '新建会话',
    search: '搜索会话',
    skills: '技能',
    plugins: '插件',
    today: '今天',
    threads: [
      ['用这张照片换肤', '刚刚 · 本地取色完成'],
      ['重构配色 token 生成逻辑', '10:24'],
      ['检查设置面板不透明度', '09:58'],
      ['整理 README 示例图', '09:12'],
      ['发布 0.2.4 到 npm', '昨天'],
      ['给侧栏品牌位加羽化遮罩', '昨天'],
    ],
    user: 'cfour-hi',
    chatTitle: '用这张照片换肤',
    chatMeta: '本地会话 · 自动保存',
    earlierUser: '侧栏也能用这张图的配色吗？',
    earlierReply: '可以。侧栏只取图片左侧的一条，向内羽化到模糊背景，不影响中间的对话区可读性。',
    userMessage: '把这张照片设成壁纸，范围整页，品牌位也换成它。',
    reply: [
      '已在本机取色：最鲜艳的颜色成为品牌色，其余配色用于表面和标签，文字对比度按当前明暗重新校正。',
      '壁纸强度 90%、模糊 6px、范围整页；侧栏品牌位和按钮缩略图也同步换成了这张图。',
    ],
    chips: ['本地取色', '整页壁纸', '品牌位'],
    placeholder: '继续调整这个皮肤，或换一张图…',
    model: 'DeepSeek-V3',
    skinName: '霓虹夜街',
    cardNames: ['落日山谷', '雾林湖岸', '霓虹夜街'],
    cardTime: '今天 14:32',
  },
  en: {
    workspace: 'Workspace · dsh-plugin-skinx',
    newChat: 'New session',
    search: 'Search sessions',
    skills: 'Skills',
    plugins: 'Plugins',
    today: 'Today',
    threads: [
      ['Theme this photo', 'just now · palette ready'],
      ['Rework palette token generator', '10:24'],
      ['Keep the settings panel opaque', '09:58'],
      ['Prepare README example shots', '09:12'],
      ['Publish 0.2.4 to npm', 'yesterday'],
      ['Feather the sidebar brand mask', 'yesterday'],
    ],
    user: 'cfour-hi',
    chatTitle: 'Theme this photo',
    chatMeta: 'Local session · autosaved',
    earlierUser: 'Can the sidebar use this picture too?',
    earlierReply: 'Yes. The sidebar samples a strip on the left of the picture and feathers it into the blurred backdrop, so the conversation stays readable.',
    userMessage: 'Use this picture as the wallpaper — whole page — and the brand mark too.',
    reply: [
      'Palette extracted on this device: the most vivid color becomes the brand, the rest seed surfaces and labels, and label contrast is corrected for the current scheme.',
      'Wallpaper strength 90%, blur 6 px, scope whole page; the sidebar brand mark and the dock thumbnail now use the same picture.',
    ],
    chips: ['Local palette', 'Whole-page wallpaper', 'Brand mark'],
    placeholder: 'Keep tuning this skin, or drop another picture…',
    model: 'DeepSeek-V3',
    skinName: 'Neon street',
    cardNames: ['Sunset valley', 'Misty lake', 'Neon street'],
    cardTime: 'today 14:32',
  },
}

/* -------------------------------------------------------------------------- */
/* Parameters                                                                 */
/* -------------------------------------------------------------------------- */

const params = new URLSearchParams(location.search)
const locale = params.get('locale') === 'en' ? 'en' : 'zh'
const scheme = params.get('scheme') === 'light' ? 'light' : 'dark'
const mode = params.get('mode') ?? 'preview'
const photoPath = params.get('photo') ?? 'docs/examples/source/neon-street.jpg'
const opacity = Number(params.get('opacity') ?? '0.82')
const blur = Number(params.get('blur') ?? '6')
const scope = params.get('scope') ?? 'full'
const fit = params.get('fit') ?? 'cover'
const brandMark = params.get('brandMark') !== '0'
const cardPaths = (params.get('cards') ?? '').split('|').filter((entry) => entry !== '')
const activeCard = Number(params.get('active') ?? '0')
const skinName = params.get('name') ?? COPY[locale].skinName

const copy = COPY[locale]
const dictionary = locale === 'zh' ? zh : en
const t = (key, values) =>
  (dictionary[key] ?? key).replace(/\{(\w+)\}/g, (match, name) => String(values?.[name] ?? match))

const assetUrl = (relative) => new URL(relative, import.meta.url).href
const photoUrl = assetUrl(`../../${photoPath}`)

/* -------------------------------------------------------------------------- */
/* Mock host stylesheet                                                      */
/* -------------------------------------------------------------------------- */

const SHELL_CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; overflow: hidden; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  color: var(--dsw-alias-label-primary);
  -webkit-font-smoothing: antialiased;
}
.app { position: relative; z-index: 1; display: flex; height: 100vh; }

/* Sidebar ---------------------------------------------------------------- */
.side {
  display: flex; flex-direction: column; flex: none;
  width: 288px;
  border-right: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-specific-sidebar-fill);
  backdrop-filter: blur(20px);
}
.side-top { display: flex; flex-direction: column; gap: 10px; padding: 16px 14px 10px; }
.brand { display: flex; align-items: center; gap: 10px; padding: 0 2px 2px; }
.brand-mark {
  flex: none; width: 30px; height: 30px; border-radius: 8px; object-fit: cover;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .22), inset 0 0 0 1px rgba(255, 255, 255, .14);
}
.brand-mark.is-fallback { background: var(--dsw-alias-bg-layer-2); }
.brand-text { min-width: 0; }
.brand-name { font-size: 14px; font-weight: 600; letter-spacing: -.01em; line-height: 18px; }
.brand-sub {
  font-size: 11px; line-height: 15px; color: var(--dsw-alias-label-tertiary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.new-chat {
  display: flex; align-items: center; gap: 7px; height: 34px; padding: 0 11px;
  border: 0; border-radius: 8px;
  background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-inverted);
  font: 600 13px/1 inherit; cursor: default;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
}
.search {
  display: flex; align-items: center; gap: 7px; height: 32px; padding: 0 10px;
  border-radius: 8px; background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-caption); font-size: 12.5px;
}
.nav { display: flex; flex-direction: column; gap: 1px; padding: 2px 10px 0; }
.nav-item {
  display: flex; align-items: center; gap: 9px; height: 30px; padding: 0 8px;
  border-radius: 8px; color: var(--dsw-alias-label-secondary); font-size: 12.5px;
}
.list-label {
  padding: 16px 20px 6px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase;
  color: var(--dsw-alias-label-caption);
}
.threads { display: flex; flex-direction: column; flex: 1; gap: 1px; min-height: 0; padding: 0 10px; }
.thread { display: flex; flex-direction: column; gap: 2px; padding: 7px 8px; border-radius: 8px; }
.thread.is-active { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent); }
.thread-title {
  font-size: 12.5px; line-height: 17px; color: var(--dsw-alias-label-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.thread-meta { font-size: 11px; line-height: 15px; color: var(--dsw-alias-label-caption); }
.side-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 9px 12px; border-top: 1px solid var(--dsw-alias-border-l1);
}
.foot-user { display: flex; align-items: center; gap: 8px; min-width: 0; font-size: 12.5px; color: var(--dsw-alias-label-secondary); }
.avatar {
  flex: none; width: 24px; height: 24px; border-radius: 50%;
  background: linear-gradient(135deg, var(--dsw-alias-brand-primary), color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, var(--dsw-alias-bg-layer-2)));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .16);
}
.foot-actions { display: flex; align-items: center; gap: 4px; }
.foot-gear { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 0; background: transparent; color: var(--dsw-alias-label-secondary); }

/* Conversation ----------------------------------------------------------- */
.main { position: relative; display: flex; flex-direction: column; flex: 1; min-width: 0; }
.main-head {
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex: none;
  height: 62px; padding: 0 28px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 55%, transparent);
  backdrop-filter: blur(16px);
}
.head-title { font-size: 14px; font-weight: 600; line-height: 20px; }
.head-meta { font-size: 11px; line-height: 15px; color: var(--dsw-alias-label-tertiary); }
.head-actions { display: flex; align-items: center; gap: 10px; color: var(--dsw-alias-label-tertiary); }
.thread-view { display: flex; flex-direction: column; flex: 1; min-height: 0; padding: 30px 0 0; }
.convo { display: flex; flex-direction: column; gap: 22px; width: 100%; max-width: 792px; margin: 0 auto; padding: 0 32px; }
.bubble-user {
  align-self: flex-end; max-width: 540px; padding: 11px 14px;
  border-radius: 12px 12px 3px 12px;
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-border-l1) 60%, transparent);
  font-size: 13.5px; line-height: 1.62;
}
.bubble-user.is-quiet { background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 70%, transparent); color: var(--dsw-alias-label-secondary); }
.reply.is-quiet { opacity: .92; }
.reply { display: flex; flex-direction: column; gap: 10px; }
.reply-head { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: var(--dsw-alias-label-tertiary); }
.reply-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--dsw-alias-brand-primary); }
.paragraph { margin: 0; font-size: 13.5px; line-height: 1.75; color: var(--dsw-alias-label-primary); }
.paragraph.is-secondary { color: var(--dsw-alias-label-secondary); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.chip {
  display: inline-flex; align-items: center; height: 22px; padding: 0 9px; border-radius: 999px;
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 13%, transparent);
  color: var(--dsw-alias-brand-primary); font-size: 11.5px; font-weight: 600;
}
.composer-wrap { margin-top: auto; padding: 18px 0 24px; }
.composer {
  display: flex; flex-direction: column; gap: 10px;
  width: 100%; max-width: 792px; margin: 0 auto; padding: 12px 14px;
  border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
  box-shadow: 0 6px 18px -8px rgba(0, 0, 0, .35);
}
.composer-ph { font-size: 13px; color: var(--dsw-alias-label-caption); }
.composer-bar { display: flex; align-items: center; justify-content: space-between; }
.composer-left { display: flex; align-items: center; gap: 8px; }
.model {
  display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 9px;
  border-radius: 7px; background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary); font-size: 11.5px;
}
.icon-button { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; color: var(--dsw-alias-label-tertiary); }
.send {
  display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;
  border-radius: 8px; background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-inverted);
}
`

/* -------------------------------------------------------------------------- */
/* Host icons                                                                 */
/* -------------------------------------------------------------------------- */

const svg = (body, size = 14) =>
  `<svg viewBox="0 0 16 16" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`

const PLUS = svg('<path d="M8 3.4v9.2M3.4 8h9.2"/>')
const SEARCH = svg('<circle cx="7.1" cy="7.1" r="4.1"/><path d="M10.2 10.2 13 13"/>')
const SPARK = svg('<path d="M8 2.6l1.5 3.9 3.9 1.5-3.9 1.5L8 13.4l-1.5-3.9-3.9-1.5 3.9-1.5z"/>')
const PLUG = svg('<path d="M6.2 2.6v2.2M9.8 2.6v2.2M4.6 4.8h6.8v3.3a3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4z"/><path d="M8 11.5v2.2"/>')
const GEAR = svg('<circle cx="8" cy="8" r="2.5"/><path d="M8 2.4v1.2M8 12.4v1.2M2.4 8h1.2M12.4 8h1.2M3.9 3.9l.9.9M11.2 11.2l.9.9M12.1 3.9l-.9.9M4.8 11.2l-.9.9"/>')
const SHARE = svg('<path d="M6.2 6.4 10 4.2M6.2 9.6 10 11.8"/><circle cx="4.4" cy="8" r="1.8"/><circle cx="11.4" cy="3.9" r="1.6"/><circle cx="11.4" cy="12.1" r="1.6"/>')
const MORE = svg('<circle cx="3.4" cy="8" r="1.1" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none"/><circle cx="12.6" cy="8" r="1.1" fill="currentColor" stroke="none"/>')
const CHIP = svg('<rect x="3.4" y="3.4" width="9.2" height="9.2" rx="2" opacity=".7"/><path d="M6.4 6.4h3.2v3.2h-3.2z"/>', 12)
const CLIP = svg('<path d="M9.9 4.6 6 8.5a1.9 1.9 0 0 0 2.7 2.7l4-4a3.2 3.2 0 0 0-4.5-4.5l-4.6 4.6a4.4 4.4 0 0 0 6.2 6.2l3.4-3.4"/>', 12)
const SEND = svg('<path d="M8 12.4V3.8M4.6 7.2 8 3.8l3.4 3.4"/>')

/* -------------------------------------------------------------------------- */
/* Shell                                                                      */
/* -------------------------------------------------------------------------- */

function brandMarkHtml() {
  return brandMark
    ? `<img class="brand-mark" src="${photoUrl}" alt="" />`
    : `<span class="brand-mark is-fallback"></span>`
}

function shellHtml() {
  const threads = copy.threads
    .map(
      ([title, meta], index) =>
        `<div class="thread${index === 0 ? ' is-active' : ''}">` +
        `<span class="thread-title">${title}</span><span class="thread-meta">${meta}</span></div>`,
    )
    .join('')

  return `
<div class="app">
  <aside class="side">
    <div class="side-top">
      <div class="brand">${brandMarkHtml()}<div class="brand-text"><div class="brand-name">DeepSeek Harness</div><div class="brand-sub">${copy.workspace}</div></div></div>
      <button class="new-chat">${PLUS}<span>${copy.newChat}</span></button>
      <div class="search">${SEARCH}<span>${copy.search}</span></div>
    </div>
    <div class="nav">
      <div class="nav-item">${SPARK}<span>${copy.skills}</span></div>
      <div class="nav-item">${PLUG}<span>${copy.plugins}</span></div>
    </div>
    <div class="list-label">${copy.today}</div>
    <div class="threads">${threads}</div>
    <div class="side-foot">
      <div class="foot-user"><span class="avatar"></span><span>${copy.user}</span></div>
      <div class="foot-actions">
        <button class="sx-dock${brandMark ? ' is-active' : ''}" title="${t('dock.title')}">${
          brandMark ? `<img class="sx-dock-thumb" src="${photoUrl}" alt="" />` : icon(Icons.DockIcon, 18)
        }<span class="sx-dock-dot"></span></button>
        <button class="foot-gear" title="Settings">${GEAR}</button>
      </div>
    </div>
  </aside>

  <main class="main">
    <header class="main-head">
      <div><div class="head-title">${copy.chatTitle}</div><div class="head-meta">${copy.chatMeta}</div></div>
      <div class="head-actions">${SHARE}${MORE}</div>
    </header>
    <div class="thread-view">
      <div class="convo">
        <div class="bubble-user is-quiet">${copy.earlierUser}</div>
        <div class="reply is-quiet">
          <div class="reply-head"><span class="reply-dot"></span>Harness</div>
          <p class="paragraph is-secondary">${copy.earlierReply}</p>
        </div>
        <div class="bubble-user">${copy.userMessage}</div>
        <div class="reply">
          <div class="reply-head"><span class="reply-dot"></span>Harness</div>
          <p class="paragraph">${copy.reply[0]}</p>
          <p class="paragraph is-secondary">${copy.reply[1]}</p>
          <div class="chips">${copy.chips.map((chip) => `<span class="chip">${chip}</span>`).join('')}</div>
        </div>
      </div>
      <div class="composer-wrap">
        <div class="composer">
          <div class="composer-ph">${copy.placeholder}</div>
          <div class="composer-bar">
            <div class="composer-left"><span class="model">${CHIP}${copy.model}</span><span class="icon-button">${CLIP}</span></div>
            <span class="send">${SEND}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
`
}

/* -------------------------------------------------------------------------- */
/* Dialog pieces                                                             */
/* -------------------------------------------------------------------------- */

function sectionBlock({ title, description, extra, body, bodyClass }) {
  return `
<section class="sx-section">
  <div class="sx-section-head">
    <div class="sx-section-heading">
      <h3 class="sx-section-title">${title}</h3>
      ${description === undefined ? '' : `<p class="sx-section-desc">${description}</p>`}
    </div>
    ${extra ?? ''}
  </div>
  <div class="sx-section-body${bodyClass ? ` ${bodyClass}` : ''}">${body}</div>
</section>`
}

function slider({ label, value, min, max, format }) {
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100
  return `
<label class="sx-slider">
  <span class="sx-slider-head"><span class="sx-label">${label}</span><span class="sx-slider-value">${format(value)}</span></span>
  <input class="sx-range" style="--sx-range-fill:${Math.max(0, Math.min(100, percent))}%" type="range" min="${min}" max="${max}" step="1" value="${value}" />
</label>`
}

function segmented({ label, options, value }) {
  return `
<div class="sx-field">
  <span class="sx-label">${label}</span>
  <div class="sx-segmented is-block" role="radiogroup">
    ${options
      .map(
        (option) =>
          `<button class="sx-segment${option.value === value ? ' is-active' : ''}" role="radio" aria-checked="${
            option.value === value
          }">${option.label}</button>`,
      )
      .join('')}
  </div>
</div>`
}

function switchRow({ label, description, checked, preview }) {
  return `
<div class="sx-switch-row">
  ${preview ?? ''}
  <div class="sx-switch-text"><span class="sx-switch-label">${label}</span><span class="sx-switch-desc">${description}</span></div>
  <button class="sx-switch${checked ? ' is-on' : ''}" role="switch" aria-checked="${checked}"><span class="sx-switch-thumb"></span></button>
</div>`
}

function headerHtml(isDraft) {
  return `
<header class="sx-header">
  <div class="sx-header-brand">
    <span class="sx-header-icon">${icon(Icons.DockIcon, 19)}</span>
    <div class="sx-header-main">
      <h2 class="sx-title">${t('dialog.title')}</h2>
      <p class="sx-subtitle">${isDraft ? t('dialog.previewSubtitle') : t('dialog.subtitle')}</p>
    </div>
  </div>
  <button class="sx-close" title="${t('dialog.close')}">${icon(Icons.CloseIcon, 17)}</button>
</header>`
}

function footerHtml(isDraft) {
  return `
<footer class="sx-footer">
  <div class="sx-footer-left">
    <button class="sx-btn sx-btn-text">${icon(Icons.RestoreIcon, 14)}<span>${t('dialog.restore')}</span></button>
  </div>
  <div class="sx-footer-right">${
    isDraft
      ? `<button class="sx-btn">${t('dialog.cancelPreview')}</button><button class="sx-btn sx-btn-primary">${t('dialog.save')}</button>`
      : `<button class="sx-btn">${t('dialog.close')}</button>`
  }</div>
</footer>`
}

function dialogShell(isDraft, body) {
  return `
<div class="sx-overlay">
  <div class="sx-dialog" role="dialog" aria-modal="true">
    ${headerHtml(isDraft)}
    <div class="sx-body">${body}</div>
    ${footerHtml(isDraft)}
  </div>
</div>`
}

function previewDialog(palette) {
  const wallpaperSection = sectionBlock({
    title: t('dialog.wallpaperShort'),
    body:
      slider({ label: t('dialog.strength'), value: 90, min: 0, max: 100, format: (value) => `${value}%` }) +
      slider({ label: t('dialog.blur'), value: blur, min: 0, max: 24, format: (value) => `${value}px` }) +
      segmented({
        label: t('dialog.scope'),
        value: scope,
        options: ['full', 'sidebar', 'hero'].map((entry) => ({ value: entry, label: t(`scope.${entry}`) })),
      }) +
      segmented({
        label: t('dialog.fit'),
        value: fit === 'contain' ? 'contain' : 'cover',
        options: ['contain', 'cover'].map((entry) => ({ value: entry, label: t(`fit.${entry}`) })),
      }),
  })

  const brandSection = sectionBlock({
    title: t('dialog.brandMarkShort'),
    extra: `<button class="sx-switch${brandMark ? ' is-on' : ''}" role="switch" aria-checked="${brandMark}"><span class="sx-switch-thumb"></span></button>`,
    body: `<div class="sx-brand-row">${
      brandMark
        ? `<img class="sx-brand-preview" src="${photoUrl}" alt="" />`
        : `<span class="sx-brand-placeholder">${icon(Icons.BrandIcon, 22)}</span>`
    }<p class="sx-section-note">${t('dialog.brandMarkDesc')}</p></div>`,
  })

  const appearanceSection = sectionBlock({
    title: t('dialog.appearance'),
    body: `
<label class="sx-field">
  <span class="sx-label-row"><span class="sx-label">${t('dialog.name')}</span></span>
  <input class="sx-input" type="text" value="${skinName}" />
</label>`,
  })

  return dialogShell(
    true,
    `
<div class="sx-preview">
  <div class="sx-preview-media-col">
    <div class="sx-preview-media">
      <img class="sx-preview-img" src="${photoUrl}" alt="" />
      <span class="sx-media-badge">${t('dialog.preview')}</span>
    </div>
    <div class="sx-media-palette">
      <span class="sx-label">${t('dialog.palette')}</span>
      <div class="sx-swatches">${palette.map((color) => `<span class="sx-swatch" style="background:${color}"></span>`).join('')}</div>
    </div>
    <p class="sx-muted">${t('dialog.localHint')}</p>
  </div>
  <div class="sx-preview-side">${appearanceSection}${wallpaperSection}${brandSection}</div>
</div>`,
  )
}

function skinCardHtml({ url, name, active }) {
  return `
<li class="sx-skin-card${active ? ' is-active' : ''}">
  <div class="sx-skin-cover">
    <button class="sx-skin-apply"><img class="sx-skin-cover-img" src="${url}" alt="" /></button>
    ${active ? `<span class="sx-skin-cover-badge">${t('dialog.active')}</span>` : ''}
    <button class="sx-skin-delete">${icon(Icons.TrashIcon, 14)}</button>
  </div>
  <div class="sx-skin-info">
    <button class="sx-skin-name"><span class="sx-skin-name-text">${name}</span><span class="sx-skin-name-pencil">${icon(
      Icons.PencilIcon,
      12,
    )}</span></button>
    <span class="sx-skin-meta">${t('dialog.colorCount', { count: 5 })} · ${copy.cardTime}</span>
  </div>
</li>`
}

function savedDialog() {
  const cards = copy.cardNames.map((name, index) =>
    skinCardHtml({
      url: cardPaths[index] === undefined ? photoUrl : assetUrl(`../../${cardPaths[index]}`),
      name,
      active: index === activeCard,
    }),
  )

  const dropZone = `
<button class="sx-drop">
  <span class="sx-drop-icon-wrap">${icon(Icons.DropIcon, 26)}</span>
  <span class="sx-drop-title">${t('dialog.dropTitle')}</span>
  <span class="sx-drop-hint">${t('dialog.dropHint')}</span>
</button>`

  const savedSection = sectionBlock({
    title: t('dialog.saved'),
    extra: `<span class="sx-count">${cards.length}</span>`,
    body: `<ul class="sx-skins">${cards.join('')}</ul>`,
    bodyClass: 'sx-section-body-list',
  })

  const activeSection = sectionBlock({
    title: t('dialog.activeSkin'),
    description: t('dialog.activeHint'),
    extra: `<span class="sx-badge">${t('dialog.active')}</span>`,
    body:
      `<div class="sx-wallpaper-fields">` +
      slider({ label: t('dialog.strength'), value: 90, min: 0, max: 100, format: (value) => `${value}%` }) +
      slider({ label: t('dialog.blur'), value: blur, min: 0, max: 24, format: (value) => `${value}px` }) +
      segmented({
        label: t('dialog.scope'),
        value: scope,
        options: ['full', 'sidebar', 'hero'].map((entry) => ({ value: entry, label: t(`scope.${entry}`) })),
      }) +
      segmented({
        label: t('dialog.fit'),
        value: fit,
        options: ['contain', 'cover'].map((entry) => ({ value: entry, label: t(`fit.${entry}`) })),
      }) +
      `</div><div class="sx-divider"></div>` +
      switchRow({
        label: t('dialog.brandMark'),
        description: t('dialog.brandMarkDesc'),
        checked: brandMark,
        preview: brandMark
          ? `<span class="sx-switch-preview"><img class="sx-brand-preview sx-brand-preview-sm" src="${photoUrl}" alt="" /></span>`
          : '',
      }),
  })

  return dialogShell(false, `${dropZone}${savedSection}${activeSection}`)
}

/* -------------------------------------------------------------------------- */
/* Render                                                                     */
/* -------------------------------------------------------------------------- */

function styleElement(css) {
  const node = document.createElement('style')
  node.textContent = css
  document.head.appendChild(node)
}

async function loadPicture(url) {
  const image = new Image()
  image.src = url
  await image.decode()
  return image
}

async function main() {
  // Decode every picture the shot needs before the first paint, so a slow disk
  // read cannot leave an empty frame in the screenshot.
  const pictureUrls = [photoUrl, ...cardPaths.map((path) => assetUrl(`../../${path}`))]
  await Promise.all(pictureUrls.map((url) => loadPicture(url).catch(() => null)))

  const image = await loadPicture(photoUrl)

  const sampleWidth = 420
  const sampleHeight = Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * sampleWidth))
  const canvas = document.createElement('canvas')
  canvas.width = sampleWidth
  canvas.height = sampleHeight
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, sampleWidth, sampleHeight)
  const { palette, brand } = extractPalette(
    context.getImageData(0, 0, sampleWidth, sampleHeight).data,
    sampleWidth,
    sampleHeight,
    { maxColors: 5 },
  )

  const pairs = withWallpaperAlpha(buildTokenPairs(brand), opacity)
  const tokensCss =
    `:root{color-scheme:${scheme}}` +
    `body{${Object.entries(pairs)
      .map(([name, pair]) => `${name}:${pair[scheme]}`)
      .join(';')};--dsw-alias-settings-card-fill:var(--dsw-alias-bg-layer-2)}`

  const wallpaper = { url: photoUrl, opacity, blur, scope, fit, aspect: image.naturalWidth / image.naturalHeight }
  const wallpaperCss = WallpaperStyle({ wallpaper }).children.join('')

  styleElement('*,*::before,*::after{animation:none!important;transition:none!important}')
  styleElement(SHELL_CSS)
  styleElement(CSS)
  styleElement(tokensCss)
  styleElement(wallpaperCss)

  document.body.setAttribute('data-skinx-wallpaper', '')

  const dialog =
    mode === 'preview' ? previewDialog(palette.map((entry) => entry.hex)) : mode === 'saved' ? savedDialog() : ''

  document.body.innerHTML = shellHtml() + dialog

  // Let the new tree paint before Chrome captures the frame. Timers rather
  // than rAF: headless Chrome screenshots under virtual time, where frames are
  // not guaranteed to be scheduled at all.
  await new Promise((resolve) => setTimeout(resolve, 120))
  await Promise.all(
    [...document.images].map((element) => (element.complete ? Promise.resolve() : element.decode().catch(() => null))),
  )

  document.title = `ready ${palette.map((entry) => entry.hex).join(',')}`
}

main().catch((error) => {
  document.body.innerHTML = `<pre style="padding:24px;font:13px/1.6 monospace;color:#f66">${error?.stack ?? error}</pre>`
  document.title = 'error'
})
