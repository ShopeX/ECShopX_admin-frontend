<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
  padding-bottom: 0;
}
.total-info {
  margin-top: 30px;
  .total-value {
    font-size: 28px;
  }
}
</style>
<template>
  <SpPage>
    <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="chief_mobile" :label="$t('8047bbf8.f5a186')">
        <el-input v-model="formQuery.chief_mobile" :placeholder="$t('8047bbf8.999e78')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="chief_name" :label="$t('8047bbf8.1e5021')">
        <el-input v-model="formQuery.chief_name" :placeholder="$t('8047bbf8.9d2c66')" />
      </SpFilterFormItem>
    </SpFilterForm>

    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      url="/community/rebate/count"
    />
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import { i18n } from '@/i18n'

export default {
  name: '',
  data() {
    return {
      formQuery: {
        chief_name: '',
        chief_mobile: ''
      },
      setting: createSetting({
        columns: [
          { name: i18n.t('8047bbf8.60d045'), key: 'chief_name' },
          { name: i18n.t('8047bbf8.8098e2'), key: 'chief_mobile' },
          {
            name: i18n.t('8047bbf8.4c54c1'),
            key: 'cash_withdrawal_rebate',
            render: (h, { row }) => h('span', {}, row.cash_withdrawal_rebate / 100)
          },
          {
            name: i18n.t('8047bbf8.962d95'),
            key: 'payed_rebate',
            render: (h, { row }) => h('span', {}, row.payed_rebate / 100)
          },
          {
            name: i18n.t('8047bbf8.794510'),
            key: 'freeze_cash_withdrawal_rebate',
            render: (h, { row }) => h('span', {}, row.freeze_cash_withdrawal_rebate / 100)
          },
          {
            name: i18n.t('8047bbf8.dd3aaf'),
            key: 'no_close_rebate',
            render: (h, { row }) => h('span', {}, row.no_close_rebate / 100)
          },
          {
            name: i18n.t('8047bbf8.186472'),
            key: 'rebate_total',
            render: (h, { row }) => h('span', {}, row.rebate_total / 100)
          }
        ]
      })
    }
  },
  created() {},
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      const formQuery = JSON.parse(JSON.stringify(this.formQuery))
      if (formQuery.approve_status == '-1') {
        delete formQuery.approve_status
      }
      return { ...params, ...formQuery }
    },
    afterSearch() {}
  }
}
</script>
