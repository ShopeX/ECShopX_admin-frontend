/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'
export default (vm) => {
  const formatDate = (timestamp) => {
    var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var YY = date.getFullYear() + '-'
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return YY + MM + DD + ' ' + hh + mm + ss
  }

  const formatTemplate_type = (status) => {
    switch (status) {
      case '0':
        return vm.$t('5e4a9ce3.983f59')
      case '1':
        return vm.$t('5e4a9ce3.e7d158')
      case '2':
        return vm.$t('5e4a9ce3.0a9738')
    }
  }
  return createSetting({
    search: [
      {
        key: 'time_start',
        name: vm.$t('5e4a9ce3.63b34d'),
        type: 'date-range',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: vm.$t('5e4a9ce3.b44c0f'),
        endPlaceholder: vm.$t('5e4a9ce3.1d468b')
      },

      {
        key: 'template_type',
        name: vm.$t('5e4a9ce3.b2b399'),
        type: 'select',
        options: vm.smeType_options
      },
      { key: 'status', name: vm.$t('5e4a9ce3.d48fc2'), type: 'select', options: vm.search_options },
      { key: 'template_code', name: vm.$t('5e4a9ce3.50760a') },
      { key: 'mobile', name: vm.$t('5e4a9ce3.8098e2') },
      { key: 'sms_content', name: vm.$t('5e4a9ce3.4e963c') },
      { key: 'task_name', name: vm.$t('5e4a9ce3.78caf7'), slot: 'task_name' }
    ],
    columns: [
      { name: vm.$t('5e4a9ce3.0bc1d2'), key: 'mobile', width: '140px' },
      { name: vm.$t('5e4a9ce3.50760a'), key: 'template_code', width: '120px' },
      { name: vm.$t('5e4a9ce3.4e963c'), key: 'sms_content' },
      {
        name: vm.$t('5e4a9ce3.b2b399'),
        key: 'template_type',
        formatter: formatTemplate_type,
        width: '100px'
      },
      { name: vm.$t('5e4a9ce3.bc50bf'), key: 'scene_name' },
      { name: vm.$t('5e4a9ce3.63b34d'), key: 'created', formatter: formatDate, width: '170px' },
      {
        name: vm.$t('5e4a9ce3.d48fc2'),
        key: 'status',
        width: '100px',
        render: (h, { row }) =>
          h(
            'div',
            {
              class: 'yahh'
            },
            [
              h('div', {
                class: `status-icon ${row.status == '3' && 'success'} ${
                  row.status == '2' && 'fail'
                }`
              }),
              h(
                'span',
                {},
                (row.status == '1' && vm.$t('5e4a9ce3.702513')) ||
                  (row.status == '3' && vm.$t('5e4a9ce3.9db9a7')) ||
                  (row.status == '2' && vm.$t('5e4a9ce3.22066a'))
              ),
              row.status == 2 &&
                row.reason &&
                h(
                  'el-tooltip',
                  {
                    class: 'tips',
                    props: {
                      effect: 'dark',
                      content: row.reason,
                      placement: 'top'
                    }
                  },
                  [h('i', { class: 'el-icon-warning-outline' }, '')]
                )
            ]
          )
      }
    ]
  })
}
