<template>
  <el-card
    shadow="never"
    header="账号信息"
  >
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      label-width="100px"
    >
      <div class="section-body">
        <el-form-item label="账户">
          {{ id }}
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="form.username"
            type="text"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="头像">
          <imgBox
            :img-url="form.head_portrait"
            inline
            @click="handleImgChange"
          />
          <imgPicker
            :dialog-visible="imgDialog"
            :sc-status="isGetImage"
            @chooseImg="pickImg"
            @closeImgDialog="closeImgDialog"
          />
        </el-form-item>

        <template v-if="change_pwd">
          <el-form-item label="修改密码">
            <el-input
              v-model="form.pwd"
              :type="new_input_type"
              style="width: 300px"
              placeholder="请输入新密码"
            >
              <i
                slot="suffix"
                title="隐藏密码"
                style="cursor: pointer"
                class="el-icon-view"
                @click="changeNewPass"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input
              v-model="form.repwd"
              :type="input_type"
              style="width: 300px"
              placeholder="请输入确认密码"
            >
              <i
                slot="suffix"
                title="隐藏密码"
                style="cursor: pointer"
                class="el-icon-view"
                @click="changePass"
              />
            </el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="修改密码">
            <span
              class="frm-tips"
            >超级管理员需通过商派账号中心进行
              <a
                href="https://account.shopex.cn/account/security"
                target="_blank"
              >修改密码</a></span>
          </el-form-item>
        </template>
      </div>
      <div class="section-footer content-center">
        <el-button
          type="primary"
          :loading="loading"
          @click="onSubmit"
        >
          保存
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
  data () {
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
  mounted () {
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
    onSubmit () {
      const that = this
      this.loading = true
      updateAdminInfo(this.form).then((response) => {
        if (response.data.data) {
          this.$message({
            message: '更新成功',
            type: 'success',
            onClose () {
              that.loading = false
              that.$router.go(-1)
            }
          })
        }
      })
    },
    changeNewPass () {
      var new_type = this.new_input_type == 'text' ? 'password' : 'text'
      this.new_input_type = new_type
    },
    changePass () {
      var type = this.input_type == 'text' ? 'password' : 'text'
      this.input_type = type
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
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.form.head_portrait = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
    }
  }
}
</script>

<style lang="scss"></style>
