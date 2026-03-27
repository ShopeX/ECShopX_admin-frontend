<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <SpPage>
    <template v-if="$route.path.indexOf('editor') === -1">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app pc alipay />

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="name" :label="$t('ecf8f419.39834b')">
          <el-input v-model="params.name" :placeholder="$t('ecf8f419.39834b')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" :label="$t('ecf8f419.374856')">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('ecf8f419.5d92ab')"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addActivityData">
          {{ $t('ecf8f419.23b46b') }}
        </el-button>
      </div>

      <el-tabs v-model="params.status" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <el-table v-loading="loading" border :data="tableList" :height="wheight - 200">
            <el-table-column prop="seckill_id" :label="$t('ecf8f419.b718ad')" width="80" />
            <el-table-column prop="activity_name" :label="$t('ecf8f419.39834b')" min-width="180" />
            <el-table-column prop="created_date" :label="$t('ecf8f419.eca37c')" min-width="150" />
            <el-table-column :label="$t('ecf8f419.c799f5')" min-width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.activity_start_date }}</div>
                <div>~</div>
                <div>{{ scope.row.activity_end_date }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('ecf8f419.3fea7c')" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'waiting'">{{ $t('ecf8f419.1568ba') }}</span>
                <span v-else-if="scope.row.status == 'in_the_notice'">{{
                  $t('ecf8f419.2a1f77')
                }}</span>
                <span v-else-if="scope.row.status == 'in_sale'">{{ $t('ecf8f419.fb852f') }}</span>
                <span v-else-if="scope.row.status == 'it_has_ended'">{{
                  $t('ecf8f419.047fab')
                }}</span>
                <span v-else-if="scope.row.status == 'close'">{{ $t('ecf8f419.255412') }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="70" prop="source_name" :label="$t('ecf8f419.295713')" />
            <el-table-column :label="$t('ecf8f419.2b6bc0')" width="250">
              <template slot-scope="scope">
                <a v-show="false" ref="download" :href="downloadUrl" :download="downloadfilename" />
                <template v-if="scope.row.edit_btn == 'Y'">
                  <el-button
                    v-if="editActionVisible(scope.row)"
                    type="text"
                    @click="editAction(scope.$index, scope.row)"
                  >
                    {{ $t('ecf8f419.9bd915') }}
                  </el-button>
                </template>
                <el-button
                  v-if="editActionVisible(scope.row)"
                  type="text"
                  @click="updateStatusCommunityAction(scope.row)"
                >
                  {{ $t('ecf8f419.6489ff') }}
                </el-button>
                <el-button
                  v-if="scope.row.status == 'it_has_ended'"
                  type="text"
                  @click="editAction(scope.$index, scope.row)"
                >
                  {{ $t('ecf8f419.6579c6') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="page.total > page.pageSize" class="content-center content-top-padded">
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
    </template>

    <el-dialog :title="$t('ecf8f419.81dc4f')" :visible.sync="dialogVisible" width="50%">
      <el-table v-loading="loading" :data="distributors.distributor_info" :height="wheight - 500">
        <el-table-column prop="name" :label="$t('ecf8f419.0d4934')" min-width="180" />
        <el-table-column prop="address" :label="$t('ecf8f419.765048')" min-width="180" />
        <el-table-column :label="$t('ecf8f419.2b6bc0')" width="250">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="uploadActionWxaCode(scope.$index, distributors, scope.row.distributor_id)"
            >
              {{ $t('ecf8f419.6d6503') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <router-view />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDefaultCurrency } from '@/api/company'
import { seckillActivityUpdateStatus, seckillActivityWxcode } from '@/api/promotions'
import { pageMixin } from '@/mixins'
export default {
  mixins: [pageMixin],
  provide() {
    return {
      refresh: this.refresh
    }
  },
  props: ['getStatus'],
  data() {
    const initialParams = {
      create_time: [],
      status: 'all',
      name: undefined,
      seckill_type: 'limited_time_sale'
    }

    return {
      initialParams,
      params: {
        ...initialParams
      },
      downloadfilename: '',
      downloadUrl: '',
      loading: false,
      communityVisible: false,
      couponVisible: false,
      goodsVisible: false,
      goodsList: [],
      goodsCount: 0,
      distributors: [],
      goodsPageSize: 10,
      goodsPage: 1,
      nowActivity: '',
      cursymbol: '',
      dialogVisible: false,
      currency: {}
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    tabList() {
      return [
        { name: this.$t('ecf8f419.a8b0c2'), activeName: 'all' },
        { name: this.$t('ecf8f419.dd4e55'), activeName: 'waiting' },
        { name: this.$t('ecf8f419.2a1f77'), activeName: 'in_the_notice' },
        { name: this.$t('ecf8f419.b793d3'), activeName: 'in_sale' },
        { name: this.$t('ecf8f419.047fab'), activeName: 'it_has_ended' }
      ]
    }
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  mounted() {
    this.fetchList()
    this.getCurrencyInfo()
  },
  methods: {
    editActionVisible({ status, source_id }) {
      if (status !== 'it_has_ended') {
        if (this.IS_ADMIN() && source_id == '0') {
          return true
        }
        if (this.IS_DISTRIBUTOR()) {
          return true
        }
      }
      return false
    },
    getParams() {
      const time = {}
      const create_time = this.params.create_time
      if (create_time && create_time.length > 0) {
        time.start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(create_time[1] + ' 23:59:59')
      }
      let params = {
        ...this.params,
        status: this.params.status === 'all' ? undefined : this.params.status,
        create_time: [],
        ...time
      }
      return params
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
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.promotions.seckillActivityGetList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false

      this.loading = false
    },
    uploadActionWxaCode(index, row, distributor_id = 0) {
      var params = { seckill_type: row.seckill_type, seckill_id: row.seckill_id }
      if (distributor_id) {
        params.distributor_id = distributor_id
      } else if (row.distributor_id === null) {
        params.distributor_id = 0
      } else if (row.distributor_id.length === 1) {
        params.distributor_id = row.distributor_id[0]
      } else if (row.distributor_id.length > 1) {
        this.distributors = row
        this.dialogVisible = true
        return
      }

      this.downloadfilename = row.activity_name + '.jpg'
      seckillActivityWxcode(params).then((res) => {
        this.downloadUrl = res.data.data.code
        setTimeout(() => {
          this.$refs.download.click()
        }, 200)
      })
    },
    handleTabClick(tab, event) {
      this.onSearch()
    },
    addActivityData() {
      // 添加物料弹框
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.$router.push({ path: this.matchRoutePath('editor/') + row.seckill_id })
    },
    updateStatusCommunityAction(row) {
      const msg = this.$t('ecf8f419.01be42')
      this.$confirm(msg, this.$t('ecf8f419.02d981'), {
        cancelButtonText: this.$t('ecf8f419.625fb2'),
        confirmButtonText: this.$t('ecf8f419.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            seckillActivityUpdateStatus({ seckill_id: row.seckill_id }).then((response) => {
              this.fetchList()
              this.$message({
                message: this.$t('ecf8f419.b69694'),
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    },
    dateChange(val) {
      this.params.status = ''
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.fetchList()
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    viewCouponList(ids) {
      this.couponVisible = true
    },
    handleCancel() {
      this.communityVisible = false
      this.couponVisible = false
      this.goodsVisible = false
    },
    getCurrencyInfo() {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    updateActivityData(params) {
      updateActivityItemData(params).then((res) => {})
    },
    editItemPrice(row) {
      let form = {
        id: row.id,
        item_id: row.item_id,
        activity_price: row.activity_price,
        vip_price: row.vip_price,
        svip_price: row.svip_price,
        activity_store: row.activity_store,
        points: row.points
      }
      this.updateActivityData(form)
    },
    refresh() {
      this.fetchList()
      this.getCurrencyInfo()
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.icon-search-plus {
  cursor: pointer;
}
.text-muted {
  color: #999;
}
</style>
