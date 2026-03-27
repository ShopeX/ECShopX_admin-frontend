<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('45e1eee6.08806e')" name="all">
        <total-view />
      </el-tab-pane>
      <el-tab-pane :label="$t('45e1eee6.07b42e')" name="transactionRecord">
        <transaction-record :get-status="trade" />
      </el-tab-pane>
      <el-tab-pane :label="$t('45e1eee6.7953e0')" name="storedValue">
        <stored-value :get-status="rechargeRule" />
      </el-tab-pane>
      <el-tab-pane :label="$t('45e1eee6.0de4fa')" name="rechargeAgreement">
        <recharge-agreement :get-status="rechargeAgreement" />
      </el-tab-pane>
      <el-tab-pane :label="$t('45e1eee6.ef4269')" name="rechargeMultiple">
        <recharge-multiple :get-status="rechargeMultiple" />
      </el-tab-pane>
      <!--
      <el-tab-pane :label="$t('45e1eee6.bc6f71')" name="storageRanking">
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
  data() {
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
    handleClick(tab, event) {
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
