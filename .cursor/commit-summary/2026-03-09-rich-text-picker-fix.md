## 本次变更总结

**时间**: 2026-03-09

**涉及文件**:
- src/components/sp-rich-text/index.vue (修改)

**主要改动**:
- 富文本（SpRichText）图片上传：修复点击上传按钮报错 `Cannot read properties of undefined (reading 'abstract')`。
  - 原因：uploader 模块内使用 `Vue.prototype.$picker.image()`，getter 的 this 为 Vue.prototype，导致 picker 弹窗的 parent 非有效组件实例，Vue initLifecycle 读 parent.$options.abstract 时报错。
  - 修改：改为使用 `this.$root.$picker.image()`，从当前组件树的根实例取 $picker，保证 parent 为合法 Vue 实例。

**一句话概括**: fix: 富文本图片上传改用 $root.$picker 修复 initLifecycle 报错
