<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addLimitPromotion">
          {{ $t('c693e930.c82ab1') }}
        </el-button>
      </div>

      <el-tabs v-model="params.status" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <el-table
            v-loading="loading"
            :data="tableList"
            border
            style="width: 100%"
            :element-loading-text="$t('c693e930.f09b12')"
          >
            <el-table-column prop="limit_id" width="60" :label="$t('c693e930.c515f3')" />
            <el-table-column prop="limit_name" :label="$t('c693e930.39834b')" />
            <el-table-column prop="source_name" :label="$t('c693e930.295713')" />
            <el-table-column :label="$t('c693e930.592c59')" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.start_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('c693e930.f78277')" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('c693e930.226b09')" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'waiting'">{{ $t('c693e930.1568ba') }}</span>
                <span v-if="scope.row.status == 'ongoing'">{{ $t('c693e930.fb852f') }}</span>
                <span v-if="scope.row.status == 'end'">{{ $t('c693e930.047fab') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('c693e930.2b6bc0')" width="150">
              <template slot-scope="scope">
                <div class="operating-icons">
                  <el-button
                    v-if="cancelActionVisible(scope.row)"
                    type="text"
                    @click="closeLimitPromotion(scope.row)"
                  >
                    {{ $t('c693e930.625fb2') }}
                  </el-button>
                  <el-button type="text" @click="showLimitPromotion(scope.row)">
                    {{ $t('c693e930.607e7a') }}
                  </el-button>
                  <el-button
                    v-if="editlActionVisible(scope.row)"
                    type="text"
                    @click="updateLimitPromotion(scope.row)"
                  >
                    {{ $t('c693e930.95b351') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="page.total > page.pageSize" class="mt-4 text-right">
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
        </el-tab-pane>
      </el-tabs>
    </SpPage>
  </SpRouterView>
</template>
<script>
import { cancelLimitPromotions, getLimitPromotions } from '@/api/promotions'
import mixin, { pageMixin } from '@/mixins'
export default {
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      status: 'all'
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false
    }
  },
  computed: {
    tabList() {
      return [
        { name: this.$t('c693e930.a8b0c2'), activeName: 'all' },
        { name: this.$t('c693e930.1568ba'), activeName: 'waiting' },
        { name: this.$t('c693e930.fb852f'), activeName: 'ongoing' },
        { name: this.$t('c693e930.047fab'), activeName: 'end' }
      ]
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    cancelActionVisible({ status, source_id }) {
      if (status == 'ongoing') {
        if (this.IS_ADMIN() && source_id == '0') {
          return true
        }
        if (this.IS_DISTRIBUTOR()) {
          return true
        }
      }
      return false
    },
    editlActionVisible({ status, source_id }) {
      if (status == 'waiting') {
        if (this.IS_ADMIN() && source_id == '0') {
          return true
        }
        if (this.IS_DISTRIBUTOR()) {
          return true
        }
      }
      return false
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.onSearch()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    addLimitPromotion() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    updateLimitPromotion(row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.limit_id })
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      const { list, total_count } = await this.$api.promotions.getLimitPromotions(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    showLimitPromotion(row) {
      this.$router.push({
        path: this.matchRoutePath('editor/') + row.limit_id,
        query: { isshow: true }
      })
    },
    closeLimitPromotion(row) {
      const that = this
      const msg = this.$t('c693e930.01be42')
      this.$confirm(msg, this.$t('c693e930.02d981'), {
        cancelButtonText: this.$t('c693e930.625fb2'),
        confirmButtonText: this.$t('c693e930.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            cancelLimitPromotions(row.limit_id).then((res) => {
              this.$message({
                message: this.$t('c693e930.285f58'),
                type: 'success',
                duration: 2 * 1000,
                onClose() {
                  that.fetchList()
                }
              })
            })
          }
          done()
        }
      })
    }
  }
}
</script>
