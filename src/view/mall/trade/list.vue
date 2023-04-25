<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div class="page-body">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="create_time" label="日期范围:">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="选择日期范围"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="单号:">
        <el-input v-model="params.mobile" placeholder="手机号/交易单号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="orderId" label="订单号:">
        <el-input v-model="params.orderId" placeholder="订单号" />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <export-tip @exportHandle="exportData">
        <el-button type="primary" plain> 导出 </el-button>
      </export-tip>
    </div>

    <el-dialog title="交易单下载" :visible.sync="downloadView" :close-on-click-modal="false">
      <template v-if="downloadUrl">
        <a :href="downloadUrl" download>{{ downloadName }}</a>
      </template>
    </el-dialog>

    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
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
          :height="wheight - 140"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="订单号：">
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
                <el-form-item label="支付方式：">
                  <span>{{ fitlerPayType(scope.row.payChannel, scope.row.payType) }}</span>
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
                <el-form-item label="总金额：">
                  <span>{{ scope.row.curFeeSymbol }}{{ scope.row.totalFee / 100 }}</span>
                </el-form-item>
                <el-form-item v-if="!VERSION_IN_PURCHASE" label="优惠金额：">
                  <el-popover v-if="scope.row.discountInfo" trigger="hover" placement="top">
                    <div v-for="item in scope.row.discountInfo" :key="item.orderId">
                      <div v-if="item.discount_fee">
                        <p v-if="item.coupon_code">优惠券码：{{ item.coupon_code }}</p>
                        <p v-if="item.member_card_code">会员卡号：{{ item.member_card_code }}</p>
                        <p>优惠原因：{{ item.info }}</p>
                        <p>优惠方案：{{ item.rule }}</p>
                        <p>
                          优惠金额：{{ scope.row.curFeeSymbol }}{{ item.discount_fee / 100 }} 元
                        </p>
                        <hr>
                      </div>
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.discountFee / 100 }}元
                    </div>
                  </el-popover>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="交易单" width="180">
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.tradeId }}
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.tradeId"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div v-if="scope.row.distributorId !== '0'" class="order-store">
                <el-tooltip effect="dark" content="店铺名" placement="top-start">
                  <i class="el-icon-office-building" />
                </el-tooltip>
                {{ scope.row.distributor_name }}
              </div>
              <!-- <div class="order-time">
                <el-tooltip effect="dark" content="创建时间" placement="top-start">
                    <i class="el-icon-time" />
                  </el-tooltip>
                  {{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}
                </div> -->
            </template>
          </el-table-column>
          <el-table-column label="交易时间" width="160">
            <template slot-scope="scope">
              {{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column label="订单信息">
            <template slot-scope="scope">
              <div class="order-num">
                <el-tooltip effect="dark" content="联系方式" placement="top-start">
                  <i class="el-icon-mobile" />
                </el-tooltip>
                {{ scope.row.mobile }}
                <el-tooltip
                  v-if="datapass_block == 0"
                  effect="dark"
                  content="复制"
                  placement="top-start"
                >
                  <i
                    v-clipboard:copy="scope.row.mobile"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div class="order-time">商品：{{ scope.row.body }}</div>
            </template>
          </el-table-column>
          <el-table-column label="实付" width="180">
            <template slot-scope="scope">
              <div>
                实付：<span v-if="scope.row.payType == 'point'" class="mark"
                  >{{ scope.row.payFee }} 积分</span
                >
                <span v-else class="mark"
                  ><span class="cur">{{ scope.row.curFeeSymbol }}</span
                  >{{ scope.row.payFee / 100 }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="支付方式">
            <template slot-scope="scope">
              <span>{{ fitlerPayType(scope.row.payChannel, scope.row.payType) }}</span>
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

          <el-table-column width="100" label="订单金额">
            <template slot-scope="scope">
              <template v-if="scope.row.payType == 'point'">
                <span>{{ scope.row.payFee }} 积分</span>
              </template>
              <template v-else>
                <span v-if="scope.row.curPayFee"
                  ><span class="cur">￥</span>{{ scope.row.curPayFee / 100 }}</span
                >
                <span v-else
                  ><span class="cur">{{ scope.row.curFeeSymbol }}</span
                  >{{ scope.row.totalFee / 100 }}</span
                >
              </template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="$store.getters.login_type != 'merchant' && !VERSION_IN_PURCHASE"
            width="60"
            label="汇率"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.curFeeRate }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" label="支付状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.tradeState == 'SUCCESS'" type="success" size="mini">
                支付成功
              </el-tag>
              <el-tag v-if="scope.row.tradeState == 'NOTPAY'" size="mini"> 未支付 </el-tag>
              <el-tag v-if="scope.row.tradeState == 'CLOSED'" type="primary" size="mini">
                已关闭
              </el-tag>
              <el-tag v-if="scope.row.tradeState == 'REVOKED'" type="primary" size="mini">
                已撤销
              </el-tag>
              <el-tag v-if="scope.row.tradeState == 'PAYERROR'" type="primary" size="mini">
                支付失败
              </el-tag>
              <el-tag v-if="scope.row.tradeState == 'REFUND_PROCESS'" type="warning" size="mini">
                退款处理中
              </el-tag>
              <el-tag v-if="scope.row.tradeState == 'REFUND_SUCCESS'" type="info" size="mini">
                退款成功
              </el-tag>
              <el-tag v-if="scope.row.tradeState == 'REFUND_FAIL'" type="danger" size="mini">
                退款失败
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
</template>
<script>
import { mapGetters } from 'vuex'
import mixin, { pageMixin } from '@/mixins'
import { PAY_TYPE } from '@/consts'

export default {
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      create_time: '',
      mobile: undefined,
      orderId: undefined
    }
    return {
      initialParams,
      activeName: 'all',
      tabList: [
        { name: '全部', activeName: 'all' },
        { name: '支付完成', activeName: 'success' },
        { name: '未支付', activeName: 'notpay' }
      ],
      datapass_block: 1,
      loading: false,
      params: {
        ...initialParams
      },
      downloadView: false,
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fitlerPayType(payChannel, payType) {
      return payChannel ? PAY_TYPE[payChannel] : PAY_TYPE[payType]
    },
    fnPath() {
      if (this.$store.getters.login_type == 'merchant') {
        return `/merchant/order/tradenormalorders/detail`
      } else if (this.$store.getters.login_type == 'distributor') {
        return `/shopadmin/order/tradenormalorders/detail`
      }

      return this.$route.path.indexOf('servicetrade') === -1
        ? '/order/entitytrade/tradenormalorders/detail'
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
        status: this.params.status
      }
      return params
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
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
          message: '已加入执行队列，请在设置-导出列表中下载'
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
          message: '无内容可导出 或 执行失败，请检查重试'
        })
        return
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
