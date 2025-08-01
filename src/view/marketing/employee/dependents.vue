<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 8px;
}
</style>
<template>
  <SpPage>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="employee_mobile" label="员工手机号:">
        <el-input v-model="queryForm.employee_mobile" placeholder="员工手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="relative_mobile" label="亲友手机号:">
        <el-input v-model="queryForm.relative_mobile" placeholder="亲友手机号" />
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
import { createSetting } from '@shopex/finder'
import moment from 'moment'
export default {
  name: '',
  data() {
    return {
      queryForm: {
        employee_mobile: '',
        relative_mobile: ''
      },
      setting: createSetting({
        columns: [
          { name: '员工手机号', key: 'employee_mobile' },
          {
            name: '员工账号',
            key: 'employee_account'
          },
          {
            name: '员工所属公司',
            key: 'enterprise_name'
          },
          {
            name: '员工昵称',
            key: 'employee_username'
          },
          {
            name: '亲友手机号',
            key: 'relative_mobile'
          },
          {
            name: '亲友昵称',
            key: 'relative_username'
          },
          {
            name: '亲友已使用额度（¥）',
            key: 'aggregate_fee'
          },
          {
            name: '绑定时间',
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
