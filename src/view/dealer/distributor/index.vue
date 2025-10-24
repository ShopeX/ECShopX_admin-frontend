<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="cus-distributor-list">
    <el-card>
      <SpFinder
        ref="finder"
        :no-selection="true"
        :hooks="{
          beforeSearch: beforeSearch
        }"
        :setting="setting"
        url="/adapay/dealer/distributors"
        @reset="onFinderReset"
      >
        <template #address>
          <el-cascader
            v-model="checkedRegions"
            clearable
            style="width: 100%"
            :props="{ checkStrictly: true }"
            :options="regions"
            filterable
            @change="handleRegionChange"
          />
        </template>
      </SpFinder>
    </el-card>
  </div>
</template>

<script>
import district from '@/common/district.json'
import { createSetting } from '@shopex/finder'

// 取选中地区的值
function getCascaderObj(val, opt) {
  return (
    val &&
    val.map(function (value, index, array) {
      for (var itm of opt) {
        if (itm.value === value) {
          opt = itm.children
          return itm
        }
      }
      return null
    })
  )
}
export default {
  data() {
    return {
      province: '',
      city: '',
      area: '',
      regions: district,
      checkedRegions: [],
      statusList: [
        { label: '未入网', value: 1 },
        { label: '待审核', value: 2 },
        { label: '入网成功', value: 3 }
      ]
    }
  },
  computed: {
    setting() {
      return createSetting({
        columns: [
          { name: '店铺名称', key: 'name' },
          { name: '负责人', key: 'contact' },
          { name: '联系方式', key: 'mobile' },
          { name: '经营地址', key: 'address' },
          {
            name: '状态',
            key: '',
            formatter: (h, { audit_state }) =>
              (audit_state == '1' && '未入网') ||
              (audit_state == '2' && '待审核') ||
              (audit_state == '3' && '入网成功')
          }
        ],
        search: [
          { type: 'input', key: 'name', name: '店铺名称', placeholder: '请输入店铺名称' },
          { type: 'input', key: 'contact', name: '负责人', placeholder: '请输入负责人' },
          { type: 'input', key: 'mobile', name: '联系方式', placeholder: '请输入联系方式' },
          { key: 'address', name: '经营地址', slot: 'address' },
          {
            type: 'select',
            key: 'audit_state',
            options: this.statusList,
            name: '状态',
            placeholder: '请选择'
          }
        ]
      })
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        province: this.province,
        city: this.city,
        area: this.area
      }
      return params
    },
    handleRegionChange(value) {
      var vals = getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.province = vals[0].label
      } else if (vals.length == 2) {
        this.province = vals[0].label
        this.city = vals[1].label
      } else if (vals.length == 3) {
        this.province = vals[0].label
        this.city = vals[1].label
        this.area = vals[2].label
      } else {
        this.province = ''
        this.city = ''
        this.area = ''
      }
    },
    // 搜索重置
    onFinderReset() {
      this.checkedRegions = []
      this.province = ''
      this.area = ''
      this.city = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.cus-distributor-list {
  .el-row {
    margin-bottom: 30px !important;
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
