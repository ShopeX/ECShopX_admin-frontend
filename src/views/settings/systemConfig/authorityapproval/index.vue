<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <SpFormPlus
        v-model="queryParams"
        form-type="searchForm"
        :form-items="formItems"
        @submit="onSearch"
        @reset="onSearch"
        :inline="true"
      />
      <SpFinder
        ref="finder"
        url="/datapass"
        no-selection
        :fixed-row-action="true"
        row-actions-align="left"
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch
        }"
      />
    </SpPage>
  </SpRouterView>
</template>
<script>
import moment from 'moment'
import { createSetting } from '@shopex-ui/finder'
export default {
  data() {
    return {
      queryParams: {
        login_name: '',
        status: '',
        queryTime: []
      },
      approveStatusList: [
        { name: '全部', value: undefined },
        { name: '待审批', value: '0' },
        { name: '已通过', value: '1' },
        { name: '未通过', value: '2' }
      ],
      setting: createSetting({
        actions: [
          {
            name: '详情',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            // visible: (row) => {
            //   return row.status == '0'
            // },
            action: {
              handler: async ([row]) => {
                const { pass_id, operator_id } = row
                this.$router.push({
                  path: this.matchRoutePath('approve'),
                  query: { pass_id, operator_id }
                })
              }
            }
          }
        ],
        columns: [
          {
            name: '账户名称',
            key: 'login_name'
          },
          {
            name: '账户角色',
            key: 'operator_type',
            formatter: (value, row, col) => {
              return value === 'staff'
                ? '平台管理员'
                : value === 'distributor'
                ? '店铺管理员'
                : '供应商管理员'
            }
          },
          {
            name: '申请时间',
            key: 'create_time',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: '申请结果',
            key: 'status',
            render: (h, scope) => {
              if (scope.row.status == '1' || scope.row.status == '2') {
                return h(
                  'el-tag',
                  {
                    props: {
                      type: scope.row.status == '1' ? 'success' : 'danger',
                      size: 'small'
                    }
                  },
                  scope.row.status == '1' ? '通过' : '拒绝'
                )
              } else {
                return ''
              }
            }
          }
        ]
      })
    }
  },
  watch: {
    'queryParams.queryTime'(val) {
      if (!val) this.queryParams.queryTime = []
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'status',
          label: '审批状态',
          component: 'select',
          componentProps: {
            placeholder: '请选择审批状态',
            options: this.approveStatusList.map((item) => ({
              label: item.name,
              value: item.value
            }))
          }
        },
        {
          fieldName: 'login_name',
          label: '账户名称',
          component: 'input',
          componentProps: {
            placeholder: '请输入账户名称'
          }
        },
        {
          fieldName: 'queryTime',
          label: '申请日期',
          component: 'datetimepicker',
          cellWidth: 2,
          componentProps: {
            type: 'datetimerange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            defaultTime: ['00:00:00', '23:59:59'],
            valueFormat: 'timestamp',
            size: 'default',
            clearable: true
          }
        }
      ]
    }
  },
  methods: {
    beforeSearch(params) {
      const time = this.queryParams.queryTime || []
      const _params = {
        ...params,
        ...this.queryParams,
        start_time: time.length >= 2 ? time[0] / 1000 : '',
        end_time: time.length >= 2 ? time[1] / 1000 : ''
      }
      delete _params.queryTime
      return _params
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    }
  }
}
</script>
