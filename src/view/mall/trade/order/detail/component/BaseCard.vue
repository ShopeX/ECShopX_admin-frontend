<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <CustomCard
    :title="$t('14e217b9.168447')"
    :info="baseInfo"
    :data-source="orderInfo"
    :is-common="true"
    :is-base="true"
    @onRefresh="onRefresh"
  />
</template>

<script>
import { OPEN_STATUS_ARR } from '@/consts'
import { dateFilter } from '@/utils'
import CustomCard from './CustomCard'
export default {
  components: {
    CustomCard
  },
  props: ['orderInfo', 'memberInfo'],
  data() {
    const self = this
    return {
      baseInfo: [
        [
          { name: self.$t('14e217b9.2240cc'), field: 'create_time', filter: dateFilter },
          { name: self.$t('14e217b9.3e8657'), field: 'order_id' },
          {
            name: self.$t('14e217b9.5cd56b'),
            field: 'order_class',
            filter: self.orderClassFilter
          },
          { name: self.$t('14e217b9.86f6cf'), field: '', filter: self.orderStatusFilter }
        ],
        [
          {
            name: self.$t('14e217b9.2af9f7'),
            field: 'invoice_status',
            filter: self.invoiceFilter
          },
          {
            name: self.$t('14e217b9.c377e5'),
            field: 'receipt_type',
            filter: self.receiptTypeFilter
          },
          { name: self.$t('14e217b9.9a7f00'), field: '', filter: self.memeberNameFilter },
          { name: self.$t('14e217b9.6a52ee'), field: '', filter: self.memeberPhoneFilter }
        ],
        [
          { name: self.$t('14e217b9.6c1583'), field: '', filter: self.memeberLevelFilter },
          { name: self.$t('14e217b9.eababe'), field: '', filter: self.memeberDisCountFilter },
          { name: self.$t('14e217b9.bf52d4'), field: 'fee_type' },
          {
            name: self.$t('14e217b9.824376'),
            field: 'bonus_points',
            isHidden: self.hiddenPoint('bonus_points')
          }
        ],
        [
          {
            name: self.$t('14e217b9.630c77'),
            field: 'get_points',
            isHidden: self.hiddenPoint('get_points')
          },
          {
            name: self.$t('14e217b9.864d7a'),
            field: 'extra_points',
            isHidden: self.hiddenPoint('extra_points')
          }
        ]
      ]
    }
  },
  methods: {
    onRefresh() {
      this.$emit('onRefresh')
    },
    hiddenPoint(field) {
      return this.orderInfo[field] === 0
    },
    orderClassFilter(item) {
      let returnValue = ''
      switch (item) {
        case 'groups':
          returnValue = this.$t('14e217b9.0dc5dc')
          break
        case 'bargain':
          returnValue = this.$t('14e217b9.151c35')
          break
        case 'service':
          returnValue = this.$t('14e217b9.e6943f')
          break
        case 'bargain':
          returnValue = this.$t('14e217b9.94b1e6')
          break
        case 'normal':
          returnValue = this.$t('14e217b9.7a83f9')
          break
        case 'excard':
          returnValue = this.$t('14e217b9.8e09cc')
          break
        case 'community':
          returnValue = this.$t('14e217b9.991e15')
          break
        default:
          returnValue = this.$t('14e217b9.7a83f9')
          break
      }
      if (returnValue === this.$t('14e217b9.7a83f9') && this.orderInfo.type == '1') {
        returnValue += this.$t('14e217b9.4ce265')
      }
      return returnValue
    },
    orderStatusFilter() {
      let returnValue = ''
      const {
        order_class,
        order_status_des,
        ziti_status,
        order_type,
        order_status_msg,
        order_status
      } = this.orderInfo
      if (order_class === 'drug') {
        if (order_status_des == 'CANCEL') {
          returnValue = this.$t('14e217b9.625fb2')
        } else if (order_status_des == 'CLOSED') {
          returnValue = this.$t('14e217b9.9c5850')
        }
        if (order_status_des !== 'CANCEL') {
          if (ziti_status === 'APPROVE') {
            returnValue += this.$t('14e217b9.68db3f')
          } else {
            returnValue += this.$t('14e217b9.1a2612')
          }
        }
      } else if (order_type == 'bargain') {
        if (order_status === 'NOTPAY') {
          returnValue = this.$t('14e217b9.608afd')
        } else if (order_status === 'CLOSED' || order_status === 'CANCEL') {
          returnValue = this.$t('14e217b9.2111cc')
        } else if (order_status === 'WAIT_GROUPS_SUCCESS') {
          returnValue = this.$t('14e217b9.c2335d')
        } else if (order_status === 'REFUND_PROCESS') {
          returnValue = this.$t('14e217b9.73ce8f')
        } else if (order_status === 'REFUND_SUCCESS') {
          returnValue = this.$t('14e217b9.d58cbd')
        } else if (order_status === 'REFUND_FAIL') {
          returnValue = this.$t('14e217b9.7c2544')
        }
      } else {
        returnValue = order_status_msg
      }
      return returnValue
    },
    invoiceFilter(item) {
      return OPEN_STATUS_ARR.find((el) => el.value === item)?.title || ''
    },
    receiptTypeFilter(item) {
      let returnValue = ''
      switch (item) {
        case 'logistics':
          returnValue = this.$t('14e217b9.249bfe')
          break
        case 'ziti':
          returnValue = this.$t('14e217b9.b30d27')
          break
        case 'dada':
          returnValue = this.$t('14e217b9.583dcd')
          break
        default:
          returnValue = this.$t('14e217b9.249bfe')
          break
      }
      return returnValue
    },
    memeberNameFilter() {
      return this.memberInfo.username
    },
    memeberPhoneFilter() {
      return this.memberInfo.mobile
    },
    memeberLevelFilter() {
      let returnValue = ''
      if (this.memberInfo.vipgrade && this.memberInfo.vipgrade.is_vip) {
        returnValue = this.memberInfo.vipgrade.grade_name
      } else {
        returnValue = this.memberInfo.gradeInfo
          ? this.memberInfo.gradeInfo.grade_name
          : this.$t('14e217b9.d81bb2')
      }
      return returnValue
    },
    memeberDisCountFilter() {
      let value = null
      if (this.memberInfo.gradeInfo && this.memberInfo.gradeInfo.privileges) {
        return 100 - this.memberInfo.gradeInfo.privileges.discount + '%'
      }
      return value
    }
  }
}
</script>

<style></style>
