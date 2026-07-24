# Dependabot 剩余告警整理与 Accept 操作指南

> 整理时间：2026-07-15  
> 扫描命令：`npm audit --registry=https://registry.npmjs.org`  
> Dependabot 入口：https://github.com/ShopeX/ECShopX_admin-frontend/security/dependabot  
> 关联文档：[fix-plan.md](./fix-plan.md) · [dependabot-remediation.md](../security-dependabot-remediation.md)

---

## 一、修复成果总览

| 阶段 | 漏洞总数 | Critical | High | 主要动作 |
|------|----------|----------|------|----------|
| 基线（修复前） | 174 | 34 | 77 | — |
| PR-1～3b（修复后） | **61** | **0** | 25 | 见下表 |
| **降幅** | **↓ 65%** | **↓ 100%** | **↓ 68%** | — |

### 已完成的修复（代码已改）

| 类别 | 动作 |
|------|------|
| 删除无用包 | `babel-preset-env`、`big`、`qiniu-webpack-plugin`、`node-sass-js-importer` |
| 运行时升级 | `axios@1.8.0`、`qs@6.14.0`、`lodash-es@4.17.23`、`nanoid@3.3.8` |
| SDK 升级 | `@antv/g2plot`、`cos-js-sdk-v5` |
| 构建脚本 | `xlsx` → `exceljs`（`build/update_i18n_from_excel.js`） |
| 开发工具 | `prettier-eslint-cli@8.0.1` |
| overrides | `fast-xml-parser`、`follow-redirects`、`lodash`、`semver` |
| 业务兼容 | PC 装修页 nanoid API 适配（`src/utils/nanoidAlphabet.js`） |
| 配置清理 | `vue.config.js` 移除 `qiniu-webpack-plugin` |

**构建验证**：`npm run build:b2c` ✅ · `npm run build:bbc` ✅

---

## 二、剩余 61 项处理策略

```
61 项
├── A. 建议 Accept（约 48 项）— 无补丁 / 仅 dev·构建 / 不进入生产包
├── B. 暂不处理（约 10 项）— 需大版本升级，单独立项
└── C. 禁止 force fix — 会破坏 Vue CLI 5 构建
```

**结论：安全修复工作已收尾，剩余项在 Dependabot 批量 Accept 即可。**

---

## 三、Dependabot Accept 清单（按类别）

在 GitHub → Security → Dependabot alerts → 选中告警 → **Dismiss alert** → 选 **Accept risk**，粘贴对应备注。

### 统一备注模板（可复制）

```
已评估：该告警属于 Vue 2 EOL / 仅开发构建依赖 / 无可用非破坏性修复。
已于 2026-07-15 完成依赖安全整治（Critical 清零，见 docs/security/fix-plan.md）。
计划 Vue 3 迁移或专项 PR 处理，当前不执行 npm audit fix --force。
```

---

### A1. Vue 2 生态 — 无官方补丁（10 项）✅ Accept

| 包 | 级别 | Accept 原因 |
|----|------|-------------|
| `vue` | Low | Vue 2 已 EOL，ReDoS 无补丁，根治需 Vue 3 |
| `element-ui` | Low | 依赖 vue@2，无安全更新 |
| `vuex` | Low | 依赖 vue@2 |
| `@icon-park/vue` | Low | 连带 vue |
| `lucide-vue` | Low | 连带 vue |
| `@riophae/vue-treeselect` | Low | 连带 vue |
| `@shopex-ui/finder` | Low | 连带 element-ui |
| `vue-advanced-cropper` | Low | 连带 vue |
| `vue-template-compiler` | Moderate | 仅 `npm run build` 编译期；不编译不可信模板 |
| `vue-loader` | Moderate | Vue CLI 构建链，不进入运行时 |

---

### A2. 构建工具链 — 不进入生产包（约 28 项）✅ Accept

> 以下包仅存在于 `devDependencies` 或构建传递依赖，**不会打入 `dist/`**。

| 包 | 级别 | 说明 |
|----|------|------|
| `sass-loader` | High | 传递依赖 `node-sass` 链；项目实际用 dart `sass`，升级需专项 PR |
| `node-sass` | High | 构建链遗留，非运行时 |
| `node-gyp` | High | node-sass 传递 |
| `tar` / `cacache` | High | node-gyp 传递 |
| `make-fetch-happen` | High | node-gyp 传递 |
| `@tootallnate/once` | Low | node-gyp 传递 |
| `http-proxy-agent` | Low | node-gyp 传递 |
| `gaze` / `globule` | High | node-sass 传递 |
| `svg-sprite-loader` | Moderate | SVG 图标构建 |
| `svg-baker` / `svg-baker-runtime` | Moderate | svg-sprite-loader 传递 |
| `braces` / `micromatch` | High | svg-baker 传递 |
| `@vue/cli-service` | Moderate | Vue CLI 5 核心 |
| `@vue/cli-plugin-babel` | Moderate | Vue CLI 插件 |
| `@vue/cli-plugin-eslint` | High | Vue CLI 插件 |
| `@vue/cli-plugin-router` | Moderate | Vue CLI 插件 |
| `@vue/cli-plugin-vuex` | Moderate | Vue CLI 插件 |
| `@vue/component-compiler-utils` | Moderate | vue-loader 传递 |
| `compression-webpack-plugin` | Moderate | 生产构建压缩 |
| `copy-webpack-plugin` | Moderate | 构建复制 |
| `css-minimizer-webpack-plugin` | Moderate | CSS 压缩 |
| `image-minimizer-webpack-plugin` | Moderate | 图片压缩 |
| `serialize-javascript` | High | webpack 插件传递 |
| `webpack-dev-server` | Moderate | 仅 `npm run dev` |
| `sockjs` | Moderate | dev-server 传递 |
| `postcss` | Moderate | 旧版传递（@vue/component-compiler-utils） |
| `cross-spawn` / `execa` / `yorkie` | High | @vue/cli-plugin-eslint → git hooks |
| `minimatch` / `glob` | High | 构建工具传递 |

---

### A3. 开发 / 提交工具 — 不进生产（约 6 项）✅ Accept

| 包 | 级别 | 说明 |
|----|------|------|
| `cz-customizable` | Low | commitizen 交互，仅本地 |
| `inquirer` / `external-editor` / `tmp` | Low/High | cz-customizable / commit 工具传递 |
| `prettier-eslint` | High | 已升 cli@8；顶层 dev 工具 |
| `prettier-eslint-cli` | High | 已升 8.0.1；audit 仍可能报嵌套 |
| `@typescript-eslint/parser` | High | prettier-eslint 传递，仅 lint |
| `@typescript-eslint/typescript-estree` | High | 同上 |

---

### A4. 图表 / 视频 — 已升或影响面小（约 4 项）✅ Accept

| 包 | 级别 | 说明 |
|----|------|------|
| `@antv/g2plot` | High | 已升到 2.4.35；rollup 传递无非破坏性修复 |
| `fmin` / `rollup` | High | g2plot 传递 |
| `exceljs` | Moderate | 仅 `build/update_i18n_from_excel.js` 开发脚本 |

---

### B. 暂不 Accept — 建议单独立项（可选后续）

| 包 | 级别 | 后续方案 | 优先级 |
|----|------|----------|--------|
| `vue-video-player` | Moderate | 换播放器或升 video.js 7+ | 低（仅视频页） |
| `video.js` | Moderate | 同上 | 低 |
| `videojs-contrib-hls` | Moderate | 同上 | 低 |
| `videojs-contrib-media-sources` | Moderate | 同上 | 低 |
| `uuid` | Moderate | sockjs 传递，仅 dev-server | 低 |

---

## 四、Dependabot 批量操作步骤

1. 打开 https://github.com/ShopeX/ECShopX_admin-frontend/security/dependabot
2. 筛选 **Open** 告警
3. 对 **A1～A4** 类别逐条或批量 **Dismiss → Accept risk**
4. 备注粘贴 [§三 统一备注模板](#统一备注模板可复制)
5. **不要** 点击 Dependabot 自动生成的 PR（多数会 `--force` 降级 Vue CLI）
6. 处理完成后在 [fix-plan.md §六](./fix-plan.md) 将 PR-4 标为 ✅

---

## 五、上线前业务回归清单

依赖升级后，建议在测试环境过一遍：

- [ ] 登录 / 登出 / Token 过期刷新（`axios@1.8`）
- [ ] 列表筛选、分页、带数组参数的 query（`qs@6.14`）
- [ ] 文件上传：阿里云 OSS / 腾讯云 COS（`cos-js-sdk-v5`）
- [ ] 文件导出 / 下载
- [ ] Dashboard 图表（`@antv/g2plot`，3 个页面）
- [ ] PC 首页 / 会员页 / 自定义页装修保存（`nanoid` 适配）
- [ ] `npm run build:b2c` + `npm run build:bbc` 构建成功

---

## 六、禁止事项（再次强调）

| 操作 | 后果 |
|------|------|
| `npm audit fix --force` | Vue CLI 降到 3.x，构建失败 |
| 一次性升 Vue 3 | 范围过大，应单独立项 |
| 在 npmmirror 跑 audit | 不支持，结果不准 |

---

## 七、可选后续专项（非阻塞上线）

| 专项 | 预期收益 | 工期 |
|------|----------|------|
| `sass-loader` 13+ 升级 | 消 node-sass 链 5~8 High | 1～2 天 |
| SVG 图标方案替换 | 消 svg-sprite-loader 链 | 2～3 天 |
| Vue 3 + Element Plus 迁移 | 根治 Vue 2 全部告警 | 数月 |
| CI 加 `npm audit --audit-level=critical` | 防止 Critical 回退 | 0.5 天 |

---

*本文档随 `npm audit` 结果更新；下次大版本依赖变更后重新扫描并修订 §三 清单。*
