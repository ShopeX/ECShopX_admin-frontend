<template>
  <SpPage>
    <SpPlatformTip h5 app alipay />
    <el-form ref="form" :model="form" label-position="left" label-width="100px">
      <div class="section-body">
        <el-form-item label="商城名称">
          <el-input v-model="form.brand_name" type="text" style="width: 300px" />
          {{ VERSION_SHUYUN ? '（注：商城名称展示到小程序端）' : '' }}
        </el-form-item>
        <el-form-item label="商城简介">
          <el-row>
            <el-col :span="18">
              <el-input
                v-model="form.intro"
                type="textarea"
                :maxlength="120"
                :rows="6"
                placeholder="请输入商城简介"
                @input="countInput"
              />
              <div class="content-right muted">{{ remnant }}/120</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="商城Logo">
          <imgBox :img-url="form.logo" inline @click="handleImgChange('imgDialog')" />
          <imgPicker
            :dialog-visible="imgDialog"
            :sc-status="isGetImage"
            @chooseImg="pickImg"
            @closeImgDialog="closeImgDialog('imgDialog')"
          />
          （ 推荐尺寸:147*46px ）
        </el-form-item>
        <el-form-item label="登录页背景图">
          <imgBox :img-url="form.background" inline @click="handleImgChange('imgDialogLoginBg')" />
          <imgPicker
            :dialog-visible="imgDialogLoginBg"
            :sc-status="isGetImage"
            @chooseImg="pickImgLoginBg"
            @closeImgDialog="closeImgDialog('imgDialogLoginBg')"
          />
          （ 推荐尺寸:1920*690px ）
        </el-form-item>
      </div>
      <div class="section-footer content-center">
        <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
      </div>
    </el-form>
  </SpPage>
</template>

<script>
import { putSettingWxShops, getSettingWxShops } from '@/api/shop'
import { uploadMaterial } from '@/api/wechat'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'
export default {
  components: {
    imgPicker,
    imgBox
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      form: {
        logo: '',
        intro: '',
        brand_name: '',
        background: ''
      },
      textarea: '',
      pic: '',
      remnant: 0,
      fileList: [],
      imgDialog: false,
      imgDialogLoginBg: false,
      isGetImage: false
    }
  },
  mounted() {
    getSettingWxShops().then(res => {
      this.form.logo = res.data.data.logo
      this.pic = this.wximageurl + res.data.data.logo
      this.form.intro = res.data.data.intro
      this.form.brand_name = res.data.data.brand_name
      this.form.background = res.data.data.background
      this.remnant = (res.data.data.intro || '').length
    })
  },
  methods: {
    onSubmit() {
      let params = {}
      this.loading = true

      if (!this.form.brand_name || !this.form.brand_name.trim()) {
        this.$message.error('请输入商城名称')
        this.loading = false
        return
      }

      params = {
        intro: this.form.intro,
        logo: this.form.logo,
        brand_name: this.form.brand_name,
        background: this.form.background
      }
      console.log(params)
      putSettingWxShops(params).then(response => {
        if (response.data.data) {
          this.$message({
            message: '保存配置信息成功！',
            type: 'success'
          })
          this.loading = false
          this.$store.dispatch('setSysLogo', this.form.logo)
        } else {
          this.$message.error('配置信息失败，请确认是否正确填写内容！')
          this.loading = false
          return false
        }
      })
    },
    // handleQualificationPicChange: function(file, fileList) {
    //   this.pic = file.url
    //   if (file && file.raw) {
    //     if (file.raw.type != 'image/jpeg' && file.raw.type != 'image/png') {
    //       this.$message.error('上传图片只能是 JPG 或者 PNG 格式!');
    //     }
    //     if (file.raw.size/1024/1024 > 5) {
    //       this.$message.error('上传图片大小不能超过 5MB!')
    //     }
    //   }

    //   let params = {isUploadFile: true, file: file.raw, type: 'image'}
    //   uploadMaterial(params).then(res => {
    //     this.form.logo = res.data.data.url
    //   })
    // },
    countInput() {
      this.remnant = this.form.intro.length
    },
    //门店LOGO
    handleImgChange(name) {
      this[name] = true
      this.isGetImage = true
    },
    pickImg(data) {
      this.form.logo = data.url
      this.imgDialog = false
    },
    pickImgLoginBg(data) {
      this.form.background = data.url
      this.imgDialogLoginBg = false
    },
    closeImgDialog(name) {
      this[name] = false
    }
  }
}
</script>

<style lang="scss"></style>
