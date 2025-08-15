import { createSetting } from '@shopex/finder'
import { Message, MessageBox } from 'element-ui'
export default (vm) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var YY = date.getFullYear() + '-'
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return YY + MM + DD + ' ' + hh + mm + ss
  }
  const formatStatus = (val) => {
    // status: 0=审核中 1=审核通过 2=已拒绝 3=处理中 4=处理成功 5=处理失败
    if (val === '0') {
      return '审核中'
    } else if (val === '1') {
      return '审核通过'
    } else if (val === '2') {
      return '已拒绝'
    } else if (val === '3') {
      return '处理中'
    } else if (val === '4') {
      return '处理成功'
    } else if (val === '5') {
      return '处理失败'
    }
  
  }
  const formatMoney = (money) => {
    return (money / 100).toFixed(2).toLocaleString()
  }

  // 判断是否为商户
  const basePath = window.location.href.match(/\/(shopadmin|supplier|merchant)(\/.*)?$/)?.[1]
  const isMerchant = basePath === 'merchant'

  // 根据是否为商户来配置不同的表格字段
  const getColumns = () => {
    if (isMerchant) {
      // 商户提现菜单字段
      return [
        { name: '申请时间', key: 'created', width: 200, formatter: formatDate },
        { name: '申请商户', key: 'merchant_name', width: 120 },
        { name: '商户id', key: 'merchant_id', width: 100 },
        { name: '申请人账号', key: 'operator', width: 120 },
        { name: '提现类型', key: 'withdraw_type', width: 100 },
        { name: '提现金额', key: 'amount', width: 120, formatter: formatMoney },
        {
          name: '查看发票', key: 'invoice_file', width: 100,
          render: (h, { row }) => {
            if (!row.invoice_file) return h('span', '-')
            return h('el-image', {
              props: {
                src: row.invoice_file,
                'preview-src-list': [row.invoice_file],
                fit: 'cover'
              },
              style: {
                width: '50px',
                height: '50px'
              }
            })
          }
        },
        { name: '审批时间', key: 'audit_time', width: 200, formatter: formatDate },
        { name: '审核原因', key: 'audit_remark', width: 150 },

        { name: '提现状态', key: 'status', width: 100, formatter: formatStatus },
        { name: '失败原因', key: 'failure_reason', width: 150 }
      ]
    } else {
      // 平台提现菜单字段
      return [
        { name: '申请时间', key: 'created', width: 200, formatter: formatDate },
        { name: '申请人账号', key: 'operator', width: 120 },
        { name: '申请店铺', key: 'distributor_name', width: 120 },
        { name: '提现类型', key: 'withdraw_type', width: 100 },
        { name: '提现金额', key: 'amount', width: 120, formatter: formatMoney },
        {
          name: '查看发票', key: 'invoice_file', width: 100,
          render: (h, { row }) => {
            if (!row.invoice_file) return h('span', '-')
            return h('el-image', {
              props: {
                src: row.invoice_file,
                'preview-src-list': [row.invoice_file],
                fit: 'cover'
              },
              style: {
                width: '50px',
                height: '50px'
              }
            })
          }
        },
        { name: '审批时间', key: 'audit_time', width: 200, formatter: formatDate },
        { name: '审核备注', key: 'audit_remark', width: 150 },
        { name: '审核人账号', key: 'auditor', width: 120 },
        { name: '提现状态', key: 'status', width: 100, formatter: formatStatus },
        { name: '提现进度', key: 'failure_reason', width: 150 }
      ]
    }
  }

  return createSetting({
    columns: getColumns()
  })
}
