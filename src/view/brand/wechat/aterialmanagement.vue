<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="本地图片" name="local">
          <localimages-list :active-name="activeName" :get-status="localpicStatus" />
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

        <el-tab-pane label="本地视频" name="localvideo">
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
        getMaterialStats().then(res => {
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
