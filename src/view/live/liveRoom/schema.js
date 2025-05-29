import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { debounce } from 'lodash-es'

const tableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'name', name: '直播名称' },
      { key: 'polyv_channel_id', name: '频道号' },
      { key: 'watch_status', name: '直播状态', type: 'select', options: vm?.live_status },
      { key: 'anchor_account', name: '主播名称' },
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas },
      {
        key: 'live_time',
        name: '开播时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd HH:mm:ss'
      }
    ],
    actions: [
      {
        name: '直播配置',
        key: 'config',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.editConfigHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: '关联商品',
        key: 'link',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.linkProductHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: '推送优惠券',
        key: 'push',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.pushCouponHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: '推送券包',
        key: 'pushPack',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.pushCouponPackHandle(row)
            },
            1000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: '关联页面链接',
        key: 'linkPath',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.linkPageUrlHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: '编辑',
        key: 'linkPath',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.editRowDataHandle(row)
            },
            2000,
            {
              leading: true
            }
          )
        }
      },
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.deleteRowDataHandle(row)
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
        name: '频道号',
        key: 'polyv_channel_id',
        width: '80'
      },
      {
        name: '直播名称',
        key: 'name',
        render(h, { row }) {
          const typeMap = {
            'live': 'danger',
            'end': 'info',
            'waiting': 'success',
            'unStart': ''
          }
          return (
            <div>
              {row.name}
              <el-tag type={typeMap[row.audit_status]}>{row.watch_status_text} </el-tag>
            </div>
          )
        }
      },
      {
        name: '审核状态',
        key: 'audit_status_text',
        render(h, { row }) {
          const typeMap = {
            'all': '',
            'pending': 'success',
            'pass': 'info',
            'reject': 'warning',
            'updated_pending': 'danger'
          }
          return (
            <el-popover
              placement='bottom'
              title='状态'
              width='240'
              trigger='click'
              onShow={() => vm.onAuditShow(row)}
              onHide={() => vm.saveAuditStatus(row)}
            >
              <el-radio-group value={vm.audit_status} onInput={(val) => vm.changeAuditStatus(val)}>
                <el-radio label={'pass'}>审核通过</el-radio>
                <el-radio label={'reject'}>审核拒绝</el-radio>
              </el-radio-group>
              <span type={typeMap[row.aduit_status]} slot='reference'>
                {' '}
                {row.audit_status_text} <i class='el-icon-s-tools' />
              </span>
            </el-popover>
          )
        }
      },
      {
        name: '直播封面',
        key: 'cover_image_url',
        width: '220',
        render(h, scope) {
          return (
            <el-image
              src={scope.row.cover_image_url}
              style={{
                width: '200px',
                height: '200px'
              }}
            />
          )
        }
      },
      {
        name: '开播时间',
        key: 'start_time',
        render(h, { row }) {
          return <span> {moment(row.start_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      },
      {
        name: '创建账号',
        key: 'anchor_account'
      },
      {
        name: '区域',
        key: 'regionauth_id',
        render(h, { row }) {
          const str = vm.areas?.find((e) => e.value == row.regionauth_id)?.label
          return <span> {str} </span>
        }
      },
      {
        name: '创建时间',
        key: 'created',
        render(h, { row }) {
          return <span> {moment(row.created * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      },
      {
        name: '更新时间',
        key: 'updated',
        render(h, { row }) {
          return <span> {moment(row.updated * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      }
    ]
  })

// 关联券包
const pushLiveCouponFormSchema = [
  {
    component() {
      return (
        <div>
          <div class='action-container'>
            <el-button type='primary' onClick={() => this.openSelectCouponPackageDialog()}>
              选择券包
            </el-button>
          </div>
          <SpFinder
            ref='finder'
            data={this.packageTableData}
            fixed-row-action
            row-actions-width='80px'
            no-selection
            setting={this.pushCouponTableSchema}
            row-actions-fixed-align='left'
          />
        </div>
      )
    }
  }
]
const pushCouponTableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.deleteHandle(row, 'couponPackage')
          }
        }
      }
    ],
    columns: [
      {
        name: '券包标题',
        key: 'title'
      },
      {
        name: '券包封面图',
        key: 'image',
        render(_, { row }) {
          return <el-image src={row.cover} style={{ width: '50px', height: '50px' }} />
        }
      },
      {
        name: '券包描述',
        key: 'package_describe'
      }
    ]
  })

// 选择优惠券
const selectCouponFormSchema = [
  {
    component() {
      return (
        <div>
          <div class='action-container'>
            <el-button type='primary' onClick={() => this.openSelectCouponDialog()}>
              选择优惠券
            </el-button>
          </div>
          <SpFinder
            ref='finder'
            data={this.couponTableData}
            fixed-row-action
            row-actions-width='80px'
            no-selection
            setting={this.selectCouponTableSchema}
            row-actions-fixed-align='left'
          />
        </div>
      )
    }
  }
]
const selectCouponTableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.deleteHandle(row, 'coupon')
          }
        }
      }
    ],
    columns: [
      {
        name: '优惠券id',
        key: 'card_id',
        width: '100px'
      },
      {
        name: '券封面图',
        key: 'cover',
        render(_, { row }) {
          return <el-image src={row.cover} style={{ width: '50px', height: '50px' }} />
        }
      },
      {
        name: '优惠券名称',
        key: 'title'
      },
      {
        name: '券类型',
        width: '100px',
        key: 'card_type',
        render: (h, { row }) =>
          h(
            'el-tag',
            {
              props: {
                size: 'mini'
              }
            },
            vm.cardTypeFormatter(row)
          )
      },
      {
        name: '券规则',
        key: 'rule_text'
      },
      {
        name: '券有效期',
        formatter: (value, { takeEffect, begin_time, end_time }, col) => {
          if (takeEffect) {
            return takeEffect
          } else {
            return vm.getCardValidate(begin_time, end_time)
          }
        }
      }
    ]
  })

// 关联直播商品
const pickLinkLivePrdSchema = [
  {
    component() {
      return (
        <div>
          <div class='action-container'>
            <el-button type='primary' onClick={() => this.openSelectPrdDialog()}>
              选择商品
            </el-button>
            <el-upload
              style='display: inline-block; height: 0'
              action=''
              http-request={(file) => this.openBatchUploadDialog(file)}
              auto-upload={true}
              show-file-list={false}
            >
              <el-button type='primary'> 批量上传 </el-button>
            </el-upload>

            <el-button type='primary' onClick={() => this.downloadTemplateFile()}>
              下载模版
            </el-button>
          </div>
          <SpFinder
            ref='finder'
            data={this.selectlivePrdData || []}
            fixed-row-action
            row-actions-width='80px'
            no-selection
            setting={this.prdTableSchema}
            row-actions-fixed-align='left'
            show-pager={false}
          />
        </div>
      )
    }
  }
]
const prdTableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.deleteHandle(row, 'livePrd')
          }
        }
      }
    ],
    columns: [
      {
        name: '商品id',
        key: 'item_id'
      },
      {
        name: '商品名称',
        key: 'itemName'
      },
      {
        name: '品牌',
        key: 'goods_brand'
      },
      {
        name: '小镇',
        key: 'regionauth_name'
      },
      {
        name: '店铺',
        key: 'distributor_name'
      },
      {
        name: '库存',
        key: 'store'
      },
      {
        name: '商品状态',
        key: 'approve_status',
        render(_, { row }) {
          const prdStatusMap = {
            '1': '上架',
            '2': '下架'
          }
          return <span>{prdStatusMap[row.approve_status]}</span>
        }
      },
      {
        name: '审核状态',
        key: 'audit_status',
        render(_, { row }) {
          const textMap = {
            submitting: '待提交',
            approved: '成功',
            processing: '审核中',
            rejected: '审核拒绝'
          }
          return <span>{textMap[row.audit_status]}</span>
        }
      }
    ]
  })

// 关联页面地址
const linkUrlPathFormSchema = [
  {
    component() {
      return (
        <div>
          <div class='action-container'>
            <el-button type='primary' onClick={() => this.openSelectPagePathDialog()}>
              选择路径
            </el-button>
          </div>
          <SpFinder
            ref='finder'
            data={this.pagesData || []}
            fixed-row-action
            row-actions-width='80px'
            no-selection
            setting={this.linkUrlPathTableSchema}
            row-actions-fixed-align='left'
            show-pager={false}
          />
        </div>
      )
    }
  }
]
const linkUrlPathTableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.deleteHandle(row, 'liveUrl')
          }
        }
      }
    ],
    columns: [
      {
        name: '页面类型',
        key: 'page_type',
        render(_, { row }) {
          const typeMap = {
            'custom_page': '自定义页面',
            'store': '店铺'
          }
          if (row.page_type == 'store' || row.page_type == 'custom_page') {
            return <span>{typeMap[row.page_type]}</span>
          } else {
            return <span>{row.page_type}</span>
          }
        }
      },
      {
        name: '图片',
        key: 'image',
        render(_, { row }) {
          return (
            <div
              class='upload-box'
              style={{
                height: '100px',
                width: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onClick={() => vm.handleImgChange(row)}
            >
              {row.image ? (
                <img src={row.image} class='avatar' style={{ width: '100%' }}></img>
              ) : (
                <i class='iconfont icon-camera' />
              )}
            </div>
          )
        }
      },
      {
        name: '页面名称',
        key: 'page_name'
      },
      {
        name: '自定义名称',
        key: 'custom_name',
        render(_, { row }) {
          return (
            <el-input value={row.custom_name} onInput={(val) => vm.changeCustomName(val, row)} />
          )
        }
      }
    ]
  })

const auditStatusFormSchema = [
  {
    type: 'radio',
    require: true,
    key: 'audit_status',
    defaultValue: '',
    options: [
      {
        label: '审核通过',
        value: 'pass'
      },
      {
        label: '审核拒绝',
        value: 'reject'
      }
    ]
  }
]

export default {
  tableSchema,
  pickLinkLivePrdSchema,
  prdTableSchema,
  pushLiveCouponFormSchema,
  pushCouponTableSchema,
  linkUrlPathFormSchema,
  linkUrlPathTableSchema,
  selectCouponFormSchema,
  selectCouponTableSchema,
  auditStatusFormSchema
}
