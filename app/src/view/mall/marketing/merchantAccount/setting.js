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
      { key: 'mobile', name: '手机号' },
      { key: 'merchant_name', name: '商户名称' },
    ],
    columns: [
      { name: '手机号（账户名称）', key: 'mobile' },
      {
        name: '商户类型', key: 'settled_type', render: (h, { row }) =>{
          if (row.settled_type=='soletrader') {
            return (h(
              'el-tag',
              {
                props: { type: 'text',type: 'warning',size:"medium" },
              },
              [h('span', { class: 'aaa' }, '个体户')]

            ))
          }else{
            return (h(
              'el-tag',
              {
                props: { type: 'text',type: 'success',size:"medium" },
              },
              [h('span', { class: 'aaa' }, '企业')]

            ))
          }
        }

      },
      { name: '商户名称', key: 'merchant_name' },
    ],
    actions: [
      {
        name: '重置密码',
        key: 'detail',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async val => {
            vm.fnChangePassword(val[0])            
          }
        }
      }
    ],
  })
}
