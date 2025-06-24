import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const tableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.editRowHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      }
    ],
    columns: [
      {
        name: '开票方名称',
        key: 'invoice_apply_bn',
        width: '120'
      },
      {
        name: '开票方税号',
        key: 'invoice_apply_bn',
        width: '120'
      },
      {
        name: '开票方电话',
        key: 'invoice_apply_bn',
        width: '120'
      },
      {
        name: '开票渠道',
        key: 'invoice_apply_bn',
        width: '120'
      },
      {
        name: '税率',
        key: 'invoice_apply_bn',
        width: '80'
      },
      {
        name: '开票人',
        key: 'invoice_apply_bn',
        width: '100'
      },
      {
        name: '收款人',
        key: 'invoice_apply_bn',
        width: '100'
      },
      {
        name: '复核人',
        key: 'invoice_apply_bn',
        width: '100'
      },
      {
        name: '开票方地址',
        key: 'invoice_apply_bn',
        width: '120'
      },
      {
        name: '添加时间',
        key: 'created',
        render(h, { row }) {
          return <span> {moment(row.create_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      }
    ]
  })

export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '开票方类型',
        key: 'alipay_fee_type',
        type: 'radio',
        options: [{ name: '平台', label: 'online' }]
      },
      {
        label: '开票人',
        key: 'alipay_fee_type',
        type: 'input',
        required: true
      },
      {
        label: '收款人',
        key: 'alipay_fee_type',
        type: 'input',
        required: true
      },
      {
        label: '复核人',
        key: 'alipay_fee_type',
        type: 'input',
        required: true
      },
      {
        label: '开票方名称',
        key: 'alipay_fee_type',
        type: 'input',
        required: true
      },
      {
        label: '税率',
        key: 'alipay_fee_type',
        type: 'input',
        required: true,
        component({ key }, value) {
          return (
            <div>
              <el-input v-model={value[key]} type='number' min={0} />%
            </div>
          )
        }
      },
      {
        label: '开票方税号',
        key: 'alipay_fee_type',
        type: 'input',
        required: true
      },
      {
        label: '开票方银行',
        key: 'alipay_fee_type',
        type: 'input',
        required: true
      },
      {
        label: '开票方银行账号',
        key: 'alipay_fee_type',
        type: 'input',
        required: true
      },
      {
        label: '开票方联系电话',
        key: 'alipay_fee_type',
        type: 'input',
        required: true
      },
      {
        key: 'invoice_type',
        label: '抬头类型',
        defaultValue: 'individual',
        component({ key }, value) {
          return (
            <div>
              <el-radio-group v-model={value['invoice_type']}>
                <el-radio label='individual'>个人</el-radio>
                <el-radio label='enterprise'>公司</el-radio>
              </el-radio-group>
            </div>
          )
        }
      },
      {
        key: 'invoice_type',
        label: '发票类型',
        defaultValue: 'individual',
        component({ key }, value) {
          return (
            <div>
              <el-radio-group v-model={value['invoice_type']}>
                <el-radio label='individual'>普通发票-电子</el-radio>
                <el-radio label='enterprise'>专业发票</el-radio>
              </el-radio-group>
            </div>
          )
        },
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_title',
        label: '个人抬头',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'individual'
        }
      },
      {
        key: 'company_title',
        label: '公司抬头',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_tax_number',
        label: '纳税人识别号',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'email',
        label: '收票人邮箱',
        type: 'input',
        defaultValue: ''
      },
      {
        key: 'mobile',
        label: '收票人手机',
        type: 'input',
        defaultValue: '',
        component({ key }, value) {
          return (
            <div>
              <el-input v-model={value['mobile']} type='number' />
            </div>
          )
        }
      },
      {
        key: 'company_address',
        label: '公司地址',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'company_telephone',
        label: '公司电话',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'bank_name',
        label: '开户银行',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      },
      {
        key: 'bank_account',
        label: '开户行账户',
        type: 'input',
        defaultValue: '',
        isShow() {
          return vm.dialogForm.invoice_type === 'enterprise'
        }
      }
    ],
    vm
  )
