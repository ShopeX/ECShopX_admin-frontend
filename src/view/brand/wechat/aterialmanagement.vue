<style type="text/css" lang="scss">
.tip-info {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #ff7800;
  margin: 11px 0;
}
</style>
<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-if="$store.getters.login_type != 'distributor'"
          label="图文消息"
          name="imagetext"
        >
          <div class="tip-info">
            <p>
              当前图文已存储数量为{{ $store.getters.login_type }}
              <span style="font-size: 20px; padding-left: 5px">{{ stats.news_count }}篇</span>
            </p>
            <p>
              当前图文剩余储
              <span style="font-size: 20px; padding-left: 5px">{{ stats.news_limit }}篇</span>
            </p>
          </div>
          <news-list
            :active-name="activeName"
            :get-status="newsStatus"
          />
        </el-tab-pane>

        <el-tab-pane
          label="本地图片"
          name="qiniu"
        >
          <!-- <div class="tip-info">
              <p>当前本地图片已存储数量为<span style="font-size:20px;padding-left: 5px;">555张</span></p>
              <p>当前本地图片剩余储<span style="font-size:20px;padding-left: 5px;">22张</span></p>
          </div>-->
          <localimages-list
            :active-name="activeName"
            :get-status="localpicStatus"
          />
        </el-tab-pane>

        <el-tab-pane
          v-if="$store.getters.login_type != 'distributor'"
          label="微信图片"
          name="picture"
        >
          <div class="tip-info">
            <p>
              当前微信图片已存储数量为
              <span style="font-size: 20px; padding-left: 5px">{{ stats.image_count }}张</span>
            </p>
            <p>
              当前微信图片剩余储
              <span style="font-size: 20px; padding-left: 5px">{{ stats.image_limit }}张</span>
            </p>
          </div>
          <images-list
            :active-name="activeName"
            :get-status="picStatus"
          />
        </el-tab-pane>

        <el-tab-pane
          label="本地视频"
          name="localvideo"
        >
          <localvideos-list
            :active-name="activeName"
            :get-status="localvideoStatus"
          />
        </el-tab-pane>

        <el-tab-pane
          v-if="$store.getters.login_type != 'distributor'"
          label="微信视频"
          name="video"
        >
          <div class="tip-info">
            <p>
              当前视频已存储数量为
              <span style="font-size: 20px; padding-left: 5px">{{ stats.video_count }}个</span>
            </p>
            <p>
              当前视频剩余储
              <span style="font-size: 20px; padding-left: 5px">{{ stats.video_limit }}个</span>
            </p>
          </div>
          <video-list
            :active-name="activeName"
            :get-status="videoStatus"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>

<script>
import videoList from './video/list.vue'
import imagesList from './images/list.vue'
import newsList from './artical/list.vue'
import localimagesList from './localimages/list.vue'
import localvideosList from './localvideos/list.vue'
import { getWechatMaterial, getMaterialStats } from '../../../api/wechat'
export default {
  components: {
    imagesList,
    newsList,
    videoList,
    localimagesList,
    localvideosList
  },
  data () {
    return {
      activeName: 'imagetext',
      stats: [],
      picStatus: false,
      newsStatus: true,
      videoStatus: false,
      localpicStatus: false,
      localvideoStatus: false,
      Status: false
    }
  },
  mounted () {
    if (this.$store.getters.login_type == 'distributor') {
      this.activeName = 'qiniu'
      this.handleClick()
    } else {
      this.activeName = 'imagetext'
      getMaterialStats().then((res) => {
        this.stats = res.data.data
      })
    }
  },
  methods: {
    handleClick () {
      if (this.activeName == 'picture') {
        this.picStatus = true
        this.newsStatus = false
        this.videoStatus = false
        this.localpicStatus = false
        this.localvideoStatus = false
      } else if (this.activeName == 'imagetext') {
        this.picStatus = false
        this.videoStatus = false
        this.newsStatus = true
        this.localpicStatus = false
        this.localvideoStatus = false
      } else if (this.activeName == 'video') {
        this.picStatus = false
        this.videoStatus = true
        this.newsStatus = false
        this.localpicStatus = false
        this.localvideoStatus = false
      } else if (this.activeName == 'localvideo') {
        this.picStatus = false
        this.videoStatus = false
        this.newsStatus = false
        this.localpicStatus = false
        this.localvideoStatus = true
      } else {
        this.picStatus = false
        this.videoStatus = false
        this.newsStatus = false
        this.localpicStatus = true
        this.localvideoStatus = false
      }
    }
  }
}
</script>
