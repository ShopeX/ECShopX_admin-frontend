# ECX-8097 阿拉伯语 RTL 样式与数据展示修复

## 问题描述
- 管理端在阿拉伯语下，商品销售分类列表、编辑/添加分类弹窗存在样式与展示异常
- 表单标签与输入左对齐、数字框按钮在右侧、弹窗底部按钮顺序不符合 RTL 习惯
- 表格操作列按钮与箭头方向不符合从右到左阅读习惯
- 切换语言后弹窗内表单文案未随当前语言更新

## 修改内容

### 1. `src/styles/lang-ar.scss`（阿拉伯语 RTL 全局样式）

**弹窗 (el-dialog)**
- 关闭按钮置于右侧（`right: 20px; left: auto`）
- 底部按钮区 `direction: rtl`、`text-align: right`，确定在右、取消在左
- 底部按钮间距：`margin-right: 10px; margin-left: 0`

**弹窗内表单 (sp-dialog)**
- RTL 下表单使用 `margin-left: 100px`、`margin-right: 0`，避免整体偏左
- `el-form--label-right` 下表单项使用 flex + gap，保证标签与输入在 RTL 下对齐

**输入与数字框**
- `.el-input__inner`、`.el-textarea__inner` 增加 `text-align: right`
- `.el-input-number` 设置 `direction: rtl`，内部输入右对齐
- `.el-input-number__decrease` / `__increase` 通过 `left: 1px; right: auto` 置于左侧

**表格**
- `.el-table__body-wrapper td .cell` 增加 `direction: rtl`，操作列按钮从右到左排列

**消息框 (el-message-box)**
- 关闭按钮置于右侧，与弹窗一致

（其余为既有 RTL 规则：设置路径/分类选择器、cascader、菜单、抽屉等）

### 2. `src/view/goods/saleCategory.vue`（销售分类页）

- 将 **categoryFormList** 从 `data` 改为 **computed**，使「分类名称」「排序」「上级分类」「分类图片」等标签与 placeholder 随当前语言（含阿拉伯语）响应式更新，切换语言后弹窗内文案正确。

## 影响范围
- 仅当 `html[lang='ar-SA']` 或 `html[dir='rtl']` 时生效，其他语言无影响
- 销售分类添加/编辑弹窗、所有使用 sp-dialog + el-form 的弹窗、表格操作列均受益于 RTL 样式

## 备注
- 父分类名称（如「运动户外」）若仍显示为中文，需后端按语言返回分类名或前端做多语言映射，属数据/多语言方案，未在本单内实现。
