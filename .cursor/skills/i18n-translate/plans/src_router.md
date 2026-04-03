# i18n 扫描结果

**扫描目录**: `src/router`
**报告文件**: `src_router.md`

## 统计

| 状态 | 数量 | 占比 |
|------|------|------|
| 未翻译完 | 约 50+ 文件 | - |
| 已翻译 | 1 | - |
| 无需翻译 | 若干（仅注释） | - |

## 已翻译

- `routes/modules/marketing.js`、`products.js`、`content.js`、`setting.js`
- `routes/shopadmin/setting.js`、`routes/shopadmin/products.js`
- `routes/supplier/setting.js`、`routes/supplier/products.js`
- `routes/merchant/setting.js`
- `src/route-supplier-setting.js`、`route-supplier-base.js`、`route-shopadmin-base.js`、`route-shopadmin-shoplist.js`、`route-base.js`、`router-merchant-base.js`
- `src/route-dealer*.js`、`route-crossborder.js`、`route-pc.js`、`route-entitygoods.js`、`route-supply.js`、`route-store.js`
- `src/route-shopadmin-shopsetting.js`、`route-shopadmin-entity.js`、`route-shopadmin-store.js`、`route-shopadmin-statistics.js`、`route-shopadmin-marketing.js`、`route-shopadmin-applications.js`
- `src/route-supplier-entitygoods.js`、`route-supplier-applications.js`
- `src/route-sellers.js`、`route-pointsmall.js`、`route-companydata.js`、`route-auth.js`、`route-applications.js`
- `merchant/route-setting.js`、`merchant/route-entitygoods.js`、`merchant/route-sellers.js`、`merchant/route-order.js`、`merchant/route-companydata.js`、`merchant/route-applications.js`

## 已翻译（routes 目录 meta.title / name）

- `routes/modules/dashboard.js`、`data.js`、`decoration.js`、`financial.js`、`orders.js`、`point.js`、`sellers.js`、`store.js`、`supplier.js` — 全部 `title`/`name` 已替换为 i18n key
- `routes/shopadmin/data.js`、`store.js`、`marketing.js`、`apps.js`
- `routes/supplier/apps.js`、`financial.js`
- `routes/merchant/dashboard.js`、`sellers.js`、`order.js`、`data.js`、`apps.js`
- `auth.js` — `name: '绑定'` 已替换为 key

## 未翻译完（仅注释或零散）

- `routes/modules/apps.js`、`routes/modules/members.js` 仅注释含中文，不翻译
- `route-applications.js` 内 `meta.title` 模板 `${name}-社区活动-社区管理-详情` 保留，key `5286ac37.2ab861` 已入 locale 供展示拼接

## 说明

- 路由中 `meta.title` / `name` 为界面菜单/面包屑展示用，已按 hash key 方案替换为 i18n key，并在 zh-CN / en / ar 中补全文案。
- 菜单数据来自后端 `accessMenus`，前端路由 meta 用于文档标题或部分场景展示，需保证 key 在 locale 中存在。
