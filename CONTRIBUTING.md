# 开发与维护

本文面向维护者与贡献者，收纳从 [README.md](README.md) 移出的实现与流程说明；插件的安装与使用请看 README。English: [CONTRIBUTING.en.md](CONTRIBUTING.en.md)。

## 开发

```bash
pnpm install          # esbuild，仅用于构建 client.js
pnpm run build        # 将 src/ 打包为 client.js
pnpm run test         # 用 node --test 测试纯模块和 Host API
pnpm run verify       # 构建检查 + host 语法检查 + 测试
```

`client.js` 是生成文件；请修改 `src/` 后重新构建。

## 从本地检出版本安装

```bash
cd <检出目录>
pnpm install
pnpm run build
```

```
plugin_manager(action: "install_bundle", target: "<检出目录的绝对路径>")
```

安装后的条目为 `@cfour-hi/dsh-plugin-skinx`（patch id 为 `skinx`）。链接目录安装会直接使用该检出版本，因此源码变更后需重新构建 `client.js` 再重新安装。

## 发布

每次推送到 `main` 以及每个 Pull Request 都会运行 `.github/workflows/ci.yml`（`pnpm install --frozen-lockfile`，然后 `pnpm verify`）。

发布由 GitHub Actions（`.github/workflows/publish.yml`）完成，不在本地机器上发布。工作流通过 OIDC 使用 npm Trusted Publishing 认证，因此无需 `NPM_TOKEN` secret。推送与 `package.json` 版本一致的 `v*` 标签即可触发；它会先执行 `pnpm verify` 校验包，再用 `npm publish` 发布 `@cfour-hi/dsh-plugin-skinx`（OIDC 需要 npm ≥ 11.5.1；安装与校验仍由 pnpm 负责，因为 pnpm 尚不支持 OIDC）。Provenance 会自动生成。预发布版本（`-beta`、`-rc` 等）会发布到 `next` dist-tag，而不是 `latest`。

1. 更新 `package.json` 中的 `version` 并在 `main` 上提交。
2. 打标签并推送：

   ```bash
   pnpm version patch     # 或 minor/major；会提交并创建 vX.Y.Z 标签
   git push origin main --follow-tags
   ```

`workflow_dispatch` 接受 `dry_run` 输入（默认 `true`），用于打包和校验而不上传。

### 一次性配置（本项目已完成，供 fork 参考）

- npm 要求包先存在于 registry 才能登记 trusted publisher，因此首个版本需手动发布一次：

  ```bash
  npm login
  npm publish --access public
  ```

- 然后在 npmjs.com 打开该包 → **Settings** → **Trusted Publisher** → **GitHub Actions**，填写 owner `cfour-hi`、repository `dsh-plugin-skinx`、workflow `publish.yml`，environment 留空。之后每次打标签都会通过 OIDC 发布，无需保存 secret。
- Provenance 证明需要公开仓库；本项目已公开。

## 工作原理

- **色彩计算**（`src/color.js`）：sRGB ↔ OKLab/OKLCH 以及 WCAG 对比度。
- **配色**（`src/palette.js`）：64×64 采样、直方图量化、确定性的加权 k-means、`sqrt(area) × chroma` 评分，以及候选生成（vivid / dominant / tonal）。
- **Tokens**（`src/tokens.js`）：以明/暗成对形式定义 alias token；标签在可见的 chroma 下限内保留图片色相（primary、secondary、tertiary、caption），并在 OKLCH 明度上微调，直到在所有表面上至少达到 4.5:1 对比度。链接跟随品牌色；品牌色会被限制在可用范围内，tone 参数会同时调整 tonal 候选的背景族与标签。
- **主题应用**（`src/runtime.js`）：使用 `theme.overrideTokens('skinx', …)` 提供明/暗值，因此皮肤会跟随明暗偏好，并可通过销毁单个图层来恢复。壁纸表面通过同一图层获得 alpha。
- **品牌标识**（`src/client.js`）：只有在设置了图片时才占用两个单一品牌槽位，因此没有激活皮肤时会恢复内置标识。
- **Host**（`index.js`）：带原子写入的 JSON 存储以及 `/skinx/api` 路由。

## 已知限制的补充注记

- 边缘羽化需要图片的宽高比。在记录该信息之前保存的皮肤会在加载时探测一次，并持久化该比例，因此无需重新选择图片也能获得羽化效果。
- `label-primary-inverted` 会根据生成的品牌填充色选择黑色或白色。变暗和偏蓝的文字与其他文字一样受到对比度保护；动画 `label-shimmer` 仍由宿主管理。

## 可读性保护与回归测试

壁纸会叠加一层保护性色调，不透明度最低为 80%，即使已保存的皮肤请求更低值也如此。基础内容表面保持透明，嵌套层仅增加少量深度色调，避免重复的全强度遮罩。每个标签、链接、品牌色和语义文字颜色都会针对所有表面上最差的黑/白壁纸像素进行校验，并为 hover/徽章背景色调额外保留 12% 余量。对话框/菜单遮罩保持不透明。两层壁纸都包含保护性色调，因此透明内容容器也会受到保护。按钮文字会自动选择黑色或白色。旧皮肤在加载时会重建 token；后续编辑会持久化重建后的集合。

回归矩阵覆盖明/暗模式、tone 极值、中性色与鲜艳配色、不透明度极值、嵌套表面、带色状态和反色按钮文字。硬编码颜色、额外不透明度或无关背景的宿主组件仍需在运行中的应用里做视觉验证。

文件变更悬停预览和代码评审正文保留不透明的本地表面，因此未变更的 diff 行不会透出下方对话。这利用了宿主的 `data-changes-hover-preview` 和 `data-review-view` 属性。
