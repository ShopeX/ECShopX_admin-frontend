<template>
  <div>
    <div class="clearfix" style="margin: .6%;">
      <div class="f_l">
        <el-button type="primary" @click="editNewsItem()">新增图文消息</el-button>
      </div>
    </div>
    <div
      v-masonry
      transition-duration="0.3s"
      ref="masonry"
      item-selector=".msg-item"
      class="msg-list"
      v-loading="loading"
    >
      <template v-if="activeName === 'imagetext'" v-for="(item, index) in list_news.item" :key="">
        <div
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
              ></div>
              <a :href="item.content.news_item[0].url" class="edit-mask preview-mask">
                <div class="edit-mask-content">
                  预览文章
                </div>
              </a>
              <p class="msg-desc" v-if="!item.content.news_item[1]">
                {{ item.content.news_item[0].digest }}
              </p>
            </div>
            <div v-for="n in item.content.news_item.length - 1" :key="">
              <div class="article-msg-item has-cover clearfix" v-if="item.content.news_item[1]">
                <div
                  class="msg-thumb-wrap"
                  :style="{
                    backgroundImage: 'url(' + wximageurl + item.content.news_item[n].thumb_url + ')'
                  }"
                ></div>
                <h4 class="msg-title">
                  <a>{{ item.content.news_item[n].title }}</a>
                </h4>
                <a :href="item.content.news_item[n].url" class="edit-mask preview-mask">
                  <div class="edit-mask-content">
                    预览文章
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="msg-operate">
            <el-row>
              <el-col :span="12">
                <div @click="editNewsItem(item.media_id)">
                  <el-tooltip effect="dark" content="编辑" placement="top" :key="item.id">
                    <a><i class="el-icon-edit"></i></a>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="opr_item" @click="removeNewsItem(item, index)">
                  <el-tooltip effect="dark" content="删除" placement="top" :key="item.id">
                    <i class="el-icon-delete"></i>
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
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="params.pageSize"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getWechatMaterial, deleteWechatMaterial } from '../../../../api/wechat'
import Vue from 'vue'
import VueMasonryPlugin from 'vue-masonry'
export default {
  props: ['activeName', 'getStatus'],
  provide() {
    return {
      refresh: this.getList
    }
  },
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
          .then((response) => {
            this.list_news = response.data.data
            this.total_count = response.data.data.total_count
            this.isLoadData = true
            this.loading = false
            // setTimeout(function() {
            //   Vue.redrawVueMasonry()
            // }, 200)
          })
          .catch((error) => {
            this.loading = false
          })
      }
    },
    editNewsItem(media_id) {
      if (media_id) {
        this.$router.push({ path: this.matchHidePage('editor/') + media_id })
      } else {
        this.$router.push({ path: this.matchHidePage('editor/') })
      }
    },
    removeNewsItem(item, index) {
      this.$confirm('确定删除此图文吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteWechatMaterial({ media_id: item.media_id }).then((response) => {
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
  },
  mounted() {
    if (this.activeName == 'imagetext' && this.getStatus) {
      this.getList()
    }
  },
  watch: {
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.getList()
      }
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
