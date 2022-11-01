<template>
  <el-col
    class="section section-white"
    :span="12"
  >
    <div class="section-header with-border">
      开奖图片上传
    </div>
    <el-form
      label-width="100px"
      style="margin-top: 25px"
    >
      <el-form-item label="中奖图片">
        <el-col :span="10">
          <div
            v-for="(item, index) in data"
            class="setting-item slider"
          >
            <div
              class="setting-remove"
              @click="removeItem(index)"
            >
              <i class="iconfont icon-trash-alt" />
            </div>
            <img
              v-if="item.imgUrl"
              :src="wximageurl + item.imgUrl"
              class="banner-uploader"
              @click="handleImgChange(index)"
            >
            <div
              v-else
              class="banner-uploader"
              @click="handleImgChange(index)"
            >
              <div class="content-center">
                <i class="iconfont icon-camera" /><br>
                上传图片
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
      <div class="frm-tips">
        只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）
      </div>
      <el-button
        :disabled="data.length >= 5"
        type="default"
        class="iconfont icon-plus-circle banner-button-uploader"
        @click="addItem"
      >
        添加轮播图
      </el-button>
    </div>
    <br>
    <div class="section-footer with-border content-center">
      <el-button
        type="primary"
        @click="save"
      >
        保存
      </el-button>
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
  data () {
    return {
      editorDataIndex: '',
      closeimgsVisible: false,
      // 图片选择器
      isGetImage: false,
      imgsVisible: false,
      data: []
    }
  },
  mounted () {
    this.getLuckydrawShow()
  },
  methods: {
    save () {
      setLuckydrawShow(this.data).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    getLuckydrawShow () {
      getLuckydrawShow().then((res) => {
        this.data = res.data.data
      })
    },
    addItem () {
      if (!this.data) {
        this.data = []
      }
      let item = {
        imgUrl: ''
      }
      if (this.data.length > 4) {
        this.$message({
          message: '轮播图最多添加5个图片',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.data.push(item)
      }
    },
    removeItem (index) {
      this.data.splice(index, 1)
    },
    handleImgChange (index) {
      this.imgsVisible = true
      this.isGetImage = true
      this.editorDataIndex = index
    },
    pickImg (data) {
      this.data[this.editorDataIndex].imgUrl = data.url
      this.imgsVisible = false
    }
  }
}
</script>

<style scoped></style>
