<!-- * @description 分账统计详情 -->
<template>
  <div v-loading="loading">
    <OrderInfo :info="orderInfoList" />
    <LedgerInfo :data="lendgerInfoData" />
    <RefundInfo
      :data="refundInfoData"
      :arr="concatArr"
    />
  </div>
</template>
<script>
import { GetOrderInfoList } from '@/api/datacube'
import OrderInfo from './companydata/orderinfo.vue' // 订单信息
import LedgerInfo from './companydata/ledgerinfo.vue' // 分账信息
import RefundInfo from './companydata/refundinfo.vue' // 退款信息
export default {
  components: {
    OrderInfo,
    RefundInfo,
    LedgerInfo
  },
  data () {
    return {
      concatArr: [],
      testPosition: 0,
      orderInfoList: {}, // 订单信息
      lendgerInfoData: [], // 分账信息表格
      refundInfoData: [], // 退款信息表格
      loading: true,
      isShowLedger: false, // 是否展示分账信息
      isShowRefund: false // 是否展示退款信息
    }
  },
  mounted () {
    this.onGetDetail()
  },
  methods: {
    rowspan (spanArr, position, spanName) {
      this.refundInfoData.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
          position = 0
        } else {
          if (this.refundInfoData[index][spanName] === this.refundInfoData[index - 1][spanName]) {
            spanArr[position] += 1
            spanArr.push(0)
          } else {
            spanArr.push(1)
            position = index
          }
        }
      })
    },
    onGetDetail () {
      let orderId = this.$route.query.orderId
      GetOrderInfoList(orderId).then((res) => {
        // const { profitsharing_status, order_status } = res.data.data || {}
        // let profit = profitsharing_status === '2' // 已结算
        // let noprofit = profitsharing_status === '1' // 未结算

        // let isOne = order_status === 'pay' && profit // 订单支付成功+已结算
        // let isTwo = order_status === 'refundsuccess' && profit // 订单退款成功+已结算
        // let isThree = order_status === 'refundfail' && profit // 订单退款失败+已结算
        // let isFour = order_status === 'refunding' && noprofit // 订单退款中+未结算
        // let isFive = order_status === 'refundsuccess' && noprofit // 订单退款成功+未结算
        // let isSix = order_status === 'refundfail' && noprofit // 订单退款失败+未结算
        // if (isOne || isTwo || isThree) { // 分账信息show：订单支付成功+已结算、订单退款成功+已结算、订单退款失败+已结算
        //   this.isShowLedger = true
        // }
        // if (isThree || isTwo || isFour || isFive || isSix) { // 退款订单show：订单退款中/订单退款失败/订单退款成功+未结算、订单退款成功+已结算、订单退款失败+已结算
        //   this.isShowRefund = true
        // }
        this.orderInfoList = res.data.data
        this.refundInfoData = res.data.data.refund_list
        this.lendgerInfoData = res.data.data.profit_share_list
        this.loading = false
        this.rowspan(this.concatArr, this.testPosition, 'refund_bn')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order_info_card {
  .el-col {
    margin-top: 15px;
  }
  h3 {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
  .order_info_label {
  }
  .order_info_value {
    margin-left: 5px;
  }
}
</style>
