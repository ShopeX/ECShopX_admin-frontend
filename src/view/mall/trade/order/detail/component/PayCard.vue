<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <CustomCard
    :title="$t('912c5906.a58517')"
    :info="info"
    :data-source="tradeInfo"
    :is-common="true"
  />
</template>

<script>
import { dateFilter } from '@/utils'
import CustomCard from './CustomCard'
import { PAY_TYPE } from '@/utils'
export default {
  components: {
    CustomCard
  },
  props: ['cardConfig', 'orderInfo', 'memberInfo', 'tradeInfo'],
  data() {
    const self = this
    return {
      info: [
        [
          { name: self.$t('912c5906.2caf6a'), field: 'tradeId' },
          { name: self.$t('912c5906.fa68e9'), field: 'transactionId' },
          { name: self.$t('912c5906.64b8dd'), field: '', filter: self.orderTotalFilter },
          {
            name: self.$t('912c5906.9a935b'),
            field: '',
            filter: self.orderFreightFilter
          }
        ],
        [
          { name: self.$t('912c5906.f77b16'), field: '', filter: self.memberDiscountFilter },
          {
            name: self.$t('912c5906.187825'),
            field: '',
            filter: self.couponsReductionFilter
          },
          {
            name: self.$t('912c5906.f5a188'),
            field: '',
            filter: self.disCountTotalMoney
          }
        ],
        [
          { name: self.$t('912c5906.6ce4a1'), field: '', filter: self.totalFilter },
          { name: self.$t('912c5906.f379ed'), field: '', filter: self.realTotalFilter },
          { name: self.$t('912c5906.0c9d2b'), field: 'payType', filter: self.payTypeFilter },
          {
            name: self.$t('912c5906.510fa2'),
            field: 'tradeState',
            filter: self.tradeStateFilter
          }
        ],
        [
          { name: self.$t('912c5906.f8de2c'), field: 'timeStart', filter: dateFilter },
          { name: self.$t('912c5906.011077'), field: 'timeExpire', filter: dateFilter }
        ]
      ]
    }
  },
  methods: {
    orderFreightFilter() {
      return `${this.orderInfo.fee_symbol}${(this.orderInfo.freight_fee / 100).toFixed(2)}`
    },
    memberDiscountFilter() {
      return `- ${this.orderInfo.fee_symbol}${(this.orderInfo.member_discount / 100).toFixed(2)}`
    },
    couponsReductionFilter() {
      return `-${this.orderInfo.fee_symbol}${(this.orderInfo.coupon_discount / 100).toFixed(2)}`
    },
    disCountTotalMoney() {
      return `-${this.orderInfo.fee_symbol}${
        this.orderInfo.discount_fee ? (this.orderInfo.discount_fee / 100).toFixed(2) : 0
      }`
    },
    pointFilter() {
      // 积分抵扣
      return `${this.orderInfo.point_use}`
    },
    totalFilter() {
      return `${this.orderInfo.fee_symbol}${(this.orderInfo.total_fee / 100).toFixed(2)}`
    },
    realTotalFilter() {
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
    orderTotalFilter() {
      return `${this.orderInfo.fee_symbol}${
        this.orderInfo.order_type != 'bargain'
          ? (this.orderInfo.item_fee / 100).toFixed(2)
          : (this.orderInfo.item_price / 100).toFixed(2)
      }`
    },
    tradeStateFilter(item) {
      let returnValue = ''
      switch (item) {
        case 'SUCCESS':
          returnValue = this.$t('912c5906.eb5dc9')
          break
        case 'REFUND':
          returnValue = this.$t('912c5906.8e2b9d')
          break
        case 'CANCEL_CLOSED':
          returnValue = this.$t('912c5906.2111cc')
          break
        case 'REFUND_SUCCESS':
          returnValue = this.$t('912c5906.d58cbd')
          break
        case 'NOTPAY':
          returnValue = this.$t('912c5906.608afd')
          break
        case 'CLOSED':
          returnValue = this.$t('912c5906.9c5850')
          break
        case 'REVOKED':
          returnValue = this.$t('912c5906.50239f')
          break
        case 'PAYERROR':
          returnValue = this.$t('912c5906.8e51b3')
          break
        default:
          returnValue = this.$t('912c5906.1622dc')
          break
      }
      return returnValue
    },
    payTypeFilter(item) {
      let returnValue = ''
      switch (item) {
        case 'amorepay':
          returnValue = this.$t('912c5906.bffe28')
          break
        case 'wxpaypc':
          returnValue = this.$t('912c5906.67a318')
          break
        case 'wxpay':
          returnValue = this.$t('912c5906.bffe28')
          break
        case 'wxpayh5':
          returnValue = this.$t('912c5906.df7033')
          break
        case 'alipay':
          returnValue = this.$t('912c5906.e3b206')
          break
        case 'alipayh5':
          returnValue = this.$t('912c5906.5a3c52')
          break
        case 'deposit':
          returnValue = this.$t('912c5906.89ac23')
          break
        case 'point':
          returnValue = this.$t('912c5906.accd19')
          break
        case 'pos':
          returnValue = this.$t('912c5906.d37dec')
          break
        case 'wxpaypos':
          returnValue = this.$t('912c5906.777d5d')
          break
        case 'alipaypos':
          returnValue = this.$t('912c5906.bd7030')
          break
        default:
          returnValue = this.$t('14e217b9.7a83f9')
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
