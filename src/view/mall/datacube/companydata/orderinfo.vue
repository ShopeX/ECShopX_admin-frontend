<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card class="order_info_card">
    <h3>{{ $t('55afc19a.a6d10d') }}</h3>
    <el-row>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.52a38c') }}</span>
        <span class="order_info_value">{{ info.hf_order_date }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.c228e5') }}</span>
        <span class="order_info_value">{{ info.hf_order_id }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.cabb16') }}</span>
        <span class="order_info_value">{{ info.pay_time }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.36ac3e') }}</span>
        <span class="order_info_value">{{ info.order_id }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.e850e7') }}</span>
        <span class="order_info_value">{{ info.trade_id }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.5f08c2') }}</span>
        <span class="order_info_value">{{ info.app_pay_type_desc }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.16b79e') }}</span>
        <span class="order_info_value" style="color: #67c23a"
          >￥ {{ (info.total_fee / 100).toFixed(2) }}</span
        >
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.b81f30') }}</span>
        <span class="order_info_value">{{
          info.profitsharing_status === '1' ? $t('55afc19a.facb53') : $t('55afc19a.139304')
        }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.0fce3b') }}</span>
        <span class="order_info_value">￥ {{ (info.charge / 100).toFixed(2) }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.14773e') }}</span>
        <span class="order_info_value">{{ info.profitsharing_rate }}%</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.4de1b7') }}</span>
        <span class="order_info_value">{{ info.distributor_name }}</span>
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.b772c7') }}</span>
        <span class="order_info_value" style="color: #d9001b"
          >￥ {{ (info.refund_fee / 100).toFixed(2) }}</span
        >
      </el-col>
      <el-col :span="6">
        <span class="order_info_label">{{ $t('55afc19a.7816f5') }}</span>
        <span class="order_info_value">
          {{
            (info.order_status === 'refunding' && $t('55afc19a.07e608')) ||
            (info.order_status === 'pay' && $t('55afc19a.eb5dc9')) ||
            (info.order_status === 'refundsuccess' && $t('55afc19a.d58cbd')) ||
            (info.order_status === 'refundfail' && $t('55afc19a.7c2544')) ||
            (info.order_status === 'NOTPAY' && $t('55afc19a.608afd')) ||
            (info.order_status === 'PART_PAYMENT' && $t('55afc19a.38b508')) ||
            (info.order_status === 'WAIT_GROUPS_SUCCESS' && $t('55afc19a.c2335d')) ||
            (info.order_status === 'PAYED' && $t('55afc19a.8d02a5')) ||
            (info.order_status === 'CANCEL' && $t('55afc19a.2111cc')) ||
            (info.order_status === 'WAIT_BUYER_CONFIRM' && $t('55afc19a.d76c15'))
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
        <span class="order_info_label">{{ $t('55afc19a.9ccb16') }}</span>
        <span class="order_info_value">￥{{ (info.balance / 100).toFixed(2) }}</span>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: ['info'],
  data() {
    return {}
  },
  mounted() {},
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
