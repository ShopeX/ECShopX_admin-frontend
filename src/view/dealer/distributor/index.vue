<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
import { createSetting } from '@shopex-ui/finder'

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
      checkedRegions: []
    }
  },
  computed: {
    statusList() {
      return [
        { label: this.$t('6ee7ef2f.14f778'), value: 1 },
        { label: this.$t('6ee7ef2f.5cb424'), value: 2 },
        { label: this.$t('6ee7ef2f.4ad6e4'), value: 3 }
      ]
    },
    setting() {
      return createSetting({
        columns: [
          { name: this.$t('6ee7ef2f.0d4934'), key: 'name' },
          { name: this.$t('6ee7ef2f.b29725'), key: 'contact' },
          { name: this.$t('6ee7ef2f.b58943'), key: 'mobile' },
          { name: this.$t('6ee7ef2f.0ed872'), key: 'address' },
          {
            name: this.$t('6ee7ef2f.3fea7c'),
            key: '',
            formatter: (h, { audit_state }) =>
              (audit_state == '1' && this.$t('6ee7ef2f.14f778')) ||
              (audit_state == '2' && this.$t('6ee7ef2f.5cb424')) ||
              (audit_state == '3' && this.$t('6ee7ef2f.4ad6e4'))
          }
        ],
        search: [
          {
            type: 'input',
            key: 'name',
            name: this.$t('6ee7ef2f.0d4934'),
            placeholder: this.$t('6ee7ef2f.867738')
          },
          {
            type: 'input',
            key: 'contact',
            name: this.$t('6ee7ef2f.b29725'),
            placeholder: this.$t('6ee7ef2f.3f15b8')
          },
          {
            type: 'input',
            key: 'mobile',
            name: this.$t('6ee7ef2f.b58943'),
            placeholder: this.$t('6ee7ef2f.8f7e96')
          },
          { key: 'address', name: this.$t('6ee7ef2f.0ed872'), slot: 'address' },
          {
            type: 'select',
            key: 'audit_state',
            options: this.statusList,
            name: this.$t('6ee7ef2f.3fea7c'),
            placeholder: this.$t('6ee7ef2f.708c9d')
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
