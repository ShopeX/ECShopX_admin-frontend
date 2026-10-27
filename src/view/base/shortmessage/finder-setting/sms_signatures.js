/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'
import { Message } from 'element-ui'
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
  const formatStatus = (status) => {
    switch (status) {
      case '0':
        return vm.$t('ed356575.7d9f89')
      case '1':
        return vm.$t('ed356575.72f646')
      case '2':
        return vm.$t('ed356575.f2945a')
      case '3':
        return vm.$t('ed356575.788dc8')
      case '4':
        return vm.$t('ed356575.af36b9')
      case '5':
        return vm.$t('ed356575.fc430f')
    }
  }
  const a = (status) => {
    switch (status) {
      case 0:
        return vm.$t('ed356575.b720a6')
      case 1:
        return vm.$t('ed356575.871a30')
      case 2:
        return vm.$t('ed356575.3c6210')
    }
  }
  return createSetting({
    search: [
      { key: 'status', name: vm.$t('ed356575.b6d0e9'), type: 'select', options: vm.search_options },
      { key: 'sign_name', name: vm.$t('ed356575.59592b') }
    ],
    columns: [
      { name: vm.$t('ed356575.59592b'), key: 'sign_name' },
      { name: vm.$t('ed356575.7f3b15'), key: 'sign_source', formatter: formatStatus },
      { name: vm.$t('ed356575.9206ad'), key: 'remark' },
      { name: vm.$t('ed356575.eca37c'), key: 'created', formatter: formatDate, width: '160px' },
      {
        name: vm.$t('ed356575.b6d0e9'),
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
                class: `status-icon ${row.status == '1' && 'success'} ${
                  row.status == '2' && 'fail'
                }`
              }),
              h(
                'span',
                {},
                (row.status == '0' && vm.$t('ed356575.b720a6')) ||
                  (row.status == '1' && vm.$t('ed356575.871a30')) ||
                  (row.status == '2' && vm.$t('ed356575.3c6210'))
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
    ],
    actions: [
      {
        name: vm.$t('ed356575.f26225'),
        key: 'detail',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.$router.push({
              path: vm.matchRoutePath('edit'),
              query: { type: 'detail', id: val[0].id }
            })
          }
        }
      },
      {
        name: vm.$t('ed356575.95b351'),
        key: 'editor',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            // status=0 审核中不可改；仅审核通过/失败可编辑
            if (val[0].status == 0 || val[0].status === '0') {
              Message.warning(vm.$t('ed356575.d4bb3f'))
              return
            }
            vm.$router.push({
              path: vm.matchRoutePath('edit'),
              query: { type: 'edit', id: val[0].id }
            })
          }
        },
        visible: (val) => {
          return val.status == 1 || val.status == 2
        }
      },
      {
        name: vm.$t('ed356575.2f4aad'),
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            if (val[0].status == 0 || val[0].status === '0') {
              Message.warning(vm.$t('ed356575.b20524'))
              return
            }
            vm.deleteSignatureHandle(val[0].id)
          }
        },
        visible: (val) => {
          return val.status != 0 && val.status !== '0'
        }
      }
    ]
  })
}
