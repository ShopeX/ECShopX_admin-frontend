## 本次变更总结

**时间**: 2026-03-09  
**TB**: ECX-8064

**涉及文件**:
- src/i18n/locales/zh-CN.json (修改)
- src/i18n/locales/en.json (修改)
- src/i18n/locales/ar.json (修改)

**主要改动**:
- i18n：补全普通订单列表导出成功提示的翻译 key。
  - 在 zh-CN、en、ar 中新增 `c95ea121.3e1ddd`，对应「已加入执行队列，请在设置-导出列表中下载」及英/阿译文。
  - 用于 `src/view/mall/trade/normalorders/list.vue` 中导出成功提示，修复该 key 未翻译的问题。

**一句话概括**: i18n: 补全 c95ea121.3e1ddd 翻译 (ECX-8064)
