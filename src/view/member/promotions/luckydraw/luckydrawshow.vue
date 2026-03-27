<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-col class="section section-white" :span="12">
    <div class="section-header with-border">{{ $t('7a96016f.626555') }}</div>
    <el-form label-width="100px" style="margin-top: 25px">
      <el-form-item :label="$t('7a96016f.7f32d0')">
        <el-col :span="10">
          <div v-for="(item, index) in data" class="setting-item slider">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="el-icon-delete" />
            </div>
            <img
              v-if="item.imgUrl"
              :src="wximageurl + item.imgUrl"
              class="banner-uploader"
              @click="handleImgChange(index)"
            >
            <div v-else class="banner-uploader" @click="handleImgChange(index)">
              <div class="content-center">
                <i class="el-icon-camera" /><br>
                {{ $t('7a96016f.ce6855') }}
              </div>
            </div>
          </div>
        </el-col>
      </el-form-item>
      <imgPicker
        :dialog-visible="imgsVisible"
        :sc-status="isGetImage"
        @chooseImg="pickImg"
        @closeImgDialog="closeimgsVisible"
      />
    </el-form>
    <div class="content-center">
      <div class="frm-tips">{{ $t('7a96016f.d5a0d5') }}</div>
      <el-button
        :disabled="data.length >= 5"
        type="default"
        class="iconfont icon-plus-circle banner-button-uploader"
        @click="addItem"
      >
        {{ $t('7a96016f.22134f') }}
      </el-button>
    </div>
    <br>
    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="save"> {{ $t('7a96016f.be5fbb') }} </el-button>
    </div>
    <br>
  </el-col>
</template>

<script>
import { setLuckydrawShow, getLuckydrawShow } from '../../../../api/promotions'
// 组件
import imgPicker from '@/components/imageselect'
export default {
  components: {
    imgPicker
  },
  data() {
    return {
      editorDataIndex: '',
      closeimgsVisible: false,
      // 图片选择器
      isGetImage: false,
      imgsVisible: false,
      data: []
    }
  },
  mounted() {
    this.getLuckydrawShow()
  },
  methods: {
    save() {
      setLuckydrawShow(this.data).then((res) => {
        this.$message({
          message: this.$t('7a96016f.3b1083'),
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    getLuckydrawShow() {
      getLuckydrawShow().then((res) => {
        this.data = res.data.data
      })
    },
    addItem() {
      if (!this.data) {
        this.data = []
      }
      let item = {
        imgUrl: ''
      }
      if (this.data.length > 4) {
        this.$message({
          message: this.$t('7a96016f.1d1897'),
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.data.push(item)
      }
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    handleImgChange(index) {
      this.imgsVisible = true
      this.isGetImage = true
      this.editorDataIndex = index
    },
    pickImg(data) {
      this.data[this.editorDataIndex].imgUrl = data.url
      this.imgsVisible = false
    }
  }
}
</script>

<style scoped></style>
