/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'
import { Divider, Message, MessageBox } from 'element-ui'
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
        return vm.$t('66b2c71e.983f59')
      case '1':
        return vm.$t('66b2c71e.e7d158')
      case '2':
        return vm.$t('66b2c71e.0a9738')
    }
  }
  return createSetting({
    search: [
      {
        key: 'time_start',
        name: vm.$t('66b2c71e.63b34d'),
        type: 'date-range',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: vm.$t('66b2c71e.b44c0f'),
        endPlaceholder: vm.$t('66b2c71e.1d468b')
      },
      { key: 'status', name: vm.$t('66b2c71e.bc7e74'), type: 'select', options: vm.search_options },
      { key: 'task_name', name: vm.$t('66b2c71e.78caf7') },
      { key: 'template_name', name: vm.$t('66b2c71e.dbe8ba') }
    ],
    columns: [
      { name: vm.$t('66b2c71e.78caf7'), key: 'task_name', width: '140px' },
      { name: vm.$t('66b2c71e.eca37c'), key: 'created', formatter: formatDate, width: '170px' },
      { name: vm.$t('66b2c71e.74e5c0'), key: 'send_at', formatter: formatDate, width: '170px' },
      { name: vm.$t('66b2c71e.dbe8ba'), key: 'template_name' },
      {
        name: vm.$t('66b2c71e.bc7e74'),
        key: 'status',
        width: '100px',
        render: (h, { row }) =>
          h(
            'div',
            {
              class: 'yahh'
            },
            [
              //   h('div', {
              //     class: `status-icon ${row.status == '1' && 'success'} ${
              //       row.status == '2' && 'fail'
              //     }`
              //   }),
              h(
                'span',
                {},
                (row.status == '1' && vm.$t('66b2c71e.65dd9e')) ||
                  (row.status == '2' && vm.$t('66b2c71e.4e9e4e')) ||
                  (row.status == '3' && vm.$t('66b2c71e.d602a5')) ||
                  (row.status == '4' && vm.$t('66b2c71e.40acf0'))
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
      },
      {
        name: vm.$t('66b2c71e.cc12fb'),
        key: 'total_num',
        render: (h, { row }) =>
          h(
            'span',
            {
              type: 'text',
              class: 'e-button--text',
              style: { color: '#409EFF', cursor: 'pointer' },
              on: {
                click: () => {
                  vm.$router.push({
                    path: '/systemsetting/datamessage/ali_sms/sms_sendLog',
                    query: {
                      task_name: row.task_name
                    }
                  })
                }
              }
            },
            row.total_num
          ),
        align: 'center'
      },
      { name: vm.$t('66b2c71e.b1e6d2'), key: 'failed_num', align: 'center' }
    ],
    actions: [
      {
        name: vm.$t('66b2c71e.607e7a'),
        key: 'detail',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.visible = true
            vm.info = {
              type: 'detail',
              id: val[0].id
            }
          }
        },
        visible: (val) => {
          return val.status != '4'
        }
      },
      {
        name: vm.$t('66b2c71e.bd9fcf'),
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.deleteSMS(val[0].id)
          }
        },
        visible: (val) => {
          return val.status == '1'
        }
      },
      {
        name: vm.$t('66b2c71e.95b351'),
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.visible = true
            vm.info = {
              type: 'edit',
              id: val[0].id
            }
          }
        },
        visible: (val) => {
          return val.status == '4'
        }
      }
    ]
  })
}
