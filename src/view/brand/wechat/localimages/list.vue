<template>
  <div class="localimg_pick_panel section-white">
    <div class="upload_box">
      <el-upload
        class="upload-demo"
        :multiple="true"
        action=""
        accept="image/jpeg,image/png,image/gif"
        :show-file-list="false"
        :http-request="handleUpload"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
        :on-error="uploadError"
      >
        <el-button type="primary"> 本地上传 </el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
      </el-upload>
    </div>
    <div v-loading="loading" class="localimg_pick">
      <ul class="clearfix">
        <li v-for="(item, index) in localimagesList.list" :key="index" class="localimg_item">
          <div class="localimg_item_bd">
            <img class="pic" :src="item.image_full_url">
            <div class="check_content">
              <span class="localimg_name" :title="item.image_name">{{ item.image_name }}</span>
            </div>
          </div>
          <div class="msg_card">
            <el-row>
              <el-col :span="12">
                <div class="opr_item" @click="removeItem(item, index)">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <i class="el-icon-delete" />
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="copy-url">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.image_full_url"
                    placement="top"
                  >
                    <i
                      v-clipboard:copy="item.image_full_url"
                      v-clipboard:success="onCopySuccess"
                      class="el-icon-document-copy"
                    />
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
        </li>
      </ul>
    </div>
    <div class="tc">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 50]"
        :total="localimagesList.total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import { validatUploadImage } from '../../../../utils/validate'
import UploadUtil from '../../../../utils/uploadUtil'
import {
  getUploadQiniuPicToken,
  uploadQiniuPic,
  getUploadPic,
  getQiniuPicList,
  deleteImage
} from '../../../../api/qiniu'
export default {
  mixins: [mixin],
  props: ['activeName', 'getStatus'],
  data() {
    return {
      actionPath: 'https://upload-z2.qiniup.com',
      image_prefix: '',
      postData: {
        token: '',
        key: '',
        fname: ''
      },
      loading: false,
      isLoadData: false,
      localimagesList: {},
      params: {
        page: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    getStatus(newV, oldV) {
      if (newV) {
        this.params = { page: 1, pageSize: this.params.pageSize }
        this.getList()
      }
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return
      }

      this.postData.fname = file.name

      let tokenParams = { filename: file.name, filesystem: 'qiniu' }
      // return getUploadQiniuPicToken(tokenParams).then(response => {
      //   this.postData.token = response.data.data.token
      //   this.postData.key = response.data.data.key
      //   this.image_prefix = response.data.data.domain
      //   this.actionPath  = `https://upload-${!response.data.data.region ? 'z2' : response.data.data.region}.qiniup.com`
      // })
    },
    handleAvatarSuccess(res, file) {
      let uploadParams = {
        image_cat_id: 2, //图片分类必填,必须为整数
        image_name: file.name, //图片名称必填,不能超过50个字符
        image_url: res.key, //图片链接必填
        // image_full_url: res.height,   //图片完整链接必填
        image_type: file.raw.type, //图片分类长度不能超过20个字符
        storage: 'image' //图片id必填
      }
      // if (res.key) {
      uploadQiniuPic(uploadParams).then((res) => {
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.isLoadData = false
        this.getList()
      })
      // }
    },
    getList() {
      if (!this.isLoadData) {
        this.loading = true
        getQiniuPicList({ ...this.params, storage: 'image' })
          .then((response) => {
            this.localimagesList = response.data.data
            this.isLoadData = true
            this.loading = false
          })
          .catch(function (error) {
            this.loading = false
          })
      }
    },
    handleCurrentChange(page_num) {
      this.isLoadData = false
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.isLoadData = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    removeItem(item, index) {
      this.$confirm('确定删除此图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteImage({ image_id: item.image_id }).then((response) => {
            this.localimagesList.list.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 自定义上传
    handleUpload: function (e) {
      const upload = new UploadUtil()
      // 上传
      upload
        .uploadImg(e.file, e.file.name)
        .then(
          (res) => e.onSuccess(res),
          (err) => e.onError(err)
        )
        .catch((err) => e.onError(err))
    },
    // 上传错误回调
    uploadError: function (e) {
      console.error(e)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-demo {
  margin-bottom: 10px;
}
.localimg_pick_panel {
  .localimg_pick {
    margin-right: -1%;
    .localimg_item {
      margin-bottom: 20px;
      margin-right: 1%;
      border: 1px solid #e7e7eb;
      width: 19%;
    }
    .localimg_item_bd {
      position: relative;
    }
    .pic {
      width: 100%;
      height: 169px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      border-bottom: 1px solid #e7e7eb;
    }
    .check_content {
      width: 100%;
      padding: 0 5px;
    }
    .localimg_name {
      height: 34px;
      line-height: 34px;
      overflow: hidden;
      display: inline-block;
      width: 90%;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.localimg_pick {
  margin-right: -45px;
  .localimg_item {
    float: left;
    text-align: center;
    &:hover {
      -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      -moz-box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
  }
}
.msg_card {
  background-color: #f4f5f9;
  border-top: 1px solid #e7e7eb;
  width: 100%;
  .opr_item,
  .copy-url {
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    color: #999;
    font-size: 16px;
    &:hover {
      color: #333;
    }
  }
  .copy-url {
    border-left: 1px solid #e7e7eb;
  }
}
</style>
