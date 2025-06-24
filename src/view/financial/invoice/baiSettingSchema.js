import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const formSchema = (vm) => bindThisForFormSchema([
  {
    type: 'group',
    label: '百望云发票'
  },
  {
    label: '用户名',
    key: 'alipay_fee_type1',
    type: 'input',
    required: true
  },
  {
    label: '密码',
    key: 'alipay_fee_type',
    type: 'input',
    required: true
  },
  {
    label: 'appKey',
    key: 'alipay_fee_type',
    type: 'input',
    required: true
  },
  {
    label: 'appSecret',
    key: 'alipay_fee_type',
    type: 'input',
    required: true
  },
  {
    label: '用户盐值',
    key: 'alipay_fee_type',
    type: 'input',
    required: true
  },
  {
    label: '机构税号',
    key: 'alipay_fee_type',
    type: 'input',
    required: true
  }
],
  vm
)
