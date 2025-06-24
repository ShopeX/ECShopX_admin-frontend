import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const formSchema = (vm) => bindThisForFormSchema([
  {
    type: 'group',
    label: '发票设置'
  },
  {
    label: '开票渠道',
    key: 'alipay_fee_type',
    type: 'radio',
    options: [
      { name: '线下开票', label: 'online' },
      { name: '线上百望开票', label: 'offline' }
    ]
  },
  {
    label: '开票申请方式',
    key: 'alipay_fee_type',
    type: 'radio',
    options: [
      { name: '下单时可申请开票', label: 'online' },
      { name: '订单完成后申请开票', label: 'offline' }
    ]
  },
  {
    label: '运费是否开票',
    key: 'alipay_fee_type',
    type: 'radio',
    options: [
      { name: '运费支持开票', label: 'online' },
      { name: '运费不支持开票', label: 'offline' }
    ]
  },
  {
    label: '开票维度',
    key: 'alipay_fee_type',
    type: 'radio',
    options: [
      { name: '按订单开票', label: 'online' }
    ]
  },
],
  vm
)
