<template>
  <div>
    <el-row
      class="filter-header"
      :gutter="20"
    >
      <el-col>
        <shop-select
          wxshops
          @update="shopHandle"
        /><!--distributors wxshops 需要哪个api传哪个-->
        <el-date-picker
          v-model="create_time"
          type="daterange"
          placeholder="选择日期范围"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="dateChange"
        />
        <el-input
          v-model="mobile"
          class="input-m"
          placeholder="手机号/订单号"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="numberSearch"
          />
        </el-input>
        <el-button
          type="primary"
          @click="exportData"
        >
          导出
        </el-button>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
        >
          <i
            slot="reference"
            class="el-icon-question"
          />
        </el-popover>
      </el-col>
    </el-row>
    <el-dialog
      title="交易单下载"
      :visible.sync="downloadView"
      :close-on-click-modal="false"
    >
      <template v-if="downloadUrl">
        <a
          :href="downloadUrl"
          download
        >{{ downloadName }}</a>
      </template>
    </el-dialog>
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="全部"
        name="all"
      />
      <el-tab-pane
        label="支付完成"
        name="success"
      />
      <el-tab-pane
        label="未支付"
        name="notpay"
      />
      <el-table
        v-loading="loading"
        :data="list"
        style="width: 100%"
        :height="wheight - 140"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="订单号：">
                <router-link
                  :to="{
                    path:
                      $route.path.indexOf('servicetrade') === -1
                        ? matchInternalRoute('tradenormalorders_detail')
                        : matchInternalRoute('tradeservice_detail'),
                    query: { orderId: scope.row.orderId, resource: '/mall/trade/payment' }
                  }"
                >
                  {{ scope.row.orderId }}
                </router-link>
              </el-form-item>
              <el-form-item label="支付方式：">
                <span v-if="scope.row.payType == 'wxpay'">微信支付</span>
                <span v-if="scope.row.payType == 'deposit'">余额支付</span>
                <span v-if="scope.row.payType == 'pos'">POS银行卡支付</span>
              </el-form-item>
              <el-form-item label="总金额：">
                <span>{{ scope.row.curFeeSymbol }}{{ scope.row.totalFee / 100 }}</span>
              </el-form-item>
              <el-form-item label="优惠金额：">
                <el-popover
                  v-if="scope.row.discountInfo"
                  trigger="hover"
                  placement="top"
                >
                  <div v-for="item in scope.row.discountInfo">
                    <div v-if="item.discount_fee">
                      <p v-if="item.coupon_code">
                        优惠券码：{{ item.coupon_code }}
                      </p>
                      <p v-if="item.member_card_code">
                        会员卡号：{{ item.member_card_code }}
                      </p>
                      <p>优惠原因：{{ item.info }}</p>
                      <p>优惠方案：{{ item.rule }}</p>
                      <p>优惠金额：{{ scope.row.curFeeSymbol }}{{ item.discount_fee / 100 }} 元</p>
                      <hr>
                    </div>
                  </div>
                  <div
                    slot="reference"
                    class="name-wrapper"
                  >
                    {{ scope.row.discountFee / 100 }}元
                  </div>
                </el-popover>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="交易单"
          width="270"
        >
          <template slot-scope="scope">
            <div class="order-num">
              {{ scope.row.tradeId }}
              <el-tooltip
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.tradeId"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
            <div class="order-time">
              <el-tooltip
                effect="dark"
                content="创建时间"
                placement="top-start"
              >
                <i class="el-icon-time" />
              </el-tooltip>
              {{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="订单信息"
          min-width="300"
        >
          <template slot-scope="scope">
            <div class="order-num">
              <el-tooltip
                effect="dark"
                content="联系方式"
                placement="top-start"
              >
                <i class="el-icon-mobile" />
              </el-tooltip>
              {{ scope.row.mobile }}
              <el-tooltip
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.mobile"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
            <div class="order-time">
              商品：{{ scope.row.body }}
            </div>
            <div>
              实付：<span
                class="mark"
              ><span class="cur">{{ scope.row.curFeeSymbol }}</span>{{ scope.row.payFee / 100 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="订单金额"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.curPayFee"
            ><span class="cur">￥</span>{{ scope.row.curPayFee / 100 }}</span>
            <span
              v-else
            ><span class="cur">{{ scope.row.curFeeSymbol }}</span>{{ scope.row.totalFee / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          label="汇率"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.curFeeRate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="支付状态"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.tradeState == 'SUCCESS'"
              type="success"
              size="mini"
            >
              支付成功
            </el-tag>
            <el-tag
              v-if="scope.row.tradeState == 'NOTPAY'"
              size="mini"
            >
              未支付
            </el-tag>
            <el-tag
              v-if="scope.row.tradeState == 'CLOSED'"
              type="primary"
              size="mini"
            >
              已关闭
            </el-tag>
            <el-tag
              v-if="scope.row.tradeState == 'REVOKED'"
              type="primary"
              size="mini"
            >
              已撤销
            </el-tag>
            <el-tag
              v-if="scope.row.tradeState == 'PAYERROR'"
              type="primary"
              size="mini"
            >
              支付失败
            </el-tag>
            <el-tag
              v-if="scope.row.tradeState == 'REFUND_PROCESS'"
              type="warning"
              size="mini"
            >
              退款处理中
            </el-tag>
            <el-tag
              v-if="scope.row.tradeState == 'REFUND_SUCCESS'"
              type="info"
              size="mini"
            >
              退款成功
            </el-tag>
            <el-tag
              v-if="scope.row.tradeState == 'REFUND_FAIL'"
              type="danger"
              size="mini"
            >
              退款失败
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="content-center content-padded">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page.sync="params.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTradeList, tradeExport } from '../../../api/trade'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  data () {
    return {
      activeName: 'all',
      loading: false,
      total_count: 0,
      status: '',
      create_time: '',
      mobile: '',
      date_begin: '',
      date_end: '',
      params: {
        page: 1,
        pageSize: 20
      },
      list: [],
      currentShop: '',
      downloadView: false,
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getList(this.params)
  },
  methods: {
    onCopy () {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    // 切换tab
    handleClick (tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    shopHandle (val) {
      val && val.shop_id
      this.currentShop = val.shop_id
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    numberSearch (e) {
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    dateChange (val) {
      if (val.length > 0) {
        this.date_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.date_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.date_begin = ''
        this.date_end = ''
      }
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getParams()
      this.getList(this.params)
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getList(this.params)
    },
    getParams () {
      this.params.time_start_begin = this.date_begin
      this.params.time_start_end = this.date_end
      this.params.mobile = this.mobile
      this.params.shop_id = this.currentShop
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    getList (filter) {
      this.loading = true
      getTradeList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    exportData () {
      this.getParams()
      this.params.page = 1
      tradeExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: '无内容可导出 或 执行失败，请检查重试'
          })
          return
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.demo-table-expand {
  font-size: 0;
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
