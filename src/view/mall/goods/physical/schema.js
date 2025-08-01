import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const createTbAddForm = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '',
        component() {
          return (
            <div>
              <div style={{ marginBottom: '10px' }}>
                <el-button
                  type='primary'
                  plain
                  onClick={() => {
                    vm.syncSpuToLocal()
                  }}
                >
                  淘宝增量同步
                </el-button>
              </div>
              <SpFinder
                ref='finderDialog'
                url='/spulists'
                setting={{
                  search: [
                    { key: 'spu_code', name: '请输入SPU编号' },
                    { key: 'goods_name', name: '商品名称' },
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
                    { name: '销售价', key: 'price' },
                    { name: '库存', key: 'num', width: 60 },
                    { name: '淘宝上架时间', key: 'list_time' }
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
                  console.log(row)
                  vm.selectedSpu = row
                }}
              ></SpFinder>
            </div>
          )
        }
      }
    ],
    vm
  )
