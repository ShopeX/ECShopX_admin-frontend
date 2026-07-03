<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
.demo-table-expand {
  font-size: 0;
  padding: 0 20px;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<template>
  <SpPage>
    <div class="page-body">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="create_time" :label="$t('35ec026d.8d3bf9')">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('35ec026d.4b8cb9')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" :label="$t('35ec026d.dcffc8')">
          <el-input v-model="params.mobile" :placeholder="$t('35ec026d.2129ea')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="orderId" :label="$t('35ec026d.070dce')">
          <el-input v-model="params.orderId" :placeholder="$t('35ec026d.1e8dc2')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="receipt_type" :label="$t('35ec026d.b6ae11')">
          <el-select v-model="params.receipt_type" clearable :placeholder="$t('35ec026d.708c9d')">
            <el-option
              v-for="item in distributionType"
              :key="item.value"
              size="mini"
              :label="$t(item.title)"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" plain @click="exportData">
          {{ $t('35ec026d.55405e') }}
        </el-button>
      </div>

      <el-dialog
        :title="$t('35ec026d.2f9864')"
        :visible.sync="downloadView"
        :close-on-click-modal="false"
      >
        <template v-if="downloadUrl">
          <a :href="downloadUrl" download>{{ downloadName }}</a>
        </template>
      </el-dialog>

      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="$t(item.nameKey)"
          :name="item.activeName"
        >
          <el-table
            v-loading="loading"
            :data="tableList"
            border
            style="width: 100%"
            :height="wheight - 140"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item :label="$t('35ec026d.a1e65c')">
                    <router-link
                      v-if="scope.row.tradeSourceType != 'membercard'"
                      :to="{
                        path: fnPath(),
                        query: { orderId: scope.row.orderId, resource: '/mall/trade/payment' }
                      }"
                    >
                      {{ scope.row.orderId }}
                    </router-link>
                    <span v-else>{{ scope.row.orderId }}</span>
                  </el-form-item>
                  <el-form-item :label="$t('35ec026d.fc4d64')">
                    <span>{{ $t(fitlerPayType(scope.row.payChannel, scope.row.payType)) }}</span>
                    <!-- <span v-if="scope.row.payType == 'wxpay' || scope.row.payType == 'wxpayjs'"
                    >微信支付</span
                  >
                  <span v-if="scope.row.payType == 'wxpayapp'">微信APP支付</span>
                  <span v-if="scope.row.payType == 'wxpayh5'">微信H5支付</span>
                  <span v-if="scope.row.payType == 'wxpaypc'">微信POS支付</span>
                  <span v-if="scope.row.payType == 'wxpaypos'">微信扫码支付</span>
                  <span v-if="scope.row.payType == 'alipayapp'">支付宝APP支付</span>
                  <span v-if="scope.row.payType == 'alipay'">支付宝支付</span>
                  <span v-if="scope.row.payType == 'alipayh5'">支付宝H5支付</span>
                  <span v-if="scope.row.payType == 'alipaypos'">支付宝扫码支付</span>
                  <span v-if="scope.row.payType == 'deposit'">余额支付</span>
                  <span v-if="scope.row.payType == 'ebuy'">EBUY支付</span>
                    <span v-if="scope.row.payType == 'point'">积分支付</span>
                    <span v-if="scope.row.payType == 'pos'">现金支付</span>
                    <span v-if="scope.row.payType == 'hfpay'">汇付支付</span>
                    <span v-if="scope.row.payType == 'chinaums'">微信支付-银联</span> -->
                  </el-form-item>
                  <el-form-item :label="$t('35ec026d.c0ae60')">
                    <span>{{ scope.row.curFeeSymbol }}{{ scope.row.totalFee / 100 }}</span>
                  </el-form-item>
                  <el-form-item v-if="!VERSION_IN_PURCHASE()" :label="$t('35ec026d.87ae51')">
                    <el-popover v-if="scope.row.discountInfo" trigger="hover" placement="top">
                      <div v-for="item in scope.row.discountInfo" :key="item.orderId">
                        <div v-if="item.discount_fee">
                          <p v-if="item.coupon_code">
                            {{ $t('35ec026d.5cc63d') }}{{ item.coupon_code }}
                          </p>
                          <p v-if="item.member_card_code">
                            {{ $t('35ec026d.c26cd3') }}{{ item.member_card_code }}
                          </p>
                          <p>{{ $t('35ec026d.fd30de') }}{{ item.info }}</p>
                          <p>{{ $t('35ec026d.e5c225') }}{{ item.rule }}</p>
                          <p>
                            {{ $t('35ec026d.87ae51') }}{{ scope.row.curFeeSymbol
                            }}{{ item.discount_fee / 100 }} {{ $t('35ec026d.c16655') }}
                          </p>
                          <hr />
                        </div>
                      </div>
                      <div slot="reference" class="name-wrapper">
                        {{
                          formatMoneyWithSymbol(scope.row.discountFee, getCurrencySymbol(scope.row))
                        }}
                      </div>
                    </el-popover>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column :label="$t('35ec026d.8ab066')" width="180">
              <template slot-scope="scope">
                <div class="order-num">
                  {{ scope.row.tradeId }}
                  <el-tooltip effect="dark" :content="$t('35ec026d.79d3ab')" placement="top-start">
                    <i
                      v-clipboard:copy="scope.row.tradeId"
                      v-clipboard:success="onCopySuccess"
                      class="el-icon-document-copy"
                    />
                  </el-tooltip>
                </div>
                <div v-if="scope.row.distributorId !== '0'" class="order-store">
                  <el-tooltip effect="dark" :content="$t('35ec026d.8a0cc2')" placement="top-start">
                    <i class="el-icon-office-building" />
                  </el-tooltip>
                  {{ scope.row.distributor_name }}
                </div>
                <!-- <div class="order-time">
                <el-tooltip effect="dark" :content="$t('35ec026d.eca37c')" placement="top-start">
                    <i class="el-icon-time" />
                  </el-tooltip>
                  {{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}
                </div> -->
              </template>
            </el-table-column>
            <el-table-column :label="$t('35ec026d.f8de2c')" width="170">
              <template slot-scope="scope">
                {{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('35ec026d.a6d10d')" width="200">
              <template slot-scope="scope">
                <div class="order-num">
                  {{ scope.row.orderId }}
                  <el-tooltip effect="dark" :content="$t('35ec026d.79d3ab')" placement="top-start">
                    <i
                      v-clipboard:copy="scope.row.orderId"
                      v-clipboard:success="onCopySuccess"
                      class="el-icon-document-copy"
                    />
                  </el-tooltip>
                </div>
                <div class="order-num">
                  <el-tooltip effect="dark" :content="$t('35ec026d.b58943')" placement="top-start">
                    <i class="el-icon-mobile" />
                  </el-tooltip>
                  {{ scope.row.mobile }}
                  <el-tooltip
                    v-if="datapass_block == 0"
                    effect="dark"
                    :content="$t('35ec026d.79d3ab')"
                    placement="top-start"
                  >
                    <i
                      v-clipboard:copy="scope.row.mobile"
                      v-clipboard:success="onCopySuccess"
                      class="el-icon-document-copy"
                    />
                  </el-tooltip>
                </div>
                <div class="order-time">{{ $t('35ec026d.10fe9c') }}{{ scope.row.body }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('35ec026d.d2fdde')" width="180">
              <template slot-scope="scope">
                <div v-if="scope.row.payType == 'point'">
                  <span class="mark">{{ scope.row.payFee }} {{ $t('35ec026d.9f68a8') }}</span>
                </div>
                <div v-else>
                  <span>{{
                    formatMoneyWithSymbol(scope.row.payFee, getCurrencySymbol(scope.row))
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('35ec026d.0c9d2b')">
              <template slot-scope="scope">
                <span>{{ $t(fitlerPayType(scope.row.payChannel, scope.row.payType)) }}</span>
                <!-- <span v-if="scope.row.payType == 'wxpay' || scope.row.payType == 'wxpayjs'"
                >微信支付</span
              >
              <span v-if="scope.row.payType == 'adapay' && scope.row.payChannel == 'wx_lite'"
                >微信支付</span
              >
              <span v-if="scope.row.payType == 'adapay' && scope.row.payChannel == 'wx_pub'"
                >微信支付</span
              >
              <span v-if="scope.row.payType == 'adapay' && scope.row.payChannel == 'alipay_wap'"
                >支付宝支付</span
              >
              <span v-if="scope.row.payType == 'wxpayapp'">微信APP支付</span>
              <span v-if="scope.row.payType == 'wxpayh5'">微信H5支付</span>
              <span v-if="scope.row.payType == 'wxpaypc'">微信POS支付</span>
              <span v-if="scope.row.payType == 'wxpaypos'">微信扫码支付</span>
              <span v-if="scope.row.payType == 'alipayapp'">支付宝APP支付</span>
              <span v-if="scope.row.payType == 'alipay'">支付宝支付</span>
              <span v-if="scope.row.payType == 'alipayh5'">支付宝H5支付</span>
              <span v-if="scope.row.payType == 'alipaypos'">支付宝扫码支付</span>
              <span v-if="scope.row.payType == 'deposit'">余额支付</span>
              <span v-if="scope.row.payType == 'ebuy'">EBUY支付</span>
                <span v-if="scope.row.payType == 'point'">积分支付</span>
                <span v-if="scope.row.payType == 'pos'">现金支付</span>
                <span v-if="scope.row.payType == 'hfpay'">汇付支付</span>
                <span v-if="scope.row.payType == 'chinaums'">微信支付-银联</span> -->
              </template>
            </el-table-column>

            <el-table-column width="180" :label="$t('35ec026d.0cacd6')">
              <template slot-scope="scope">
                <template v-if="scope.row.payType == 'point'">
                  <span>{{ scope.row.payFee }} {{ $t('35ec026d.9f68a8') }}</span>
                </template>
                <template v-else>
                  <span v-if="scope.row.curPayFee">{{
                    formatMoneyWithSymbol(scope.row.curPayFee, getCurrencySymbol(scope.row))
                  }}</span>
                  <span v-else>{{
                    formatMoneyWithSymbol(scope.row.totalFee, getCurrencySymbol(scope.row))
                  }}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column :label="$t('35ec026d.edfe4c')">
              <template slot-scope="scope">
                {{ getDistributionType(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('35ec026d.1138a9')">
              <template slot-scope="scope">
                {{
                  scope.row.self_delivery_fee
                    ? formatMoneyWithSymbol(
                        scope.row.self_delivery_fee,
                        getCurrencySymbol(scope.row)
                      )
                    : ''
                }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('35ec026d.b7765e')">
              <template slot-scope="scope">
                {{ scope.row.self_delivery_operator_name }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="mobile" label="业务员">
              <template slot-scope="scope">
                {{ scope.row.salesman_mobile }}
                <el-tooltip
                  v-if="datapass_block == 0 && scope.row.salesman_mobile"
                  effect="dark"
                  content="复制"
                  placement="top-start"
                >
                  <i
                    v-clipboard:copy="scope.row.salesman_mobile"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </template>
            </el-table-column> -->

            <el-table-column
              v-if="$store.getters.login_type != 'merchant' && !VERSION_IN_PURCHASE()"
              width="60"
              :label="$t('35ec026d.d3bc58')"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.curFeeRate }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" :label="$t('35ec026d.510fa2')">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.tradeState == 'SUCCESS'" type="success" size="mini">
                  {{ $t('35ec026d.eb5dc9') }}
                </el-tag>
                <el-tag v-if="scope.row.tradeState == 'NOTPAY'" size="mini">
                  {{ $t('35ec026d.608afd') }}
                </el-tag>
                <el-tag v-if="scope.row.tradeState == 'CLOSED'" type="primary" size="mini">
                  {{ $t('35ec026d.9c5850') }}
                </el-tag>
                <el-tag v-if="scope.row.tradeState == 'REVOKED'" type="primary" size="mini">
                  {{ $t('35ec026d.50239f') }}
                </el-tag>
                <el-tag v-if="scope.row.tradeState == 'PAYERROR'" type="primary" size="mini">
                  {{ $t('35ec026d.4548cc') }}
                </el-tag>
                <el-tag v-if="scope.row.tradeState == 'REFUND_PROCESS'" type="warning" size="mini">
                  {{ $t('35ec026d.73ce8f') }}
                </el-tag>
                <el-tag v-if="scope.row.tradeState == 'REFUND_SUCCESS'" type="info" size="mini">
                  {{ $t('35ec026d.d58cbd') }}
                </el-tag>
                <el-tag v-if="scope.row.tradeState == 'REFUND_FAIL'" type="danger" size="mini">
                  {{ $t('35ec026d.7c2544') }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="content-center content-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :current-page.sync="page.pageIndex"
              :page-sizes="[20, 30, 50]"
              :total="page.total"
              :page-size="params.pageSize"
              @current-change="onCurrentChange"
              @size-change="onSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import mixin, { pageMixin } from '@/mixins'
import { PAY_TYPE, DISTRIBUTION_TYPE } from '@/consts'
import { formatMoneyWithSymbol, getCurrencySymbol } from '@/utils'

export default {
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      create_time: '',
      mobile: undefined,
      orderId: undefined,
      receipt_type: undefined
    }
    return {
      initialParams,
      activeName: 'all',
      tabList: [
        { nameKey: '35ec026d.a8b0c2', activeName: 'all' },
        { nameKey: '35ec026d.21d63b', activeName: 'success' },
        { nameKey: '35ec026d.608afd', activeName: 'notpay' }
      ],
      datapass_block: 1,
      loading: false,
      params: {
        ...initialParams
      },
      downloadView: false,
      downloadUrl: '',
      downloadName: '',
      distributionType: DISTRIBUTION_TYPE
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    formatMoneyWithSymbol,
    getCurrencySymbol,
    fitlerPayType(payChannel, payType) {
      return payChannel ? PAY_TYPE[payChannel] : PAY_TYPE[payType]
    },
    fnPath() {
      if (this.$store.getters.login_type == 'merchant') {
        return `/merchant/order/order-manage/order-list/detail`
      } else if (this.$store.getters.login_type == 'distributor') {
        return `/shopadmin/order/order-manage/order-list/detail`
      }

      return this.$route.path.indexOf('servicetrade') === -1
        ? '/order/order-manage/order-list/detail'
        : '/order/servicetrade/tradeservice/detail'
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateTransfer(val, isExport) {
      let time_start_begin = undefined
      let time_start_end = undefined
      if (val.length > 0) {
        time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      if (isExport) {
        return {
          date_begin: time_start_begin,
          date_end: time_start_end
        }
      }
      return {
        time_start_begin,
        time_start_end
      }
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    getParams(isExport) {
      let params = {
        ...this.dateTransfer(this.params.create_time, isExport),
        mobile: this.params.mobile || undefined,
        orderId: this.params.orderId || undefined,
        status: this.params.status,
        receipt_type: this.params.receipt_type
      }
      return params
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.onSearch()
    },
    getDistributionType({ receipt_type }) {
      const fd = DISTRIBUTION_TYPE.find((item) => item.value == receipt_type)
      if (fd) {
        return fd.title
      }
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count, datapass_block } = await this.$api.trade.getTradeList(params)
      this.tableList = list
      this.page.total = total_count
      this.datapass_block = datapass_block
      this.loading = false
    },
    async exportData() {
      const { status, url, filename } = await this.$api.trade.tradeExport({
        ...this.getParams(true)
      })
      if (status) {
        this.$message({
          type: 'success',
          message: this.$t('35ec026d.3e1ddd')
        })
        this.$export_open('tradedata')
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      } else {
        this.$message({
          type: 'error',
          message: this.$t('35ec026d.89ae53')
        })
        return
      }
    }
  }
}
</script>
