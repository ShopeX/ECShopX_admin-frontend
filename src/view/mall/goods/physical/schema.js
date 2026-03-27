/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
                  {vm.$t('149970ec.25faf6')}
                </el-button>
                <el-button
                  type='primary'
                  plain
                  onClick={() => {
                    if (vm.selectedSpu.length > 0) {
                      vm.setCategory()
                    } else {
                      vm.$message.warning(vm.$t('149970ec.9f5a62'))
                    }
                  }}
                >
                  {vm.$t('149970ec.2ce315')}
                </el-button>
              </div>
              <SpFinder
                ref='finderDialog'
                url='/spulists'
                reserveSelection={true}
                rowKey='outer_id'
                setting={{
                  search: [
                    { key: 'spu_code', name: vm.$t('149970ec.44bb10') },
                    { key: 'title', name: vm.$t('149970ec.1fd1d5') },
                    {
                      key: 'is_set_cid',
                      name: vm.$t('149970ec.685b30'),
                      type: 'select',
                      options: [
                        {
                          label: vm.$t('149970ec.da208e'),
                          value: 1
                        },
                        {
                          label: vm.$t('149970ec.71dc8f'),
                          value: 0
                        }
                      ]
                    },
                    {
                      key: 'list_time',
                      name: vm.$t('149970ec.e2c409'),
                      slot: 'list_time'
                    }
                  ],
                  columns: [
                    { name: vm.$t('149970ec.18ea2a'), key: 'outer_id', width: 100 },
                    { name: vm.$t('149970ec.1fd1d5'), key: 'title' },
                    { name: vm.$t('149970ec.b3ed9f'), key: 'category_name', width: 180 },
                    { name: vm.$t('149970ec.e29575'), key: 'price', width: 100 },
                    { name: vm.$t('149970ec.0eac88'), key: 'num', width: 120 },
                    { name: vm.$t('149970ec.8299f0'), key: 'list_time', width: 180 }
                  ]
                }}
                attrs={{
                  hooks: {
                    beforeSearch: (params) => {
                      console.log(params)
                      const list_time_start = vm.list_time && vm.list_time[0]
                      const list_time_end = vm.list_time && vm.list_time[1]
                      return {
                        ...params,
                        list_time_start,
                        list_time_end
                      }
                    }
                  }
                }}
                onSelect={(row) => {
                  vm.selectedSpu = row
                }}
                onReset={() => {
                  vm?.$refs?.finderDialog?.refresh(true)
                }}
                on-select-all={(row) => {
                  vm.selectedSpu = row
                }}
              >
                <el-date-picker
                  v-model={vm.list_time}
                  slot='list_time'
                  type='datetimerange'
                  range-separator={vm.$t('149970ec.981cbe')}
                  start-placeholder={vm.$t('149970ec.592c59')}
                  end-placeholder={vm.$t('149970ec.f78277')}
                  value-format='yyyy-MM-dd HH:mm:ss'
                  default-time={['00:00:00', '23:59:59']}
                />
              </SpFinder>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <el-button
                  type='primary'
                  plain
                  onClick={() => {
                    vm.onTbAddSubmit()
                  }}
                >
                  {vm.$t('149970ec.7d77bf')}
                </el-button>
              </div>
            </div>
          )
        }
      }
    ],
    vm
  )
