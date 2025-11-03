// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

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
                    { key: 'title', name: '商品名称' },
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
                      slot: 'list_time'
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
                onReset = {() => {
                  vm?.$refs?.finderDialog?.refresh(true)
                }}
                on-select-all={(row) => {
                  vm.selectedSpu = row
                }}
              >
                <el-date-picker
                  v-model={vm.list_time}
                  slot="list_time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time={['00:00:00', '23:59:59']}
                />
              </SpFinder>
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
