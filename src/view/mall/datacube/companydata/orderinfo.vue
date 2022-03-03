<!-- * @description 分账统计详情-订单信息 -->
<template>
  <el-card class="order_info_card">
    <h3>订单信息</h3>
    <el-row>
      <el-col :span="6">
        <span class="order_info_label">分账订单日期:</span>
        <span class="order_info_value">{{ info.hf_order_date }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">分账订单号:</span>
        <span class="order_info_value">{{ info.hf_order_id }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">原订单支付日期:</span>
        <span class="order_info_value">{{ info.pay_time }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">原支付订单号:</span>
        <span class="order_info_value">{{ info.order_id }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">交易单号:</span>
        <span class="order_info_value">{{ info.trade_id }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">原交易类型:</span>
        <span class="order_info_value">{{ info.app_pay_type_desc }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">订单支付金额:</span>
        <span
          class="order_info_value"
          style="color: #67c23a"
        >￥ {{ (info.total_fee / 100).toFixed(2) }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">结算状态:</span>
        <span class="order_info_value">{{
          info.profitsharing_status === '1' ? '未结算' : '已结算'
        }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">平台手续费:</span>
        <span class="order_info_value">￥ {{ (info.charge / 100).toFixed(2) }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">平台服务费率:</span>
        <span class="order_info_value">{{ info.profitsharing_rate }}%</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">店铺名称:</span>
        <span class="order_info_value">{{ info.distributor_name }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">退款金额:</span>
        <span
          class="order_info_value"
          style="color: #d9001b"
        >￥ {{ (info.refund_fee / 100).toFixed(2) }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">订单状态:</span>
        <span class="order_info_value">
          {{
            (info.order_status === 'refunding' && '退款中') ||
              (info.order_status === 'pay' && '支付成功') ||
              (info.order_status === 'refundsuccess' && '退款成功') ||
              (info.order_status === 'refundfail' && '退款失败') ||
              (info.order_status === 'NOTPAY' && '未支付') ||
              (info.order_status === 'PART_PAYMENT' && '部分付款') ||
              (info.order_status === 'WAIT_GROUPS_SUCCESS' && '等待拼团成功') ||
              (info.order_status === 'PAYED' && '已支付') ||
              (info.order_status === 'CANCEL' && '已取消') ||
              (info.order_status === 'WAIT_BUYER_CONFIRM' && '待用户收货')
          }}
        </span>
      </el-col>
      <el-col
        v-if="
          info.order_status === 'refunding' ||
            info.order_status === 'refundsuccess' ||
            info.order_status === 'refundfail'
        "
        :span="6"
      >
        <span class="order_info_label">剩余金额:</span>
        <span class="order_info_value">￥{{ (info.balance / 100).toFixed(2) }}</span>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: ['info'],
  data () {
    return {}
  },
  mounted () {},
  methods: {}
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
