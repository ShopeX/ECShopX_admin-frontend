<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.picker-image {
  &-hd {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .btn-actions {
      display: flex;
    }
    .btn-upload {
      margin-right: 10px;
    }
  }
  &-bd {
    display: flex;
    padding: 0 0 10px 10px;
    .lf-container {
      width: auto;
      background: #f5f5f5;
      height: 500px;
      margin-right: 8px;
      padding: 8px;
      overflow: auto;
      .i-icon-folder-plus {
        display: inline-block;
        margin-right: 6px;
        margin-top: 3px;
      }
      .i-icon-editor {
        font-size: 13px;
        float: right;
        display: none;
      }
      .i-icon-delete {
        font-size: 13px;
        float: right;
        margin-right: 6px;
        display: none;
      }
    }
    .rg-container {
      flex: 1;
    }
  }
  .catgory-item {
    height: 30px;
    line-height: 30px;
    padding: 0 6px;
    &:hover {
      color: rgb(255, 255, 255);
      background-color: rgba(0, 0, 0, 0.4);
      .i-icon-editor {
        display: block;
      }
      .i-icon-delete {
        display: block;
      }
    }
    &.active {
      color: rgb(255, 255, 255);
      background-color: var(--primary);
    }
  }
  .image-item {
    position: relative;
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
    &:hover {
      .image-meta {
        display: block;
      }
      .i-icon-link-two {
        display: block;
      }
      .i-icon-delete {
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
    .i-icon-link-two {
      position: absolute;
      top: 8px;
      left: 4px;
      display: none;
      color: #666;
    }
    .i-icon-delete {
      position: absolute;
      bottom: 8px;
      left: 4px;
      display: none;
      color: #666;
    }
  }
  .image-title-wrap {
    width: 120px;
    &__title {
      font-size: 12px;
      @include text-overflow();
    }
  }
  .el-pagination {
    margin-top: 8px;
    text-align: right;
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
  .image-list {
    height: 452px;
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
  <div class="picker-image">
    <div class="picker-image-hd">
      <div class="btn-actions">
        <el-upload
          class="btn-upload"
          action=""
          accept="image/jpeg,image/png,image/gif"
          :multiple="true"
          :show-file-list="false"
          :data="localpostData"
          :http-request="handleUpload"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :on-error="uploadError"
        >
          <el-button>{{ $t('f69ac5cd.ce6855') }}</el-button>
        </el-upload>
        <el-button @click="onAddGroup"> {{ $t('f69ac5cd.ddceab') }} </el-button>
        <el-button :disabled="disabledBtn" @click="onMoveGroup">
          {{ $t('f69ac5cd.68d982') }}
        </el-button>
        <el-button :disabled="disabledBtn" @click="handleCancelAll">
          {{ $t('f69ac5cd.4c347e') }}
        </el-button>
      </div>
    </div>
    <div class="picker-image-bd">
      <div class="lf-container">
        <div
          v-for="(item, index) in catgoryList"
          :key="`catgory-item__${index}`"
          class="catgory-item flex justify-between items-center"
          :class="{
            active: selectCatgory == item.image_cat_id
          }"
          @click="handleClickCatgory(item)"
        >
          <div class="flex items-center justify-between w-full">
            <div>
              <SpIcon name="folder-plus" />
              {{ item.image_cat_name }}
            </div>
            <div>
              <SpIcon v-if="index > 0" name="editor" @click.stop="onEditGroup(item)" />
              <SpIcon v-if="index > 0" name="delete" @click.stop="onDeleteGroup(item)" />
            </div>
          </div>
        </div>
      </div>
      <div class="rg-container">
        <div v-loading="loading" class="image-list">
          <div
            v-for="(item, index) in list"
            :key="`image-item-wrap__${index}`"
            class="image-item-wrap"
            @click="handleClickItem(item)"
          >
            <div
              class="image-item"
              :style="{ color: '#fff', backgroundImage: `url('${item.url}')` }"
            >
              <SpIcon name="link-two" size="20" @click.stop="handleCopy(item.url)" />
              <SpIcon name="delete" size="18" @click.stop="removeItem(item, index)" />
              <!-- <span class="image-meta">800*800</span> -->
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
                <i v-if="!multiple" class="iconfont icon-check" />
              </div>
            </div>
          </div>
          <el-empty v-if="list.length == 0" :description="$t('f69ac5cd.21efd8')" />
        </div>
        <el-pagination
          layout="total, prev, pager, next"
          :current-page.sync="pageCur"
          :page-size="pageSize"
          :total="pageCount"
          @current-change="goPage"
        />
      </div>
    </div>

    <!-- 添加分组 -->
    <SpDialog
      ref="groupDialogRef"
      v-model="groupDialog"
      :title="$t('f69ac5cd.ddceab')"
      :modal="false"
      :form="groupForm"
      :form-list="groupFormList"
      @onSubmit="onGroupFormSubmit"
    />

    <!-- 编辑 -->
    <SpDialog
      ref="editDialogRef"
      v-model="editDialog"
      :title="$t('f69ac5cd.2ccbfe')"
      :modal="false"
      :form="editForm"
      :form-list="editFormList"
      @onSubmit="onEditFormSubmit"
    />

    <!-- 图片裁剪 -->
    <el-dialog
      class="cropper-dialog"
      :title="$t('f69ac5cd.1cb6db')"
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
          <i class="iconfont icon-search-minus" @click="handleCropperAction('minus')" />
          <i class="iconfont icon-search-plus" @click="handleCropperAction('plus')" />
          <i class="iconfont icon-undo-alt" @click="handleCropperAction('rotateRight')" />
          <i class="iconfont icon-redo-alt" @click="handleCropperAction('rotateLeft')" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cropperDialogShow = false">{{ $t('f69ac5cd.c08ab9') }}</el-button>
        <el-button type="primary" @click="cropperDialogShow = false">{{
          $t('f69ac5cd.aa7527')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import UploadUtil from '@/utils/uploadUtil'
import { isObject, isArray } from '@/utils'
import BasePicker from './base'
import PageMixin from './mixins/page'
import { deleteImage } from '@/api/qiniu'
export default {
  name: 'PickerImage',
  components: {
    VueCropper
  },
  extends: BasePicker,
  mixins: [PageMixin],
  props: ['value'],
  data() {
    let { multiple = true, data } = this.value || {}
    if (!data) {
      data = multiple ? [] : ''
    }
    return {
      multiple,
      list: [],
      selected: data,
      catgoryList: [],
      selectCatgory: -1,
      groupDialog: false,
      groupForm: {
        groupId: '',
        groupName: ''
      },
      groupFormList: [
        {
          label: this.$t('f69ac5cd.1014b3'),
          key: 'groupName',
          type: 'input',
          maxlength: 150,
          placeholder: this.$t('f69ac5cd.0c6416'),
          required: true,
          message: this.$t('f69ac5cd.281bad')
        }
      ],
      editDialog: false,
      editForm: {
        groupId: ''
      },
      editFormList: [
        {
          label: this.$t('f69ac5cd.e26c8c'),
          key: 'groupId',
          placeholder: this.$t('f69ac5cd.597997'),
          type: 'select',
          options: [],
          required: true,
          message: this.$t('f69ac5cd.281bad')
        }
      ],
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
  computed: {
    config() {
      return { title: this.$t('f69ac5cd.e757d0') }
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
  created() {},
  mounted() {
    this.nextPage()
    this.getImageAllCatgory()
  },
  methods: {
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
            return handleRegExp(this.selected.url) == handleRegExp(url)
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
          this.$t('f69ac5cd.9b22f9') + '【' + image_cat_name + '】？',
          this.$t('f69ac5cd.02d981'),
          {
            confirmButtonText: this.$t('f69ac5cd.38cf16'),
            cancelButtonText: this.$t('f69ac5cd.625fb2')
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
          parent_id: 0
        })
      } else {
        await this.$api.picker.addImageCatgory({
          image_cat_name: groupName,
          parent_id: 0
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

    handleEdit() {
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
    },
    async fetch({ page_no, page_size }) {
      let params = {
        type: 'image',
        page: page_no,
        pageSize: page_size
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
      const { list } = await this.$api.picker.getImageAllCatgory({ image_cat_id: 0 })
      this.catgoryList = [
        { image_cat_id: -1, image_cat_name: this.$t('f69ac5cd.a8982a') },
        ...list.reverse()
      ]
      this.editFormList[0].options = this.catgoryList.map((item) => {
        return {
          title: item.image_cat_name,
          value: item.image_cat_id
        }
      })
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
        const fdx = this.selected.findIndex((s) => s.image_id == item.image_id)
        if (fdx > -1) {
          this.selected.splice(fdx, 1)
        } else {
          this.selected.push(_item)
        }
      } else {
        this.selected = _item
      }
      this.updateVal(this.selected)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error(this.$t('f69ac5cd.34e969'))
        return
      }
      if (!isLt2M) {
        this.$message.error(this.$t('f69ac5cd.50fa12'))
        return
      }
      this.localpostData.fname = file.name
    },
    async handleAvatarSuccess(res, file) {
      const uploadParams = {
        image_cat_id: this.selectCatgory, //图片分类必填,必须为整数
        image_name: file.name, //图片名称必填,不能超过50个字符
        image_url: res.key, //图片链接必填
        image_type: file.raw.type, //图片分类长度不能超过20个字符
        storage: 'image' //图片id必填
      }
      await this.$api.qiniu.uploadQiniuPic(uploadParams)
      this.$message.success(this.$t('f69ac5cd.a7699b'))
      this.refresh(true)
    },
    // 自定义上传
    handleUpload: function (e) {
      const upload = new UploadUtil()
      // 上传
      upload
        .uploadImg(e.file, e.file.name)
        .then(
          (res) => e.onSuccess(res),
          (err) => e.onError(err)
        )
        .catch((err) => e.onError(err))
    },
    // 上传错误回调
    uploadError: function (e) {
      console.error(e)
    },
    async handleCopy(url) {
      await this.$copyText(url)
      this.$notify.success({
        message: this.$t('f69ac5cd.c13172'),
        showClose: true
      })
    },
    removeItem(item, index) {
      this.$confirm(this.$t('f69ac5cd.5dab41'), this.$t('f69ac5cd.02d981'), {
        confirmButtonText: this.$t('f69ac5cd.38cf16'),
        cancelButtonText: this.$t('f69ac5cd.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteImage({ image_id: item.image_id }).then((response) => {
            this.refresh(true)
            this.$message({
              message: this.$t('f69ac5cd.0007d1'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('f69ac5cd.2111cc')
          })
        })
    },
    handleCancelAll() {
      const { multiple } = this
      this.selected = multiple ? [] : null
    },
    handleCropperAction(action) {
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
    }
  }
}
</script>
