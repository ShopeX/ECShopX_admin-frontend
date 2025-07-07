import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const formSchema = (vm) => bindThisForFormSchema([
  {
    type: 'group',
    label: '发票设置'
  },
  {
    label: '开票渠道',
    key: 'invoice_method',
    type: 'radio',
    defaultValue: 'offline',
    options: [
      { name: '线下开票', label: 'offline' },
      { name: '线上开票（对接第三方开票系统）', label: 'online' }
    ]
  },
  {
    label: '开票申请方式',
    key: 'apply_type',
    type: 'radio',
    defaultValue: '1',
    options: [
      { name: '结算页可申请开票', label: '1' },
      { name: '已支付订单可申请开票', label: '2' }
    ]
  },
  {
    label: '运费是否开票',
    key: 'freight_invoice',
    type: 'radio',
    defaultValue: '2',
    options: [
      { name: '运费支持开票', label: '2' },
      { name: '运费不支持开票', label: '1' }
    ]
  },
  {
    label: '运费开票名称',
    key: 'freight_name',
    type: 'input',
    tip:'为空时默认运费开票名称，如果填写名称按填写名称展示在发票上'
  },
  {
    label: '开票维度',
    key: 'invoice_limit',
    type: 'radio',
    defaultValue: 'order',
    options: [
      { name: '按订单开票', label: 'order' },
      // { name: 'SKU维度', label: 'item' },
    ]
  },
  {
    label: '可开票期限',
    key: 'invoice_open_term',
    component({ key }, value){
      return(
        <div>订单商品签收后，且在订单创建&nbsp; <el-input v-model={value[key]} type='number' min='0' /> &nbsp;(月)内支持申请开票</div>
      )
    }
  },
  {
    label: '专用发票展示',
    key: 'special_invoice',
    type: 'radio',
    defaultValue: '1',
    options: [
      { name: '企业抬头可选择专用发票', label: '1' },
      { name: '企业抬头不可以选择专用发票（前端此选项不展示，默认为普通发票）', label: '2' }
    ]
  },
  {
    label: '申请开票节点',
    key: 'apply_node',
    type: 'radio',
    defaultValue: '2',
    options: [
      { name: '订单过了售后期', label: '2' },
      { name: '订单确认收货', label: '1' }
    ]
  },
  {
    label: '是否启用开票',
    key: 'invoice_status',
    type: 'switch'
  },
],
  vm
)
