# Development and maintenance

This page is for maintainers and contributors. It collects the implementation
and process details moved out of [README.en.md](README.en.md); for installing and
using the plugin, see the README. 中文: [CONTRIBUTING.md](CONTRIBUTING.md)。

## Develop

```bash
pnpm install          # esbuild, only for building client.js
pnpm run build        # bundle src/ → client.js
pnpm run test         # node --test for the pure modules and the Host API
pnpm run verify       # build check + host syntax + tests
```

`client.js` is generated; edit `src/` and rebuild.

## Documentation shots

The images under `docs/examples/` come from `pnpm run docs:shots`:
`scripts/docs-shots/page.js` decodes the sample pictures in headless Chrome
(`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` by default,
override with `CHROME_BIN`), runs `src/palette.js` and `src/tokens.js` to derive
and inject the tokens, then paints the dialog and the wallpaper with
`src/ui/styles.js` and `WallpaperStyle`. The host shell around the dialog is an
illustrative layout only. Sample pictures live in `docs/examples/source/`; swap
them and rerun the script.


## From a checkout

```bash
cd <checkout-dir>
pnpm install
pnpm run build
```

```
plugin_manager(action: "install_bundle", target: "<absolute path to checkout>")
```

The row is `@cfour-hi/dsh-plugin-skinx` (patch id `skinx`). A linked directory
install picks up the checkout directly, so rebuild `client.js` before
reinstalling after source changes.

## Release

Every push to `main` and every pull request runs `.github/workflows/ci.yml`
(`pnpm install --frozen-lockfile` then `pnpm verify`).

Publishing is done by GitHub Actions (`.github/workflows/publish.yml`); nothing
is published from a laptop. The workflow authenticates through npm Trusted
Publishing over OIDC, so there is no `NPM_TOKEN` secret. A `v*` tag whose
version matches `package.json` triggers it; it verifies the package with
`pnpm verify` and then publishes `@cfour-hi/dsh-plugin-skinx` with
`npm publish` (npm ≥ 11.5.1 is required for OIDC; pnpm still handles install
and verification because it has no OIDC support). Provenance is attested
automatically. Prerelease versions (`-beta`, `-rc`, …) go to the `next`
dist-tag instead of `latest`.

1. Bump `version` in `package.json` and commit it on `main`.
2. Tag and push:

   ```bash
   pnpm version patch     # or minor/major; commits and tags vX.Y.Z
   git push origin main --follow-tags
   ```

`workflow_dispatch` accepts a `dry_run` input (default `true`) to pack and
verify without uploading.

### One-time setup (already done here; kept for forks)

- npm requires the package to exist on the registry before it accepts a trusted
  publisher, so the first version must be published once by hand:

  ```bash
  npm login
  npm publish --access public
  ```

- Then open the package on npmjs.com → **Settings** → **Trusted Publisher** →
  **GitHub Actions** and enter owner `cfour-hi`, repository
  `dsh-plugin-skinx`, workflow `publish.yml`, and leave the environment field
  empty. Every later tag publishes through OIDC with no stored secret.
- Provenance attestations require a public repository; this one is public.

## How it works

- **Color math** (`src/color.js`): sRGB ↔ OKLab/OKLCH and WCAG contrast.
- **Palette** (`src/palette.js`): 64×64 sampling, histogram quantization, a
  deterministic weighted k-means, a score of `sqrt(area) × chroma`, and
  candidate generation (vivid / dominant / tonal).
- **Tokens** (`src/tokens.js`): the alias tokens as light/dark pairs; labels
  keep the picture's hue at a visible chroma floor (primary, secondary,
  tertiary, caption) and are nudged in OKLCH lightness until they meet at least
  4.5:1 contrast across all surfaces. Links follow the brand; brand color is
  clamped to a usable range, and a tone parameter shifts both the background
  family and the labels for the tonal candidate.
- **Theme application** (`src/runtime.js`): `theme.overrideTokens('skinx', …)`
  with light/dark values, so the skin follows the light/dark preference and
  restores by disposing one layer. Wallpaper surfaces get alpha via the same
  layer.
- **Brand marks** (`src/client.js`): the two single brand slots are occupied
  only while a picture is set, so the shipped mark returns when no skin is
  active.
- **Host** (`index.js`): JSON store with atomic writes and the `/skinx/api`
  routes.

## Extra notes on known limits

- Edge feathering needs the picture's aspect ratio. Skins saved before it was
  recorded are probed once on load, and the ratio is persisted so they get the
  feather without re-selecting the picture.
- `label-primary-inverted` chooses black or white against the generated brand
  fill. Dimmed and bluish text receive the same contrast protection as other
  text; animated `label-shimmer` remains owned by the host.

## Readability protection and regression tests

The wallpaper receives one protective tint with a minimum opacity of 80%, even
if a saved skin requests less. Base content surfaces stay transparent and nested
layers add only a small depth tint, avoiding repeated full-strength masks.
Every label, link, brand and semantic text color is checked against the worst
black/white wallpaper pixel across all surfaces, with another 12% margin for
hover/badge background tints. Dialog/menu overlays remain opaque. Both
wallpaper layers include the protective tint so transparent content containers
are protected too. Button text automatically selects black or white. Older
skins rebuild their tokens when loaded; subsequent edits persist the rebuilt
set.

The regression matrix covers light/dark modes, tone extremes, neutral and vivid
palettes, opacity extremes, nested surfaces, tinted states and inverse button
text. Host components with hard-coded colors, additional opacity or unrelated
backgrounds still need visual verification in the running application.

File-change hover previews and code review bodies keep an opaque local surface,
so unchanged diff lines cannot show the conversation underneath. This uses the
host `data-changes-hover-preview` and `data-review-view` attributes.
