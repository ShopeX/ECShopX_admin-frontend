# ECShopX Admin 前端依赖安全漏洞整理与修复计划

> 文档生成时间：2026-07-15  
> 项目：`ecshopx-admin`（`package.json` version 4.8.0）  
> GitHub 仓库：[ShopeX/ECShopX_admin-frontend](https://github.com/ShopeX/ECShopX_admin-frontend)  
> 本地扫描：`npm audit --registry=https://registry.npmjs.org`  
> Node 版本：`16.16.0`（见 `package.json` engines）

> 关联执行方案：**[fix-plan.md](./fix-plan.md)**（按 PR 拆分的可落地修复步骤）  
> Dependabot Accept 清单：**[dependabot-accept-list.md](./dependabot-accept-list.md)**

---

本地 `npm audit` 结果（2026-07-15）：

| 严重级别 | 数量 |
|----------|------|
| Critical | 34 |
| High | 77 |
| Moderate | 42 |
| Low | 21 |
| **合计** | **174** |

其中 **35 个告警来自 `package.json` 直接依赖**，其余为传递依赖（transitive）。

> **注意**：若使用 npmmirror 执行 `npm audit` 会失败（不支持 security audit API），请始终使用：
>
> ```bash
> npm audit --registry=https://registry.npmjs.org
> ```

---

## 2. 风险分级说明

| 级别 | 含义 | 处理优先级 |
|------|------|------------|
| Critical | 可能导致 RCE、严重注入等 | 立即处理 |
| High | SSRF、原型污染、DoS 等 | 本迭代内处理 |
| Moderate | 中等风险，多出现在构建链 | 计划内处理 |
| Low | 低风险或暂无修复（如 Vue 2 EOL） | 评估后接受或长期规划 |

---

## 3. 第一阶段：低风险快速清理（推荐优先执行）

以下依赖经代码检索为 **未使用或误装**，删除后预计可消除一批 Critical/High 告警，且几乎不影响业务。

### 3.1 建议立即删除的依赖

| 包名 | 当前版本 | 问题 | 依据 |
|------|----------|------|------|
| `babel-preset-env` | `^1.7.0` | Babel 6 生态，含**任意代码执行**相关 Critical 漏洞 | `babel.config.js` 已使用 `@vue/cli-plugin-babel/preset`（Babel 7），未引用此包 |
| `big` | `^0.5.2` | 误装的小型 HTTP 框架，带入 express/morgan/lodash 等大量漏洞 | 业务代码使用 `big.js`（来自 loader-utils 传递依赖），无任何 `import 'big'` |
| `qiniu-webpack-plugin` | `^0.4.2` | 无可用修复版本，依赖老旧 `qiniu` | `vue.config.js` 仅 `require`，未实例化；上传已用 `webpack-aliyun-oss` |

**执行命令：**

```bash
npm uninstall babel-preset-env big qiniu-webpack-plugin
npm audit fix --registry=https://registry.npmjs.org
```

同时删除 `vue.config.js` 第 2 行无用引用：

```js
// 删除：const QiniuPlugin = require('qiniu-webpack-plugin')
```

### 3.2 `npm audit fix` 说明

- ✅ 可安全执行：`npm audit fix`（**不要**加 `--force`）
- ❌ 禁止执行：`npm audit fix --force`（会把 `@vue/cli-service` 降级到 3.x，破坏构建）

`audit fix` 通常可自动修复的传递依赖包括：`webpack`、`yaml`、`svgo`、`semver` 等。

---

## 4. 第二阶段：直接依赖升级（需回归测试）

以下为 `package.json` 中 **isDirect: true** 的主要告警项，按严重级别排序。

### 4.1 Critical

| 包名 | 当前 | 建议 | 说明 |
|------|------|------|------|
| `babel-preset-env` | `^1.7.0` | **删除** | 见 3.1，Babel 6 整条链 |

### 4.2 High

| 包名 | 当前 | 建议 | 主要风险 | 影响范围 |
|------|------|------|----------|----------|
| `axios` | `^0.19.2` | `^1.8.0` | SSRF、CSRF | `src/api/request/`、`utils/fetch.js` 等 15+ 文件 |
| `big` | `^0.5.2` | **删除** | 误装依赖 | 无业务引用 |
| `qs` | `^6.4.0` | `^6.14.0` | 原型污染、DoS | `src/api/request/index.js`、`utils/fetch.js`、`api/shipping.js` |
| `@antv/g2plot` | `^2.4.31` | 最新 `2.4.x` / `2.5.x` | 传递依赖 `fmin` | `views/dashboard/`、`view/mall/datacube/companydata/order.vue` |
| `lodash-es` | `^4.17.21` | `^4.17.23` | 代码注入、原型污染 | 多处间接使用 |
| `node-sass-js-importer` | `^4.0.2` | 删除或换 `^7.0.0` | 牵 `node-sass` | 构建链；项目已用 `sass`（dart-sass） |
| `prettier-eslint-cli` | `^5.0.1` | `^8.0.1` 或移除 | 旧版 typescript-eslint 链 | 仅开发工具 |
| `qiniu-webpack-plugin` | `^0.4.2` | **删除** | 无修复 | 见 3.1 |
| `sass-loader` | `^10.1.1` | `^13.x`（配合 Vue CLI 5） | 牵 `node-sass` | 构建链 |
| `svgo` | `^3.3.2` | `npm audit fix` | DoS（Billion Laughs） | 构建链 svg 优化 |
| `xlsx` | `^0.18.5` | 换 `exceljs` 或接受风险 | 原型污染、ReDoS，**社区版无修复** | 仅 `build/update_i18n_from_excel.js` |

### 4.3 Moderate

| 包名 | 当前 | 建议 | 说明 |
|------|------|------|------|
| `@vue/cli-plugin-babel` | `^5.0.0` | 保持 5.x，随 audit fix 更新传递依赖 | 构建工具 |
| `@vue/cli-service` | `^5.0.0` | 保持 5.x | 勿 force 降级 |
| `nanoid` | `^2.1.8` | `^3.3.8` 或 `^5.x` | ID 可预测性 |
| `postcss` | `^8.4.21` | `^8.4.47` | ReDoS |
| `uuid` | `^11.1.0` | audit fix | buffer 边界检查 |
| `vue-template-compiler` | `^2.6.10` | 随 Vue 2 迁移处理 | 编译期 XSS，仅构建时 |
| `vue-video-player` | `^5.0.2` | `^6.0.0`（大版本） | 牵 video.js |

### 4.4 Low（暂无修复 / Vue 2 生态）

| 包名 | 说明 |
|------|------|
| `vue` `^2.6.11`（实际 lock 为 2.7.16） | ReDoS，Vue 2 已 EOL，**无官方修复**，需 Vue 3 迁移 |
| `element-ui` | 依赖 vue，随框架迁移换 `element-plus` |
| `@icon-park/vue`、`lucide-vue`、`vuex` 等 | 因依赖 vue 被连带标记 |

---

## 5. 第三阶段：无官方修复项的处理策略

### 5.1 `xlsx`（SheetJS 社区版）

- **现状**：High，原型污染 + ReDoS，npm 上 **No fix available**
- **使用位置**：仅 `build/update_i18n_from_excel.js`（构建脚本，非运行时）
- **方案 A（推荐）**：替换为 `exceljs`
- **方案 B**：保留，在 Dependabot 标记为 accepted risk，限制仅 dev/build 使用

### 5.2 `vue` / `element-ui`（Vue 2 EOL）

- **现状**：Low~Moderate，无修复版本
- **方案**：短期在 Dependabot 接受风险并注明原因；长期纳入 **Vue 3 + Element Plus** 迁移路线图

### 5.3 `vue-template-compiler`

- **现状**：Moderate，客户端 XSS（编译模板时）
- **方案**：确保不在生产环境编译不可信模板；长期随 Vue 3 消除

---

## 6. 传递依赖与 overrides 建议

项目已在 `package.json` 中使用 `overrides`，可在 Phase 1/2 后按需追加：

```json
"overrides": {
  "resource": "0.8.1",
  "xmlhttprequest": "1.8.0",
  "jugglingdb-nano": "0.0.1",
  "global": "2.0.1",
  "webpack": "^5.104.1",
  "ws": "^8.18.0",
  "semver": "^7.7.0",
  "lodash": "^4.17.23"
}
```

> 添加 overrides 后必须重新 `npm install` 并完整回归构建。

---

## 7. 推荐执行路线图

```
Phase 1（1 天）
  ├─ 删除 babel-preset-env / big / qiniu-webpack-plugin
  ├─ 清理 vue.config.js 无用 require
  └─ npm audit fix

Phase 2（3~5 天，分 PR）
  ├─ PR-1: qs、lodash-es、nanoid、postcss、uuid 等小版本升级
  ├─ PR-2: axios 0.19 → 1.8（重点回归 API 层）
  └─ PR-3: sass-loader / 构建链升级

Phase 3（1~2 天）
  ├─ xlsx → exceljs（仅 build 脚本）
  └─ @antv/g2plot 版本验证

Phase 4（长期）
  └─ Vue 3 + Element Plus 迁移
```

### 7.1 每个 Phase 的验证清单

```bash
# 安装依赖
npm install

# 安全扫描
npm audit --registry=https://registry.npmjs.org

# 构建验证
npm run build:b2c
npm run build:bbc

# 开发启动
npm run dev:b2c
```

**业务回归重点（Phase 2 后）：**

- [ ] 登录 / 鉴权 / Token 刷新
- [ ] 列表查询、筛选、分页
- [ ] 文件上传（OSS）
- [ ] 订单金额计算（`big.js`）
- [ ] 数据看板图表（`@antv/g2plot`）
- [ ] Excel 导出（如有）

---

## 8. CI / Dependabot 建议

### 8.1 GitHub Dependabot

- 对 Phase 1、2 的修复开 **grouped PR**（按 dev / prod 分组）
- 对 Vue 2 相关无修复项：标记 **Accept risk**，备注「待 Vue 3 迁移」

### 8.2 CI 门禁（可选）

```bash
# 仅对 direct 依赖或 high 以上失败
npm audit --registry=https://registry.npmjs.org --audit-level=high
```

### 8.3 定期复查

建议每月或每季度执行：

```bash
npm audit --registry=https://registry.npmjs.org
npm outdated
```

---

## 9. 关键文件索引

| 文件 | 与安全修复相关说明 |
|------|-------------------|
| `package.json` | 直接依赖声明、overrides |
| `package-lock.json` | 锁定传递依赖版本 |
| `babel.config.js` | 已用 Babel 7，无需 babel-preset-env |
| `vue.config.js` | 可移除 qiniu-webpack-plugin 引用 |
| `src/api/request/index.js` | axios、qs 核心封装 |
| `src/utils/fetch.js` | 旧版 axios 封装 |
| `build/update_i18n_from_excel.js` | 唯一使用 xlsx 的脚本 |

---

## 10. 附录：axios 升级注意事项

`axios` 从 `0.19.x` 升到 `1.x` 为 **破坏性升级**，需关注：

1. **错误对象结构**：`error.response` 行为基本一致，但部分边界情况有变
2. **拦截器**：检查 `src/api/request/index.js` 中 request/response interceptor
3. **参数序列化**：项目同时使用 `qs`，确认 `params` 与 `data` 序列化逻辑
4. **JSONP / 旧 API**：`utils/axiosJsonp.js` 需单独验证
5. **建议**：单独开 PR，在测试环境全量回归后再合并

```bash
npm install axios@^1.8.0
```

---

## 11. 变更记录

| 日期 | 说明 |
|------|------|
| 2026-07-15 | 初版：基于 npm audit 174 项告警整理，含分阶段修复计划 |
| 2026-07-15 | 补充 Dependabot 入口链接与 GitHub 仓库 `ShopeX/ECShopX_admin-frontend` 对照说明 |
| 2026-07-15 | 新增 [dependabot-accept-list.md](./dependabot-accept-list.md) Accept 操作清单 |

---

*本文档随依赖升级进度更新。完成每个 Phase 后请同步修改第 11 节变更记录。*
