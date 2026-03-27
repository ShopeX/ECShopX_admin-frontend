<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('72bc21f6.3354fe')" name="local">
          <!--localimages-list :active-name="activeName" :get-status="localpicStatus" /-->
          <picker-image
            :page-size="24"
            :active-name="activeName"
            :get-status="localpicStatus"
            :value="{
              multiple: true
            }"
            :columns="8"
          />
        </el-tab-pane>

        <!-- <el-tab-pane
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
        </el-tab-pane> -->

        <el-tab-pane :label="$t('72bc21f6.9d1ba1')" name="localvideo">
          <localvideos-list :active-name="activeName" :get-status="localvideoStatus" />
        </el-tab-pane>

        <!-- <el-tab-pane
          v-if="$store.getters.login_type != 'distributor' && $store.getters.login_type != 'supplier'"
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
        </el-tab-pane> -->

        <!-- <el-tab-pane
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
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <router-view />
  </SpPage>
</template>

<script>
import videoList from '@/view/brand/wechat/video/list.vue'
import imagesList from '@/view/brand/wechat/images/list.vue'
import newsList from '@/view/brand/wechat/artical/list.vue'
//import localimagesList from './localimages/list.vue'
import pickerImage from '@/components/sp-picker/pickers/picker-image.vue'
import localvideosList from '@/view/brand/wechat/localvideos/list.vue'
import { getWechatMaterial, getMaterialStats } from '../../api/wechat'
export default {
  components: {
    imagesList,
    newsList,
    videoList,
    //localimagesList,
    pickerImage,
    localvideosList
  },
  data() {
    return {
      activeName: 'local',
      stats: [],
      picStatus: false,
      newsStatus: true,
      videoStatus: false,
      localpicStatus: false,
      localvideoStatus: false,
      Status: false
    }
  },
  mounted() {
    if (this.$store.getters.login_type == 'distributor') {
      this.activeName = 'local'
      this.handleClick()
    } else {
      this.activeName = 'local'
      this.handleClick()
    }
  },
  methods: {
    handleClick() {
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
        getMaterialStats().then((res) => {
          this.stats = res.data.data
        })
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
