import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        type: 'group',
        label: '百望云发票'
      },
      {
        label: '用户名',
        key: 'username',
        type: 'input',
        required: true
      },
      {
        label: '密码',
        key: 'password',
        type: 'input',
        required: true
      },
      {
        label: 'appKey',
        key: 'appKey',
        type: 'input',
        required: true
      },
      {
        label: 'appSecret',
        key: 'appSecret',
        type: 'input',
        required: true
      },
      {
        label: '用户盐值',
        key: 'orgAuthCode',
        type: 'input',
        required: true
      },
      {
        label: '机构税号',
        key: 'taxNo',
        type: 'input',
        required: true
      }
    ],
    vm
  )
