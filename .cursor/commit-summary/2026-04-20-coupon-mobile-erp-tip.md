## 本次变更总结

**时间**: 2026-04-20

**涉及文件**:
- `src/view/member/cardticket/detail/receive.vue` (修改)
- `src/view/member/cardticket/detail/used.vue` (修改)
- `src/views/settings/systemConfig/wdtSetting.vue` (修改)
- `src/views/settings/systemConfig/jstSetting.vue` (修改)
- `src/i18n/locales/zh-CN.json` (修改)
- `src/i18n/locales/en.json` (修改)
- `src/i18n/locales/ar.json` (修改)

**主要改动**:
- 优惠券管理「查看优惠券数据」两个子列表新增手机号查询能力，支持输入手机号后搜索、回车搜索和清空后重查。
- 旺店通与聚水潭系统配置页顶部新增服务商模式提示，采用 `SpPlatformTip` 方式展示并与现有页面风格对齐。
- 补充三语文案键 `59579ae2.c5d4d8` 与 `20f6ad88.c5d4d8`，用于两处服务商提示文案。

**一句话概括**: feat: 优惠券数据列表支持手机号查询并补充 ERP 服务商提示
