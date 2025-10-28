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
<style scoped lang="scss">
.no-shop {
  display: inline-block;
  height: 37px;
  line-height: 37px;
  box-shadow: 0 0 0 1px #dcdfe6;
  border-radius: 3px;
  cursor: no-drop;
}
</style>
<template>
  <div style="display: inline-block; margin-right: 10px">
    <el-cascader
      v-model="selected_params.regions_value"
      class="input-m"
      placeholder="根据地区筛选"
      :options="regions"
      filterable
      :props="{ checkStrictly: true }"
      @change="RegionChangeSearch"
    />
    <el-select
      v-if="exist_shop"
      v-model="selected_params.shop_id"
      v-scroll="handleScroll"
      class="input-m"
      :placeholder="desc"
      filterable
      remote
      :remote-method="remoteMethod"
      clearable
    >
      <el-option
        v-for="item in list"
        v-if="wxshops"
        :key="item.wxShopId"
        :label="item.storeName"
        :value="item.wxShopId"
      />
      <el-option
        v-for="item in list"
        v-if="distributors"
        :key="item.distributor_id"
        :label="item.name"
        :value="item.distributor_id"
      />
    </el-select>
    <span v-else class="input-m content-center muted no-shop">暂无符合要求的店铺</span>
    <el-button @click="init"> 重置 </el-button>
  </div>
</template>
<script>
import district from '@/common/district.json'
import { shoplistMixin } from '@/mixins/fetchShoplist'
export default {
  mixins: [shoplistMixin],
  props: {
    shopIdDefault: {
      type: String,
      default: ''
    },
    performInit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      regions: district,
      params: {
        page: 1,
        pageSize: 20,
        name: '',
        mobile: '',
        is_valid: 'true',
        province: '',
        city: '',
        area: ''
      },
      total: '',
      selected_params: {
        shop_id: this.shopIdDefault,
        regions_value: []
      },
      exist_shop: true
    }
  },

  watch: {
    'selected_params.shop_id': {
      handler(newVal, oldVal) {
        this.$emit('update', this.selected_params)
      },
      deep: true
    },
    shopIdDefault: {
      handler(newVal, oldVal) {
        this.selected_params.shop_id = newVal
      }
    },
    performInit: {
      handler(newVal, oldVal) {
        newVal && this.init()
      }
    }
  },
  mounted() {
    this.getList(true)
  },

  methods: {
    handleScroll(param) {
      let { pageSize, page } = this.params
      if (param && Math.ceil(this.total / pageSize) > page) {
        this.params.page++
        this.getList()
      }
    },

    RegionChangeSearch(value) {
      var vals = this.getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.params.province = vals[0].label
        this.params.city = ''
        this.params.area = ''
      } else if (vals.length == 2) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = ''
      } else if (vals.length == 3) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = vals[2].label
      }
      this.params.page = 1
      this.selected_params.shop_id = ''
      this.getList(true)
    },

    getCascaderObj(val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },

    init() {
      this.params = {
        page: 1,
        pageSize: 20,
        name: '',
        mobile: '',
        is_valid: 'true',
        province: '',
        city: '',
        area: ''
      }
      this.regions = district
      this.selected_params.regions_value = []
      this.selected_params.shop_id = ''
      this.exist_shop = true
      this.getList(true)
      this.$emit('init')
    },

    remoteMethod(query) {
      this.params.name = query
      this.getList(true)
    }
  }
}
</script>
