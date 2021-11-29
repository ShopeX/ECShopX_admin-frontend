<template>
  <div>
    <div class="view-flex">
      <div v-if="checked.media_id" class="video-box">
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
        >
        </video-player>
      </div>
      <div
        @click="showVideos"
        class="upload-box"
        v-if="!checked.media_id || (checked.media_id && multiple)"
      >
        <i class="iconfont icon-video"></i>
      </div>
    </div>
    <el-dialog class="video_dialog" title="选择视频" :visible.sync="visible" append-to-body>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-if="$store.getters.login_type != 'distributor'"
          label="微信上传"
          name="wechatvideos"
        >
          <div>
            <el-row :gutter="10" v-loading="loading">
              <el-col
                :span="6"
                v-for="(item, index) in videoList"
                :key="index"
                class="media-item"
                :class="{ 'checked': temp.media_id === item.media_id }"
              >
                <video-player class="vjs-custom-skin" :options="item.options"> </video-player>
                <div class="video-caption view-flex view-flex-middle" @click="checkVideo(item)">
                  <div class="view-flex-item video-name">{{ item.name }}</div>
                  <div class="check-btn iconfont icon-check"></div>
                </div>
              </el-col>
            </el-row>
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :current-page.sync="params.page"
              :page-sizes="[10, 20, 50]"
              :total="total_count"
              :page-size="params.pageSize"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="本地上传" name="localvideos">
          <div>
            <el-row :gutter="10" v-loading="localloading">
              <el-col
                :span="6"
                v-for="(item, index) in localvideoList"
                :key="index"
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
                >
                </video-player>
                <div
                  class="video-caption view-flex view-flex-middle"
                  @click="checkLocalVideo(item)"
                >
                  <div class="view-flex-item video-name">{{ item.image_name }}</div>
                  <div class="check-btn iconfont icon-check"></div>
                </div>
              </el-col>
            </el-row>
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              @current-change="handleLocalCurrentChange"
              @size-change="handleLocalSizeChange"
              :current-page.sync="params.page"
              :page-sizes="[10, 20, 50]"
              :total="total_count"
              :page-size="params.pageSize"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getWechatMaterial } from '../../api/wechat'
import { getQiniuVideoList } from '@/api/qiniu'

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
  data() {
    return {
      checked: '',
      temp: '',
      videoList: [],
      localvideoList: [],
      loading: false,
      localloading: false,
      activeName: 'wechatvideos',
      params: {
        type: 'video',
        page: 1,
        pageSize: 20
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
    data(val) {
      this.checked = val
    }
  },
  methods: {
    showVideos() {
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
    fetchVideos() {
      this.loading = true
      getWechatMaterial(this.params)
        .then((response) => {
          this.videoList = response.data.data.item.map((v) => ({
            ...v,
            options: {
              preload: 'auto',
              aspectRatio: '16:9',
              fluid: true,
              sources: [
                {
                  // mp4
                  type: 'video/mp4',
                  src: v.url
                }
              ],
              notSupportedMessage: '此视频暂无法播放，请稍后再试',
              controlBar: false
            }
          }))
          this.loading = false
          this.total_count = response.data.data.total_count
        })
        .catch(function(error) {
          this.loading = false
        })
    },
    fetchLocalVideos() {
      this.localloading = true
      getQiniuVideoList(this.localparams)
        .then((response) => {
          this.localvideoList = response.data.data.list
          this.localloading = false
        })
        .catch(function(error) {
          this.localloading = false
        })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.fetchVideos()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.fetchLocalVideos()
    },
    handleLocalCurrentChange(page_num) {
      this.localparams.page = page_num
      this.fetchLocalVideos()
    },
    handleLocalSizeChange(pageSize) {
      this.localparams.page = 1
      this.localparams.pageSize = pageSize
      this.fetchVideos()
    },
    checkVideo(item) {
      this.temp = item
    },
    checkLocalVideo(item) {
      this.temp = {
        desc: item.brief,
        media_id: item.url,
        name: item.image_name,
        update_time: item.updated,
        url: item.url
      }
    },
    handleCancel() {
      this.visible = false
      this.temp = ''
    },
    handleSubmit() {
      if (this.checked) {
        this.visible = false
        this.checked = this.temp
        this.$emit('change', this.checked)
      } else {
        this.$message('请选择视频')
      }
    },
    handleClick(tab, event) {}
  },
  created() {
    this.checked = this.data
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
