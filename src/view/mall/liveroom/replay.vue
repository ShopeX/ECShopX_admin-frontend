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
  <div class="section-white">
    <div v-loading="loading" class="video_pick">
      <ul class="clearfix">
        <li
          v-for="(videoitem, index) in videoList"
          :key="index"
          class="video_item"
          style="width:20%; !important; margin:0 50px 50px 0;"
        >
          <div class="video_item_bd" width="150 !important">
            <video
              class="video-html"
              :src="videoitem.media_url"
              controls="controls"
              style="width:100%; !important"
            >
              您的浏览器不支持 video 标签。
            </video>
            <div class="check_content">
              <span class="video_name" :title="videoitem.name"
                >过期时间：{{ videoitem.expire_time }}</span
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="total_count > params.pageSize" class="mt-4 text-right">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { getLiverooms } from '@/api/promotions'

export default {
  data() {
    return {
      loading: false,
      isLoadData: false,
      videoList: [],
      total_count: 0,
      params: {
        wxapp_id: '',
        roomid: 0,
        action: 'get_replay',
        page: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    if (this.$route.query.roomid && this.$route.query.wxapp_id) {
      this.params.roomid = this.$route.query.roomid
      this.params.wxapp_id = this.$route.query.wxapp_id
      this.getList()
    }
  },
  methods: {
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
    getList() {
      if (!this.isLoadData) {
        this.isLoadData = true
        getLiverooms(this.params).then(response => {
          this.videoList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.isLoadData = false
          this.loading = false
        })
      }
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
  .opr_item {
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    color: #999;
    font-size: 16px;
    &:hover {
      color: #333;
    }
  }
}
</style>
