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
  <div>
    <div class="clearfix" style="margin: 0.6%">
      <div class="f_l">
        <el-button type="primary" @click="editNewsItem()"> 新增图文消息 </el-button>
      </div>
    </div>
    <div
      ref="masonry"
      v-masonry
      v-loading="loading"
      transition-duration="0.3s"
      item-selector=".msg-item"
      class="msg-list"
    >
      <template v-for="(item, index) in list_news.item" v-if="activeName === 'imagetext'">
        <div
          :key="index"
          v-masonry-tile
          class="msg-item has-first-cover"
          :class="{ multi: item.content.news_item[1], single: !item.content.news_item[1] }"
        >
          <div class="msg-content">
            <div class="msg-info">
              <span>更新于 {{ item.update_time | datetime }}</span>
            </div>
            <div class="sub-msg-item" :class="{ coverMsgItem: item.content.news_item[1] }">
              <h4 class="msg-title">
                <a>{{ item.content.news_item[0].title }}</a>
              </h4>
              <div
                class="msg-thumb-wrap"
                :style="{
                  backgroundImage: 'url(' + wximageurl + item.content.news_item[0].thumb_url + ')'
                }"
              />
              <a :href="item.content.news_item[0].url" class="edit-mask preview-mask">
                <div class="edit-mask-content">预览文章</div>
              </a>
              <p v-if="!item.content.news_item[1]" class="msg-desc">
                {{ item.content.news_item[0].digest }}
              </p>
            </div>
            <div v-for="n in item.content.news_item.length - 1" :key="n">
              <div v-if="item.content.news_item[1]" class="article-msg-item has-cover clearfix">
                <div
                  class="msg-thumb-wrap"
                  :style="{
                    backgroundImage: 'url(' + wximageurl + item.content.news_item[n].thumb_url + ')'
                  }"
                />
                <h4 class="msg-title">
                  <a>{{ item.content.news_item[n].title }}</a>
                </h4>
                <a :href="item.content.news_item[n].url" class="edit-mask preview-mask">
                  <div class="edit-mask-content">预览文章</div>
                </a>
              </div>
            </div>
          </div>
          <div class="msg-operate">
            <el-row>
              <el-col :span="12">
                <div @click="editNewsItem(item.media_id)">
                  <el-tooltip :key="item.id" effect="dark" content="编辑" placement="top">
                    <a><i class="el-icon-edit" /></a>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="opr_item" @click="removeNewsItem(item, index)">
                  <el-tooltip :key="item.id" effect="dark" content="删除" placement="top">
                    <i class="el-icon-delete" />
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
    </div>
    <div class="tc">
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
import { getWechatMaterial, deleteWechatMaterial } from '../../../../api/wechat'
export default {
  provide() {
    return {
      refresh: this.getList
    }
  },
  props: ['activeName', 'getStatus'],
  data() {
    return {
      loading: false,
      isLoadData: false,
      list_news: [],
      total_count: 0,
      params: {
        type: 'news',
        page: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.getList()
      }
    }
  },
  mounted() {
    if (this.activeName == 'imagetext' && this.getStatus) {
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
        this.loading = true
        getWechatMaterial(this.params)
          .then(response => {
            this.list_news = response.data.data
            this.total_count = response.data.data.total_count
            this.isLoadData = true
            this.loading = false
            // setTimeout(function() {
            //   Vue.redrawVueMasonry()
            // }, 200)
          })
          .catch(error => {
            this.loading = false
          })
      }
    },
    editNewsItem(media_id) {
      if (media_id) {
        this.$router.push({ path: this.matchRoutePath('editor/') + media_id })
      } else {
        this.$router.push({ path: this.matchRoutePath('editor/') })
      }
    },
    removeNewsItem(item, index) {
      this.$confirm('确定删除此图文吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteWechatMaterial({ media_id: item.media_id }).then(response => {
            this.list_news.item.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
          //删除操作
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>
<style scoped lang="scss">
.msg-list {
  margin-top: 20px;
  .msg-item {
    width: 23%;
    margin: 10px;
  }
}
.sub-msg-item:hover,
.article-msg-item:hover {
  .preview-mask {
    display: flex;
  }
}
.msg-operate {
  background-color: #f4f4f4;
  border-top: 1px solid #e7e7eb;
  > div {
    height: 44px;
    line-height: 44px;
    text-align: center;
    cursor: pointer;
    font-size: 18px;
    a {
      display: block;
      border-right: 1px solid #e7e7eb;
    }
    i {
      color: #999;
    }
    i:hover {
      color: #333;
    }
  }
}
</style>
