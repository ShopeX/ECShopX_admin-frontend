<template>
  <el-card>
    <div slot="header">
      <div style="display: flex; align-items: center">
        <div>店铺图片</div>
        <div class="frm-tips">
          （只能上传jpg/png文件，且不超过2M）
        </div>
      </div>
    </div>
    <el-row>
      <el-col :span="8">
        <el-form-item>
          <div>店铺Logo <span class="tips">推荐尺寸：140px * 140px</span></div>
          <div
            class="upload-box"
            @click="handleImgPicker('logo')"
          >
            <img
              v-if="form.logo"
              :src="form.logo"
              class="avatar"
            >
            <i
              v-else
              class="iconfont icon-camera avatar-uploader-icon"
            />
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <div>商铺背景图片<span class="tips">推荐尺寸：400px * 260px</span></div>
          <div
            class="upload-box"
            @click="handleImgPicker('banner')"
          >
            <img
              v-if="form.banner"
              :src="form.banner"
              class="avatar"
            >
            <i
              v-else
              class="iconfont icon-camera avatar-uploader-icon"
            />
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
  </el-card>
</template>

<script>
import { getDadaInfo } from '@/api/mall/dada'
import imgPicker from '@/components/imageselect'
export default {
  components: {
    imgPicker
  },
  props: ['externalForm'],
  data () {
    return {
      pickerImgType: 'logo',
      imgDialog: false,
      isGetImage: false,
      form: {
        logo: '',
        banner: ''
      }
    }
  },
  watch: {
    externalForm: {
      handler (val) {
        if (val.logo) {
          this.form.logo = val.logo
        }
        if (val.banner) {
          this.form.banner = val.banner
        }
      },
      deep: true
    }
  },
  mounted () {},
  methods: {
    closeImgDialog () {
      this.imgDialog = false
      this.isGetImage = false
    },
    handleImgPicker: function (pickerImgType) {
      this.pickerImgType = pickerImgType
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      if (this.pickerImgType == 'logo') {
        this.form.logo = data.url
      } else {
        this.form.banner = data.url
      }
      this.imgDialog = false
    }
  }
}
</script>

<style scoped lang="scss">
.upload-box {
  width: 150px;
  height: 150px;
  align-items: center;
  display: flex;
  border: 1px dashed #ccc;
  border-radius: 5px;
  img {
    width: 100%;
  }
}
.tips {
  color: #8d8d8d;
  line-height: 1.5;
  font-size: 12px;
  padding: 10px 0;
}
</style>
