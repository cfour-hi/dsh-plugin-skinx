# SkinX

Turn a picture into a DeepSeek Harness theme. SkinX reads an image, extracts a
palette locally, derives light/dark values for theme tokens (surfaces,
text, borders, brand, state, sidebar), and uses the same picture as a wallpaper,
a brand mark, and a dock thumbnail.

## What it does

- **One picture → a readable theme.** The picture never becomes a token by
  itself: its palette seeds the colors, contrast correction keeps labels
  readable, and semantic state colors retain their hue while their lightness is corrected when needed.
- **Automatic palette.** The most vivid color in the picture becomes the brand
  color and the rest of the palette seeds surfaces and labels; contrast is
  corrected per theme, so there is no palette picker to fiddle with.
- **Wallpaper.** Surfaces become translucent so the picture shows
  through `body::before`/`body::after`: the picture is drawn with `contain` plus
  a cover-sized blurred backdrop, and its own edges are feathered into that
  backdrop so the boundary is not abrupt. A `cover` mode fills the viewport by
  cropping instead. Strength, blur, fit, and scope (whole page / sidebar /
  empty-session hero) are adjustable.
- **The picture elsewhere.** The picture also fills the sidebar brand mark and
  the blank-session hero mark, and appears as a thumbnail in the dock button
  and the saved-skin list.
- **Drag intake.** Drag a picture anywhere outside a text editor and the SkinX
  dialog opens with a live preview. Pasting inside the dialog also works; the
  page no longer intercepts paste outside a text field.
- **Saved skins.** Click a skin's picture to apply it, click its name (or the
  pencil) to rename it in place, and hover a cover to reveal its delete button.
  Restore the default look from the dialog footer. The active skin and its
  wallpaper/brand-mark settings are restored on the next launch.
- **Local-only.** Decoding, palette extraction, and encoding happen in the
  page; nothing is uploaded to a network service and no model is called.

## Use

1. Click the SkinX icon beside Settings at the sidebar foot (it shows the
   active picture once a skin is applied).
2. Drop a picture onto the page or the dialog (or pick a file, or paste while
   the dialog is open).
3. Tune the name, wallpaper scope/strength/blur, and brand mark.
4. **Save and apply**.
5. Reopen the dialog to switch skins (click the picture), rename one in place,
   tune the active skin, or restore the default.

## Install

```bash
npm install @cfour-hi/dsh-plugin-skinx
```

Then install the bundle in the running Harness:

```
plugin_manager(action: "install_bundle", target: "@cfour-hi/dsh-plugin-skinx")
```

### From a checkout

```bash
cd /Users/qaxc84/GitHub/dsh-plugin-skinx
pnpm install           # esbuild, only for building client.js
pnpm run build
```

```
plugin_manager(action: "install_bundle", target: "/Users/qaxc84/GitHub/dsh-plugin-skinx")
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

One-time setup:

- The package must already exist on the registry before npm accepts a trusted
  publisher, so publish the first version once by hand:

  ```bash
  npm login
  npm publish --access public
  ```

- Then open the package on npmjs.com → **Settings** → **Trusted Publisher** →
  **GitHub Actions** and enter owner `cfour-hi`, repository
  `dsh-plugin-skinx`, workflow `publish.yml`, and leave the environment field
  empty. Every later tag publishes through OIDC with no stored secret.
- Provenance attestations require a public repository; this one is public.

## Data and privacy

- Skin definitions live in `${DSH_HOME:-~/.dsh}/skinx/skins.json`; wallpapers
  live in `.../skinx/backgrounds/`.
- The Host half serves them under `/skinx/api` behind the shipped Connection
  trust fence, so only the page's own session can read or write them.
- Images are resized to at most 1600 px and re-encoded as WebP/JPEG before
  they are stored.

## How it works

- **Color math** (`src/color.js`): sRGB ↔ OKLab/OKLCH and WCAG contrast.
- **Palette** (`src/palette.js`): 64×64 sampling, histogram quantization, a
  deterministic weighted k-means, a score of `sqrt(area) × chroma`, and
  candidate generation (vivid / dominant / tonal).
- **Tokens** (`src/tokens.js`): the alias tokens as light/dark pairs; labels
  keep the picture's hue at a visible chroma floor (primary, secondary,
  tertiary, caption) and are nudged in OKLCH lightness until they meet at least
  4.5:1 contrast across all surfaces. Links follow the brand; brand color is clamped to a usable
  range, and a tone parameter shifts both the background family and the
  labels for the tonal candidate.
- **Theme application** (`src/runtime.js`): `theme.overrideTokens('skinx', …)`
  with light/dark values, so the skin follows the light/dark preference and
  restores by disposing one layer. Wallpaper surfaces get alpha via the same
  layer.
- **Brand marks** (`src/client.js`): the two single brand slots are occupied
  only while a picture is set, so the shipped mark returns when no skin is
  active.
- **Host** (`index.js`): JSON store with atomic writes and the `/skinx/api`
  routes.

## Develop

```bash
pnpm run build       # bundle src/ → client.js
pnpm run test        # node --test for the pure modules and the Host API
pnpm run verify      # build check + host syntax + tests
```

`client.js` is generated; edit `src/` and rebuild.

## Known limits

- Palette extraction is algorithmic, not semantic: SkinX does not recognize
  "this is a sunset" — it only reads colors. Very low-contrast or monochrome
  pictures fall back to a neutral tint.
- The wallpaper assumes shipped surfaces use the alias tokens. Any surface
  painted with a fixed literal color will stay opaque.
- Local wallpaper scopes approximate the region with a mask (a left column fade
  for the sidebar, a centered glow for the hero) instead of addressing those
  containers directly.
- Edge feathering needs the picture's aspect ratio. Skins saved before it was
  recorded are probed once on load, and the ratio is persisted so they get the
  feather without re-selecting the picture.
- Enabling the brand mark replaces the shipped sidebar brand while a skin is
  active.
- `label-primary-inverted` chooses black or white against the generated brand
  fill. Dimmed and bluish text receive the same contrast protection as other
  text; animated `label-shimmer` remains owned by the host.
- One skin is active globally; per-session skins and the Appearance theme
  picker are not part of this version.

## Readability protection

The wallpaper receives one protective tint with a minimum opacity of 80%, even
if a saved skin requests less. Base content surfaces stay transparent and nested
layers add only a small depth tint, avoiding repeated full-strength masks. Every label, link, brand and semantic text color is checked against the
worst black/white wallpaper pixel across all surfaces, with another 12% margin
for hover/badge background tints. Dialog/menu overlays remain opaque. Both
wallpaper layers include the protective tint so transparent content containers
are protected too. Button text automatically selects black or white. Older
skins rebuild their tokens when loaded; subsequent edits persist the rebuilt set.

The regression matrix covers light/dark modes, tone extremes, neutral and vivid
palettes, opacity extremes, nested surfaces, tinted states and inverse button
text. Host components with hard-coded colors, additional opacity or unrelated
backgrounds still need visual verification in the running application.

File-change hover previews and code review bodies keep an opaque local surface,
so unchanged diff lines cannot show the conversation underneath. This uses the
host `data-changes-hover-preview` and `data-review-view` attributes.
