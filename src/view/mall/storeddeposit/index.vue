<!--
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /app/src/view/mall/storeddeposit/index.vue
 * @Date: 2020-03-12 14:24:16
 * @LastEditors: Arvin
 * @LastEditTime: 2021-01-26 17:23:42
-->
<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="总览"
        name="all"
      >
        <total-view />
      </el-tab-pane>
      <el-tab-pane
        label="交易记录"
        name="transactionRecord"
      >
        <transaction-record :get-status="trade" />
      </el-tab-pane>
      <el-tab-pane
        label="储值面额"
        name="storedValue"
      >
        <stored-value :get-status="rechargeRule" />
      </el-tab-pane>
      <el-tab-pane
        label="充值协议"
        name="rechargeAgreement"
      >
        <recharge-agreement :get-status="rechargeAgreement" />
      </el-tab-pane>
      <el-tab-pane
        label="充值送积分翻倍"
        name="rechargeMultiple"
      >
        <recharge-multiple :get-status="rechargeMultiple" />
      </el-tab-pane>
      <!--
      <el-tab-pane label="吸储排行" name="storageRanking">
        <storage-ranking :get-status="storageRanking"></storage-ranking>
      </el-tab-pane>
      -->
    </el-tabs>
  </div>
</template>

<script>
import totalView from './totalview.vue'
import transactionRecord from './transactionrecord.vue'
import storedValue from './storedvalue.vue'
import rechargeAgreement from './rechargeagreement.vue'
import rechargeMultiple from './rechargemultiple.vue'

export default {
  components: {
    totalView,
    transactionRecord,
    storedValue,
    rechargeAgreement,
    rechargeMultiple
  },
  data () {
    return {
      activeName: 'all',
      trade: false,
      rechargeRule: false,
      rechargeAgreement: false,
      storageRanking: false,
      rechargeMultiple: false
    }
  },
  methods: {
    //充值送钱
    handleClick (tab, event) {
      if (this.activeName == 'transactionRecord') {
        this.trade = true
      } else if (this.activeName == 'storedValue') {
        this.rechargeRule = true
      } else if (this.activeName == 'rechargeAgreement') {
        this.rechargeAgreement = true
      } else if (this.activeName == 'rechargeMultiple') {
        this.rechargeMultiple = true
      }
    }
  }
}
</script>
