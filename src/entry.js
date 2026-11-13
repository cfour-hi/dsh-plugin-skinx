/**
 * Browser artifact entry. The module loader seeds React through `require`.
 *
 * @module @cfour-hi/dsh-plugin-skinx/entry
 */

import { createClient } from './client.js'

window.__ModuleLoader__.load({
  id: '@cfour-hi/dsh-plugin-skinx',
  factory(require) {
    return createClient(require('react'))
  },
})
