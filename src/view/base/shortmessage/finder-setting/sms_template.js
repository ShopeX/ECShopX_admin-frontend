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
        return vm.$t('7adabfaf.983f59')
      case '1':
        return vm.$t('7adabfaf.e7d158')
      case '2':
        return vm.$t('7adabfaf.0a9738')
    }
  }
  return createSetting({
    search: [
      { key: 'status', name: vm.$t('7adabfaf.b6d0e9'), type: 'select', options: vm.search_options },
      { key: 'template_name', name: vm.$t('7adabfaf.a5d1c5') }
    ],
    columns: [
      { name: vm.$t('7adabfaf.a5d1c5'), key: 'template_name' },
      { name: vm.$t('7adabfaf.50760a'), key: 'template_code' },
      { name: vm.$t('7adabfaf.03ae79'), key: 'template_content' },
      { name: vm.$t('7adabfaf.b2b399'), key: 'template_type', formatter: formatTemplate_type },
      { name: vm.$t('7adabfaf.bc50bf'), key: 'scene_name' },
      { name: vm.$t('7adabfaf.eca37c'), key: 'created', formatter: formatDate },
      {
        name: vm.$t('7adabfaf.b6d0e9'),
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
                (row.status == '0' && vm.$t('7adabfaf.b720a6')) ||
                  (row.status == '1' && vm.$t('7adabfaf.871a30')) ||
                  (row.status == '2' && vm.$t('7adabfaf.3c6210'))
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
        name: vm.$t('7adabfaf.f26225'),
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
        name: vm.$t('7adabfaf.95b351'),
        key: 'editor',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.$router.push({
              path: vm.matchRoutePath('edit'),
              query: { type: 'edit', id: val[0].id }
            })
          }
        },
        visible: (val) => {
          return val.status == '2'
        }
      },
      {
        name: vm.$t('7adabfaf.2f4aad'),
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.deleteTemplateHandle(val[0].id)
          }
        },
        visible: (val) => {
          return val.status != '0'
        }
      }
    ]
  })
}
