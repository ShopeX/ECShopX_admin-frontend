/* eslint-disable */
<template>
  <el-card shadow="never" header="基本信息">
    <el-form ref="form" :model="form" label-position="left" label-width="100px">
      <div class="section-body">
        <el-form-item label="商城名称">
          <el-input type="text" v-model="form.brand_name" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="商城简介">
          <el-row>
            <el-col :span="18">
              <el-input
                type="textarea"
                :maxlength="120"
                @input="countInput"
                :rows="6"
                placeholder="请输入商城简介"
                v-model="form.intro"
              >
              </el-input>
              <div class="content-right muted">{{ remnant }}/120</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="商城Logo">
          <imgBox :imgUrl="form.logo" inline @click="handleImgChange"></imgBox>
          <imgPicker
            :dialog-visible="imgDialog"
            :sc-status="isGetImage"
            @chooseImg="pickImg"
            @closeImgDialog="closeImgDialog"
          ></imgPicker>
        </el-form-item>
      </div>
      <div class="section-footer content-center">
        <el-button type="primary" v-loading="loading" @click="onSubmit">保存</el-button>
      </div>
    </el-form>
  </el-card>
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
        brand_name: ''
      },
      textarea: '',
      pic: '',
      remnant: 0,
      fileList: [],
      imgDialog: false,
      isGetImage: false
    }
  },
  methods: {
    onSubmit() {
      let params = {}
      this.loading = true

      params = {
        intro: this.form.intro,
        logo: this.form.logo,
        brand_name: this.form.brand_name
      }
      console.log(params)
      putSettingWxShops(params).then((response) => {
        if (response.data.data) {
          this.$message({
            message: '保存门店配置信息成功！',
            type: 'success'
          })
          this.loading = false
        } else {
          this.$message.error('配置门店信息失败，请确认是否正确填写内容！')
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
    //     if (file.raw.size/1024/1024 > 2) {
    //       this.$message.error('上传图片大小不能超过 2MB!')
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
    handleImgChange() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      this.form.logo = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    }
  },
  mounted() {
    getSettingWxShops().then((res) => {
      this.form.logo = res.data.data.logo
      this.pic = this.wximageurl + res.data.data.logo
      this.form.intro = res.data.data.intro
      this.form.brand_name = res.data.data.brand_name
      this.remnant = (res.data.data.intro||"").length
    })
  }
}
</script>

<style lang="scss"></style>
