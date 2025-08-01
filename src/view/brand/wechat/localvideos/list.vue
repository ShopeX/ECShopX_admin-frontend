<template>
  <div class="video_pick_panel section-white">
    <div class="upload_box">
      <el-button type="primary" icon="plus" @click="addVideo"> 上传视频 </el-button>
    </div>
    <div v-loading="loading" class="video_pick">
      <ul class="clearfix">
        <li v-for="(videoitem, index) in localvideosList.list" :key="index" class="video_item">
          <div class="video_item_bd">
            <video class="video-html" :src="videoitem.image_full_url" controls="controls">
              您的浏览器不支持 video 标签。
            </video>
            <div class="check_content">
              <span class="video_name" :title="videoitem.name">{{ videoitem.image_name }}</span>
            </div>
          </div>
          <div class="msg_card">
            <el-row>
              <el-col :span="VERSION_IN_PURCHASE() ? 12 : 24">
                <div class="opr_item" @click="removeItem(videoitem, index)">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <i class="el-icon-delete" />
                  </el-tooltip>
                </div>
              </el-col>
              <el-col v-if="VERSION_IN_PURCHASE()" :span="VERSION_IN_PURCHASE() ? 12 : 24">
                <div class="copy-url">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="videoitem.image_full_url"
                    placement="top"
                  >
                    <i
                      v-clipboard:copy="videoitem.image_full_url"
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
        :total="localvideosList.total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <el-dialog title="上传视频文件" :visible.sync="uploadDialog" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="videoForm" class="demo-ruleForm" label-width="90px">
          <el-form-item label="视频标题">
            <el-col :span="14">
              <el-input v-model="videoForm.title" maxlength="20" />
            </el-col>
          </el-form-item>
          <el-form-item label="视频描述">
            <el-col :span="14">
              <el-input v-model="videoForm.description" maxlength="20" />
            </el-col>
          </el-form-item>
          <el-form-item label="视频文件">
            <el-col :span="14">
              <el-upload
                class="upload-demo"
                :multiple="true"
                action=""
                accept="video/mp4"
                :show-file-list="false"
                :http-request="handleUpload"
                :on-error="uploadError"
                :before-upload="beforeVideoUpload"
                :on-success="handleVideoSuccess"
              >
                <el-button type="primary"> 本地上传 </el-button>
                <div slot="tip" class="el-upload__tip">只能上传mp4文件，且不超过50M</div>
              </el-upload>
            </el-col>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/mixins'
import {
  deleteVideo,
  getQiniuVideoList,
  getUploadQiniuVideoToken,
  uploadQiniuVideo
} from '../../../../api/qiniu'
import UploadUtil from '../../../../utils/uploadUtil'

export default {
  mixins: [mixin],
  props: ['activeName', 'getStatus'],
  data() {
    return {
      actionPath: 'https://upload-z2.qiniup.com',
      uploadDialog: false,
      image_prefix: '',
      postData: {
        token: '',
        key: '',
        fname: ''
      },
      loading: false,
      isLoadData: false,
      localvideosList: {},
      params: {
        storage: 'videos',
        page: 1,
        pageSize: 20
      },
      videoForm: {
        title: '',
        description: ''
      }
    }
  },
  watch: {
    getStatus(newV, oldV) {
      if (newV) {
        this.params = { storage: 'videos', page: 1, pageSize: this.params.pageSize }
        this.getList()
      }
    }
  },
  methods: {
    beforeVideoUpload(file) {
      if (this.videoForm.title.length <= 0) {
        this.$message({
          message: '视频标题必填',
          type: 'error'
        })
        return
      }
      if (this.videoForm.description.length <= 0) {
        this.$message({
          message: '视频描述必填',
          type: 'error'
        })
        return
      }

      const isMP4 = file.type === 'video/mp4'
      const isLt2M = file.size / 1024 / 1024 < 50

      if (!isMP4) {
        this.$message.error('上传视频只能是 mp4 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('上传视频大小不能超过 50MB!')
        return
      }

      this.postData.fname = file.name

      let tokenParams = { filename: file.name, filesystem: 'video' }
    },
    handleVideoSuccess(res, file) {
      let uploadParams = {
        image_cat_id: 2, //视频分类必填,必须为整数
        image_name: this.videoForm.title, //视频名称必填,不能超过50个字符
        brief: this.videoForm.description, //视频名称必填,不能超过50个字符
        image_url: res.key, //视频链接必填
        // image_full_url: res.height,   //视频完整链接必填
        image_type: file.raw.type, //视频分类长度不能超过20个字符
        storage: 'videos' //视频id必填
      }
      // if (res.key) {
      uploadQiniuVideo(uploadParams).then(res => {
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.uploadDialog = false
        this.isLoadData = false
        this.getList()
      })
      // }
    },
    getList() {
      if (!this.isLoadData) {
        this.loading = true
        getQiniuVideoList(this.params)
          .then(response => {
            this.localvideosList = response.data.data
            this.isLoadData = true
            this.loading = false
          })
          .catch(() => {
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
      this.$confirm('确定删除此视频吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteVideo({ image_id: item.image_id }).then(response => {
            this.localvideosList.list.splice(index, 1)
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
    addVideo() {
      this.uploadDialog = true
    },
    handleCancel() {
      this.uploadDialog = false
    },
    // 自定义上传
    handleUpload: function (e) {
      const upload = new UploadUtil('videos')
      // 上传
      upload
        .uploadImg(e.file, e.file.name)
        .then(
          res => e.onSuccess(res),
          err => e.onError(err)
        )
        .catch(err => e.onError(err))
    },
    // 上传错误回调
    uploadError: function (e) {
      console.error(e)
    }
  }
}
</script>

<style scoped lang="scss">
.video_pick_panel {
  .video_pick {
    margin-right: -1%;
    margin-top: 10px;
    .video_item {
      margin-bottom: 20px;
      margin-right: 1%;
      border: 1px solid #e7e7eb;
      width: 19%;
    }
    .video_item_bd {
      position: relative;
    }
    .video-html {
      width: 100%;
      height: 169px;
      border-bottom: 1px solid #e7e7eb;
    }
    .check_content {
      width: 100%;
      padding: 0 5px;
    }
    .video_name {
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
.video_pick {
  margin-right: -45px;
  .video_item {
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
  > div {
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
