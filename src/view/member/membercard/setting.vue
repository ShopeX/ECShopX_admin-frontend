<template>
  <div class="clearfix">
    <div class="form-view clearfix">
      <section
        id="formView"
        class="section section-white card_preview_area member_card"
      >
        <div class="msg_card_section shop">
          <div
            class="shop_panel"
            :style="{
              backgroundColor: form.color,
              backgroundImage: 'url(' + (wximageurl + form.background_pic_url) + ')'
            }"
          >
            <div class="mask" />
            <div class="logo_area">
              <span class="logo">
                <img :src="wximageurl + form.logo_url">
              </span>
              <p>{{ form.brand_name }}</p>
              <p
                id="js_title_preview"
                class="card_name"
              >
                {{ form.title }}
              </p>
              <span class="qrcode" />
            </div>
            <div class="msg_area">
              <span class="member_number">0268 8888 8888</span>
              <span class="icon_info"><i class="el-icon-warning" /></span>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="form-wrapper">
      <section class="section section-white">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="110px"
          label-position="left"
        >
          <!-- <div class="section-header with-border">
            <h3>会员卡基本信息</h3>
          </div> -->
          <div
            class="section-body"
            prop="logo_url"
          >
            <!-- <el-form-item label="商户logo">
              <div class="logo-box">
                <div class="bran-img">
                  <img :src="wximageurl + form.logo_url">
                </div>
                <el-upload class="upload-demo" action="" :show-file-list="false" :auto-upload="false" :on-change="handleChange">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </el-form-item> -->
            <!-- <el-form-item label="商户自定义会员卡背景图">
              <div class="logo-box">
                <div class="bran-img">
                  <img :src="wximageurl + form.background_pic_url">
                </div>
                <el-upload class="upload-demo" action="" :show-file-list="false" :auto-upload="false" :on-change="bgimgUpload">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </el-form-item> -->
            <el-form-item label="商户logo">
              <div>
                <div
                  class="upload-box"
                  @click="handleImgChange"
                >
                  <HoverDelete
                    v-if="form.logo_url"
                    @delete="form.logo_url = ''"
                  >
                    <img
                      v-if="form.logo_url"
                      :src="wximageurl + form.logo_url"
                      class="avatar"
                    >
                  </HoverDelete>
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  />
                </div>
              </div>
              <imgPicker
                :dialog-visible="imgDialog"
                :sc-status="isGetImage"
                @chooseImg="pickImg"
                @closeImgDialog="closeImgDialog"
              />
            </el-form-item>

            <el-form-item label="商户自定义会员卡背景图">
              <div>
                <div
                  class="upload-box"
                  @click="handleImgBgChange"
                >
                  <HoverDelete
                    v-if="form.background_pic_url"
                    @delete="form.background_pic_url = ''"
                  >
                    <img
                      :src="wximageurl + form.background_pic_url"
                      class="avatar"
                    >
                  </HoverDelete>
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  />
                </div>
                （建议尺寸：400px * 250px）
              </div>
              <imgPicker
                :dialog-visible="imgBgDialog"
                :sc-status="isGetImageBg"
                @chooseImg="pickBgImg"
                @closeImgDialog="closeBgImgDialog"
              />
            </el-form-item>

            <el-form-item
              label="商户名称"
              prop="brand_name"
            >
              <el-input
                v-model="form.brand_name"
                placeholder="字数上限为12个汉字"
                style="width: 240px"
                :maxlength="12"
              />&nbsp;<span class="frm-tips">{{ form.brand_name.length }}/12</span>
            </el-form-item>
            <el-form-item
              label="会员卡标题"
              prop="title"
            >
              <el-input
                v-model="form.title"
                placeholder="字数上限为9个汉字"
                style="width: 240px"
                :maxlength="9"
              />&nbsp;<span class="frm-tips">{{ form.title.length }}/9</span>
              <p class="frm-tips">
                卡券名，字数上限为9个汉字(建议涵盖卡券属性、服务及金额)。
              </p>
            </el-form-item>
            <el-form-item
              label="卡券颜色"
              prop="color"
              style="margin-bottom: 0"
            >
              <el-color-picker v-model="form.color" />
            </el-form-item>
            <!-- <el-form-item label="券面码型">
              <el-row style="padding-left: 1.5%;" class="code-item">
                <el-col :span="4" class="code-type">
                  <el-radio v-model="form.code_type" label="CODE_TYPE_QRCODE">二维码</el-radio>
                  <div class="sub-item">
                    <p class="frm-tips">扫码或输码后可销券</p>
                    <div class="frm-demo-img">
                      <img :src="qrcodeImg" />
                     </div>
                   </div>
                </el-col>
                <el-col :span="4" class="code-type">
                  <el-radio v-model="form.code_type" label="CODE_TYPE_BARCODE">条形码</el-radio>
                  <div class="sub-item">
                    <p class="frm-tips">扫码或输码后可销券</p>
                    <div class="frm-demo-img">
                      <img :src="barcodeImg" />
                    </div>
                  </div>
                </el-col>
                <el-col :span="4" class="code-type">
                  <el-radio v-model="form.code_type" label="CODE_TYPE_TEXT">仅卡券号</el-radio>
                  <div class="sub-item">
                    <p class="frm-tips">输码后可销券</p>
                    <div class="frm-demo-img">
                      <img :src="phoneImg" />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-form-item> -->
          </div>
          <div class="section-footer with-border">
            <el-button
              type="primary"
              @click="submitForm('form')"
            >
              保存
            </el-button>
          </div>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script>
import { getMemberCardDetail, setMemberCard } from '../../../api/membercard'
import { pushNewsImage } from '../../../api/wechat'
import imgPicker from '../../../components/imageselect'
var dimg = require('@/assets/img/demo-img.jpg')
var qr = require('@/assets/img/dispose1.jpg')
var bar = require('@/assets/img/dispose2.jpg')
var phone = require('@/assets/img/dispose3.jpg')
export default {
  components: {
    imgPicker
  },
  data () {
    return {
      logo_url: '',
      submitDisabled: false,
      demoimg: dimg,
      qrcodeImg: qr,
      barcodeImg: bar,
      phoneImg: phone,
      form: {
        logo_url: '',
        background_pic_url: '',
        brand_name: '',
        title: '',
        color: '#409EFF',
        code_type: 'CODE_TYPE_QRCODE'
      },
      rules: {
        logo_url: [{ required: true, message: '请选择商户logo', trigger: 'blur' }],
        brand_name: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
        title: [{ required: true, message: '请输入会员卡标题', trigger: 'blur' }],
        title: [
          {
            required: true,
            max: 9,
            message: '卡券名称不能为空且长度不超过9个汉字或18个英文字母',
            trigger: 'blur'
          }
        ],
        color: [{ required: true, message: '请选择卡券颜色', trigger: 'blur' }]
      },
      imgDialog: false,
      isGetImage: false,
      imgBgDialog: false,
      isGetImageBg: false
    }
  },
  mounted () {
    getMemberCardDetail().then((res) => {
      if (res.data.data.brand_name) {
        this.form = res.data.data
      }
    })
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitDisabled = true
          let params = this.form
          setMemberCard(params).then((res) => {
            if (res.data.data) {
              this.submitDisabled = false
              this.$message.success('设置成功')
            }
          })
        } else {
          return false
        }
      })
    },
    // bgimgUpload (file, fileList) {
    //   this.form.background_pic_url = file.url
    //   if (file && file.raw) {
    //       if (file.raw.type != 'image/jpeg' && file.raw.type != 'image/png') {
    //         this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
    //         return
    //       }
    //       if (file.raw.size/1024/1024 > 1) {
    //         this.$message.error('上传头像图片大小不能超过 1MB!')
    //         return
    //       }
    //   }

    //   let params = {isUploadFile: true, file: file.raw}
    //   pushNewsImage(params).then(res => {
    //     this.form.background_pic_url = res.data.data.url
    //   })
    // },
    // handleChange (file, fileList) {
    //   this.logo_url = file.url
    //   if (file && file.raw) {
    //       if (file.raw.type != 'image/jpeg' && file.raw.type != 'image/png') {
    //         this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
    //         return
    //       }
    //       if (file.raw.size/1024/1024 > 1) {
    //         this.$message.error('上传头像图片大小不能超过 1MB!')
    //         return
    //       }
    //   }

    //   let params = {isUploadFile: true, file: file.raw}
    //   pushNewsImage(params).then(res => {
    //     this.form.logo_url = res.data.data.url
    //   })
    // },
    //商户logo
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.form.logo_url = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
    },
    //商户自定义会员卡背景图
    handleImgBgChange () {
      this.imgBgDialog = true
      this.isGetImageBg = true
    },
    pickBgImg (data) {
      this.form.background_pic_url = data.url
      this.imgBgDialog = false
    },
    closeBgImgDialog () {
      this.imgBgDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
.form-view {
  float: left;
  width: 320px;
}
#formView {
  width: 320px;
}
.list {
  margin: 0 10px;
  border-bottom: 1px solid #e7e7eb;
}
.form-wrapper {
  display: flow-root;
  min-width: 612px;
  margin-left: 20px;
  float: left;
}
.msg_card_section.shop {
  margin: 0;
  padding: 0;
  border-bottom: 1px dashed #e7e7eb;
  position: relative;
  background-color: #fff;
  border-radius: 5px 5px 0 0;
  -moz-border-radius: 5px 5px 0 0;
  -webkit-border-radius: 5px 5px 0 0;
}
.member_card {
  background-image: none;
  border: 1px solid #e7e7eb;
  padding: 10px;
}
.card_preview_area {
  float: left;
  width: 318px;
  padding-bottom: 300px;
  overflow: hidden;
}
.member_card .shop {
  padding: 80px 26px 10px;
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  border-bottom: 0;
  background: #fff url(../../../assets/img/topbar.png) no-repeat 0 5px;
  background-size: contain;
}
.msg_card_section.shop .shop_panel {
  padding: 21px 12px 12px;
  min-height: 137px;
  height: auto;
  text-align: center;
}
.member_card .shop .shop_panel {
  background-color: #fff;
  border-radius: 12px;
  -moz-border-radius: 12px;
  -webkit-border-radius: 12px;
  text-align: left;
  padding: 0 0 10px;
  overflow: hidden;
  position: relative;
  background-size: 100% 100%;
  background-size: cover;
  background-position: top center;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: alpha(opacity = 75);
  -moz-opacity: 0.75;
  -khtml-opacity: 0.75;
  opacity: 0.75;
  background-color: #000;
  z-index: 9998;
}
.member_card .mask {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: rgba(0, 0, 0, 0.6);
  background: -moz-linear-gradient(top, rgba(0, 0, 0, 0.6) 0, rgba(0, 0, 0, 0.2) 100%);
  background: -webkit-gradient(
    left top,
    left bottom,
    color-stop(0%, rgba(0, 0, 0, 0.6)),
    color-stop(100%, rgba(0, 0, 0, 0.2))
  );
  background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.6) 0, rgba(0, 0, 0, 0.2) 100%);
  background: -ms-linear-gradient(top, rgba(0, 0, 0, 0.6) 0, rgba(0, 0, 0, 0.2) 100%);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0, rgba(0, 0, 0, 0.2) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000',endColorstr='#000000',GradientType=0);
}
.card_preview_area .logo_area {
  position: relative;
  margin-bottom: 7px;
  line-height: 42px;
  color: #8d8d8d;
  margin-top: -40px;
}
.member_card .shop .logo_area {
  margin: 0;
  padding: 24px 20px 12px 66px;
  text-align: left;
  line-height: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: bolder;
  text-shadow: 1px 1px 3px #666;
}
.logo {
  float: left;
  padding-top: 10px;
  font-size: 24px;
}
.card_preview_area .logo {
  display: block;
  width: 38px;
  height: 38px;
  padding-top: 0;
  margin: 0 auto;
  border-radius: 22px;
  -moz-border-radius: 22px;
  -webkit-border-radius: 22px;
  float: none;
  border: 1px solid #e7e7eb;
  background-color: #fff;
}
.card_preview_area .logo img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  -moz-border-radius: inherit;
  -webkit-border-radius: inherit;
}
.card_preview_area .msg_card_cell {
  background-color: #fff;
}
.member_card .shop .logo {
  position: absolute;
  width: 38px;
  height: 38px;
  top: 24px;
  left: 20px;
}
.member_card .shop .card_name {
  font-size: 14px;
  font-weight: bold;
}
.member_card .shop .qrcode {
  width: 36px;
  height: 36px;
  background: url(/mpres/zh_CN/htmledition/comm_htmledition/style/page/cardticket/member_card_control_z331295.png)
    0 -147px no-repeat;
  position: absolute;
  top: 26px;
  right: 20px;
}
.member_card .msg_area {
  padding: 2px 20px 10px;
  margin-top: 30px;
  position: relative;
}
.member_card .msg_area .member_number {
  font-size: 17px;
  font-family: menlo, tahoma;
  text-shadow: 1px 1px 2px #666;
  line-height: 18px;
  color: #fff;
}
.member_card .msg_area .icon_info {
  display: inline-block;
  width: 18px;
  height: 18px;
  float: right;
  color: #fff;
  font-size: 16px;
}
.msg_card_cell.quick_pay {
  line-height: 14px;
  text-align: center;
}
.quick_pay {
  height: auto;
  padding: 17px 0 30px;
  border-top: 0;
  border-bottom: 1px solid #e7e7eb;
}
.quick_pay .btn_card_preview {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  border-width: 1px;
  border-style: solid;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  -ms-border-radius: 6px;
  border-radius: 6px;
  width: 136px;
  color: rgb(85, 189, 71);
}
.msg_card_cell.last_cell .list {
  border-bottom-width: 0;
}

.member_card .msg_card_cell {
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
}
.msg_card_cell.custom_detail {
  margin-top: 1em;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
}
.msg_card_section {
  position: relative;
}
.list li .li_panel {
  display: block;
  padding: 11px 30px 11px 0;
  border-bottom: 1px solid #e7e7eb;
}
.list li .li_panel [class^='el-icon'] {
  position: absolute;
  top: 36%;
  right: 5px;
  width: 16px;
  height: 15px;
  color: #ccc;
}
.list li .supply_area {
  color: #8d8d8d;
  float: right;
}
.list {
  padding: 0 10px;
  font-size: 14px;
  background: #fff;
  .list-content {
    padding: 11px 10px;
    border-bottom: 1px solid #e7e7eb;
    .el-icon-arrow-right {
      text-align: right;
      color: #8d8d8d;
    }
  }
}
.card-edit-detail {
  background: #fff;
  input {
    width: 30%;
  }
}
.bran-img {
  display: inline-block;
  vertical-align: top;
  img {
    margin-right: 1em;
    width: 80px;
    height: 80px;
  }
}
.brand-name {
  display: inline-block;
  vertical-align: top;
}
.upload-preview {
  display: block;
  margin-top: 10px;
  img {
    max-width: 100px;
    max-height: 100px;
  }
}
a.img-wrap {
  display: inline-block;
  vertical-align: top;
  cursor: zoom-in;
  img {
    max-width: 380px;
  }
}

.custom-enter-box {
  .enter-title {
    height: 34px;
    line-height: 34px;
    margin-bottom: 20px;
    font-size: 14px;
    border-bottom: 1px solid #e6e9eb;
  }
  .delete-enter-item {
    float: right;
  }
}
.tool-bar {
  padding: 20px 0;
}
.border {
  border-top: 1px solid #d9dadc;
}
.option-text {
  float: right;
}
.section-footer {
  padding: 15px 10px;
  text-align: center;
  .with-border {
    border-top: 1px solid #f8f8f8;
  }
}
.card_article_box .card_article_img {
  background-color: #fff;
}
.sub-item {
  padding-left: 1.7em;
}
.frm-demo-img {
  width: 144px;
  height: 80px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #e7e7eb;
  text-align: center;
  overflow: hidden;
  img {
    max-width: 100%;
    margin: 0 auto;
  }
}
.appmsg_card {
  max-width: 360px;
}
.appmsg {
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid #e7e7eb;
  background-color: #fff;
  color: #8d8d8d;
}
.appmsg_content {
  position: relative;
}
.appmsg_info {
  font-size: 13px;
  line-height: 20px;
  margin: 0 14px;
  padding: 12px 0;
  border-bottom: 1px solid #e7e7eb;
}
.appmsg_item {
  position: relative;
  padding: 12px 14px;
  .appmsg_title {
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 1.6;
    overflow: hidden;
    word-break: break-all;
    word-wrap: break-word;
    color: #222;
  }
  .appmsg_desc {
    padding: 5px 0 10px;
    word-break: break-all;
    word-wrap: break-word;
  }
  &:hover {
    .edit_mask {
      display: block;
    }
  }
}
.edit_mask {
  display: none;
  font-size: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  z-index: 1;
  text-align: center;
  padding: 14px;
  .edit_mask_content {
    display: flex;
    justify-content: center;
    align-itmes: center;
    font-size: 14px;
  }
}

.media_edit {
  display: block;
  position: relative;
  z-index: 2;
  float: none;
  min-width: 800px;
  margin-left: 340px;
}
.custom-item {
  text-align: center;
  font-size: 18px;
  border-right: 1px solid #e7e7eb;
  .frm-tips {
    font-size: 12px;
  }
  &:last-child {
    border-right: 0;
  }
}
.code-item {
  max-width: 612px;
  .code-type {
    width: 33%;
  }
}
.color-green,
.color-green a {
  color: #55bd47;
}
.tips {
  margin-left: 2px;
}
</style>
<style type="text/css" lang="scss">
.color-group {
  .el-radio-button__inner {
    border-left: 1px solid #bfcbd9;
    margin-left: -1px;
    margin-bottom: 10px;
    border-radius: 0;
  }
}
.upload-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  width: 150px;
  height: 150px;
  .avatar {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .avatar-uploader-icon {
    width: 100%;
    height: 100%;
    line-height: 150px;
    text-align: center;
  }
  .avatar-uploader-icon {
    font-size: 38px;
  }
}
</style>
