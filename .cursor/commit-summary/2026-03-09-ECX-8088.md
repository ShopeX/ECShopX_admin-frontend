## 本次变更总结

**时间**: 2026-03-09  
**TB**: ECX-8088

**涉及文件**:
- src/components/sp-picker/pickers/picker-regactivity.vue (修改)
- src/i18n/locales/zh-CN.json (修改)
- src/i18n/locales/en.json (修改)
- src/i18n/locales/ar.json (修改)

**主要改动**:
- 活动报名挂件（picker-regactivity）：
  - 接口由 `easylist` 改为 `list`（/selfhelp/registrationActivity/list）。
  - 列表新增「活动状态」列（status_name），并做 i18n（key ffeca7a9.1181a5）。
  - 弹窗标题改为通过 config 的 key 在 created 中解析，去掉硬编码中文。
  - 模板名称列注释隐藏；beforeSearch 中 is_valid 参数注释掉。
- i18n：zh-CN/en/ar 新增「活动状态」文案（ffeca7a9.1181a5）。

**一句话概括**: feat(picker): 活动报名挂件改 list 接口、加状态列并 i18n (ECX-8088)
