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
<style lang="scss">
.picker-category {
  .cascader-header {
    display: flex;
    background-color: #f0f2f5;
    .hd {
      color: #222;
      width: 180px;
      padding: 6px 20px;
      border-left: 1px solid #e8e8e8;
    }
  }
  .el-cascader-panel {
    height: 526px;
    border-radius: 0;
  }

  .el-cascader-menu__wrap {
    height: 526px;
  }
}
</style>
<template>
  <div class="picker-category">
    <div class="cascader-header">
      <div class="hd">一级</div>
      <div class="hd">二级</div>
      <div class="hd">三级</div>
    </div>
    <el-cascader-panel
      v-model="localValue"
      :options="options"
      :props="props"
      @change="onChangeCascader"
    />
  </div>
</template>

<script>
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerSaleCategory',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择管理分类'
  },
  props: ['value'],
  data() {
    return {
      props: {
        label: 'category_name',
        value: 'category_id',
        children: 'children',
        checkStrictly: true
      },
      options: [],
      multiple: this.value?.multiple ?? true,
      localValue: []
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const { data } = this.value
      const res = await this.$api.goods.getCategory({
        is_main_category: true
      })
      this.options = res
      this.localValue = this.findPathById(res, data)
    },
    findPathById(list, v, path) {
      if (typeof path === 'undefined') {
        path = []
      }
      for (let i = 0; i < list.length; i++) {
        let tempPath = [...path]
        tempPath.push(list[i].category_id)
        if (list[i].category_id == v) {
          return tempPath
        }
        if (list[i].children) {
          const result = this.findPathById(list[i].children, v, tempPath)
          if (result) {
            return result
          }
        }
      }
    },
    getNodeInfo(list, e, index) {
      const node = list.find(({ category_id }) => category_id == e[index])
      if (index < e.length - 1) {
        return this.getNodeInfo(node.children, e, ++index)
      } else {
        const { category_id, category_name } = node
        return {
          id: category_id,
          title: category_name
        }
      }
    },
    onChangeCascader(e) {
      const nodeInfo = this.getNodeInfo(this.options, e, 0)
      this.updateVal([nodeInfo])
    }
  }
}
</script>
