<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <template v-if="$route.path.indexOf('editor') === -1">
      <SpPlatformTip v-if="!VERSION_SHUYUN" h5 app pc alipay />
      <div class="action-container">
        <el-button
          type="primary"
          icon="iconfont icon-xinzengcaozuo-01"
          @click="addPackagePromotion"
        >
          {{ $t('7dd41c7e.577acc') }}
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
            :element-loading-text="$t('7dd41c7e.f09b12')"
          >
            <el-table-column :label="$t('7dd41c7e.2b6bc0')" width="150">
              <template slot-scope="scope">
                <div class="operating-icons">
                  <el-button
                    v-if="cancelActionVisible(scope.row)"
                    type="text"
                    @click="closePackagePromotion(scope.row)"
                  >
                    {{ $t('7dd41c7e.625fb2') }}
                  </el-button>
                  <el-button type="text" @click="showPackagePromotion(scope.row)">
                    {{ $t('7dd41c7e.607e7a') }}
                  </el-button>
                  <el-button
                    v-if="editlActionVisible(scope.row)"
                    type="text"
                    @click="updatePackagePromotion(scope.row)"
                  >
                    {{ $t('7dd41c7e.95b351') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="package_id" width="60" :label="$t('7dd41c7e.c515f3')" />
            <el-table-column prop="package_name" :label="$t('7dd41c7e.0d51ce')" />
            <el-table-column prop="source_name" :label="$t('7dd41c7e.295713')" />
            <el-table-column :label="$t('7dd41c7e.592c59')" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.start_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('7dd41c7e.f78277')" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('7dd41c7e.226b09')" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'waiting'">{{ $t('7dd41c7e.1568ba') }}</span>
                <span v-if="scope.row.status == 'ongoing'">{{ $t('7dd41c7e.fb852f') }}</span>
                <span v-if="scope.row.status == 'end'">{{ $t('7dd41c7e.047fab') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="page.total > page.pageSize" class="mt-4 text-right">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
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
    </template>
    <router-view />
  </SpPage>
</template>
<script>
import { cancelPackagePromotions } from '@/api/promotions'
import { pageMixin } from '@/mixins'

export default {
  mixins: [pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    return {
      loading: false,
      params: {
        status: 'all'
      },
      list: []
    }
  },
  computed: {
    tabList() {
      return [
        { name: this.$t('7dd41c7e.a8b0c2'), activeName: 'all' },
        { name: this.$t('7dd41c7e.1568ba'), activeName: 'waiting' },
        { name: this.$t('7dd41c7e.fb852f'), activeName: 'ongoing' },
        { name: this.$t('7dd41c7e.047fab'), activeName: 'end' }
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
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      const { list, total_count } = await this.$api.promotions.getPackagePromotions(params)
      this.tableList = list
      this.page.total = Number(total_count)
      this.loading = false
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.onSearch()
    },
    addPackagePromotion() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    updatePackagePromotion(row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.package_id })
    },

    showPackagePromotion(row) {
      this.$router.push({
        path: this.matchRoutePath('editor/') + row.package_id,
        query: { isshow: true }
      })
    },
    closePackagePromotion(row) {
      const that = this
      const msg = this.$t('7dd41c7e.01be42')
      this.$confirm(msg, this.$t('7dd41c7e.02d981'), {
        cancelButtonText: this.$t('7dd41c7e.625fb2'),
        confirmButtonText: this.$t('7dd41c7e.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            cancelPackagePromotions(row.package_id).then((res) => {
              this.$message({
                message: this.$t('7dd41c7e.285f58'),
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
