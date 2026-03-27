<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss"></style>

<template>
  <div>
    <SpFinder
      ref="finder"
      url="/deposit/trades"
      no-selection
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    >
      <template slot="tableTop">
        <div class="action-container">
          <el-button @click="addStoreValue">{{ $t('598bafdd.e50663') }}</el-button>
        </div>
      </template>
    </SpFinder>

    <!-- 储值添加 -->
    <SpDialog
      ref="chuzhiDialogRef"
      v-model="chuzhiDialog"
      :title="$t('598bafdd.e50663')"
      :form="chuzhiForm"
      :form-list="chuzhiFormList"
      @onSubmit="onChuZhiFormSubmit"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
export default {
  data() {
    return {
      chuzhiDialog: false,
      chuzhiForm: {
        money: 0
      }
    }
  },
  computed: {
    setting() {
      const vm = this
      return createSetting({
        columns: [
          {
            name: vm.$t('598bafdd.7a036a'),
            key: 'timeStart',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: vm.$t('598bafdd.1bcb8e'),
            key: 'curPayFee',
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            }
          },
          {
            name: vm.$t('598bafdd.fafe8f'),
            key: 'tradeStatus',
            render: (h, { row }) => {
              return h(
                'el-tag',
                {
                  props: {
                    type: row.tradeStatus == 'SUCCESS' ? 'success' : 'danger'
                  }
                },
                row.tradeStatus == 'SUCCESS' ? vm.$t('598bafdd.e64875') : vm.$t('598bafdd.d9217d')
              )
            }
          },
          { name: vm.$t('598bafdd.3bdd08'), key: 'detail' }
        ]
      })
    },
    chuzhiFormList() {
      return [
        {
          label: this.$t('598bafdd.1bcb8e'),
          key: 'money',
          type: 'number',
          precision: 2,
          setp: 0.1
        }
      ]
    }
  },
  created() {},
  methods: {
    beforeSearch(params) {
      const { user_id } = this.$route.query
      params = {
        ...params,
        user_id,
        page: params.page,
        pageSize: params.pageSize
      }
      return params
    },
    addStoreValue() {
      this.chuzhiForm.money = 0
      this.chuzhiDialog = true
    },
    async onChuZhiFormSubmit() {
      const { user_id } = this.$route.query
      await this.$api.deposit.rechargeDeposit({
        user_id,
        money: parseInt(this.chuzhiForm.money * 100)
      })
      this.$message.success('添加成功')
      this.chuzhiDialog = false
      this.$refs['finder'].refresh(true)
    }
  }
}
</script>
