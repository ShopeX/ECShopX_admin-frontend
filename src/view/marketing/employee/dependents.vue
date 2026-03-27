<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 8px;
}
</style>
<template>
  <SpPage>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="employee_mobile" :label="$t('a2055098.5f4688')">
        <el-input v-model="queryForm.employee_mobile" :placeholder="$t('a2055098.1a1f66')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="relative_mobile" :label="$t('a2055098.125e4a')">
        <el-input v-model="queryForm.relative_mobile" :placeholder="$t('a2055098.ec6ed9')" />
      </SpFilterFormItem>
    </SpFilterForm>

    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :row-actions-align="'left'"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="/employeepurchase/activity/users"
    />
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
export default {
  name: '',
  data() {
    return {
      queryForm: {
        employee_mobile: '',
        relative_mobile: ''
      }
    }
  },
  computed: {
    setting() {
      return createSetting({
        columns: [
          { name: this.$t('a2055098.1a1f66'), key: 'employee_mobile' },
          { name: this.$t('a2055098.a64a69'), key: 'employee_account' },
          { name: this.$t('a2055098.1bfa5e'), key: 'enterprise_name' },
          { name: this.$t('a2055098.4a1a2c'), key: 'employee_username' },
          { name: this.$t('a2055098.ec6ed9'), key: 'relative_mobile' },
          { name: this.$t('a2055098.5912a9'), key: 'relative_username' },
          { name: this.$t('a2055098.cf3c69'), key: 'aggregate_fee' },
          {
            name: this.$t('a2055098.d12952'),
            key: 'created',
            formatter: (value, { created }, col) => {
              return `${moment(created * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
          }
        ]
      })
    }
  },
  created() {},
  methods: {
    beforeSearch(params) {
      const { id } = this.$route.params
      params = {
        ...params,
        activity_id: id,
        ...this.queryForm
      }
      return params
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    }
  }
}
</script>
