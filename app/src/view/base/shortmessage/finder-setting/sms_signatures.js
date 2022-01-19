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
  const formatStatus = (status) => {
    switch (status) {
      case 0:
        return `企事业单位的全称或简称`
      case 1:
        return `工信部备案网站的全称或简称`
      case 2:
        return `App 应用的全称或简称`
      case 3:
        return `公众号或小程序的全称或简称`
      case 4:
        return `电商平台店铺名的全称或简称`
    }
    // return
  }
  return createSetting({
    search: [
      { key: 'status', name: '审核状态', type: 'select', options: vm.search_options },
      { key: 'sign_name', name: '签名名称' }
    ],
    columns: [
      { name: '签名名称', key: 'sign_name' },
      { name: '签名来源', key: 'sign_source' ,formatter: formatStatus},
      { name: '申请说明', key: 'remark' },
      { name: '创建时间', key: 'created', formatter: formatDate, width: '160px' },
      {
        name: '审核状态',
        key: 'status',
        width: '100px',
        render: (h, {row}) =>
        h(
          'div',
          {
            class:'yahh',
          },
          [h('div',{class:`status-icon ${row.status=='1' && 'success'} ${row.status=='2' && 'fail'}`}),h('span',{class:''},row.status=='0' && '审核中',row.status=='1' && '审核通过',row.status=='2' && '审核失败'),row.status=='2' && h('span',{},'sdsadassa')]
      
      ),
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
