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
  return createSetting({
    search: [
      { key: 'merchant_name', name: vm.$t('f06f8d75.e6f169') },
      { key: 'legal_name', name: vm.$t('f06f8d75.52409d') },
      { key: 'legal_mobile', name: vm.$t('f06f8d75.09a1f6') },
      {
        key: 'time_start',
        name: vm.$t('f06f8d75.773775'),
        type: 'date-range',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: vm.$t('f06f8d75.b44c0f'),
        endPlaceholder: vm.$t('f06f8d75.1d468b')
      }
    ],
    columns: [
      { name: vm.$t('f06f8d75.e6f169'), key: 'merchant_name' },
      { name: vm.$t('f06f8d75.52409d'), key: 'legal_name' },
      { name: vm.$t('f06f8d75.09a1f6'), key: 'legal_mobile' },
      { name: vm.$t('f06f8d75.773775'), key: 'created', formatter: formatDate, width: '160px' },
      {
        name: vm.$t('f06f8d75.fc90f2'),
        key: 'audit_goods',
        width: '100px',
        render: (h, { row }) =>
          h(
            'el-button',
            {
              class: 'yahh',
              props: { type: 'text' },
              on: {
                click: () => {
                  vm.fnAffirm(row)
                }
              }
            },
            [
              h(
                'span',
                { class: 'aaa' },
                row.audit_goods ? vm.$t('f06f8d75.0a60ac') : vm.$t('f06f8d75.c9744f')
              ),
              h('i', { class: 'el-icon-s-tools' }, '')
            ]
          ),

        renderHeader() {
          return (
            <div>
              <span>{vm.$t('f06f8d75.a453a5')} </span>
              <el-tooltip
                class='item'
                effect='light'
                content={vm.$t('f06f8d75.3792c2')}
                placement='top-start'
              >
                {/* <span slot='content'>
                      商户商家商品是否<br/>需通过平台审核
                      </span> */}
                <i class='el-icon-question'></i>
              </el-tooltip>
            </div>
          )
        }
      }
    ],
    actions: [
      {
        name: vm.$t('f06f8d75.f26225'),
        key: 'detail',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.$router.push({
              path: vm.matchRoutePath('editor'),
              query: { type: 'detail', merchantId: val[0].id }
            })
          }
        }
      },
      {
        name: vm.$t('f06f8d75.95b351'),
        key: 'editor',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.$router.push({
              path: vm.matchRoutePath('editor'),
              query: { type: 'edit', merchantId: val[0].id }
            })
          }
        },
        visible: () => {
          return vm.datapass_block == 0
        }
      },
      {
        name: vm.$t('f06f8d75.710ad0'),
        key: 'off',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.fnMerchantsState(val, false)
          }
        },
        visible: (val) => {
          return !val.disabled
        }
      },
      {
        name: vm.$t('f06f8d75.cc42dd'),
        key: 'off',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.fnMerchantsState(val, true)
          }
        },
        visible: (val) => {
          return val.disabled
        }
      }
    ]
  })
}
