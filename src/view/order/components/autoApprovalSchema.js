import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'
import { debounce } from 'lodash-es'

export const autoApprovalSchema = (vm) => {
  const _params = {
    actions: [
      {
        name: '编辑',
        key: 'edit',
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
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: debounce(
            ([row]) => {
              vm.deleteConfigHandle(row)
            },
            2000,
            { leading: true }
          )
        }
      }
    ],
    columns: [
      {
        key: 'regionauth_name',
        name: '区域'
      },
      {
        key: 'refund_amount_limit',
        name: '申请退款金额上线'
      },
      {
        key: 'aftersale_reason',
        name: '售后原因'
      }
    ]
  }
  if (vm.activeName === 'distributor') {
    _params.columns = [
      _params.columns[0],
      {
        key: 'distributor_id',
        name: '店铺编号'
      },
      {
        key: 'distributor_name',
        name: '店铺'
      },
      _params.columns[1],
      _params.columns[2]
    ]
    _params.search = [
      { key: 'distributor_name', name: '店铺名称' },
      { key: 'regionauth_name', name: '区域', type: 'select', options: vm?.areas },
      { key: 'distributor_id', name: '店铺编号' }
    ]
  }
  return createSetting(_params)
}

export const autoApprovalFormListArea = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '',
        type: 'text',
        component({ key }, value) {
          return <span>满足指定条件，退货申请商家自动审批通过</span>
        }
      },
      {
        key: 'regionauth_id',
        label: '区域',
        type: 'select',
        options: vm.areas,
        required: true
      },
      {
        label: '退款金额上限',
        key: 'refund_amount_limit',
        type: 'number',
        required: true
      },
      {
        label: '售后原因',
        key: 'aftersale_reason',
        component({ key }, value) {
          return (
            <el-select
              v-model={value[key]}
              placeholder='请选择'
              multiple
              default-first-option
            >
              {vm?.reason_list?.map((el) => (
                <el-option label={el.title} value={el.value} />
              ))}
            </el-select>
          )
        }
      }
    ],
    vm
  )

export const autoApprovalFormListShop = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '',
        type: 'text',
        component({ key }, value) {
          return <span>满足指定条件，退货申请商家自动审批通过</span>
        }
      },
      {
        key: 'regionauth_id',
        label: '区域',
        type: 'select',
        required: true,
        component({ key }, value) {
          return (
            <div class='refund-address'>
              <el-select v-model={value['regionauth_id']} placeholder='请选择' onChange={vm.handleRegionChange}>
                {(vm.areas || [])?.map((el, index) => {
                  return <el-option key={index} label={el.label} value={el.value} />
                })}
              </el-select>
            </div>
          )
        }
      },
      {
        label: '店铺',
        key: 'distributor_id',
        placeholder: '选择店铺',
        defaultValue: '',
        required: true,
        component({ key }, value) {
          return (
            <div class='refund-address'>
              <el-button
                onclick={() => {
                  this.handleClick()
                }}
              >
                选择店铺
              </el-button>
              <div style={{ width: '200px', height: '50px', display: 'flex' }}>
                <el-image
                  src={this.distributor?.logo || require('@/assets/img/shop_logo_default.png')}
                  style={{
                    width: '60px',
                    height: '60px'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '25px' }}>
                  <div>{this.distributor?.name}</div>
                  <div>ID:{this.distributor?.distributor_id}</div>
                </div>
              </div>
            </div>
          )
        },
        isShow() {
          return vm.activeName === 'distributor'
        }
      },
      {
        label: '退款金额上限',
        key: 'refund_amount_limit',
        type: 'number',
        required: true
      },
      {
        label: '售后原因',
        key: 'aftersale_reason',
        component({ key }, value) {
          return (
            <el-select
              v-model={value[key]}
              placeholder='请选择'
              multiple
              default-first-option
            >
              {vm?.reason_list?.map((el) => (
                <el-option label={el.title} value={el.value} />
              ))}
            </el-select>
          )
        }
      }
    ],
    vm
  )