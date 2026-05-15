<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-image {
  &-bd {
    display: flex;
    padding: 0 0 10px 10px;
    .lf-container {
      width: 220px;
      background: #f5f5f5;
      height: 555px;
      margin-right: 8px;
      padding: 8px;
      overflow: auto;
      .icon-edit {
        font-size: 13px;
        float: right;
        display: none;
      }
      .el-icon-delete-solid {
        font-size: 13px;
        float: right;
        margin-top: 1px;
        margin-right: 6px;
        display: none;
      }
    }
  }
  .catgory-item {
    height: 36px;
    line-height: 36px;
    padding: 0 6px;
    &:hover {
      color: var(--primary);
      background-color: color-mix(in srgb, #ffffff 90%, var(--primary));
    }
    &.active {
      color: rgb(255, 255, 255);
      background-color: var(--primary);
    }

    .i-icon-edit-two,
    .i-icon-delete {
      display: none;
    }

    &:hover {
      .i-icon-edit-two,
      .i-icon-delete {
        display: block;
      }
    }
  }
  .image-item {
    &-wrap {
      display: inline-block;
      position: relative;
      margin-right: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      vertical-align: middle;
      cursor: pointer;
    }
    display: flex;
    align-items: flex-end;
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    background: 50% 50% / cover no-repeat rgb(221, 221, 221);
    overflow: hidden;
    &--video,
    &--audio {
      background: #2a2a2a;
    }
    .media-preview {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .audio-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c0c4cc;
      font-size: 36px;
      background: linear-gradient(135deg, #36383d 0%, #1f2024 100%);
    }
    &:hover {
      .image-meta {
        display: block;
      }
      .el-icon-link {
        display: block;
      }
    }
    .image-meta {
      height: 28px;
      width: 100%;
      line-height: 28px;
      text-align: center;
      color: rgb(255, 255, 255);
      background-color: rgba(0, 0, 0, 0.4);
      display: none;
    }
    .el-icon-link {
      position: absolute;
      top: 2px;
      left: 4px;
      display: none;
      color: #666;
    }
  }
  .image-title-wrap {
    width: 120px;
    height: 36px;
    &__title {
      font-size: 12px;
      @include multi-ellipsis(2);
    }
  }
  .el-pagination {
    margin-top: 8px;
    text-align: right;
  }
  .picker-source-tabs {
    .el-tabs__nav-wrap::after { height: 1px; }
    .el-tabs__header { margin-bottom: 0; }
  }
  .image-box-selected {
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    width: 120px;
    height: 120px;
    border: 2px solid var(--primary);
    color: #fff;
    overflow: hidden;
    pointer-events: none;
    &__right-angle {
      position: absolute;
      top: -21px;
      right: -21px;
      width: 42px;
      height: 42px;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      background: var(--primary);
    }
    &__text {
      position: absolute;
      top: -2px;
      right: 3px;
    }
    .icon-check {
      position: relative;
      top: -2px;
      right: -2px;
    }
  }
  .cropper-container {
    width: 498px;
    height: 498px;
    position: relative;
    .cropper-actions {
      position: absolute;
      bottom: 0;
      left: 10px;
      .iconfont {
        font-size: 18px;
        color: #fff;
        margin-right: 6px;
      }
      .icon-search-minus,
      .icon-search-plus {
        font-size: 19px;
      }
    }
  }
}
</style>
<template>
  <div v-loading="loading" class="picker-image">
    <div v-if="enableSourceTab" class="px-3 pt-2">
      <el-tabs v-model="sourceTab" class="picker-source-tabs" @tab-click="onSourceTabChange">
        <el-tab-pane label="原素材" name="normal" />
        <el-tab-pane label="AI 素材" name="ai_generate" />
      </el-tabs>
    </div>
    <div class="p-3 flex justify-between">
      <div class="flex items-center gap-3">
        <!-- AI tab 下不允许在 picker 现场上传：AI 素材只能从制作页"保存到素材库"流入 -->
        <SpImageUploader
          v-if="sourceTab === 'normal'"
          :localpost-data="localpostData"
          :refresh="refresh"
          :current-category="selectCatgory"
        />

        <el-button @click="onAddGroup" class="h-[calc(1em+16px)]">
          {{ addGroupBtnText }}
        </el-button>
        <el-button :disabled="disabledBtn" @click="onMoveGroup">
          {{ moveGroupBtnText }}
        </el-button>
        <!-- <el-button :disabled="disabledDeleteGroup" @click="onDeleteImageGroup">
          删除分组
        </el-button> -->
        <!-- <el-button :disabled="disabledBtnEdit" @click="handleEdit"> 编辑 </el-button> -->
        <!-- <el-button
          :disabled="disabledBtnCropper"
          @click="handleCropper"
        >
          裁剪
        </el-button>

        <el-button
          :disabled="disabledBtnDelete"
          @click="handleEdit"
        >
          删除
        </el-button>
        <el-button
          :disabled="disabledBtnDownload"
          @click="handleEdit"
        >
          下载
        </el-button> -->
        <el-button :disabled="disabledBtn" @click="handleCancelAll">
          {{ cancelAllBtnText }}
        </el-button>
      </div>
      <!-- <div>
        <el-input size="small" placeholder="请输入图片名称" suffix-icon="el-icon-search" />
      </div> -->
    </div>
    <div class="picker-image-bd">
      <div class="lf-container">
        <div
          v-for="(item, index) in catgoryList"
          :key="`catgory-item__${index}`"
          class="catgory-item flex justify-between"
          :class="{
            active: selectCatgory == item.image_cat_id
          }"
          @click="handleClickCatgory(item)"
        >
          <div class="flex items-center">
            <SpIcon name="folder-open" />
            <span class="w-[120px] ml-1 overflow-x-hidden text-ellipsis whitespace-nowrap">
              {{ item.image_cat_name }}
            </span>
          </div>
          <div class="flex items-center w-12 gap-1">
            <SpIcon v-if="index > 0" name="edit-two" @click="onEditGroup(item)" />
            <SpIcon v-if="index > 0" name="delete" @click="onDeleteGroup(item)" />
          </div>
          <!-- <i v-if="index > 0" class="el-icon-edit-outline" @click.stop="onEditGroup(item)" />
          <i v-if="index > 0" class="el-icon-delete-solid" @click.stop="onDeleteGroup(item)" /> -->
        </div>
      </div>

      <SpCropper ref="spCropperRef" @save-complete="handleCropComplete" />

      <div class="flex-1">
        <div
          class="grid gap-2 p-2 min-h-[300px] w-full"
          :style="{ gridTemplateColumns: `repeat(${columns || 6}, minmax(100px, 1fr))` }"
        >
          <div
            v-for="(item, index) in list"
            :key="`image-item-wrap__${index}`"
            class="image-item-wrap"
            @click="handleClickItem(item)"
          >
            <div
              class="image-item relative group"
              :class="{
                'image-item--video': mediaKindOf(item) === 'video',
                'image-item--audio': mediaKindOf(item) === 'audio'
              }"
              :style="mediaKindOf(item) === 'image' ? { color: '#fff', backgroundImage: `url('${item.url}')` } : { color: '#fff' }"
            >
              <!-- 视频缩略图：浏览器读首帧，时长由 onloadedmetadata 拿到塞到 item 上 -->
              <video
                v-if="mediaKindOf(item) === 'video'"
                :src="item.url"
                muted
                preload="metadata"
                class="media-preview"
                @loadedmetadata="onMediaMeta(item, $event)"
              />
              <!-- 音频：大图标占位 -->
              <div v-else-if="mediaKindOf(item) === 'audio'" class="media-preview audio-placeholder">
                <i class="el-icon-headset" />
              </div>

              <!-- 媒体类型角标 + 时长 -->
              <div
                v-if="mediaKindOf(item) !== 'image'"
                class="absolute top-1 left-1 px-1 rounded text-[11px] leading-[16px] bg-black/50"
              >
                {{ mediaKindOf(item) === 'video' ? '视频' : '音频' }}
                <span v-if="item._duration"> · {{ formatDuration(item._duration) }}</span>
              </div>

              <div
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <div
                  class="w-6 h-6 rounded-full bg-black/40 hover:bg-black/40 flex items-center justify-center cursor-pointer duration-200"
                >
                  <close-small
                    theme="outline"
                    size="16"
                    fill="white"
                    @click.stop="removeItem(item, index)"
                  />
                </div>
              </div>
              <div
                class="absolute bottom-0 right-0 left-0 bg-black/40 flex justify-between items-center px-2 py-1"
              >
                <copy-link
                  theme="outline"
                  size="20"
                  fill="white"
                  @click.stop="handleCopy(item.url)"
                />
                <!-- 仅图片可裁剪 -->
                <file-editing
                  v-if="mediaKindOf(item) === 'image'"
                  theme="outline"
                  size="20"
                  fill="white"
                  @click.stop="handleEditImage(item)"
                />
              </div>
            </div>
            <div class="image-title-wrap" :title="item.image_name">
              <p class="image-title-wrap__title">
                {{ item.image_name }}
              </p>
            </div>
            <div v-if="multiple ? isActive(item) > -1 : isActive(item)" class="image-box-selected">
              <div class="image-box-selected__right-angle" />
              <div class="image-box-selected__text">
                <span v-if="multiple">{{ isActive(item) + 1 }}</span>
                <!-- <i v-if="!multiple" class="iconfont icon-check" /> -->
                <SpIcon v-if="!multiple" name="check" />
              </div>
            </div>
          </div>
          <el-empty v-if="list.length == 0" :description="emptyDescription" />
        </div>
        <el-pagination
          layout="total, prev, pager, next"
          :current-page.sync="pageCur"
          :page-size="pageSize"
          :total="pageCount"
          @current-change="goPage"
          background
        />
      </div>
    </div>

    <!-- 添加分组 -->
    <SpDialog
      ref="groupDialogRef"
      v-model="groupDialog"
      :title="groupDialogTitle"
      :modal="false"
      :form="groupForm"
      :form-list="groupFormList"
      @onSubmit="onGroupFormSubmit"
    />

    <!-- 编辑 -->
    <SpDialog
      ref="editDialogRef"
      v-model="editDialog"
      :title="editDialogTitle"
      :modal="false"
      :form="editForm"
      :form-list="editFormList"
      @onSubmit="onEditFormSubmit"
    />

    <!-- 图片裁剪 -->
    <el-dialog
      class="cropper-dialog"
      :title="cropperDialogTitle"
      :modal="false"
      :visible.sync="cropperDialogShow"
      width="500px"
    >
      <div class="cropper-container">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :auto-crop="option.autoCrop"
        />
        <div class="cropper-actions">
          <i class="el-icon-remove-outline" @click="handleCropperAction('minus')" />
          <i class="el-icon-circle-plus-outline" @click="handleCropperAction('plus')" />
          <i class="el-icon-refresh-left" @click="handleCropperAction('rotateRight')" />
          <i class="el-icon-refresh-right" @click="handleCropperAction('rotateLeft')" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cropperDialogShow = false">{{ cancelText }}</el-button>
        <el-button type="primary" @click="cropperDialogShow = false">{{ confirmText }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { i18n } from '@/i18n'
import UploadUtil from '@/utils/uploadUtil'
import { isObject, isArray } from '@/utils'
import BasePicker from './base'
import PageMixin from '../mixins/page'
import SpCropper from '@/components/sp-cropper/SpCropper'
import SpImageUploader from '@/components/sp-image-uploader/SpImageUploader'
import { CopyLink, FileEditing, CloseSmall } from '@icon-park/vue'
import { deleteImage } from '@/api/qiniu'

export default {
  name: 'PickerImage',
  components: {
    VueCropper,
    SpCropper,
    SpImageUploader,
    CopyLink,
    FileEditing,
    CloseSmall
  },
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: ''
  },
  created() {
    this.$options.config.title = i18n.t('4c4bec01.e757d0')
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Number,
      default: 6
    },
    /**
     * 是否显示「原素材 / AI 素材」来源切换 tab。
     * - 业务弹窗（如商品图选择）默认开启，便于跨库选图
     * - 独立的素材管理页（/content/material/material-management）不需要这个 tab：
     *   AI 素材有专门的管理页（/ai-material/material-library），素材管理页只负责原素材
     */
    enableSourceTab: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let { multiple = false, data } = this.value || {}
    //如果父组件指定了 multiple，使用指定值；否则使用默认值 true（多选）
    if (this.value && this.value.multiple !== undefined) {
      multiple = this.value.multiple
    }
    // 如果传入的是对象格式（不是数组），需要转换
    if (data && typeof data === 'object' && !Array.isArray(data) && 'url' in data) {
      //没有明确指定 multiple，自动推断为单选模式
      if (this.value.multiple === undefined) {
        multiple = false
        data = data.url || null
      }
      //已经明确指定了 multiple，按指定模式转换数据格式
      else {
        if (multiple) {
          //多选模式：对象转数组
          data = data.url ? [{ url: data.url }] : []
        } else {
          //单选模式：提取 url 字符串
          data = data.url || null
        }
      }
    }
    if (typeof data === 'string') {
      //如果字符串为空，视为未选择
      if (data.trim() === '') {
        data = multiple ? [] : null
      } else {
        data = multiple ? [data] : data //多选转为数组，单选保持字符串
      }
    } else if (!data) {
      data = multiple ? [] : null
    }
    return {
      spCropperRef: null,
      multiple,
      list: [],
      selected: data,
      catgoryList: [],
      selectCatgory: -1,
      // 素材来源 tab：normal=原素材库 / ai_generate=AI素材库
      // 通过 value.source 传入可初始定位（场景：从某些入口想直接打开 AI tab）
      sourceTab: (this.value && this.value.source === 'ai_generate') ? 'ai_generate' : 'normal',
      groupDialog: false,
      groupForm: {
        groupId: '',
        groupName: ''
      },
      editDialog: false,
      editForm: {
        groupId: ''
      },
      editFormListOptions: [],
      cropperDialogShow: false,
      localpostData: {
        token: '',
        key: '',
        fname: ''
      },
      option: {
        img: '',
        size: 1,
        autoCrop: true
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) return
        // 首先同步 multiple 状态（无论 data 是否存在）
        if (val.multiple !== undefined) {
          this.multiple = val.multiple
        }
        // 同步 value.data 到 selected
        if (val.data !== undefined) {
          let { multiple = true, data } = val
          // 如果明确指定了 multiple，使用指定的值
          if (val.multiple !== undefined) {
            multiple = val.multiple
            this.multiple = val.multiple
          }

          if (data && typeof data === 'object' && !Array.isArray(data) && 'url' in data) {
            // 只有当 multiple 未明确指定（使用默认值）时才自动设置为单选
            if (val.multiple === undefined) {
              multiple = false
              this.multiple = false
              // 提取 url 字符串，如果 url 为空字符串或 undefined 则视为未选择
              data = data.url || null
            } else {
              // 如果明确指定了 multiple，保持原值，但需要转换对象格式
              if (multiple) {
                // 多选模式：将对象转换为数组格式
                data = data.url ? [{ url: data.url }] : []
              } else {
                // 单选模式：提取 url 字符串
                data = data.url || null
              }
            }
          }

          if (typeof data === 'string') {
            // 如果字符串为空，视为未选择
            if (data.trim() === '') {
              data = multiple ? [] : null
            } else {
              data = multiple ? [data] : data
            }
          } else if (!data) {
            data = multiple ? [] : null
          }
          // 确保 selected 与 value.data 同步
          this.selected = data
        } else {
          // 如果 data 未定义，但明确指定了 multiple，也要同步 multiple 状态
          if (val.multiple !== undefined) {
            this.multiple = val.multiple
          }
        }
      }
    }
  },
  computed: {
    addGroupBtnText() {
      return i18n.t('4c4bec01.ddceab')
    },
    moveGroupBtnText() {
      return i18n.t('4c4bec01.af4be5')
    },
    cancelAllBtnText() {
      return i18n.t('4c4bec01.4c347e')
    },
    emptyDescription() {
      return i18n.t('4c4bec01.21efd8')
    },
    groupDialogTitle() {
      return i18n.t('4c4bec01.ddceab')
    },
    editDialogTitle() {
      return i18n.t('4c4bec01.2ccbfe')
    },
    cropperDialogTitle() {
      return i18n.t('4c4bec01.1cb6db')
    },
    cancelText() {
      return i18n.t('4c4bec01.c08ab9')
    },
    confirmText() {
      return i18n.t('4c4bec01.aa7527')
    },
    groupFormList() {
      return [
        {
          label: i18n.t('4c4bec01.1014b3'),
          key: 'groupName',
          type: 'input',
          maxlength: 20,
          placeholder: i18n.t('4c4bec01.0c6416'),
          required: true,
          message: i18n.t('4c4bec01.281bad')
        }
      ]
    },
    editFormList() {
      return [
        {
          label: i18n.t('4c4bec01.e26c8c'),
          key: 'groupId',
          placeholder: i18n.t('4c4bec01.597997'),
          type: 'select',
          options: this.editFormListOptions,
          required: true,
          message: i18n.t('4c4bec01.281bad')
        }
      ]
    },
    disabledDeleteGroup() {
      return this.selectCatgory == -1
    },
    disabledBtnCropper() {
      if (this.multiple) {
        return this.selected.length !== 1
      } else {
        return !this.selected
      }
    },
    disabledBtnEdit() {
      return this.multiple ? this.selected.length == 0 : !this.selected
    },
    disabledBtnDelete() {
      return this.multiple ? this.selected.length == 0 : !this.selected
    },
    disabledBtnDownload() {
      return this.multiple ? this.selected.length == 0 : !this.selected
    },
    disabledBtnCancel() {
      return this.multiple ? this.selected.length == 0 : !this.selected
    },
    disabledBtn() {
      return this.multiple ? this.selected.length == 0 : !this.selected
    }
  },
  mounted() {
    this.nextPage()
    this.getImageAllCatgory()
    //等 DOM 更新完再访问 SpCropper 组件实例
    this.$nextTick(() => {
      this.spCropperRef = this.$refs.spCropper
    })
    /*console.log('组件挂载时')
    console.log('selected的值:', this.selected)*/
  },
  methods: {
    removeItem(item, index) {
      this.$confirm(i18n.t('4c4bec01.5dab41'), i18n.t('4c4bec01.02d981'), {
        confirmButtonText: i18n.t('4c4bec01.38cf16'),
        cancelButtonText: i18n.t('4c4bec01.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteImage({ image_id: item.image_id }).then((response) => {
            this.refresh(true)
            this.$message({
              message: i18n.t('4c4bec01.0007d1'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: i18n.t('4c4bec01.2111cc')
          })
        })
    },

    handleEditImage(item) {
      if (this.$refs.spCropperRef && item) {
        const currentIndex = this.list.findIndex((img) => img.image_id === item.image_id)
        if (currentIndex === -1) {
          this.$message.warning(i18n.t('4c4bec01.fa3a23'))
          return
        }
        this.$refs.spCropperRef.showDialog({
          image: item,
          imageList: this.list,
          currentIndex: currentIndex
        })
      }
    },

    handleCropComplete(data) {
      this.refresh(true)
      this.$message.success(i18n.t('4c4bec01.6a0cb2'))
    },

    isActive({ image_id, url }) {
      if (this.multiple) {
        return isArray(this.selected) ? this.selected.findIndex((item) => item.url == url) : false
      } else {
        // return this.selected ? this.selected.image_id == image_id : false
        if (this.selected) {
          const handleRegExp = (str) => {
            const regExp = /^(http|https):\/\/(.*)/g
            const [p1, p2, p3] = regExp.exec(str)
            return p3
          }
          if (isObject(this.selected)) {
            if (this.selected.url) {
              return handleRegExp(this.selected.url) == handleRegExp(url)
            }
            return false
          } else {
            return handleRegExp(this.selected) == handleRegExp(url)
          }
        } else {
          return false
        }
      }
    },
    onAddGroup() {
      const { groupForm } = this.$options.data()
      this.groupForm = groupForm
      this.groupDialog = true
    },
    onEditGroup({ image_cat_id, image_cat_name }) {
      this.groupForm = {
        groupId: image_cat_id,
        groupName: image_cat_name
      }
      this.groupDialog = true
    },
    async onDeleteGroup({ image_cat_id, image_cat_name }) {
      try {
        await this.$confirm(
          i18n.t('4c4bec01.9b22f9') + `【${image_cat_name}】？`,
          i18n.t('4c4bec01.02d981'),
          {
            confirmButtonText: i18n.t('4c4bec01.38cf16'),
            cancelButtonText: i18n.t('4c4bec01.625fb2')
          }
        )
        await this.$api.picker.deleteImageGroup(image_cat_id)
        this.getImageAllCatgory()
        this.refresh(true)
      } catch (e) {
        console.log(e)
      }
    },
    async onGroupFormSubmit() {
      const { groupId, groupName } = this.groupForm
      if (groupId) {
        await this.$api.picker.addImageCatgory({
          image_cat_id: groupId,
          image_cat_name: groupName,
          parent_id: 0,
          source: this.sourceTab
        })
      } else {
        await this.$api.picker.addImageCatgory({
          image_cat_name: groupName,
          parent_id: 0,
          source: this.sourceTab
        })
      }
      this.groupDialog = false
      this.getImageAllCatgory()
    },
    onMoveGroup() {
      this.editDialog = true
    },
    async onEditFormSubmit() {
      const { groupId } = this.editForm
      this.$refs['editDialogRef'].resetForm()
      let image_id
      if (isArray(this.selected)) {
        image_id = this.selected.map(({ image_id }) => image_id)
      } else {
        image_id = this.selected.image_id
      }
      await this.$api.picker.moveImageGroup({
        image_cat_id: groupId,
        // company_id => '企业id必填,必须为整数',
        image_id: image_id.toString()
      })
      this.editDialog = false
      this.refresh(true)
    },

    /*handleEdit() {
      const { multiple, selected } = this
      this.editFormList[1].disabled = false
      if (multiple && selected.length == 1) {
        this.editForm.name = selected[0].image_name
      } else if (!multiple && selected) {
        this.editForm.name = selected.image_name
      } else {
        this.editFormList[1].disabled = true
      }
      this.editDialog = true
    },
    handleCropper() {
      const { selected, multiple } = this
      this.option.img = multiple ? selected[0].url : selected.url
      this.cropperDialogShow = true
    },*/
    async fetch({ page_no, page_size }) {
      let params = {
        type: 'image',
        page: page_no,
        pageSize: page_size,
        source: this.sourceTab
      }
      if (this.selectCatgory != '-1') {
        params = {
          ...params,
          image_cat_id: this.selectCatgory
        }
      }
      const { list, total_count } = await this.$api.picker.getImageList(params)
      this.list = list
      return { count: total_count }
    },
    async getImageAllCatgory() {
      const { list } = await this.$api.picker.getImageAllCatgory({
        image_cat_id: 0,
        source: this.sourceTab
      })
      this.catgoryList = [
        { image_cat_id: -1, image_cat_name: i18n.t('4c4bec01.a8982a') },
        ...list.reverse()
      ]
      this.editFormListOptions = this.catgoryList.map((item) => {
        return {
          title: item.image_cat_name,
          value: item.image_cat_id
        }
      })
    },
    /** 切换原素材 / AI 素材 tab：分类树和列表都重拉，分类选中重置 */
    async onSourceTabChange() {
      this.selectCatgory = -1
      await this.getImageAllCatgory()
      this.refresh(true)
    },
    /** 按 image_type MIME 前缀 / image_url 后缀分辨媒体类型 */
    mediaKindOf(item) {
      const mime = (item && item.image_type) ? String(item.image_type).toLowerCase() : ''
      if (mime.indexOf('video/') === 0) return 'video'
      if (mime.indexOf('audio/') === 0) return 'audio'
      if (mime.indexOf('image/') === 0) return 'image'
      // 兜底用扩展名
      const url = String((item && (item.url || item.image_full_url || item.image_url)) || '')
      const ext = (url.split('?')[0].split('.').pop() || '').toLowerCase()
      if (['mp4', 'mov', 'webm', 'm4v'].indexOf(ext) > -1) return 'video'
      if (['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'].indexOf(ext) > -1) return 'audio'
      return 'image'
    },
    /** 浏览器读完视频/音频元数据后塞 _duration 到 item，复用既有响应式数组 */
    onMediaMeta(item, ev) {
      const dur = ev && ev.target && ev.target.duration
      if (dur && isFinite(dur)) {
        this.$set(item, '_duration', Math.round(dur))
      }
    },
    formatDuration(sec) {
      if (!sec) return ''
      const s = Math.max(0, Math.round(Number(sec) || 0))
      const m = Math.floor(s / 60)
      const r = s % 60
      return m + ':' + (r < 10 ? '0' + r : r)
    },

    handleClickCatgory({ image_cat_id }) {
      this.selectCatgory = image_cat_id
      this.refresh(true)
    },
    handleClickItem(item) {
      const { image_id, url } = item
      const _item = {
        image_id,
        url
      }
      if (this.multiple) {
        // 支持字符串和对象两种格式的查找
        const fdx = this.selected.findIndex((s) => {
          if (typeof s === 'string') {
            const handleRegExp = (str) => {
              const regExp = /^(http|https):\/\/(.*)/g
              const match = regExp.exec(str)
              return match ? match[2] : str
            }
            return handleRegExp(s) === handleRegExp(url)
          } else if (isObject(s)) {
            return s.image_id == image_id || s.url === url
          }
          return false
        })
        if (fdx > -1) {
          this.selected.splice(fdx, 1)
        } else {
          // 默认最多可选20
          const maxSelect = 20
          if (this.selected.length < maxSelect) {
            this.selected.push(_item)
          } else {
            this.$message.error(i18n.t('4c4bec01.a0672e') + maxSelect + i18n.t('4c4bec01.54aa1e'))
            return
          }
        }
      } else {
        // 单选模式，检查当前点击的图片是否已经被选中
        const isAlreadySelected = this.isActive(item)
        if (isAlreadySelected) {
          // 如果已经选中，点击后取消选中
          this.selected = null
        } else {
          // 如果未选中，点击后选中这张图片
          this.selected = _item
        }
      }
      this.updateVal(this.selected)
    },
    async handleCopy(url) {
      await this.$copyText(url)
      this.$message.success(i18n.t('4c4bec01.c13172'))
    },
    handleCancelAll() {
      const { multiple } = this
      this.selected = multiple ? [] : null
      this.updateVal(this.selected)
    }
    /*handleCropperAction(action) {
      switch (action) {
        case 'minus':
          this.$refs.cropper.changeScale(-2)
          break
        case 'plus':
          this.$refs.cropper.changeScale(2)
          break
        case 'rotateRight':
          this.$refs.cropper.rotateRight()
          break
        case 'rotateLeft':
          this.$refs.cropper.rotateLeft()
          break
      }
    }*/
  }
}
</script>
