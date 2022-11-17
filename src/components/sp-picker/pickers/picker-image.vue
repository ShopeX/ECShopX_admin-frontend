<style lang="scss">
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
      width: 220px;
      background: #f5f5f5;
      height: 500px;
      margin-right: 8px;
      padding: 8px;
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
    }
    &.active {
      color: rgb(255, 255, 255);
      background-color: var(--themeColor);
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
    &:hover {
      .image-meta {
        display: block;
      }
      .icon-link {
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
    .icon-link {
      position: absolute;
      top: 2px;
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
    border: 2px solid var(--themeColor);
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
      background: var(--themeColor);
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
          :show-file-list="false"
          :data="localpostData"
          :http-request="handleUpload"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :on-error="uploadError"
        >
          <el-button>上传图片</el-button>
        </el-upload>
        <!-- <el-button
          @click="
            () => {
              this.groupDialog = true
            }
          "
        >
          添加分组
        </el-button>
        <el-button :disabled="disabledDeleteGroup">
          删除分组
        </el-button>
        <el-button
          :disabled="disabledBtnCropper"
          @click="handleCropper"
        >
          裁剪
        </el-button>
        <el-button
          :disabled="disabledBtnEdit"
          @click="handleEdit"
        >
          编辑
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
        </el-button>
        <el-button
          :disabled="disabledBtnCancel"
          @click="handleCancelAll"
        >
          全部取消
        </el-button> -->
      </div>
      <div>
        <el-input size="small" placeholder="请输入图片名称" suffix-icon="el-icon-search" />
      </div>
    </div>
    <div class="picker-image-bd">
      <!-- <div class="lf-container">
        <div
          v-for="(item, index) in catgoryList"
          :key="`catgory-item__${index}`"
          class="catgory-item"
          :class="{
            active: selectCatgory == item.image_cat_id
          }"
          @click="handleClickCatgory(item)"
        >
          {{ item.image_cat_name }}
        </div>
      </div> -->
      <div class="rg-container">
        <div v-loading="loading" class="image-list">
          <div
            v-for="(item, index) in list"
            :key="`image-item-wrap__${index}`"
            class="image-item-wrap"
            @click="handleClickItem(item)"
          >
            <div class="image-item" :style="{ color: '#fff', backgroundImage: `url(${item.url})` }">
              <i class="iconfont icon-link" @click.stop="handleCopy(item.url)" />
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
          <el-empty v-if="list.length == 0" description="暂无数据" />
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
      title="添加分组"
      :modal="false"
      :form="groupForm"
      :form-list="groupFormList"
      @onSubmit="onGroupFormSubmit"
    />

    <!-- 编辑 -->
    <SpDialog
      ref="editDialogRef"
      v-model="editDialog"
      title="编辑"
      :modal="false"
      :form="editForm"
      :form-list="editFormList"
      @onSubmit="onEditFormSubmit"
    />

    <!-- 图片裁剪 -->
    <el-dialog
      class="cropper-dialog"
      title="图片裁剪"
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
        <el-button @click="cropperDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="cropperDialogShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import UploadUtil from '@/utils/uploadUtil'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerImage',
  components: {
    VueCropper
  },
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '我的图片'
  },
  props: ['value'],
  data() {
    const { multiple = false, data } = this.value
    return {
      multiple,
      list: [],
      selected: data,
      catgoryList: [],
      selectCatgory: -1,
      groupDialog: false,
      groupForm: {
        groupName: ''
      },
      groupFormList: [
        {
          label: '分组名称:',
          key: 'groupName',
          type: 'input',
          maxlength: 150,
          placeholder: '请输入分组名称',
          required: true,
          message: '不能为空'
        }
      ],
      editDialog: false,
      editForm: {
        groupName: '',
        name: ''
      },
      editFormList: [
        {
          label: '图片分组:',
          key: 'groupName',
          placeholder: '请选择图片分组',
          type: 'select',
          options: [],
          required: true,
          message: '不能为空'
        },
        {
          label: '图片名称:',
          key: 'name',
          type: 'input',
          placeholder: '请输入图片名称',
          required: true,
          message: '不能为空'
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
    }
  },
  created() {},
  mounted() {
    this.nextPage()
    this.getImageAllCatgory()
  },
  methods: {
    isActive({ image_id }) {
      if (this.multiple) {
        return this.selected.findIndex((item) => item.image_id == image_id)
      } else {
        return this.selected ? this.selected.image_id == image_id : false
      }
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
    onEditFormSubmit() {
      this.$refs['editDialogRef'].resetForm()
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
      this.catgoryList = [{ image_cat_id: -1, image_cat_name: '默认分组' }, ...list.reverse()]
      this.editFormList[0].options = this.catgoryList.map((item) => {
        return {
          title: item.image_cat_name,
          value: item.image_cat_id
        }
      })
    },
    async onGroupFormSubmit() {
      const { groupName } = this.groupForm
      await this.$api.picker.addImageCatgory({
        image_cat_name: groupName,
        parent_id: 0
      })
      this.groupDialog = false
      this.getImageAllCatgory()
    },
    handleClickCatgory({ image_cat_id }) {
      this.selectCatgory = image_cat_id
      this.refresh(true)
    },
    handleClickItem(item) {
      // console.log('picker-image:', item)
      const { image_id, url } = item
      const _item = {
        image_id,
        url
      }
      if (!this.multiple) {
        this.selected = _item
      } else {
        const fdx = this.selected.findIndex((s) => s.image_id == item.image_id)
        if (fdx > -1) {
          this.selected.splice(fdx, 1)
        } else {
          this.selected.push(_item)
        }
      }
      this.updateVal(this.selected)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return
      }
      this.localpostData.fname = file.name
    },
    async handleAvatarSuccess(res, file) {
      const uploadParams = {
        image_cat_id: 2, //图片分类必填,必须为整数
        image_name: file.name, //图片名称必填,不能超过50个字符
        image_url: res.key, //图片链接必填
        image_type: file.raw.type, //图片分类长度不能超过20个字符
        storage: 'image' //图片id必填
      }
      await this.$api.qiniu.uploadQiniuPic(uploadParams)
      this.$message.success('上传成功')
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
        message: '链接复制成功',
        showClose: true
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
