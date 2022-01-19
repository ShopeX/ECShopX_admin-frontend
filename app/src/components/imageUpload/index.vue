<template>
  <div class="cpnUploadPicture">
    <div class="upload-box">
      <el-upload
        v-loading="loading"
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload"
      >
        <i class="iconfont el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <!-- <div class="row">
        <span>{{title}}</span>
        <el-tooltip v-if="content" :style="{'margin-left':10+'px'}" :content="content" placement="right-end" effect="light">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </div> -->
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    content: {
      type: String
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      loading: ''
    }
  },
  mounted() {},
  methods: {
    // 自定义上传
    handleUpload: function (e) {
      console.log('========');
      console.log(e)
      console.log(e.file)
      console.log(this.type)

      this.$api.adapay
        .uploadPic({
          file: e.file,
          file_type: this.type,
          isUploadFile: true
        })
        .then(
          (res) => e.onSuccess(res),
          (err) => e.onError(err)
        )
        .catch((err) => {
          this.loading = false;
          this.$message.error('请重新上传')
        })

      // 上传
      // upload.uploadImg(e.file, e.file.name)
      // .then(res => e.onSuccess(res), err => e.onError(err))
      // .catch(err => e.onError(err))
    },
    uploadHandle(val) {
      console.log(val)
    },
    handleAvatarSuccess(res, file) {
      this.$emit('successHandle', res.data.data)
      this.loading = false
    },
    beforeAvatarUpload(file) {
      this.loading = true
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
        return  this.loading = false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
          return  this.loading = false
      } 
    }
  }
}
</script>



<style lang="scss">
.cpnUploadPicture {
  .el-icon-warning-outline {
    font-size: 18px;
  }
  .el-loading-mask {
    top: 5px;
    left: 5px;
  }
  .row {
    text-align: center;
  }
  .clearfix span {
    font-weight: 700;
  }
  label {
    font-size: 12px;
    color: #000;
  }
  .avatar-uploader {
    width: 140px;
    height: 140px;
  }
  .avatar-uploader .el-upload {
    border: 2px dashed #ccc;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    i {
      font-size: 30px;
      font-weight: 700;
      color: #888;
    }
    img {
      width: 100%;
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .avatar {
    width: 140px;
    height: 140px;
    display: block;
  }
}
</style>