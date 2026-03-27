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
  <div>
    <template v-if="$route.path.indexOf('editor') === -1">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app pc alipay />
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addActivityData">
          {{ $t('41b41f1c.23b46b') }}
        </el-button>
      </div>

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="name" :label="$t('41b41f1c.1cadc0')">
          <el-input v-model="params.name" :placeholder="$t('41b41f1c.39834b')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="status" :label="$t('41b41f1c.1743c9')">
          <el-select
            v-model="params.status"
            :placeholder="$t('41b41f1c.1181a5')"
            clearable
            style="width: 100%"
          >
            <el-option :label="$t('41b41f1c.a8b0c2')" value="0" />
            <el-option :label="$t('41b41f1c.1568ba')" value="waiting" />
            <el-option :label="$t('41b41f1c.7e19ab')" value="in_the_notice" />
            <el-option :label="$t('41b41f1c.fb852f')" value="in_sale" />
            <el-option :label="$t('41b41f1c.047fab')" value="it_has_ended" />
            <!-- <el-option
              label="已终止"
              value="close"
            /> -->
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" :label="$t('41b41f1c.374856')">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('41b41f1c.5d92ab')"
            style="width: 100%; min-width: 250px"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-table v-loading="loading" border :data="tableList" :height="wheight - 150">
        <el-table-column prop="seckill_id" label="ID" width="50" />
        <el-table-column :label="$t('41b41f1c.36c6f5')">
          <template slot-scope="scope">
            {{ scope.row.activity_name }}<br>
            <span class="text-muted">{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('41b41f1c.295713')">
          <template slot-scope="scope">
            {{ getDistributorInfo(scope.row.distributor_info) }}
          </template>
        </el-table-column>
        <el-table-column prop="activity_release_date" :label="$t('41b41f1c.292b75')" width="160" />
        <el-table-column :label="$t('41b41f1c.c799f5')" width="190">
          <template slot-scope="scope">
            {{ scope.row.activity_start_date }}
            <span class="text-muted">{{ $t('41b41f1c.a3e3b8') }}</span>
            {{ scope.row.activity_end_date }}
            <span class="text-muted">{{ $t('41b41f1c.12f1d7') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_date" :label="$t('41b41f1c.eca37c')" width="160" />
        <el-table-column prop="status" :label="$t('41b41f1c.3fea7c')" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'waiting'">{{ $t('41b41f1c.1568ba') }}</span>
            <span v-else-if="scope.row.status == 'in_the_notice'">{{ $t('41b41f1c.7e19ab') }}</span>
            <span v-else-if="scope.row.status == 'in_sale'">{{ $t('41b41f1c.fb852f') }}</span>
            <span v-else-if="scope.row.status == 'it_has_ended'">{{ $t('41b41f1c.047fab') }}</span>
            <!-- <span v-else-if="scope.row.status == 'close'">已终止</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="items" :label="$t('41b41f1c.9897d8')" width="50">
          <template slot-scope="scope">
            <i class="iconfont icon-search-plus" @click="viewGoodsList(scope.row.seckill_id)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('41b41f1c.2b6bc0')" width="60">
          <template slot-scope="scope">
            <el-button
              v-if="overActionVisible(scope.row)"
              type="text"
              @click="updateStatusCommunityAction(scope.row)"
            >
              {{ $t('41b41f1c.ff6c6a') }}
            </el-button>
            <div class="operating-icons">
              <!-- <i class="iconfont icon-search-plus" @click="communityDetail(scope.$index, scope.row)"></i> -->
              <i
                v-if="scope.row.status == 'waiting'"
                class="el-icon-edit-outline"
                @click="editCommunityAction(scope.$index, scope.row)"
              />
            </div>
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

      <el-dialog
        :title="$t('41b41f1c.1fd1d5')"
        :visible.sync="goodsVisible"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-table v-loading="loading" :data="goodsList">
            <el-table-column prop="item_id" label="id" width="60" />
            <el-table-column prop="item_name" :label="$t('41b41f1c.ea887b')" />
            <el-table-column prop="item_spec_desc" :label="$t('41b41f1c.08ee55')" />
            <el-table-column prop="activity_price" :label="$t('41b41f1c.0eac88')" width="100">
              <template slot-scope="scope">
                {{ cursymbol }}{{ scope.row.activity_price / 100 }}
                <!-- <el-input v-model="scope.row.activity_price"  @change="editItemPrice(scope.$index, scope.row)"><i slot="prefix" class="el-input__icon el-icon-edit"></i><i slot="suffix" class="el-input__icon">元</i></el-input> -->
              </template>
            </el-table-column>
            <el-table-column prop="activity_store" :label="$t('41b41f1c.c41fda')" width="70" />
            <el-table-column prop="limit_num" :label="$t('41b41f1c.c360e9')" width="50" />
            <el-table-column prop="sort" :label="$t('41b41f1c.01be42')" width="60" />
          </el-table>
          <div v-if="goodsCount > goodsPageSize" class="content-center content-top-padded">
            <el-pagination
              layout="prev, pager, next"
              :current-page.sync="goodsPage"
              :total="goodsCount"
              :page-size="goodsPageSize"
              @current-change="handleGoodsCurrentChange"
            />
          </div>
        </template>
      </el-dialog>
    </template>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDefaultCurrency } from '@/api/company'
import { seckillActivityUpdateStatus, getSeckillItemList } from '@/api/promotions'
import mixin, { pageMixin } from '@/mixins'

export default {
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.refresh
    }
  },
  props: ['getStatus'],
  data() {
    const initialParams = {
      name: undefined,
      status: undefined,
      create_time: []
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false,
      communityVisible: false,
      couponVisible: false,
      goodsVisible: false,
      goodsList: [],
      goodsCount: 0,
      goodsPageSize: 10,
      goodsPage: 1,
      nowActivity: '',
      cursymbol: '',
      currency: {}
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getActivityLists(this.params)
      }
    }
  },
  mounted() {
    if (this.$route.query.status) {
      this.params.status = this.$route.query.status
    }
    this.fetchList()
    this.getCurrencyInfo()
  },
  methods: {
    overActionVisible({ status, source_id }) {
      if (status != 'it_has_ended') {
        if (this.IS_ADMIN() && source_id == '0') {
          return true
        }
        if (this.IS_DISTRIBUTOR()) {
          return true
        }
      }
      return false
    },
    getDistributorInfo(distributor_info) {
      if (distributor_info.length > 0) {
        return distributor_info[0].store_name
      }
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
    handleGoodsCurrentChange(page_num) {
      this.goodsPage = page_num
      this.viewGoodsList(this.nowActivity)
    },
    addActivityData() {
      // 添加物料弹框
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editCommunityAction(index, row) {
      // 编辑物料弹框
      this.$router.push({ path: this.matchRoutePath('editor/') + row.seckill_id })
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
    },
    updateStatusCommunityAction(row) {
      const msg = this.$t('41b41f1c.02d981')
      this.$confirm(msg, this.$t('41b41f1c.625fb2'), {
        cancelButtonText: this.$t('41b41f1c.38cf16'),
        confirmButtonText: this.$t('41b41f1c.b69694'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            seckillActivityUpdateStatus({ seckill_id: row.seckill_id }).then((response) => {
              this.fetchList()
              this.$message({
                message: this.$t('41b41f1c.1c48c9'),
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    viewGoodsList(activityId) {
      this.nowActivity = activityId
      this.goodsVisible = true
      getSeckillItemList({
        seckill_id: activityId,
        page: this.goodsPage,
        pageSize: this.goodsPageSize
      }).then((res) => {
        this.goodsList = res.data.data.list
        this.goodsCount = res.data.data.total_count
      })
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
      this.fetchList(this.params)
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
