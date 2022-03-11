<template>
  <CustomCard
    title="支付清单"
    :info="info"
    :data-source="tradeInfo"
    :is-common="true"
  />
</template>

<script>
import { dateFilter } from '@/utils'
import CustomCard from './CustomCard'
export default {
  components: {
    CustomCard
  },
  props: ['cardConfig', 'orderInfo', 'memberInfo', 'tradeInfo'],
  data () {
    const self = this
    return {
      info: [
        [
          { name: '交易单号', field: 'tradeId' },
          { name: '交易流水号', field: 'transactionId' },
          { name: '商品总额', field: '', filter: self.orderTotalFilter },
          {
            name: '运费',
            field: '',
            filter: self.orderFreightFilter
          }
        ],
        [
          { name: '会员优惠', field: '', filter: self.memberDiscountFilter },
          {
            name: '优惠券减免',
            field: '',
            filter: self.couponsReductionFilter
          },
          {
            name: '优惠总金额',
            field: '',
            filter: self.disCountTotalMoney
          }
          // { name: "积分抵扣", field: "point_use", filter: self.pointFilter }
        ],
        [
          { name: '应付总金额', field: '', filter: self.totalFilter },
          { name: '实付总金额', field: '', filter: self.realTotalFilter },
          { name: '支付方式', field: 'payType', filter: self.payTypeFilter },
          {
            name: '支付状态',
            field: 'tradeState',
            filter: self.tradeStateFilter
          }
        ],
        [
          { name: '交易时间', field: 'timeStart', filter: dateFilter },
          { name: '交易结束时间', field: 'timeExpire', filter: dateFilter }
        ]
      ]
    }
  },
  methods: {
    orderFreightFilter () {
      return `${this.orderInfo.fee_symbol}${(this.orderInfo.freight_fee / 100).toFixed(2)}`
    },
    memberDiscountFilter () {
      return `- ${this.orderInfo.fee_symbol}${(this.orderInfo.member_discount / 100).toFixed(2)}`
    },
    couponsReductionFilter () {
      return `-${this.orderInfo.fee_symbol}${(this.orderInfo.coupon_discount / 100).toFixed(2)}`
    },
    disCountTotalMoney () {
      return `-${this.orderInfo.fee_symbol}${
        this.orderInfo.discount_fee ? (this.orderInfo.discount_fee / 100).toFixed(2) : 0
      }`
    },
    pointFilter () {
      // 积分抵扣
      return `${this.orderInfo.point_use}`
    },
    totalFilter () {
      return `${this.orderInfo.fee_symbol}${(this.orderInfo.total_fee / 100).toFixed(2)}`
    },
    realTotalFilter () {
      let returnValue = ''
      if (this.tradeInfo.payType === 'point') {
        returnValue = `￥0`
      } else if (this.tradeInfo.tradeState === 'NOTPAY') {
        returnValue = `￥0`
      } else {
        returnValue = `${this.orderInfo.fee_symbol}${(this.orderInfo.total_fee / 100).toFixed(2)}`
      }
      return returnValue
    },
    orderTotalFilter () {
      return `${this.orderInfo.fee_symbol}${
        this.orderInfo.order_type != 'bargain'
          ? (this.orderInfo.item_fee / 100).toFixed(2)
          : (this.orderInfo.item_price / 100).toFixed(2)
      }`
    },
    tradeStateFilter (item) {
      let returnValue = ''
      switch (item) {
        case 'SUCCESS':
          returnValue = '支付成功'
          break
        case 'REFUND':
          returnValue = '转入退款'
          break
        case 'CANCEL_CLOSED':
          returnValue = '已取消'
          break
        case 'REFUND_SUCCESS':
          returnValue = '退款成功'
          break
        case 'NOTPAY':
          returnValue = '未支付'
          break
        case 'CLOSED':
          returnValue = '已关闭'
          break
        case 'REVOKED':
          returnValue = '已撤销'
          break
        case 'PAYERROR':
          returnValue = '支付失败(其他原因，如银行返回失败)'
          break
        default:
          returnValue = '未知'
          break
      }
      return returnValue
    },
    payTypeFilter (item) {
      let returnValue = ''
      switch (item) {
        case 'amorepay':
          returnValue = '微信支付'
          break
        case 'wxpaypc':
          returnValue = '微信PC支付'
          break
        case 'wxpay':
          returnValue = '微信支付'
          break
        case 'wxpayh5':
          returnValue = '微信H5支付'
          break
        case 'alipay':
          returnValue = '支付宝支付'
          break
        case 'alipayh5':
          returnValue = '支付宝H5支付'
          break
        case 'deposit':
          returnValue = '余额支付'
          break
        case 'point':
          returnValue = '积分支付'
          break
        case 'pos':
          returnValue = 'POS银行卡支付'
          break
        case 'wxpaypos':
          returnValue = '微信扫码支付'
          break
        case 'alipaypos':
          returnValue = '支付宝扫码支付'
          break
        default:
          returnValue = '实体订单'
          break
      }
      return returnValue
    }
  }
}
</script>

<style scoped>
.item-image {
  max-width: 80px;
  margin: 0 auto;
}
.ell3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
