import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'

const shopTableSchema = {
  search: [
    { key: 'shop_code', name: '', placeholder: '请输入店铺编号' },
    { key: 'name', name: '', placeholder: '请输入店铺名称' },
    {
      key: 'has_ship_template',
      name: '',
      type: 'select',
      placeholder: '是否已关联运费模板',
      options: [
        {
          label: '否',
          value: 2
        },
        {
          label: '是',
          value: 1
        }
      ]
    }
  ],
  columns: [
    {
      name: '店铺编号',
      key: 'shop_code'
    },
    {
      name: '所属区域',
      key: 'regionauth_name'
    },
    {
      name: '店铺名称',
      key: 'name'
    },
    {
      name: '铺位号',
      key: 'store_address'
    },
    {
      name: '是否关联运费模板',
      key: 'has_ship_template',
      render(_, { row }) {
        return row.has_ship_template == '1' ? '是' : '否'
      }
    }
  ]
}

export const createFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        key: 'select',
        defaultValue: '',
        component() {
          return (
            <div>
              <SpFinder
                ref='finder'
                fixed-row-action
                row-actions-width='80px'
                no-selection
                data={vm.innerTableData}
                setting={vm.innerTableSchema}
                row-actions-fixed-align='right'
                front-paging={true}
              >
                <div slot='tableTop'>
                  <SpFilterForm
                    ref='searchForm'
                    attrs={{ model: vm.formData }}
                    on-onSearch={() => vm.innerSearch()}
                    on-onReset={() => vm.innerReset()}
                    onInput={() => {}}
                  >
                    <SpFilterFormItem prop='shop_code' label='店铺编码'>
                      <el-input v-model={vm.innerFormData.shop_code} placeholder='请输入' />
                    </SpFilterFormItem>
                    <SpFilterFormItem prop='name' label='店铺名称'>
                      <el-input v-model={vm.innerFormData.name} placeholder='请输入' />
                    </SpFilterFormItem>
                  </SpFilterForm>
                  <div class='action-container'>
                    <el-button type='primary' plain onClick={() => vm.selectShop()}>
                      选择店铺
                    </el-button>
                    <el-upload
                      action=''
                      attrs={{
                        'on-change': (file, fileList) => {
                          vm.importHandle(file, fileList)
                        }
                      }}
                      auto-upload={false}
                      show-file-list={false}
                    >
                      <el-button type='primary' plain>
                        导入店铺
                      </el-button>
                    </el-upload>
                    <el-button type='primary' plain onClick={() => vm.downloadHandle()}>
                      下载模板
                    </el-button>
                  </div>
                </div>
              </SpFinder>
            </div>
          )
        }
      }
    ],
    vm
  )

const innerTableSchema = (vm) =>
  createSetting({
    actions: [
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
        name: '店铺编码',
        key: 'shop_code'
      },
      {
        name: '店铺名称',
        key: 'name'
      }
    ]
  })

export const createErrorFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        key: 'select',
        defaultValue: '',
        component() {
          return (
            <SpFinder
              ref='finder'
              fixed-row-action
              no-selection
              data={vm.errorTableData}
              setting={vm.errorTableSchema}
              row-actions-fixed-align='left'
            />
          )
        }
      }
    ],
    vm
  )

const errorTableSchema = {
  columns: [
    {
      name: '店铺ID',
      key: 'shop_code'
    },
    {
      name: '所属区域',
      key: 'regionauth_name'
    },
    {
      name: '店铺名称',
      key: 'name'
    },
    {
      name: '运费模板',
      key: 'ship_template_name'
    }
  ]
}

export default {
  shopTableSchema,
  innerTableSchema,
  errorTableSchema
}
