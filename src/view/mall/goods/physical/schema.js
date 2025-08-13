import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const createTbAddForm = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '',
        component() {
          return (
            <div>
              <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                <el-button
                  type='primary'
                  plain
                  onClick={() => {
                    vm.syncSpuToLocal()
                  }}
                >
                  淘宝增量同步
                </el-button>
                <el-button
                  type='primary'
                  plain
                  onClick={() => {
                    if (vm.selectedSpu.length > 0) {
                      vm.setCategory()
                    } else {
                      vm.$message.warning('请先选择商品')
                    }
                  }}
                >
                  设置管理分类
                </el-button>
              </div>
              <SpFinder
                ref='finderDialog'
                url='/spulists'
                reserveSelection={true}
                rowKey='outer_id'
                setting={{
                  search: [
                    { key: 'spu_code', name: 'SPU编号' },
                    { key: 'goods_name', name: '商品名称' },
                    {
                      key: 'is_set_cid',
                      name: '配置管理分类',
                      type: 'select',
                      options: [
                        {
                          label: '已配置',
                          value: 1
                        },
                        {
                          label: '未配置',
                          value: 0
                        }
                      ]
                    },
                    {
                      key: 'list_time',
                      name: '上架时间',
                      type: 'date-range',
                      defaultTime: [],
                      startPlaceholder: '开始日期',
                      endPlaceholder: '结束日期',
                      format: 'yyyy-MM-dd HH:mm:ss'
                    }
                  ],
                  columns: [
                    { name: 'SPU编码', key: 'outer_id', width: 100 },
                    { name: '商品名称', key: 'title' },
                    { name: '管理分类', key: 'category_name', width: 180 },
                    { name: '销售价', key: 'price', width: 100 },
                    { name: '库存', key: 'num', width: 120 },
                    { name: '淘宝上架时间', key: 'list_time', width: 180 }
                  ]
                }}
                attrs={{
                  hooks: {
                    beforeSearch: (params) => {
                      console.log(params)
                      if (params.list_time) {
                        params.list_time_start = params.list_time[0]
                        params.list_time_end = params.list_time[1]
                        delete params.list_time
                      }
                      return params
                    }
                  }
                }}
                onSelect={(row) => {
                  vm.selectedSpu = row
                }}
              ></SpFinder>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <el-button
                  type='primary'
                  plain
                  onClick={() => {
                    vm.onTbAddSubmit()
                  }}
                >
                  同步商品池
                </el-button>
              </div>
            </div>
          )
        }
      }
    ],
    vm
  )
