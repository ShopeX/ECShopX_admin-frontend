<template>
  <section class="section section-white">
    <el-form ref="form" :model="form" label-width="100px" label-position="left">
      <div class="section-header with-border">创建商品</div>
      <div class="section-body">
        <el-form-item label="物品名称">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input v-model="form.thing_name" type="text" placeholder="" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="官方售价">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input v-model="form.price" type="number" placeholder="" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="物品图片" prop="ad_pic">
          <p class="frm-tips">点击图片可更换，图片大小不能超过 2MB</p>
          <div>
            <div class="upload-box" @click="handleImgChange">
              <img v-if="form.pic" :src="wximageurl + form.pic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </div>
          </div>
          <imgPicker
            :dialog-visible="imgDialog"
            :sc-status="isGetImage"
            @chooseImg="pickImg"
            @closeImgDialog="closeImgDialog"
          />
        </el-form-item>
        <el-form-item label="物品详情">
          <el-row :gutter="20">
            <el-col :span="20">
              <vue-html5-editor
                ref="editor"
                :content="form.intro"
                :height="360"
                @change="updateContent"
              />
              <span class="tpl_item img" style="" @click="addImgPreview">
                <i class="iconfont icon-image" />图片
              </span>
              <imgPicker
                :dialog-visible="thumbDialog"
                :sc-status="isGetThumb"
                @chooseImg="pickThumb"
                @closeImgDialog="closeThumbDialog"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="default" @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="submitThingsAction"> 保存 </el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import { Message } from 'element-ui'
import imgPicker from '../../../components/imageselect'
import { getThingsDetail, createThings, updateThings } from '../../../api/onecode'
import { uploadMaterial } from '../../../api/wechat'
export default {
  components: {
    imgPicker
  },
  data() {
    return {
      imgDialog: false,
      isGetImage: false,

      thumbDialog: false,
      isGetThumb: false,

      form: {
        thing_id: '',
        thing_name: '',
        price: '',
        pic: '',
        intro: ''
      }
    }
  },
  mounted() {
    if (this.$route.query.thing_id) {
      // 初始化门店数据
      getThingsDetail(this.$route.query.thing_id)
        .then((response) => {
          console.log(response)
          let thingsDetailData = response.data.data

          this.form.thing_id = thingsDetailData.thing_id
          this.form.thing_name = thingsDetailData.thing_name
          this.form.price = thingsDetailData.price / 100
          this.form.pic = thingsDetailData.pic
          this.form.intro = thingsDetailData.intro
          console.log(this.form)
        })
        .catch((error) => {
          this.$router.push({ path: '/brand/onecode' })
        })
    }
  },
  methods: {
    // 物品图片
    handleImgChange: function () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg: function (data) {
      this.form.pic = data.url
      this.imgDialog = false
    },
    closeImgDialog: function () {
      this.imgDialog = false
    },
    // 图文详情中的图片
    addImgPreview: function () {
      this.thumbDialog = true
      this.isGetThumb = true
    },
    pickThumb: function (data) {
      if (data && data.url !== '') {
        this.thumbDialog = false
        var index = this.$refs.editor.$el.id
        var loc = this.$refs.editor
        var img = new Image()
        img.src = this.wximageurl + data.url
        if (loc.range) {
          loc.range.insertNode(img)
        } else {
          loc.$refs.content.appendChild(img)
          loc.focus()
          loc.restoreSelection()
        }
        this.form.intro = loc.$refs.content.innerHTML
      }
    },
    closeThumbDialog: function () {
      this.thumbDialog = false
    },
    updateContent: function (data) {
      this.form.intro = data
    },
    handlePicChange: function (file, fileList) {
      let that = this
      if (file && file.raw) {
        if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
          that.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
        }
        if (file.raw.size / 1024 / 1024 > 5) {
          that.$message.error('上传图片大小不能超过 5MB!')
        }
      }

      let params = { isUploadFile: true, file: file.raw, type: 'image' }
      uploadMaterial(params).then((res) => {
        file.url = this.wximageurl + res.data.data.url
        that.form.pic = res.data.data.url
      })
    },
    submitThingsAction: function () {
      // 提交商品
      if (this.form.thing_id) {
        updateThings(this.form.thing_id, this.form)
          .then((response) => {
            this.$router.push({ path: '/brand/onecode' })
          })
          .catch((error) => {
            console.log(error)
            this.$message({
              type: 'error',
              message: '更新物品信息出错'
            })
          })
      } else {
        createThings(this.form)
          .then((response) => {
            console.log(response)
            this.$router.push({ path: '/brand/onecode' })
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: '保存物品信息出错'
            })
          })
      }
    },
    handleCancel: function () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-uploader-icon {
  font-size: 48px;
}
.pics-box {
  .upload-box {
    .avatar-uploader-icon {
      width: 140px;
      height: 140px;
      line-height: 140px;
    }
    .avatar-uploader-icon {
      font-size: 38px;
    }
  }
}
.pics-list {
  display: inline-block;
  .pics-item {
    position: relative;
    overflow: hidden;
    display: inline-block;
    border-radius: 5px;
    margin-right: 10px;
    .bg-mask {
      position: absolute;
      bottom: -140px;
      width: 140px;
      height: 140px;
      line-height: 140px;
      text-align: center;
      transition: 0.4s;
      background: rgba(0, 0, 0, 0.7);
    }
    .icon {
      color: #999;
      font-size: 26px;
      cursor: pointer;
      margin: 0 3px;
    }
    .icon:hover {
      color: #fff;
    }
    &:hover {
      .bg-mask {
        bottom: 0;
      }
    }
  }
  img {
    width: 140px;
    height: 140px;
    vertical-align: middle;
  }
}
.upload-box {
  display: inline-block;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}
.tpl_item {
  display: inline-block;
  border: 1px solid #ddd;
  background-color: #fff;
  text-align: left;
  padding: 0 5px;
  line-height: 36px;
  cursor: pointer;
  border-radius: 5px;
}
.tpl_item .fa {
  width: 12px;
  height: 22px;
  vertical-align: middle;
  display: inline-block;
  margin-right: 1em;
  font-size: 20px;
  text-align: center;
}
.vue-html5-editor {
  vertical-align: top;
  display: inline-block;
}
</style>
