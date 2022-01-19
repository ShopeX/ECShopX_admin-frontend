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
  if (vm.$store.getters.login_type != 'merchant') {
    return createSetting({

      search: [
        { key: 'mobile', name: '手机号' },
        { key: 'merchant_name', name: '商户名称' },
      ],
      columns: [
        {
          name: '手机号（账号名称）', key: 'mobile', render: (h, { row }) => {
            if (row.settled_type === 'soletrader') {
              return [(
                h(
                  'span',
                  {
                    style: { 'margin-right': '20px' }
                  },
                  row.mobile
                )
              ), h(
                'el-tag',
                {
                  props: { type: 'text', type: 'warning', size: "medium" },
                },
                '个体户'
              )]
            } else {
              return [(
                h(
                  'span',
                  {
                    style: { 'margin-right': '20px' }
                  },
                  row.mobile
                )
              ),h(
                'el-tag',
                {
                  props: { type: 'text', type: 'success', size: "medium" },
                },
                '企业'
              )]
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
  } else {
    return createSetting({
      columns: [
        {
          name: '手机号（账号名称）', key: 'mobile', render: (h, { row }) => {
            if (row.is_merchant_main == '1') {
              return [(
                h(
                  'span',
                  {
                    style: { 'margin-right': '20px' }
                  },
                  row.mobile
                )
              ), h(
                'el-tag',
                {
                  props: { type: 'text', type: 'warning', size: "medium" },
                },
                '超级管理员'
              )]
            } else {
              return (
                h(
                  'span',
                  {
                    style: { 'margin-right': '20px' }
                  },
                  row.mobile
                )
              )
            }

          }
        },
      ],
      actions: [
        {
          name: '编辑',
          key: 'detail',
          type: 'button',
          buttonType: 'text',
          action: {
            type: 'link',
            handler: async val => {
              vm.editHandler(val[0])
              console.log(val);
            }
          }
        }
      ],
    })
  }

}
