<template>
  <CustomCard
    title="订单基本信息"
    :info="baseInfo"
    :data-source="orderInfo"
    :is-common="true"
    :is-base="true"
    @onRefresh="onRefresh"
  />
</template>

<script>
import { dateFilter } from '@/utils'
import CustomCard from './CustomCard'
export default {
  components: {
    CustomCard
  },
  props: ['orderInfo', 'memberInfo'],
  data () {
    const self = this
    return {
      baseInfo: [
        [
          { name: '下单时间', field: 'create_time', filter: dateFilter },
          { name: '订单编号', field: 'order_id' },
          {
            name: '订单类型',
            field: 'order_class',
            filter: self.orderClassFilter
          },
          { name: '订单状态', field: '', filter: self.orderStatusFilter }
        ],
        [
          {
            name: '开票状态',
            field: 'is_invoiced',
            filter: self.invoiceFilter
          },
          {
            name: '配送类型',
            field: 'receipt_type',
            filter: self.receiptTypeFilter
          },
          { name: '会员昵称', field: '', filter: self.memeberNameFilter },
          { name: '会员手机号', field: '', filter: self.memeberPhoneFilter }
        ],
        [
          { name: '会员等级', field: '', filter: self.memeberLevelFilter },
          { name: '会员折扣', field: '', filter: self.memeberDisCountFilter },
          { name: '货币类型', field: 'fee_type' },
          {
            name: '购物赠送积分',
            field: 'bonus_points',
            isHidden: self.hiddenPoint('bonus_points')
          }
        ],
        [
          { name: '订单获取积分', field: 'get_points', isHidden: self.hiddenPoint('get_points') },
          {
            name: '额外获取积分',
            field: 'extra_points',
            isHidden: self.hiddenPoint('extra_points')
          }
        ]
      ]
    }
  },
  methods: {
    onRefresh () {
      this.$emit('onRefresh')
    },
    hiddenPoint (field) {
      return this.orderInfo[field] === 0
    },
    orderClassFilter (item) {
      let returnValue = ''
      switch (item) {
        case 'groups':
          returnValue = '拼团'
          break
        case 'bargain':
          returnValue = '助力'
          break
        case 'service':
          returnValue = '服务类订单'
          break
        case 'bargain':
          returnValue = '助力订单'
          break
        case 'normal':
          returnValue = '实体订单'
          break
        case 'excard':
          returnValue = '兑换订单'
          break
        case 'community':
          returnValue = '社区团购订单'
          break
        default:
          returnValue = '实体订单'
          break
      }
      if (returnValue === '实体订单' && this.orderInfo.type == '1') {
        returnValue += '-跨境订单'
      }
      return returnValue
    },
    orderStatusFilter () {
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
          returnValue = '取消'
        } else if (order_status_des == 'CLOSED') {
          returnValue = '已关闭'
        }
        if (order_status_des !== 'CANCEL') {
          if (ziti_status === 'APPROVE') {
            returnValue += ' 审核通过'
          } else {
            returnValue += ' 待审核'
          }
        }
      } else if (order_type == 'bargain') {
        if (order_status === 'NOTPAY') {
          returnValue = '未支付'
        } else if (order_status === 'CLOSED' || order_status === 'CANCEL') {
          returnValue = '已取消'
        } else if (order_status === 'WAIT_GROUPS_SUCCESS') {
          returnValue = '等待拼团成功'
        } else if (order_status === 'REFUND_PROCESS') {
          returnValue = '退款处理中'
        } else if (order_status === 'REFUND_SUCCESS') {
          returnValue = '退款成功'
        } else if (order_status === 'REFUND_FAIL') {
          returnValue = '退款失败'
        }
      } else {
        returnValue = order_status_msg
      }
      return returnValue
    },
    invoiceFilter (item) {
      let returnValue = ''
      if (item) {
        returnValue = '已开票'
      } else {
        returnValue = '未开票'
      }
      return returnValue
    },
    receiptTypeFilter (item) {
      let returnValue = ''
      switch (item) {
        case 'logistics':
          returnValue = '普通快递'
          break
        case 'ziti':
          returnValue = '自提'
          break
        case 'dada':
          returnValue = '同城配'
          break
        default:
          returnValue = '普通快递'
          break
      }
      return returnValue
    },
    memeberNameFilter () {
      return this.memberInfo.username
    },
    memeberPhoneFilter () {
      return this.memberInfo.mobile
    },
    memeberLevelFilter () {
      let returnValue = ''
      if (this.memberInfo.vipgrade && this.memberInfo.vipgrade.is_vip) {
        returnValue = this.memberInfo.vipgrade.grade_name
      } else {
        returnValue = this.memberInfo.gradeInfo ? this.memberInfo.gradeInfo.grade_name : '无'
      }
      return returnValue
    },
    memeberDisCountFilter () {
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
