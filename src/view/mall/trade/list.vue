<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div class="page-body">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <!-- 新增 区域 -->
      <SpFilterFormItem prop="regionauth_id" label="区域:">
        <el-select v-model="params.regionauth_id" clearable placeholder="请选择">
          <el-option
            v-for="item in areaOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <!-- 修改  订单流水号 -->
      <SpFilterFormItem prop="oid" label="订单流水号:">
        <el-input v-model="params.oid" placeholder="订单流水号" />
      </SpFilterFormItem>
      <!-- 修改 -->
      <SpFilterFormItem prop="mobile" label="交易单号:">
        <el-input v-model="params.mobile" placeholder="手机号/交易单号" />
      </SpFilterFormItem>
      <!-- 新增 订单编号 -->
      <SpFilterFormItem prop="orderId" label="订单编号:">
        <el-input v-model="params.orderId" placeholder="订单编号" />
      </SpFilterFormItem>
      <!-- 新增 会员卡号 -->
      <SpFilterFormItem prop="user_card_code" label="会员卡号:">
        <el-input v-model="params.user_card_code" placeholder="会员卡号" />
      </SpFilterFormItem>
      <!-- 新增 支付流水号 -->
      <SpFilterFormItem prop="payFlow" label="支付流水号:">
        <el-input v-model="params.payFlow" placeholder="支付流水号" />
      </SpFilterFormItem>
      <!-- 新增 商品订单号 -->
      <SpFilterFormItem prop="goodsOrderId" label="商品订单号:">
        <el-input v-model="params.goodsOrderId" placeholder="商品订单号" />
      </SpFilterFormItem>
      <!-- 新增 手机号 -->
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="params.mobile" placeholder="手机号" />
      </SpFilterFormItem>
      <!-- 修改 交易时间 -->
      <SpFilterFormItem prop="time_start" label="交易时间:">
        <el-date-picker
          v-model="params.time_start"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="选择日期范围"
        />
      </SpFilterFormItem>
      <!-- 新增 交易完成时间 -->
      <SpFilterFormItem prop="time_expire" label="交易完成时间:">
        <el-date-picker
          v-model="params.time_expire"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="选择日期范围"
        />
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
          <!-- 隐藏 -->
          <!-- <el-table-column type="expand">
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
                        <hr />
                      </div>
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.discountFee / 100 }}元
                    </div>
                  </el-popover>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column> -->
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
          <!-- 新增 订单编号 -->
          <el-table-column label="订单编号" width="160">
            <template slot-scope="scope">
              {{ scope.row.orderId }}
            </template>
          </el-table-column>

          <el-table-column label="订单信息" width="220">
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

          <!-- 新增 会员卡号 -->
          <el-table-column label="会员卡号" width="160">
            <template slot-scope="scope">
              {{ scope.row.user_card_code }}
            </template>
          </el-table-column>
          <!-- 新增 区域 -->
          <el-table-column label="区域" width="160">
            <template slot-scope="scope">
              {{ scope.row.regionauth_name }}
            </template>
          </el-table-column>

          <el-table-column label="支付方式">
            <template slot-scope="scope">
              <span>{{ fitlerPayType(scope.row.payChannel, scope.row.payType) }}</span>
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

          <!-- 新增 支付流水号 -->
          <el-table-column label="支付流水号" width="160">
            <template slot-scope="scope">
              {{ scope.row.payFlow }}
            </template>
          </el-table-column>

          <!-- 新增 订单流水号 -->
          <el-table-column label="订单流水号" width="160">
            <template slot-scope="scope">
              {{ scope.row.orderId }}
            </template>
          </el-table-column>
          <el-table-column label="交易时间" width="160">
            <template slot-scope="scope">
              {{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <!-- 新增 交易完成时间 -->
          <el-table-column label="交易完成时间" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.timeEnd">
                {{ scope.row.timeEnd | datetime('YYYY-MM-DD HH:mm:ss') }}
              </span>
              <span v-else> - </span>
            </template>
          </el-table-column>

          <!-- 隐藏 -->
          <!--           
          <el-table-column label="配送方式">
            <template slot-scope="scope">
              {{ getDistributionType(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="配送费">
            <template slot-scope="scope">
              {{ scope.row.self_delivery_fee && scope.row.self_delivery_fee / 100 + '元' }}
            </template>
          </el-table-column>
          <el-table-column label="配送员">
            <template slot-scope="scope">
              {{ scope.row.self_delivery_operator_name }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="业务员">
            <template slot-scope="scope">
              {{ scope.row.salesman_mobile }}
              <el-tooltip
                v-if="datapass_block == 0"
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

          <!-- 隐藏 -->
          <!-- <el-table-column
            v-if="$store.getters.login_type != 'merchant' && !VERSION_IN_PURCHASE"
            width="60"
            label="汇率"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.curFeeRate }}</span>
            </template>
          </el-table-column> -->
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
import { PAY_TYPE, DISTRIBUTION_TYPE } from '@/consts'
import api from '@/api'

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
      downloadName: '',
      distributionType: DISTRIBUTION_TYPE,
      areaOptions: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.fetchList()
    api.regionauth.getRegionauth().then((res) => {
      this.areaOptions = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name,
        title: el.regionauth_name
      }))
    })
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
