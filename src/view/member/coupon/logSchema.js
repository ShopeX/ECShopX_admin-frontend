import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'
import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const createTableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '日志',
        key: 'log',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.showLogInfo(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      }
    ],
    search: [
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas },
      { key: 'card_title', name: '优惠券名称' },
      {
        key: 'card_type', name: '券类型', type: 'select', options: [
          {
            label: '折扣券',
            value: 'discount',
            name: 'discount'
          },
          {
            label: '满减券',
            value: 'cash',
            name: 'cash'
          },
          {
            label: '兑换券',
            value: 'new_gift',
            name: 'new_gift'
          },
          {
            label: '立减券',
            value: 'minus',
            name: 'minus'
          },
        ]
      },
      {
        key: 'status',
        name: '状态',
        type: 'select',
        options: [
          {
            label: '待使用',
            value: 1,
            name: 1
          },
          {
            label: '已使用',
            value: 2,
            name: 2
          },
          {
            label: '已过期',
            value: 3,
            name: 3
          },
          {
            label: '已作废',
            value: 4,
            name: 4
          }
        ]
      },
      {
        key: 'get_outer_str',
        name: '发券渠道',
        type: 'select',
        options: [
          {
            label: '人工发放',
            value: 'manual',
            name: 'manual'
          },
          {
            label: '领券中心',
            value: 'center',
            name: 'center'
          },
          {
            label: '签到奖励',
            value: 'signin',
            name: 'signin'
          },
          {
            label: '大转盘抽奖',
            value: 'wheel',
            name: 'wheel'
          }
        ]
      },
      { key: 'user_card_code', name: '会员卡号' },
      { key: 'mobile', name: '手机号' },
      {
        key: 'get_date',
        name: '领取时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd'
      },
      {
        key: 'code',
        name: '优惠券券码'
      },
      {
        key: 'card_id',
        name: '券模板id'
      }
    ],
    columns: [
      {
        name: '发放/领取时间',
        key: 'get_date',
        width: '200px'
      },
      {
        name: '券模板ID',
        key: 'card_id',
        render(_, { row }) {
          return <span style={{ color: '#409EFF', textDecoration: 'underline' }} >{row.card_id}</span>
        }
      },
      {
        name: '券模板名称',
        key: 'card_title'
      },
      {
        name: '券类型',
        key: 'card_type',
        render(_, { row }) {
          const typeMap = {
            discount: '折扣券',
            cash: '满减券',
            new_gift: '兑换券',
            minus: '立减券'
          }
          return typeMap[row.card_type] || '-'
        }
      },
      {
        name: '规则',
        key: 'discount_rule'
      },
      {
        name: '优惠券券码',
        key: 'code',
        width: '160px',
        render(_, { row }) {
          // 
          return <div>
            <span>{row.code}</span>&nbsp;
            <el-tooltip effect="dark" content="复制" placement="top-start">
              <i
                onClick={() => {
                  vm.$copyText(row.code)
                  vm.$message.success('复制成功')
                }}
                class="el-icon-document-copy"
              />
            </el-tooltip>
          </div>
        }
      },
      {
        name: 'PO编码',
        key: 'po_code'
      },
      {
        name: 'Budget code',
        key: 'budget_code'
      },
      {
        name: '区域',
        key: 'regionauth_name'
      },
      {
        name: '有效期',
        key: 'quantit1y',
        width: '200px',
        render(_, { row }) {
          return `${row.begin_date} - ${row.end_date}`
        }
      },
      {
        name: '状态',
        key: 'status',
        width: '100px',
        render(_, { row }) {
          const statusMap = {
            1: '待使用',
            2: '已使用',
            3: '已过期',
            4: '已作废'
          }
          const typeMap = {
            1: 'primary',
            2: 'success',
            3: 'warning',
            4: 'danger'
          }
          return <el-tag class="status-card" type={typeMap[row.status] || ''}>
            {statusMap[row.status] || '-'}
          </el-tag>
        }
      },
      {
        name: '会员卡号',
        key: 'user_card_code',
        width: '160px'
      },
      {
        name: '手机号',
        key: 'mobile'
      },
      {
        name: '发券渠道',
        key: 'get_outer_str',
        render(_, { row }) {
          const getOuterStrMap = {
            manual: '人工发放',
            center: '领券中心',
            signin: '签到奖励',
            wheel: '大转盘抽奖',
          }
          return getOuterStrMap[row.get_outer_str] || '-'
        }
      },
      {
        name: '核销时间',
        key: 'used_time',
        width: '140px',
        render(_, { row }) {
          return row.used_time > 0 ? moment(row.used_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
        }
      },
      {
        name: '核销订单',
        key: 'used_order_id',
        render(_, { row }) {
          return <span style={{ color: '#409EFF', textDecoration: 'underline' }} onClick={() => {
            vm.$router.push(`/order/detail/${row.used_order_id}`)
          }}>{row.used_order_id}</span>
        }
      }
    ]
  })

// 日志表格数据
export const createLogTableSchema = (vm) =>
  createSetting({
    columns: [
      {
        name: '操作类型',
        key: 'act_type',
      },
      {
        name: '操作内容',
        key: 'log_content',
        render(_, { row }) {
          if (typeof row.log_content === 'string') {
            return <span>{row.log_content}</span>
          }
          return (
            <SpFinder
              ref='finder'
              fixed-row-action
              row-actions-width='200px'
              no-selection
              setting={innerTableSchema}
              row-actions-fixed-align='left'
              data={row.log_content}
              front-paging
            />
          )
        }
      },
      {
        name: '操作人',
        key: 'operator'
      },
      {
        name: '时间',
        key: 'created',
        render(_, { row }) {
          return <span>{moment(row.created * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
        }
      }
    ]
  })

// 嵌套在日志里面的表格信息
const innerTableSchema = {
  columns: [
    {
      name: '修改项',
      key: 'edit'
    },
    {
      name: '修改前',
      key: 'before'
    },
    {
      name: '修改后',
      key: 'after'
    }
  ]
}

export const loseFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '',
        key: 'text',
        component(_, value) {
          return (
            <div>
              <div>作废优惠券后将不可使用,为了避免客诉,请和客户沟通后再作废优惠券</div>
            </div>
          )
        }
      },
      {
        label: '原因',
        key: 'lose_reason',
        component(_, value) {
          return (
            <div>
              <el-input v-model={value['lose_reason']} type='textarea' placeholder='请输入' />
            </div>
          )
        }
      }
    ],
    vm
  )
