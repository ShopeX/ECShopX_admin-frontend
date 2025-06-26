<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-button type="primary" @click="handleClickAddActivity"> 新增活动 </el-button>
      <div class="articles">
        <el-row :gutter="10">
          <el-col v-for="(item, index) in list" :key="index" :xs="12" :sm="8" :md="6" :lg="4">
            <div class="article-item">
              <router-link :to="{ path: matchRoutePath('editor'), query: { id: item.id } }">
                <div
                  class="thumbnail"
                  :style="
                    'background: url(' +
                    (item.article_cover ||
                      'https://fakeimg.pl/200x180/EFEFEF/CCC/?text=image&font=lobster') +
                    ') 0% 0% / cover no-repeat;'
                  "
                />
                <div class="caption">
                  <div class="title">
                    {{ item.article_title }}
                  </div>
                  <!-- <div class="update-time">{{ item.updated  }}</div> -->
                  <div class="update-time">
                    {{ timestampToTime(item.updated) }}
                  </div>

                  <div class="view-flex">
                    <!-- <div class="attention-count"><i class="iconfont icon-eye"></i>{{item.articleFocusNum.count || 0}}</div>
                    <div class="attention-count"><i class="iconfont icon-heart"></i>{{item.articlePraiseNum.count || 0}}</div>-->
                  </div>
                </div>
              </router-link>
              <div class="footer">
                <div class="footer-item" @click="handleClikPublish(item)">
                  <template v-if="item.is_show === '1'">
                    <i class="iconfont icon-undo-alt" />撤回
                  </template>
                  <template v-else> <i class="iconfont icon-broadcast-tower" />发布 </template>
                </div>
                <el-popover v-model="item.visible" class="footer-item" placement="top" width="160">
                  <div class="content-bottom-padded">
                    <el-input v-model="item.sort" size="mini" placeholder="请输入排序" />
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="item.visible = false">
                      取消
                    </el-button>
                    <el-button type="primary" size="mini" @click="handleClickSort(item)">
                      确定
                    </el-button>
                  </div>
                  <div slot="reference"><i class="iconfont icon-sort-amount-up" />排序</div>
                </el-popover>
                <div class="footer-item" @click="handleClickDel(item)">
                  <i class="iconfont icon-trash-alt" />删除
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-pagination
          class="center"
          :current-page.sync="paging.page"
          :page-size="paging.pageSize"
          layout="prev, pager, next"
          :total="paging.total"
          @size-change="handleChangeSize"
          @current-change="handleChangeCurrent"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
import {
  getActivearticleList,
  setActivearticle,
  delActivearticle,
  putActivearticle
} from '@/api/promotions'
export default {
  data() {
    return {
      paging: {
        page: 1,
        pageSize: 10,
        total: 10
      },
      list: []
    }
  },
  mounted() {
    this._getActivearticleList()
  },
  methods: {
    handleClickAddActivity() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    handleChangeSize(e) {},
    handleChangeCurrent(e) {
      this.paging.page = e
      this._getActivearticleList()
    },
    /**
     * 获取列表
     * */
    async _getActivearticleList() {
      let params = {
        page: this.paging.page,
        page_size: this.paging.pageSize
      }
      let { data } = await getActivearticleList(params)
      // this.paging.total = data.data.total_count;

      this.list = data.data.list.map(item => {
        item.visible = false
        return item
      })
    },

    /**
     * 撤回
     * */
    handlePublish() {},

    /**
     * 排序
     * */
    async handleClickSort(row) {
      let params = JSON.parse(JSON.stringify(row))

      delete params.created
      delete params.updated
      delete params.visible

      let { data } = await putActivearticle(params)
      this._getActivearticleList()
    },

    /**
     * 删除
     * */
    handleClickDel(row) {
      this.$confirm('确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delActivearticle(row.id).then(res => {
            this._getActivearticleList()
            this.$message({
              message: '删除活动成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {})
    },

    /**
     * 回测 || 发布
     * */
    async handleClikPublish(row) {
      let params = JSON.parse(JSON.stringify(row))
      params.is_show = params.is_show === '1' ? 0 : 1

      delete params.created
      delete params.updated
      delete params.visible

      let { data } = await putActivearticle(params)
      this._getActivearticleList()
    },
    // 时间戳转日期格式
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var YY = date.getFullYear() + '-'
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return YY + MM + DD + ' ' + hh + mm + ss
    }
  }
}
</script>
<style scoped lang="scss">
.center {
  text-align: center;
}
.articles {
  margin-top: 20px;
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
