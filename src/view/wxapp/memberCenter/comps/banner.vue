<template>
  <div>
    <el-form ref="form" :model="form" label-position="left" label-width="160px">
      <div class="section-body">
        <el-form-item label="未登录BANNER：">
          <imgBox
            :img-url="form.data.no_login_banner"
            inline
            @click="handleImgChange('no_login')"
          />
        </el-form-item>
        <el-form-item label="已登录BANNER：">
          <imgBox :img-url="form.data.login_banner" inline @click="handleImgChange('login')" />
        </el-form-item>
        <el-form-item label="会员中心是否展示：">
          <el-switch v-model="form.data.is_show" />
        </el-form-item>
        <div v-if="$route.path.indexOf('aliapp') === -1">
          <el-form-item label="外部链接是否开启：">
            <el-switch v-model="form.data.url_is_open" />
          </el-form-item>
          <el-form-item label="外部链接小程序appid：">
            <el-input v-model="form.data.app_id" type="text" style="width: 300px" />
          </el-form-item>
          <el-form-item label="外部链接路径：">
            <el-input v-model="form.data.page" type="text" style="width: 300px" />
          </el-form-item>
        </div>
      </div>
      <div class="section-footer content-center">
        <el-button v-loading="loading" type="primary" @click="saveConfig"> 保存 </el-button>
      </div>
    </el-form>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'
import { savePageParams, getParamByTempName } from '@/api/wxa'
import { saveALiPageParams, getALiParamByTempName } from '@/api/ali'
export default {
  components: {
    imgPicker,
    imgBox
  },
  data() {
    return {
      activeName: 'banner',
      loading: false,
      form: {
        name: 'base',
        data: {
          no_login_banner: '',
          login_banner: '',
          is_show: false,
          url_is_open: false,
          app_id: '',
          page: ''
        }
      },
      textarea: '',
      pic: '',
      remnant: 0,
      fileList: [],
      imgDialog: false,
      isGetImage: false,
      pickerImgType: 'no_login'
    }
  },
  computed: {
    ...mapGetters(['wheight', 'wwidth', 'template_name', 'ali_template_name'])
  },
  mounted() {
    let filter = {
      template_name:
        this.$route.path.indexOf('aliapp') === -1 ? this.template_name : this.ali_template_name,
      version: 'v1.0.1',
      page_name: 'member_center_setting'
    }
    if (this.$route.path.indexOf('aliapp') === -1) {
      getParamByTempName(filter).then(res => {
        if (res.data.data.list.length !== 0) {
          if (typeof res.data.data.list[0].params.data != 'undefined') {
            this.form = res.data.data.list[0].params
          }
        }
      })
    } else {
      getALiParamByTempName(filter).then(res => {
        if (res.data.data.list.length !== 0) {
          if (typeof res.data.data.list[0].params.data != 'undefined') {
            this.form = res.data.data.list[0].params
          }
        }
      })
    }
  },
  methods: {
    handleClick(tab, event) {},
    // 保存设置
    saveConfig() {
      let param = {
        template_name:
          this.$route.path.indexOf('aliapp') === -1 ? this.template_name : this.ali_template_name,
        config: JSON.stringify([this.form]),
        page_name: 'member_center_setting'
      }
      if (this.$route.path.indexOf('aliapp') === -1) {
        savePageParams(param).then(res => {
          if (res.data.data.status) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
        })
      } else {
        saveALiPageParams(param).then(res => {
          if (res.data.data.status) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
        })
      }
    },
    countInput() {
      this.remnant = this.form.intro.length
    },
    //门店LOGO
    handleImgChange(pickerImgType) {
      this.pickerImgType = pickerImgType
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      if (this.pickerImgType == 'no_login') {
        this.form.data.no_login_banner = data.url
      } else {
        this.form.data.login_banner = data.url
      }
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    }
  }
}
</script>

<style lang="scss"></style>
