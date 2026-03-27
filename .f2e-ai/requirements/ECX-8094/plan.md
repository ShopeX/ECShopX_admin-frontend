# Plan — ECX-8094

## 目标

视频选择器（sp-video-picker）关闭按钮图标统一为项目 ecx 图标（icon-qingchuFilled），与设计/其他组件一致。

## 范围

- 仅修改：`src/components/sp-video-picker/index.vue`
- 不涉及接口、API、其他页面或组件

## 步骤

1. **模板**
   - 将删除按钮的 class 从 `el-icon-circle-close` 改为 `ecx-icon icon-qingchuFilled`（删除单条视频的 `<i>` 节点）。

2. **样式**
   - 删除对 `.icon-times-circle1`、`.el-icon-circle-close` 的样式，统一为 `.icon-qingchuFilled`（保留定位、z-index、字体与颜色、cursor）。
   - 移除 `.el-icon-circle-close:hover` 的单独样式。

## 验收

- 视频选择器内每条视频右上角关闭按钮显示为 ecx 清除图标。
- 点击关闭按钮可正常删除对应视频，逻辑不变。

## 备注

- 实现已完成并提交，本文档为事后补写便于追溯。
