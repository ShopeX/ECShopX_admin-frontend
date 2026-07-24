# 依赖漏洞修复执行方案

> 制定时间：2026-07-15  
> 基线扫描：`npm audit --registry=https://registry.npmjs.org` → **174 项**（Critical 34 / High 77 / Moderate 42 / Low 21）  
> 关联文档：[dependabot-remediation.md](./dependabot-remediation.md)  
> Dependabot：https://github.com/ShopeX/ECShopX_admin-frontend/security/dependabot

---

## 一、修复目标

| 阶段 | 目标 | 预计剩余告警 | 工期 |
|------|------|--------------|------|
| PR-1 清理 | 删除无用依赖 + audit fix | ~120 项 | 0.5 天 |
| PR-2 运行时升级 | axios / qs / lodash-es 等 | ~90 项 | 2~3 天 |
| PR-3 构建链 | sass-loader、xlsx 替换等 | ~70 项 | 2 天 |
| PR-4 接受风险 | Vue 2 生态 Document | ~50 项（长期） | 持续 |

**本方案目标**：3 个 PR 内将 **Critical 清零、High 降至 30 以下**；Vue 2 相关 Low 暂 Accept。

---

## 二、PR-1：零风险清理（优先合并）

### 2.1 删除未使用 / 误装依赖

经全仓检索，以下包 **无任何业务引用**，删除不影响构建与运行：

| 包 | 类型 | 删除理由 |
|----|------|----------|
| `babel-preset-env` | dev | Babel 6 遗留；`babel.config.js` 已用 Babel 7 |
| `big` | prod | 误装 HTTP 框架；业务用的是 `big.js`（传递依赖） |
| `qiniu-webpack-plugin` | prod | `vue.config.js` 仅 require 未使用；已有 `webpack-aliyun-oss` |
| `node-sass-js-importer` | dev | 无引用；项目使用 `sass`（dart-sass） |

### 2.2 代码改动

**`vue.config.js`** — 删除第 2 行：

```diff
- const QiniuPlugin = require('qiniu-webpack-plugin')
```

### 2.3 执行命令

```bash
npm uninstall babel-preset-env big qiniu-webpack-plugin node-sass-js-importer
npm audit fix --registry=https://registry.npmjs.org
npm run build:b2c
npm run build:bbc
```

### 2.4 验证

```bash
npm audit --registry=https://registry.npmjs.org | tail -3
# 记录剩余数量，更新本文档 §六 进度表
```

### 2.5 预期效果

- 消除 `babel-preset-env` 整条 Babel 6 Critical 链（约 20+ 项）
- 消除 `big` 带入的 express/morgan/request 等 Critical 链
- 消除 `qiniu-webpack-plugin` 相关 High
- `audit fix` 自动修复 webpack、yaml、semver 等传递依赖

**风险**：极低  
**建议 TB**：可单独开安全清理任务

---

## 三、PR-2：运行时依赖升级（需全量回归）

### 3.1 升级清单

| 包 | 当前 | 目标 | 级别 | 改动范围 |
|----|------|------|------|----------|
| `axios` | 0.19.2 | **1.8.0** | High | 全局 HTTP，重点见 §3.2 |
| `qs` | ^6.4.0 | **^6.14.0** | High | 3 个文件 |
| `lodash-es` | 4.17.21 | **4.17.23** | High | 传递 + 直接 |
| `nanoid` | 2.1.8 | **3.3.8** | Moderate | API 兼容，检查调用方 |
| `@antv/g2plot` | 2.4.31 | **2.4.35+** | High | 3 个图表页 |

### 3.2 axios 升级专项（风险最高）

**执行：**

```bash
npm install axios@1.8.0
```

**必查文件：**

```
src/api/request/index.js      # 主请求封装、拦截器、Token 刷新
src/api/request/request.js
src/utils/fetch.js            # 旧封装
src/utils/axiosJsonp.js
src/api/req.js
src/api/ossStorage.js
```

**回归清单：**

- [ ] 登录 / 登出 / Token 过期刷新
- [ ] 列表分页、筛选、导出
- [ ] 文件上传（OSS / COS）
- [ ] FormData / 文件下载
- [ ] 错误提示（401 / 403 / 500）

**常见破坏性变化：**

- 错误对象结构细微差异 → 检查 `error.response` 判空
- 默认 `Content-Type` 行为 → 上传接口重点测
- 不再内置某些旧版 hack → 检查 `utils/fetch.js`

### 3.3 qs 升级

```bash
npm install qs@6.14.0
```

**文件：**

- `src/api/request/index.js`
- `src/utils/fetch.js`
- `src/api/shipping.js`

**回归：** 带复杂 query 的列表筛选、数组参数序列化。

### 3.4 其余小版本

```bash
npm install lodash-es@4.17.23 nanoid@3.3.8
npm install @antv/g2plot@latest   # 锁定后检查 lock 版本 ≤ 当前大版本
npm audit fix --registry=https://registry.npmjs.org
```

**图表回归页：**

- `src/views/dashboard/index.vue`
- `src/views/dashboard/merchant-dashboard.vue`
- `src/view/mall/datacube/companydata/order.vue`

### 3.5 PR-2 验证命令

```bash
npm run build:b2c && npm run build:bbc
npm audit --registry=https://registry.npmjs.org --audit-level=high
```

**风险**：中（axios 为主）  
**建议**：PR-2 仅含运行时 prod 依赖，不要混入 dev 构建链改动

---

## 四、PR-3：构建链与无修复包处理

### 4.1 xlsx → exceljs（推荐）

**现状**：`xlsx@0.18.5` High，社区版 **无 npm 修复**  
**使用处**：仅 `build/update_i18n_from_excel.js`

**方案：**

```bash
npm uninstall xlsx
npm install -D exceljs
```

重写 `build/update_i18n_from_excel.js` 读写逻辑（仅开发脚本，不影响生产包体积若放 devDependencies）。

**替代**：若脚本使用频率极低，可改为手动维护 JSON，直接删除 xlsx。

### 4.2 sass 构建链

项目已用 `sass`（dart-sass），可升级 loader：

```bash
npm install -D sass-loader@^13.3.0
```

检查 `vue.config.js` 中 sass/scss `loaderOptions` 是否需适配。

**不要**再引入 `node-sass` / `node-sass-js-importer`（PR-1 已删）。

### 4.3 package.json overrides 扩展

PR-1、2 完成后若 High 仍多，追加：

```json
"overrides": {
  "resource": "0.8.1",
  "xmlhttprequest": "1.8.0",
  "jugglingdb-nano": "0.0.1",
  "global": "2.0.1",
  "webpack": "^5.104.1",
  "ws": "^8.18.0",
  "semver": "^7.7.0",
  "lodash": "^4.17.23",
  "follow-redirects": "^1.15.9"
}
```

```bash
rm -rf node_modules package-lock.json
npm install
npm run build:b2c
```

> 全量重装 lock 影响面大，建议在 PR-3 单独做，便于回滚。

### 4.4 devDependencies 可选升级（非阻塞）

| 包 | 建议 | 说明 |
|----|------|------|
| `postcss` | ^8.5.6 | audit fix 或手动 |
| `svgo` | 最新 3.x | 构建 svg 优化 |
| `prettier-eslint-cli` | ^8.0.1 或移除 | 仅本地 lint |
| `compression-webpack-plugin` 等 | audit fix | 随 lock 更新 |

### 4.5 PR-3 验证

```bash
npm run build:b2c
npm run build:bbc
node build/update_i18n_from_excel.js   # 若改 xlsx
npm audit --registry=https://registry.npmjs.org
```

---

## 五、PR-4：无法修复项 — Dependabot Accept Risk

以下告警 **暂无安全修复版本**，在 GitHub Dependabot 标记 **Accept risk** 并统一备注：

> Vue 2 已 EOL，计划 Vue 3 + Element Plus 迁移后消除。跟踪文档：docs/security/fix-plan.md

| 包 | 级别 | 原因 |
|----|------|------|
| `vue@2.7.x` | Low | ReDoS，无官方补丁 |
| `element-ui` | Low | 依赖 vue |
| `vue-template-compiler` | Moderate | 编译期 XSS，仅构建时；不编译不可信模板 |
| `@icon-park/vue` / `lucide-vue` / `vuex` | Low | 连带 vue |
| `@shopex-ui/finder` | Low | 连带 element-ui |

**禁止**：对以上包执行 `npm audit fix --force`。

---

## 六、进度跟踪表（执行时填写）

| PR | 状态 | 执行日 | audit 总数 | Critical | High | 备注 |
|----|------|--------|------------|----------|------|------|
| 基线 | ✅ | 2026-07-15 | 174 | 34 | 77 | 本地扫描 |
| PR-1+2 | ✅ | 2026-07-15 | 68 | 1 | 31 | 删 4 包 + audit fix + axios/qs/lodash/nanoid |
| PR-3 | ✅ | 2026-07-15 | 63 | 0 | 24 | xlsx→exceljs + overrides + g2plot/cos |
| PR-3b | ✅ | 2026-07-15 | 61 | 0 | 25 | prettier-eslint-cli 5→8 |
| PR-4 | ⬜ | | | | | 见 [dependabot-accept-list.md](./dependabot-accept-list.md) |

**每次 PR 合并后执行：**

```bash
npm audit --registry=https://registry.npmjs.org 2>&1 | grep -E "vulnerabilities|low|moderate|high|critical"
```

---

## 七、禁止事项

| 操作 | 原因 |
|------|------|
| `npm audit fix --force` | 会把 Vue CLI 降到 3.x，构建必挂 |
| 一次性升 Vue 3 | 范围过大，应单独立项 |
| 升级 `big` 到 0.3.1 | 应 **删除** `big`，不是升级 |
| 在 npmmirror 上跑 audit | 不支持，结果为空或报错 |

---

## 八、推荐排期（1 人）

```
第 1 天上午   PR-1  删除 4 包 + vue.config 清理 + audit fix + 构建
第 1 天下午   PR-2  qs / lodash-es / nanoid / g2plot + 构建
第 2~3 天     PR-2  axios 升级 + 全站业务回归
第 4 天       PR-3  xlsx → exceljs + sass-loader + overrides
第 4 天下午   PR-4  Dependabot bulk dismiss + 文档更新
```

---

## 九、CI 建议（修复完成后）

```yaml
# .gitlab-ci.yml 或 GitHub Actions 示例片段
- npm audit --registry=https://registry.npmjs.org --audit-level=critical
# 或仅 prod：
- npm audit --registry=https://registry.npmjs.org --omit=dev --audit-level=high
```

初期可设 `allow_failure: true`，PR-3 完成后改为阻断。

---

## 十、快速命令速查

```bash
# 扫描
npm audit --registry=https://registry.npmjs.org

# PR-1
npm uninstall babel-preset-env big qiniu-webpack-plugin node-sass-js-importer
npm audit fix --registry=https://registry.npmjs.org

# PR-2
npm install axios@1.8.0 qs@6.14.0 lodash-es@4.17.23 nanoid@3.3.8

# 构建验证
npm run build:b2c && npm run build:bbc
```

---

*执行过程中遇到问题，将现象与 `npm audit` 新数字更新到 §六 进度表及 [dependabot-remediation.md](./dependabot-remediation.md)。*
