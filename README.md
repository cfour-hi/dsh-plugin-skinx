<p align="center">
  <img src="https://raw.githubusercontent.com/cfour-hi/dsh-plugin-skinx/main/banner.zh-CN.svg" alt="SkinX — 把任意图片变成 DeepSeek Harness 主题">
</p>

<p align="center">
  <strong>简体中文</strong> · <a href="README.en.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/cfour-hi/dsh-plugin-skinx/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/cfour-hi/dsh-plugin-skinx/ci.yml?branch=main&amp;label=CI&amp;style=flat-square"></a>
  <a href="https://www.npmjs.com/package/@cfour-hi/dsh-plugin-skinx"><img alt="npm version" src="https://img.shields.io/npm/v/@cfour-hi/dsh-plugin-skinx?logo=npm&amp;logoColor=white&amp;color=cb3837&amp;style=flat-square"></a>
  <a href="https://github.com/cfour-hi/dsh-plugin-skinx/blob/main/package.json"><img alt="Node.js >= 20" src="https://img.shields.io/badge/node-%3E%3D20-339933?logo=nodedotjs&amp;logoColor=white&amp;style=flat-square"></a>
  <a href="https://github.com/cfour-hi/dsh-plugin-skinx/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/github/license/cfour-hi/dsh-plugin-skinx?style=flat-square&amp;color=3da639"></a>
  <a href="https://github.com/cfour-hi/dsh-plugin-skinx/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/cfour-hi/dsh-plugin-skinx?style=flat-square&amp;color=6b7280"></a>
  <img alt="For DeepSeek Harness" src="https://img.shields.io/badge/for-DeepSeek%20Harness-4D6BFE?style=flat-square">
</p>

SkinX 读取一张图片，在本地提取配色，推导明暗两套主题 token（表面、文字、边框、品牌色、状态色、侧边栏），并把同一张图片用作壁纸、品牌标识和 Dock 缩略图。

## 功能

- **一张图片 → 一套可读的主题。** 图片本身不会直接变成 token：它的配色用于生成颜色种子，对比度校正保证标签清晰可读；语义状态色保留原有色相，仅在需要时修正明度。
- **自动配色。** 图片中最鲜艳的颜色成为品牌色，其余配色用于生成表面与标签；每个主题单独校正对比度，无需手动调整取色器。
- **壁纸。** 表面变为半透明，图片通过 `body::before`/`body::after` 透出：图片以 `contain` 方式绘制，并叠加一张铺满（cover）的模糊背景，图片边缘羽化融入背景，避免生硬边界。`cover` 模式则通过裁切铺满视口。强度、模糊、适配方式和作用范围（整页 / 侧边栏 / 空白会话主视觉）均可调整。
- **图片的其他用途。** 图片还会填充侧边栏品牌标识和空白会话主视觉标识，并作为 Dock 按钮和已保存皮肤列表中的缩略图出现。
- **拖拽导入。** 在文本编辑器之外的任意位置拖入图片，SkinX 对话框会打开并实时预览。在对话框内粘贴同样可用；页面不再拦截文本输入框之外的粘贴。
- **已保存的皮肤。** 点击皮肤图片即可应用；点击名称（或铅笔图标）可原地重命名；悬停封面可显示删除按钮。可在对话框底部恢复默认外观。下次启动时会恢复当前皮肤及其壁纸/品牌标识设置。
- **仅本地处理。** 解码、配色提取和编码都在页面内完成；不会上传到网络服务，也不会调用模型。

## 使用

1. 点击侧边栏底部“设置”旁的 SkinX 图标（应用皮肤后，图标会显示当前图片）。
2. 将图片拖到页面或对话框上（也可以选择文件，或在对话框打开时粘贴）。
3. 调整名称、壁纸范围/强度/模糊和品牌标识。
4. **保存并应用**。
5. 重新打开对话框即可切换皮肤（点击图片）、原地重命名、调整当前皮肤，或恢复默认。

## 安装

```bash
npm install @cfour-hi/dsh-plugin-skinx
```

然后在运行中的 Harness 里安装 bundle：

```
plugin_manager(action: "install_bundle", target: "@cfour-hi/dsh-plugin-skinx")
```

### 从本地检出版本安装

```bash
cd /Users/qaxc84/GitHub/dsh-plugin-skinx
pnpm install           # esbuild，仅用于构建 client.js
pnpm run build
```

```
plugin_manager(action: "install_bundle", target: "/Users/qaxc84/GitHub/dsh-plugin-skinx")
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

一次性配置：

- 在 npm 接受 trusted publisher 之前，包必须已存在于 registry，因此需要先手动发布首个版本：

  ```bash
  npm login
  npm publish --access public
  ```

- 然后在 npmjs.com 打开该包 → **Settings** → **Trusted Publisher** → **GitHub Actions**，填写 owner `cfour-hi`、repository `dsh-plugin-skinx`、workflow `publish.yml`，environment 留空。之后每次打标签都会通过 OIDC 发布，无需保存 secret。
- Provenance 证明需要公开仓库；本项目已公开。

## 数据与隐私

- 皮肤定义保存在 `${DSH_HOME:-~/.dsh}/skinx/skins.json`；壁纸保存在 `.../skinx/backgrounds/`。
- Host 端通过随包提供的 Connection 信任机制在 `/skinx/api` 下提供这些数据，只有页面自身会话可以读写。
- 图片在存储前会缩放到最大 1600 px，并重新编码为 WebP/JPEG。

## 工作原理

- **色彩计算**（`src/color.js`）：sRGB ↔ OKLab/OKLCH 以及 WCAG 对比度。
- **配色**（`src/palette.js`）：64×64 采样、直方图量化、确定性的加权 k-means、`sqrt(area) × chroma` 评分，以及候选生成（vivid / dominant / tonal）。
- **Tokens**（`src/tokens.js`）：以明/暗成对形式定义 alias token；标签在可见的 chroma 下限内保留图片色相（primary、secondary、tertiary、caption），并在 OKLCH 明度上微调，直到在所有表面上至少达到 4.5:1 对比度。链接跟随品牌色；品牌色会被限制在可用范围内，tone 参数会同时调整 tonal 候选的背景族与标签。
- **主题应用**（`src/runtime.js`）：使用 `theme.overrideTokens('skinx', …)` 提供明/暗值，因此皮肤会跟随明暗偏好，并可通过销毁单个图层来恢复。壁纸表面通过同一图层获得 alpha。
- **品牌标识**（`src/client.js`）：只有在设置了图片时才占用两个单一品牌槽位，因此没有激活皮肤时会恢复内置标识。
- **Host**（`index.js`）：带原子写入的 JSON 存储以及 `/skinx/api` 路由。

## 开发

```bash
pnpm run build       # 将 src/ 打包为 client.js
pnpm run test        # 用 node --test 测试纯模块和 Host API
pnpm run verify      # 构建检查 + host 语法检查 + 测试
```

`client.js` 是生成文件；请修改 `src/` 后重新构建。

## 已知限制

- 配色提取是算法式的，而非语义式的：SkinX 无法识别“这是日落”——它只读取颜色。对比度极低或单色的图片会回退为中性色调。
- 壁纸假设内置表面使用 alias token。任何使用固定字面颜色绘制的表面都会保持不透明。
- 局部壁纸范围通过遮罩近似区域（侧边栏使用左侧列淡出，主视觉使用居中光晕），而不是直接作用于这些容器。
- 边缘羽化需要图片的宽高比。在记录该信息之前保存的皮肤会在加载时探测一次，并持久化该比例，因此无需重新选择图片也能获得羽化效果。
- 启用品牌标识后，皮肤激活期间会替换内置侧边栏品牌标识。
- `label-primary-inverted` 会根据生成的品牌填充色选择黑色或白色。变暗和偏蓝的文字与其他文字一样受到对比度保护；动画 `label-shimmer` 仍由宿主管理。
- 同一时间全局只有一个激活皮肤；按会话的皮肤和 Appearance 主题选择器不属于此版本。

## 可读性保护

壁纸会叠加一层保护性色调，不透明度最低为 80%，即使已保存的皮肤请求更低值也如此。基础内容表面保持透明，嵌套层仅增加少量深度色调，避免重复的全强度遮罩。每个标签、链接、品牌色和语义文字颜色都会针对所有表面上最差的黑/白壁纸像素进行校验，并为 hover/徽章背景色调额外保留 12% 余量。对话框/菜单遮罩保持不透明。两层壁纸都包含保护性色调，因此透明内容容器也会受到保护。按钮文字会自动选择黑色或白色。旧皮肤在加载时会重建 token；后续编辑会持久化重建后的集合。

回归矩阵覆盖明/暗模式、tone 极值、中性色与鲜艳配色、不透明度极值、嵌套表面、带色状态和反色按钮文字。硬编码颜色、额外不透明度或无关背景的宿主组件仍需在运行中的应用里做视觉验证。

文件变更悬停预览和代码评审正文保留不透明的本地表面，因此未变更的 diff 行不会透出下方对话。这利用了宿主的 `data-changes-hover-preview` 和 `data-review-view` 属性。
