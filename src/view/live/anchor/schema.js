import { createSetting } from '@shopex/finder'
import { bindThisForFormSchema } from '@/utils/schemaHelper.js'

const tableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas || [] },
      { key: 'distributor_id', name: '店铺', slot: 'select_shop' },
      { key: 'anchor_account', name: '账号' }
    ],
    actions: [
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.editConfigHandle(row)
          }
        }
      },
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.deleteHandle(row)
          }
        }
      }
    ],
    columns: [
      {
        name: '账号',
        key: 'anchor_account'
      },
      {
        name: '区域',
        key: 'regionauth_name'
      },
      {
        name: '店铺',
        key: 'distributor_name'
      }
    ]
  })
const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '主播账号',
        key: 'anchor_account',
        placeholder: '请输入',
        defaultValue: '',
        type: 'input',
        required: true,
        disabled: false,
        message: '活动名称不能为空'
      },
      {
        label: '区域',
        key: 'regionauth_id',
        placeholder: '请选择',
        defaultValue: '',
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
        // required: true,
        component({ key }, value) {
          return (
            <div class='refund-address'>
              <el-button
                onclick={() => {
                  vm.handleClick()
                }}
              >
                选择店铺
              </el-button>
              {vm?.distributor ? <div style={{ width: '200px', height: '50px', display: 'flex' }}>
                <el-image
                  src={vm.distributor?.logo || require('@/assets/img/shop_logo_default.png')}
                  style={{
                    width: '60px',
                    height: '60px'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '25px' }}>
                  <div>{vm.distributor?.name}</div>
                  <div>ID:{vm.distributor?.shop_code}</div>
                </div>
              </div> : null}
            </div>
          )
        }
      }
    ],
    vm
  )

export default {
  tableSchema,
  formSchema
}
