import { createSetting } from '@shopex/finder'
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
      { key: 'merchant_name', name: '商户名称' },
      { key: 'legal_name', name: '联系人' },
      { key: 'legal_mobile', name: '联系电话' },
      {
        key: 'time_start',
        name: '入驻时间',
        type: 'date-range',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      }
    ],
    columns: [
      { name: '商户名称', key: 'merchant_name' },
      { name: '联系人', key: 'legal_name' },
      { name: '联系电话', key: 'legal_mobile' },
      { name: '入驻时间', key: 'created', formatter: formatDate, width: '160px' },
      {
        name: '商品审核（商户商家商品是否需通过平台审核）',
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
              h('span', { class: 'aaa' }, row.audit_goods ? ' 是 ' : ' 否 '),
              h('i', { class: 'el-icon-s-tools' }, '')
            ]
          ),

        renderHeader () {
          return (
            <div>
              <span>商品审核 </span>
              <el-tooltip
                class='item'
                effect='light'
                content='商户上架商品是否需通过平台审核'
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
        name: '详情',
        key: 'detail',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.$router.push({
              path: vm.matchHidePage('editor'),
              query: { type: 'detail', merchantId: val[0].id }
            })
          }
        }
      },
      {
        name: '编辑',
        key: 'editor',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.$router.push({
              path: vm.matchHidePage('editor'),
              query: { type: 'edit', merchantId: val[0].id }
            })
          }
        },
        visible: () => {
          return vm.datapass_block == 0
        }
      },
      {
        name: '禁用',
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
        name: '开启',
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
