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
  <div class="page-body">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="distributor" :label="$t('822436ab.4de1b7')">
        <el-autocomplete
          v-model="params.distributor.name"
          :fetch-suggestions="queryStoreSearch"
          :placeholder="$t('822436ab.867738')"
          @select="handleSelectStore"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_bn" :label="$t('822436ab.477317')">
        <el-input v-model="params.refund_bn" :placeholder="$t('822436ab.b0612b')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('822436ab.070dce')">
        <el-input v-model="params.order_id" :placeholder="$t('822436ab.1e8dc2')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" :label="$t('822436ab.ce2bf3')">
        <el-input v-model="params.mobile" :placeholder="$t('822436ab.8098e2')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_type" :label="$t('822436ab.9db7af')">
        <el-select v-model="params.refund_type" :placeholder="$t('822436ab.f98f05')">
          <el-option
            v-for="(item, index) in refundTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_channel" :label="$t('822436ab.369034')">
        <el-select v-model="params.refund_channel" :placeholder="$t('822436ab.4178e0')">
          <el-option
            v-for="(item, index) in refundChannelList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_status" :label="$t('822436ab.a2f94f')">
        <el-select v-model="params.refund_status" :placeholder="$t('822436ab.db7c80')">
          <el-option
            v-for="(item, index) in refundsStatusList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" :label="$t('822436ab.8d3bf9')">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :placeholder="$t('822436ab.4b8cb9')"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" plain @click="exportData"> {{ $t('822436ab.55405e') }} </el-button>
    </div>

    <el-form ref="form" label-width="100px">
      <el-table
        v-loading="loading"
        border
        :data="tableList"
        :element-loading-text="$t('822436ab.f09b12')"
      >
        <el-table-column :label="$t('822436ab.2b6bc0')" fixed="left">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">
              {{ $t('822436ab.f26225') }}
            </el-button>
            <el-button
              v-if="
                scope.row.refund_status == 'AUDIT_SUCCESS' &&
                scope.row.refund_channel == 'offline' &&
                (jstErpSetting?.is_open ? scope?.row?.progress != '8' : true)
              "
              style="color: #459ae9"
              type="text"
              @click="() => handleRefund(scope.row)"
            >
              {{ $t('822436ab.538b41') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="refund_bn" min-width="220" :label="$t('822436ab.b0612b')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.refund_type == '0'" effect="plain" type="warning" size="mini">
              {{ $t('822436ab.59bd68') }}
            </el-tag>
            <el-tag v-else-if="scope.row.refund_type == '1'" effect="plain" size="mini">
              {{ $t('822436ab.63d2ec') }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.refund_type == '2'"
              effect="plain"
              type="danger"
              size="mini"
            >
              {{ $t('822436ab.518ce0') }}
            </el-tag>
            <div>
              <router-link
                target="_blank"
                :to="{
                  path: matchRoutePath('detail'),
                  query: { refund_bn: scope.row.refund_bn }
                }"
              >
                {{ scope.row.refund_bn }}
              </router-link>
              <el-tooltip effect="dark" :content="$t('822436ab.79d3ab')" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.refund_bn"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
            <div v-if="scope.row.distributor_id !== '0'" class="order-store">
              <el-tooltip effect="dark" :content="$t('822436ab.8a0cc2')" placement="top-start">
                <i class="el-icon-office-building" />
              </el-tooltip>
              {{ scope.row.distributor_info.name }}
            </div>
            <div class="order-time">
              <el-tooltip effect="dark" :content="$t('822436ab.2bd499')" placement="top-start">
                <i class="el-icon-time" />
              </el-tooltip>
              {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="aftersales_bn" width="180" :label="$t('822436ab.d34f24')">
          <template slot-scope="scope">
            <div>
              <router-link
                target="_blank"
                :to="{
                  path:
                    (`${$store.getters.login_type}` == 'distributor' &&
                      '/shopadmin/order/aftersaleslist/detail') ||
                    (`${$store.getters.login_type}` == 'merchant' &&
                      '/merchant/order/aftersaleslist/detail') ||
                    '/order/aftersales/aftersaleslist/detail',

                  query: { aftersales_bn: scope.row.aftersales_bn }
                }"
              >
                {{ scope.row.aftersales_bn }}
              </router-link>
              <el-tooltip
                v-if="scope.row.aftersales_bn"
                effect="dark"
                :content="$t('822436ab.79d3ab')"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.aftersales_bn"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="200" :label="$t('822436ab.1e8dc2')">
          <template slot-scope="scope">
            <div>
              <router-link
                target="_blank"
                :to="{
                  path:
                    (`${$store.getters.login_type}` == 'distributor' &&
                      '/shopadmin/order/order-manage/order-list/detail') ||
                    (`${$store.getters.login_type}` == 'merchant' &&
                      '/merchant/order/order-manage/order-list/detail') ||
                    '/order/order-manage/order-list/detail',
                  query: { orderId: scope.row.order_id }
                }"
              >
                {{ scope.row.order_id }}
              </router-link>
              <el-tooltip effect="dark" :content="$t('822436ab.79d3ab')" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.order_id"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="200" :label="$t('822436ab.0c9d2b')">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_type == 'wxpay' || scope.row.pay_type == 'adapay'">{{
              $t('822436ab.bffe28')
            }}</span>
            <span v-if="scope.row.pay_type == 'wxpayapp'">{{ $t('822436ab.3c2c77') }}</span>
            <span v-if="scope.row.pay_type == 'wxpayh5'">{{ $t('822436ab.df7033') }}</span>
            <span v-if="scope.row.pay_type == 'wxpaypc'">{{ $t('822436ab.c8a8cb') }}</span>
            <span v-if="scope.row.pay_type == 'wxpaypos'">{{ $t('822436ab.67a318') }}</span>
            <span v-if="scope.row.pay_type == 'alipayapp'">{{ $t('822436ab.2ac4fe') }}</span>
            <span v-if="scope.row.pay_type == 'alipay'">{{ $t('822436ab.e3b206') }}</span>
            <span v-if="scope.row.pay_type == 'alipayh5'">{{ $t('822436ab.5a3c52') }}</span>
            <span v-if="scope.row.pay_type == 'alipaypos'">{{ $t('822436ab.bc475f') }}</span>
            <span v-if="scope.row.pay_type == 'deposit'">{{ $t('822436ab.89ac23') }}</span>
            <span v-if="scope.row.pay_type == 'ebuy'">{{ $t('822436ab.a2e703') }}</span>
            <span v-if="scope.row.pay_type == 'point'">{{ $t('822436ab.accd19') }}</span>
            <span v-if="scope.row.pay_type == 'pos'">{{ $t('822436ab.d37dec') }}</span>
            <span v-if="scope.row.pay_type == 'hfpay'">{{ $t('822436ab.bb68ee') }}</span>
            <span v-if="scope.row.pay_type == 'chinaums'">{{ $t('822436ab.1d7dae') }}</span>
            <span v-if="scope.row.pay_type == 'offline_pay'">{{ $t('822436ab.2d8019') }}</span>
            <span v-if="scope.row.pay_type == 'doumen_intl'">{{ $t('822436ab.e37lpb') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180" :label="$t('822436ab.a0cd4c')">
          <template slot-scope="scope">
            <div class="order-num mark">
              {{ formatMoneyWithSymbol(scope.row.refund_fee, getCurrencySymbol(scope.row)) }}
            </div>
            <div v-if="scope.row.refund_point" class="order-num mark">
              {{ scope.row.refund_point }}{{ $t('822436ab.9f68a8') }}
            </div>
            <div v-if="scope.row.refund_success_time" class="order-time">
              <el-tooltip effect="dark" :content="$t('822436ab.ef5fb8')" placement="top-start">
                <i class="el-icon-time" />
              </el-tooltip>
              {{ scope.row.refund_success_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column width="180" :label="$t('822436ab.3034f2')">
          <template slot-scope="scope">
            {{
              scope.row.freight_type == 'cash'
                ? formatMoneyWithSymbol(scope.row.freight, getCurrencySymbol(scope.row))
                : 0
            }}
          </template>
        </el-table-column>
        <el-table-column width="180" :label="$t('822436ab.ff5669')">
          <template slot-scope="scope">
            {{ scope.row.freight_type == 'point' ? scope.row.freight : 0 }}
          </template>
        </el-table-column>

        <!-- 退款方式 -->
        <el-table-column prop="refund_channel" width="80" :label="$t('822436ab.4178e0')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.refund_channel == 'offline'" size="mini">
              {{ $t('822436ab.46a9a9') }}
            </el-tag>
            <el-tag v-if="scope.row.refund_channel == 'original'" type="success" size="mini">
              {{ $t('822436ab.eef322') }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 退款状态 -->
        <el-table-column prop="refund_status" width="100" :label="$t('822436ab.db7c80')">
          <template slot-scope="scope">
            <!-- 订单状态 -->
            <el-tag v-if="scope.row.refund_status == 'READY'" size="mini" type="info">
              {{ $t('822436ab.97a81d') }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.refund_status == 'AUDIT_SUCCESS'"
              size="mini"
              type="success"
            >
              {{ $t('822436ab.202a8b') }}
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'SUCCESS'" size="mini" type="success">
              {{ $t('822436ab.d58cbd') }}
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'REFUSE'" size="mini" type="danger">
              {{ $t('822436ab.771b8b') }}
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'CANCEL'" size="mini" type="info">
              {{ $t('822436ab.0a7dff') }}
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'PROCESSING'" size="mini" type="success">
              {{ $t('822436ab.cd3291') }}
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'CHANGE'" size="mini" type="danger">
              {{ $t('822436ab.c59ead') }}
            </el-tag>
            <el-tag v-if="scope.row.refund_status == 'REFUNDCLOSE'" type="info" size="mini">
              {{ $t('822436ab.1d83a4') }}
            </el-tag>
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
    </el-form>

    <SpDialog
      ref="refundDialogRef"
      v-model="refundDialog"
      :title="$t('822436ab.d59116') + refundForm.order_id + $t('822436ab.5942e7')"
      :confirm-status="refundLoading"
      :form="refundForm"
      :form-list="refundFormList"
      @onSubmit="onrefundSubmit"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { exportRefundList } from '@/api/aftersales'
import mixin, { pageMixin } from '@/mixins'
import { i18n } from '@/i18n'
import { formatMoneyWithSymbol, getCurrencySymbol } from '@/utils'
export default {
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      distributor: {
        id: undefined,
        name: undefined
      },
      create_time: '',
      refund_bn: undefined,
      order_id: undefined,
      mobile: undefined,
      refund_type: undefined,
      refund_channel: undefined,
      refund_status: undefined
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false,
      shopList: [],
      refundTypeList: [
        { name: i18n.t('822436ab.a8b0c2'), value: '' },
        { name: i18n.t('822436ab.59bd68'), value: '0' },
        { name: i18n.t('822436ab.63d2ec'), value: '1' },
        { name: i18n.t('822436ab.518ce0'), value: '2' }
      ],
      refundChannelList: [
        { name: i18n.t('822436ab.46a9a9'), value: 'offline' },
        { name: i18n.t('822436ab.eef322'), value: 'original' }
      ],
      refundsStatusList: [
        { name: i18n.t('822436ab.a8b0c2'), value: '' },
        { name: i18n.t('822436ab.97a81d'), value: 'READY' },
        { name: i18n.t('822436ab.202a8b'), value: 'AUDIT_SUCCESS' },
        { name: i18n.t('822436ab.d58cbd'), value: 'SUCCESS' },
        { name: i18n.t('822436ab.771b8b'), value: 'REFUSE' },
        { name: i18n.t('822436ab.0a7dff'), value: 'CANCEL' },
        { name: i18n.t('822436ab.cd3291'), value: 'PROCESSING' },
        { name: i18n.t('822436ab.c59ead'), value: 'CHANGE' },
        { name: i18n.t('822436ab.1d83a4'), value: 'REFUNDCLOSE' }
      ],
      refundDialog: false,
      refundLoading: false,
      refundForm: {
        refund_bn: '',
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        refund_account_name: '',
        refund_account_bank: '',
        refund_account_no: '',
        pay_type: '',
        order_id: '',
        refund_fee: ''
      },
      jstErpSetting: {},
      refundFormList: [
        {
          label: i18n.t('822436ab.4178e0'),
          key: 'pay_type',
          type: 'radio',
          required: true,
          options: [{ label: 'offline_pay', name: i18n.t('822436ab.2d8019') }]
        },
        {
          label: i18n.t('822436ab.84fc41'),
          key: 'bank_account_name',
          type: 'input',
          required: true,
          message: i18n.t('822436ab.2eb695')
        },
        {
          label: i18n.t('822436ab.27d6ee'),
          key: 'bank_account_no',
          type: 'input',
          required: true,
          message: i18n.t('822436ab.f9aa7d')
        },
        {
          label: i18n.t('822436ab.cc5ca0'),
          key: 'bank_name',
          type: 'input',
          required: true,
          message: i18n.t('822436ab.46222a')
        },
        {
          label: i18n.t('822436ab.4de280'),
          key: 'refund_account_name',
          type: 'input',
          required: true,
          message: i18n.t('822436ab.93e941')
        },
        {
          label: i18n.t('822436ab.abfe4d'),
          key: 'refund_account_bank',
          type: 'input',
          required: true,
          message: i18n.t('822436ab.d459b0')
        },
        {
          label: i18n.t('822436ab.4968ad'),
          key: 'refund_account_no',
          type: 'input',
          required: true,
          message: i18n.t('822436ab.fad689')
        },
        {
          label: i18n.t('822436ab.a0cd4c'),
          key: 'refund_fee',
          type: 'input',
          disabled: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    $route(to, from) {},
    'params.distributor': {
      handler: function (val) {
        if (!val.name && val.id) {
          this.params.distributor = {
            id: undefined,
            name: undefined
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    //获取店铺
    this.getDistributorList()
    this.fetchList()
    this.getJstErpSetting()
  },
  methods: {
    formatMoneyWithSymbol,
    getCurrencySymbol,
    handleDetail(row) {
      this.$router.push({
        path: this.matchRoutePath('detail'),
        query: { refund_bn: row.refund_bn }
      })
    },
    getJstErpSetting() {
      this.$api.third.getJstErpSetting().then((res) => {
        this.jstErpSetting = res
      })
    },
    handleSelectStore(storeItem) {
      this.params.distributor.id = storeItem.distributor_id
    },
    dateTransfer(val) {
      let time_start_begin = undefined
      let time_start_end = undefined
      if (val.length > 0) {
        time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      return {
        time_start_begin,
        time_start_end
      }
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getParams() {
      let params = {
        distributor_id: this.params.distributor.id || undefined,
        ...this.dateTransfer(this.params.create_time),
        refund_bn: this.params.refund_bn || undefined,
        order_id: this.params.order_id || undefined,
        refund_type: this.params.refund_type || undefined,
        mobile: this.params.mobile || undefined,
        refund_channel: this.params.refund_channel || undefined,
        refund_status: this.params.refund_status || undefined
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
      this.params = {
        ...this.params,
        distributor: {
          id: undefined,
          name: undefined
        }
      }
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
      const { list, total_count } = await this.$api.aftersales.getRefundsList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    queryStoreSearch(queryString, cb) {
      var restaurants = this.shopList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    async exportData() {
      const { status, url, filename } = await exportRefundList({
        ...this.getParams()
      })
      if (status) {
        this.$message({
          type: 'success',
          message: this.$t('822436ab.3e1ddd')
        })
        this.$export_open('refund_record_count')
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      } else {
        this.$message({
          type: 'error',
          message: this.$t('822436ab.bfd8d5')
        })
      }
    },
    async handleRefund({ order_id, refund_bn, refund_fee, cur_fee_symbol }) {
      const { bank_account_name, bank_account_no, bank_name } =
        await this.$api.aftersales.getOfflineInfo({ order_id })
      const symbol = cur_fee_symbol || '¥'
      this.refundForm = {
        order_id,
        refund_bn,
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        refund_account_name: bank_account_name,
        refund_account_bank: bank_account_no,
        refund_account_no: bank_name,
        pay_type: 'offline_pay',
        refund_fee: `${symbol}${refund_fee / 100}`
      }
      this.refundDialog = true
    },
    async onrefundSubmit() {
      this.refundLoading = true
      try {
        await this.$api.aftersales.refundOffline({ ...this.refundForm })
        this.refundLoading = false
        this.refundDialog = false
        this.fetchList()
      } catch (error) {
        this.refundLoading = false
      }
    },
    async getDistributorList() {
      var params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach((row) => {
          this.shopList.push({ value: row.name, distributor_id: row.distributor_id })
        })
      }
    }
  }
}
</script>
