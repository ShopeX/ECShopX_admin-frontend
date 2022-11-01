<template>
  <div>
    <div class="view-flex">
      <div
        v-if="checked.media_id"
        class="video-box"
      >
        <video-player
          class="vjs-custom-skin"
          :options="{
            preload: 'auto',
            aspectRatio: '16:9',
            fluid: true,
            sources: [
              {
                // mp4
                type: 'video/mp4',
                src: checked.url
              }
            ],
            notSupportedMessage: '此视频暂无法播放，请稍后再试',
            controlBar: false
          }"
        />
      </div>
      <div
        v-if="!checked.media_id || (checked.media_id && multiple)"
        class="upload-box"
        @click="showVideos"
      >
        <i class="iconfont icon-video" />
      </div>
    </div>
    <el-dialog
      class="video_dialog"
      title="选择视频"
      :visible.sync="visible"
      append-to-body
    >
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="本地上传"
          name="localvideos"
        >
          <div>
            <div class="upload_box">
              <el-upload
                class="upload-demo"
                :multiple="true"
                action=""
                accept="video/mp4,.mov"
                :show-file-list="false"
                :http-request="handleUpload"
                :on-error="uploadError"
                :before-upload="beforeVideoUpload"
                :on-success="handleVideoSuccess"
              >
                <el-button type="primary">
                  本地上传
                </el-button>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >
                  只能上传mp4文件，且不超过50M
                </div>
              </el-upload>
            </div>
            <el-row
              v-loading="localloading"
              :gutter="10"
            >
              <el-col
                v-for="(item, index) in localvideoList"
                :key="index"
                :span="6"
                class="media-item"
                :class="{ 'checked': temp.media_id === item.url }"
              >
                <video-player
                  class="vjs-custom-skin"
                  :options="{
                    preload: 'auto',
                    aspectRatio: '16:9',
                    fluid: true,
                    sources: [
                      {
                        // mp4
                        type: 'video/mp4',
                        src: item.url
                      }
                    ],
                    notSupportedMessage: '此视频暂无法播放，请稍后再试',
                    controlBar: false
                  }"
                />
                <div
                  class="video-caption view-flex view-flex-middle"
                  @click="checkLocalVideo(item)"
                >
                  <div class="view-flex-item video-name">
                    {{ item.image_name }}
                  </div>
                  <div class="check-btn iconfont icon-check" />
                </div>
              </el-col>
            </el-row>
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :current-page.sync="params.page"
              :page-sizes="[10, 20, 50]"
              :total="total_count"
              :page-size="params.pageSize"
              @current-change="handleLocalCurrentChange"
              @size-change="handleLocalSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getWechatMaterial } from '../../api/wechat'
import { getQiniuVideoList, uploadQiniuVideo } from '@/api/qiniu'
import UploadUtil from '@/utils/uploadUtil'
export default {
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      checked: '',
      temp: '',
      videoList: [],
      localvideoList: [],
      loading: false,
      localloading: false,
      activeName: 'localvideos',
      params: {
        type: 'video',
        page: 1,
        pageSize: 20
      },
      postData: {
        token: '',
        key: '',
        fname: ''
      },
      videoForm: {
        title: '',
        description: ''
      },
      localparams: {
        storage: 'videos',
        page: 1,
        pageSize: 20
      },
      total_count: 0,
      visible: false
    }
  },
  watch: {
    data (val) {
      this.checked = val
    }
  },
  created () {
    this.checked = this.data
  },
  methods: {
    // 自定义上传
    handleUpload: function (e) {
      const upload = new UploadUtil('videos')
      // 上传
      upload
        .uploadImg(e.file, e.file.name)
        .then(
          (res) => e.onSuccess(res),
          (err) => e.onError(err)
        )
        .catch((err) => e.onError(err))
    },
    handleVideoSuccess (res, file) {
      let uploadParams = {
        image_cat_id: 2, //视频分类必填,必须为整数
        image_name: file?.name, //视频名称必填,不能超过50个字符
        brief: '视频本地上传', //视频名称必填,不能超过50个字符
        image_url: res.key, //视频链接必填
        // image_full_url: res.height,   //视频完整链接必填
        image_type: file.raw.type, //视频分类长度不能超过20个字符
        storage: 'videos' //视频id必填
      }
      // if (res.key) {
      uploadQiniuVideo(uploadParams).then((res) => {
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.fetchLocalVideos()
      })
      // }
    },
    beforeVideoUpload (file) {
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
    },
    showVideos () {
      this.visible = true
      this.temp = this.checked
      if (this.$store.getters.login_type == 'distributor') {
        this.activeName = 'localvideos'
        this.fetchLocalVideos()
      } else {
        this.fetchLocalVideos()
        this.fetchVideos()
      }
    },
    fetchVideos () {
      // this.loading = true
      // getWechatMaterial(this.params)
      //   .then((response) => {
      //     this.videoList = response.data.data.item.map((v) => ({
      //       ...v,
      //       options: {
      //         preload: 'auto',
      //         aspectRatio: '16:9',
      //         fluid: true,
      //         sources: [
      //           {
      //             // mp4
      //             type: 'video/mp4',
      //             src: v.url
      //           }
      //         ],
      //         notSupportedMessage: '此视频暂无法播放，请稍后再试',
      //         controlBar: false
      //       }
      //     }))
      //     this.loading = false
      //     this.total_count = response.data.data.total_count
      //   })
      //   .catch(function(error) {
      //     this.loading = false
      //   })
    },
    fetchLocalVideos () {
      this.localloading = true
      getQiniuVideoList(this.localparams)
        .then((response) => {
          this.localvideoList = response.data.data.list
          this.localloading = false
        })
        .catch(function (error) {
          this.localloading = false
        })
    },
    // 上传错误回调
    uploadError: function (e) {
      console.error(e)
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.fetchVideos()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.fetchLocalVideos()
    },
    handleLocalCurrentChange (page_num) {
      this.localparams.page = page_num
      this.fetchLocalVideos()
    },
    handleLocalSizeChange (pageSize) {
      this.localparams.page = 1
      this.localparams.pageSize = pageSize
      this.fetchVideos()
    },
    checkVideo (item) {
      this.temp = item
    },
    checkLocalVideo (item) {
      this.temp = {
        desc: item.brief,
        media_id: item.url,
        name: item.image_name,
        update_time: item.updated,
        url: item.url
      }
    },
    handleCancel () {
      this.visible = false
      this.temp = ''
    },
    handleSubmit () {
      if (this.checked) {
        this.visible = false
        this.checked = this.temp
        this.$emit('change', this.checked)
      } else {
        this.$message('请选择视频')
      }
    },
    handleClick (tab, event) {}
  }
}
</script>

<style scoped lang="scss">
.media-item {
  .video-caption {
    padding-top: 5px;
    cursor: pointer;

    .video-name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .check-btn {
      width: 19px;
      height: 19px;
      margin-left: 5px;
      text-align: center;
      line-height: 19px;
      border-radius: 50%;
      color: #ccc;
      background: #efefef;
      font-size: 0.1em;
      border: 1px solid #ccc;
    }
  }

  &.checked {
    .video-caption {
      .video-name {
        color: #46a0fc;
        font-weight: bold;
      }

      .check-btn {
        color: #fff;
        background: #46a0fc;
        border: 1px solid #46a0fc;
      }
    }
  }
}

.upload_box {
  .upload-demo {
    border-bottom: 1px solid #e5e7e7;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
}
.upload-box {
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;

  .iconfont {
    font-size: 30px;
    color: #ccc;
  }
}

.video-box {
  margin-right: 10px;
  width: 213px;
  height: 120px;
  border: 1px dashed #c0ccda;

  video {
    width: 100%;
    height: 100%;
  }
}
</style>
