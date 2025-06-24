import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { open_status_map, open_status_step_map, invoice_source_map } from './constants'
import moment from 'moment'
export const formSchema = (vm) => bindThisForFormSchema([
  {
    type: 'group',
    label: '基础信息'
  },
  {
    key: 'create_time',
    label: '开票申请时间',
    display: 'inline',
    component(_, value) {
      return <span> {moment(value.create_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
    }
  },
  {
    key: 'invoice_status',
    label: '开票状态',
    display: 'inline',
    component(_, value) {
      return <span> {open_status_map[value.status]} </span>
    }
  },
  {
    key: 'invoice_method',
    label: '开票渠道',
    display: 'inline',
    component(_, value) {
      return <span> {open_status_step_map[value.invoice_method]} </span>
    }
  },
  {
    key: 'invoice_source',
    label: '来源',
    display: 'inline',
    component(_, value) {
      return <span> {invoice_source_map[value.invoice_source]} </span>
    }
  },
  {
    key: 'update_time',
    label: '更新时间',
    display: 'inline',
    component(_, value) {
      return <span> {moment(value.update_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
    }
  },
  {
    key: 'user_card_code',
    label: '会员编号',
    type: 'text',
    display: 'inline'
  },
  {
    key: 'user_mobile',
    label: '会员手机',
    type: 'text',
    display: 'inline'
  },
  {
    key: 'order_id',
    label: '订单编号',
    type: 'text',
    display: 'inline'
  },
  {
    key: 'invoice_amount',
    label: '发票金额',
    type: 'text',
    display: 'inline'
  },
  {
    key: 'remark',
    label: '备注',
    type: 'text',
    display: 'inline'
  },
  {
    type: 'group',
    label: '开票信息'
  },
  {
    key: 'invoice_type',
    label: '抬头类型',
    type: 'text',
    component(_, value) {
      const typeMap = { enterprise: '企业', individual: '个人' };
      return <span> {typeMap[value.invoice_type]} </span>
    }
  },
  {
    key: 'company_title',
    label: '发票抬头',
    type: 'text',
    display: 'inline',
  },
  {
    key: 'email',
    label: '开票类型',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'enterprise'
    }
  },
  {
    key: 'mobile',
    label: '开票手机号',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'individual'
    }
  },
  {
    key: 'email',
    label: '开票邮箱',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'individual'
    }
  },
  {
    key: 'company_tax_number',
    label: '纳税人识别号',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'enterprise'
    }
  },
  {
    key: 'company_address',
    label: '公司地址',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'enterprise'
    }
  },
  {
    key: 'company_telephone',
    label: '公司电话',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'enterprise'
    }
  },
  {
    key: 'bank_name',
    label: '开户银行',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'enterprise'
    }
  },
  {
    key: 'bank_account',
    label: '银行账户',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'enterprise'
    }
  },
  {
    key: 'bank_account',
    label: '开票手机号',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'enterprise'
    }
  },
  {
    key: 'bank_account',
    label: '开票邮箱',
    type: 'text',
    isShow() {
      return vm.form.invoice_type === 'enterprise'
    }
  },
  {
    type: 'group',
    label: '开票商品明细'
  },
  {
    key: 'invoice_items',
    component(_, value) {
      return (
        <SpFinder
          ref='finder'
          setting={infoTable}
          data={value.invoice_items}
          no-selection
          show-pager={false}
        />
      )
    }
  },
  {
    type: 'group',
    label: '发票详情'
  },
  {
    key: 'invoices',
    component() {
      return (
        <SpFinder
          ref='finder'
          fixed-row-action
          setting={afterTable}
          data={vm.form.invoices}
          no-selection
          show-pager={false}
        >
          <div slot='tableTop'>
            <div class='action-container'>
              <div style='height: 20px' />
              <el-button type='primary' plain onClick={() => this.showPdHandle()}>
                查看发票PDF
              </el-button>
              {vm.form.invoice_status === 'invoice_success' && vm.form.invoice_method === 'online' && <el-button type='primary' plain onClick={() => this.sendEmailHandle()}>
                重发至邮箱
              </el-button>}
            </div>
          </div>
        </SpFinder>
      )
    }
  }
],
  vm
)

const afterTable = {
  columns: [
    {
      name: '发票号码',
      key: 'invoice_no',
      width: 180
    },
    {
      name: '发票代码',
      key: 'invoice_code',
      width: 100
    },
    {
      name: '开票类型',
      key: 'invoice_type',
      width: 100,
      render(_, { row }) {
        const color_map = {
          'blue': "蓝票",
          'red': "红票"
        }
        return <span> {color_map[row['invoice_type']]} </span>
      }
    },
    {
      name: '开票日期',
      key: 'create_time',
      width: 190,
      render(_, { row }) {
        return <span> {moment(row['create_time'] * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
      }
    }
  ]
}

// 嵌套在日志里面的商品表格信息
const infoTable = {
  columns: [
    {
      key: 'item_bn',
      name: 'SKU编号',
      width: 180
    },
    {
      key: 'item_name',
      name: '商品名称',
      width: 180
    },
    {
      key: 'spec_info',
      name: '规格',
      width: 80
    },
    {
      key: 'num',
      name: '数量',
      width: 80
    },
    {
      key: 'amount',
      name: '开票金额',
      width: 120
    },
    {
      key: 'order_id',
      name: '订单编号',
      width: 220
    }
  ]
}
