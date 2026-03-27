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
        { i18nKey: '815d646e.a8b0c2', value: undefined },
        { i18nKey: '815d646e.b0bf01', value: '0' },
        { i18nKey: '815d646e.ecfa64', value: '1' },
        { i18nKey: '815d646e.4fcdbf', value: '2' }
      ]
    }
  },
  watch: {
    'queryParams.queryTime'(val) {
      if (!val) this.queryParams.queryTime = []
    }
  },
  computed: {
    setting() {
      return createSetting({
        actions: [
          {
            name: this.$t('815d646e.f26225'),
            key: 'apply',
            type: 'button',
            buttonType: 'text',
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
            name: this.$t('815d646e.fec615'),
            key: 'login_name'
          },
          {
            name: this.$t('815d646e.9be7c1'),
            key: 'operator_type',
            formatter: (value, row, col) => {
              return value === 'staff'
                ? this.$t('815d646e.fc79d4')
                : value === 'distributor'
                ? this.$t('815d646e.3282f2')
                : this.$t('815d646e.40954c')
            }
          },
          {
            name: this.$t('815d646e.5ba072'),
            key: 'create_time',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: this.$t('815d646e.3650f5'),
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
                  scope.row.status == '1' ? this.$t('815d646e.23c1f3') : this.$t('815d646e.7173f8')
                )
              } else {
                return ''
              }
            }
          }
        ]
      })
    },
    formItems() {
      return [
        {
          fieldName: 'status',
          label: this.$t('815d646e.d352ae'),
          component: 'select',
          componentProps: {
            placeholder: this.$t('815d646e.a7dd1f'),
            options: this.approveStatusList.map((item) => ({
              label: this.$t(item.i18nKey),
              value: item.value
            }))
          }
        },
        {
          fieldName: 'login_name',
          label: this.$t('815d646e.fec615'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('815d646e.329159')
          }
        },
        {
          fieldName: 'queryTime',
          label: this.$t('815d646e.4c9c23'),
          component: 'datetimepicker',
          cellWidth: 2,
          componentProps: {
            type: 'datetimerange',
            startPlaceholder: this.$t('815d646e.b44c0f'),
            endPlaceholder: this.$t('815d646e.1d468b'),
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
