<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card shadow="never" :header="$t('b0145cf3.53cab4')">
    <el-form ref="form" :model="form" label-position="left" label-width="100px">
      <div class="section-body">
        <el-form-item :label="$t('b0145cf3.7116e7')">
          {{ id }}
        </el-form-item>
        <el-form-item :label="$t('b0145cf3.23eb0e')">
          <el-input v-model="form.username" type="text" style="width: 300px" />
        </el-form-item>
        <el-form-item :label="$t('b0145cf3.4c50ee')">
          <imgBox :img-url="form.head_portrait" inline @click="handleImgChange" />
          <imgPicker
            :dialog-visible="imgDialog"
            :sc-status="isGetImage"
            @chooseImg="pickImg"
            @closeImgDialog="closeImgDialog"
          />
        </el-form-item>

        <template v-if="change_pwd">
          <el-form-item :label="$t('b0145cf3.7fc88a')">
            <el-input
              v-model="form.pwd"
              :type="new_input_type"
              style="width: 300px"
              :placeholder="$t('b0145cf3.abdd7e')"
            >
              <i
                slot="suffix"
                :title="$t('b0145cf3.dd909a')"
                style="cursor: pointer"
                class="el-icon-view"
                @click="changeNewPass"
              />
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('b0145cf3.3fbdde')">
            <el-input
              v-model="form.repwd"
              :type="input_type"
              style="width: 300px"
              :placeholder="$t('b0145cf3.a7a9a2')"
            >
              <i
                slot="suffix"
                :title="$t('b0145cf3.dd909a')"
                style="cursor: pointer"
                class="el-icon-view"
                @click="changePass"
              />
            </el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item :label="$t('b0145cf3.7fc88a')">
            <span class="frm-tips"
              >{{ $t('b0145cf3.3d509c') }}
              <a href="https://account.shopex.cn/account/security" target="_blank">{{
                $t('b0145cf3.7fc88a')
              }}</a></span
            >
          </el-form-item>
        </template>
      </div>
      <div class="section-footer content-center">
        <el-button type="primary" :loading="loading" @click="onSubmit">
          {{ $t('b0145cf3.be5fbb') }}
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import { getAdminInfo, updateAdminInfo } from '@/api/login'
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
      change_pwd: false,
      loading: false,
      id: '',
      form: {
        username: '',
        head_portrait: '',
        pwd: '',
        repwd: '',
        logintype: ''
      },
      pic: '',
      fileList: [],
      imgDialog: false,
      isGetImage: false,
      input_type: 'password',
      new_input_type: 'password'
    }
  },
  mounted() {
    getAdminInfo().then((res) => {
      console.log(res.data.data.logintype)
      if (res.data.data.logintype == 'admin') {
        this.change_pwd = false
      } else {
        this.change_pwd = true
      }
      this.form.head_portrait = res.data.data.head_portrait
      this.form.username = res.data.data.username
      this.form.logintype = res.data.data.logintype
      this.id = res.data.data.mobile
    })
  },
  methods: {
    onSubmit() {
      const that = this
      this.loading = true
      updateAdminInfo(this.form).then((response) => {
        if (response.data.data) {
          this.$message({
            message: this.$t('b0145cf3.55aa63'),
            type: 'success',
            onClose() {
              that.loading = false
              that.$router.go(-1)
            }
          })
        }
      })
    },
    changeNewPass() {
      var new_type = this.new_input_type == 'text' ? 'password' : 'text'
      this.new_input_type = new_type
    },
    changePass() {
      var type = this.input_type == 'text' ? 'password' : 'text'
      this.input_type = type
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
    handleImgChange() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      this.form.head_portrait = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    }
  }
}
</script>

<style lang="scss"></style>
