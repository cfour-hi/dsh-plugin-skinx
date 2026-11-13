/**
 * Inline stroke icons (24-unit grid) used by the SkinX dialog. They inherit
 * `currentColor`, so they follow the same theme tokens as the text around
 * them.
 *
 * @module @cfour-hi/dsh-plugin-skinx/ui/icons
 */

import { h } from '../react.js'

function icon(size, children) {
  return h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': true,
      focusable: false,
    },
    ...children,
  )
}

export function DockIcon({ size = 18 }) {
  return h(
    'svg',
    { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': true },
    h('rect', {
      x: 3,
      y: 4.5,
      width: 18,
      height: 13.5,
      rx: 3,
      stroke: 'currentColor',
      strokeWidth: 1.7,
    }),
    h('circle', { cx: 8.2, cy: 9, r: 1.55, fill: 'currentColor' }),
    h('path', {
      d: 'M4.2 16.2l4.6-4.4 3.4 2.9 3-2.4 4.4 4.2',
      stroke: 'currentColor',
      strokeWidth: 1.7,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
    h('circle', { cx: 6.2, cy: 20.2, r: 1.15, fill: 'currentColor' }),
    h('circle', { cx: 11.2, cy: 20.2, r: 1.15, fill: 'currentColor' }),
    h('circle', { cx: 16.2, cy: 20.2, r: 1.15, fill: 'currentColor' }),
  )
}

export function DropIcon({ size = 26 }) {
  return h(
    'svg',
    { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': true },
    h('rect', {
      x: 3,
      y: 4.5,
      width: 18,
      height: 15,
      rx: 3,
      stroke: 'currentColor',
      strokeWidth: 1.6,
    }),
    h('circle', { cx: 8.2, cy: 9.2, r: 1.5, fill: 'currentColor' }),
    h('path', {
      d: 'M4.4 16.6l4.4-4.2 3.2 2.8 3-2.3 4.6 4.1',
      stroke: 'currentColor',
      strokeWidth: 1.6,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  )
}

export function CloseIcon({ size = 16 }) {
  return icon(size, [h('path', { key: 'a', d: 'M6 6l12 12' }), h('path', { key: 'b', d: 'M18 6L6 18' })])
}

export function CheckIcon({ size = 14 }) {
  return icon(size, [h('path', { key: 'a', d: 'M5 12.5l4.5 4.5L19 7.5' })])
}

export function AlertIcon({ size = 16 }) {
  return icon(size, [
    h('circle', { key: 'a', cx: 12, cy: 12, r: 9 }),
    h('path', { key: 'b', d: 'M12 7.5V13' }),
    h('circle', { key: 'c', cx: 12, cy: 16.5, r: 0.9, fill: 'currentColor', stroke: 'none' }),
  ])
}

export function PencilIcon({ size = 12 }) {
  return icon(size, [
    h('path', { key: 'a', d: 'M4.5 19.5l.9-3.8L15.8 5.2a2.05 2.05 0 0 1 2.9 2.9L8.3 18.6l-3.8.9z' }),
    h('path', { key: 'b', d: 'M14.4 6.6l3 3' }),
  ])
}

export function TrashIcon({ size = 15 }) {
  return icon(size, [
    h('path', { key: 'a', d: 'M4 7h16' }),
    h('path', { key: 'b', d: 'M9.4 7V5.6C9.4 4.7 10.1 4 11 4h2c.9 0 1.6.7 1.6 1.6V7' }),
    h('path', { key: 'c', d: 'M6.4 7l.8 11.5c.1 1 .9 1.5 1.9 1.5h5.8c1 0 1.8-.5 1.9-1.5L17.6 7' }),
    h('path', { key: 'd', d: 'M10.4 10.8v5.4' }),
    h('path', { key: 'e', d: 'M13.6 10.8v5.4' }),
  ])
}

export function RestoreIcon({ size = 14 }) {
  return icon(size, [
    h('path', { key: 'a', d: 'M4.5 10.5a8 8 0 1 1 2.2 6.4' }),
    h('path', { key: 'b', d: 'M4.5 5.5v5h5' }),
  ])
}

export function BrandIcon({ size = 22 }) {
  return icon(size, [
    h('path', { key: 'a', d: 'M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1L5 10.5l5.1-1.9L12 3.5z' }),
    h('path', { key: 'b', d: 'M18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z' }),
  ])
}

export function EmptyIcon({ size = 26 }) {
  return icon(size, [
    h('rect', { key: 'a', x: 3, y: 4.5, width: 18, height: 15, rx: 3 }),
    h('path', { key: 'b', d: 'M7.5 14.5l3-2.6 2.4 2 2.1-1.7 3 2.6' }),
    h('circle', { key: 'c', cx: 8.2, cy: 8.7, r: 1.2, fill: 'currentColor', stroke: 'none' }),
  ])
}
