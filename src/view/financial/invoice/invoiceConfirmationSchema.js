import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        type: 'group',
        label: '专票确认书'
      },
      {
        label: '企业专用发票确认书',
        key: 'special_invoice_confirm_open',
        type: 'switch'
      },
      {
        label: '注册协议标题',
        key: 'title',
        type: 'input',
        maxlength: 15
      },
      {
        label: '注册协议',
        key: 'content',
        type: 'richText'
      }
    ],
    vm
  )
