<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <div class="action-container">
        <el-button type="primary" icon="plus" @click="articleAdd"> 添加文章 </el-button>
      </div>

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="title" label="文章标题:">
          <el-input v-model="params.title" placeholder="请输入文章标题" />
        </SpFilterFormItem>
      </SpFilterForm>

      <section v-loading="loading" class="articles">
        <el-row :gutter="10">
          <el-col v-for="(item, index) in tableList" :key="index" :xs="12" :sm="8" :md="6" :lg="4">
            <div class="article-item">
              <router-link :to="{ path: matchHidePage('editor'), query: { id: item.article_id } }">
                <div
                  class="thumbnail"
                  :style="
                    'background: url(' +
                    (item.image_url ||
                      'https://fakeimg.pl/200x180/EFEFEF/CCC/?text=image&font=lobster') +
                    ') 0% 0% / cover no-repeat;'
                  "
                />
                <div class="caption">
                  <div class="title">
                    {{ item.title }}
                  </div>
                  <div class="update-time">
                    {{ item.updated | datetime('YYYY-MM-DD HH:mm:ss') }}
                  </div>
                </div>
              </router-link>
              <div class="footer">
                <div
                  v-clipboard:copy="item.link"
                  v-clipboard:success="onCopySuccess"
                  class="footer-item copy-btn"
                >
                  <input v-model="item.link" class="copy-link" type="text" />
                  <i class="iconfont icon-copy" /> 复制文章链接
                </div>
              </div>
              <div class="footer">
                <div
                  class="footer-item"
                  @click="handlePublish(item.article_id, item.release_status)"
                >
                  <template v-if="item.release_status">
                    <i class="iconfont icon-undo-alt" /> 撤回
                  </template>
                  <template v-else> <i class="iconfont icon-broadcast-tower" /> 发布 </template>
                </div>
                <el-popover v-model="item.visible" class="footer-item" placement="top" width="160">
                  <div class="content-bottom-padded">
                    <el-input v-model="item.sort" size="mini" placeholder="请输入排序" />
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="item.visible = false">
                      取消
                    </el-button>
                    <el-button type="primary" size="mini" @click="handleSort(item.article_id)">
                      确定
                    </el-button>
                  </div>
                  <div slot="reference"><i class="iconfont icon-sort-amount-up" /> 排序</div>
                </el-popover>
                <div class="footer-item" @click="articleDelete(item.article_id)">
                  <i class="iconfont icon-trash-alt" /> 删除
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <dataPlaceholder :visible.sync="showPlaceholder" height="100%" />
        <div v-if="page.total > page.pageSize" class="content-padded content-center">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="page.pageIndex"
            :page-sizes="[10, 20, 50]"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
          />
        </div>
      </section>
    </div>
    <router-view />
  </div>
</template>

<script>
import mixin, { pageMixin } from '@/mixins'
import { deleteArticle, updateArticleSortOrStatus } from '@/api/article' 
import DataPlaceholder from '@/components/element/dataPlaceholder'

export default {
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  components: {
    dataPlaceholder: DataPlaceholder
  },
  mixins: [mixin, pageMixin],
  data() {
    return {
      loading: false,
      showPlaceholder: false,
      params: {
        title: ''
      }
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: { 
    articleAdd(id) {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    articleDelete(id) {
      const _self = this
      this.$confirm('确认删除当前文章吗？').then((_) => {
        deleteArticle(id).then((res) => {
          if (res.data.data.status) {
            this.$message({
              message: '删除成功',
              type: 'success',
              onClose() {
                _self.fetchList()
              }
            })
          }
        })
      })
    },
    handleSort(id) {
      const _self = this
      let index = this.tableList.findIndex((item) => item.article_id === id)
      this.tableList[index].visible = false
      let param = {
        inputdata: [
          {
            article_id: id,
            sort: this.tableList[index].sort
          }
        ]
      }
      updateArticleSortOrStatus(param).then((res) => {
        _self.fetchList()
      })
    },
    handlePublish(id, status) {
      let msg = ''
      if (status) {
        msg = '确定撤回本篇文章吗？'
      } else {
        msg = '确定发布本篇文章吗？'
      }
      const _self = this
      this.$confirm(msg)
        .then((res) => {
          let param = {
            inputdata: [
              {
                article_id: id,
                release_status: !status
              }
            ]
          }
          updateArticleSortOrStatus(param).then((res) => {
            _self.fetchList()
          })
        })
        .catch(() => {
          return
        })
    }, 
    async fetchList() {
      this.loading = true
      const { total_count, list } = await this.$api.article.getArticleList(this.params)
      if (total_count === 0) {
        this.showPlaceholder = true
      }
      list.forEach((item) => {
        item.link = `pages/article/index?id=${item.article_id}`
      })
      this.tableList = list
      this.total_count = total_count
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
.articles {
  height: 500px;
  .article-item {
    position: relative;
    margin-bottom: 10px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
    border: 1px solid #efefef;
    .copy-btn {
      position: relative;
      font-size: 12px;
      cursor: pointer;
      [class^='copy-link'] {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        visibility: hidden;
      }
      .iconfont {
        font-size: 10px;
        line-height: 1;
      }
    }
    .thumbnail {
      height: 160px;
      background: #efefef;
    }
    .caption {
      height: 90px;
      padding: 10px;
      overflow: hidden;
      .title {
        display: -webkit-box;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 2;
        box-orient: vertical;
        line-height: 1.3;
        height: 35px;
        font-size: 14px;
        color: #666;
        font-weight: normal;
      }
      .update-time {
        font-size: 11px;
        color: #ccc;
        text-align: right;
      }
      .attention-count {
        padding-right: 15px;
        font-size: 11px;
        color: #999;
        .iconfont {
          margin-right: 5px;
          font-size: 10px;
          vertical-align: middle;
          line-height: 1;
          color: #ccc;
        }
      }
    }
    .footer {
      display: flex;
      height: 35px;
      border-top: 1px solid #f8f8f8;
      .footer-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
        color: #999;
        &::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 1px;
          background: #f8f8f8;
          content: '';
        }
        &:last-child::after {
          content: none;
        }
        &:hover {
          color: $dominant_hue;
        }
        i {
          margin-right: 3px;
          vertical-align: middle;
          line-height: 1;
          font-size: 10px;
        }
      }
    }
  }
}
</style>
