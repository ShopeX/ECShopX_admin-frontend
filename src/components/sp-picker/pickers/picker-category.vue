<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
      <div class="hd">{{ headerCol1 }}</div>
      <div class="hd">{{ headerCol2 }}</div>
      <div class="hd">{{ headerCol3 }}</div>
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
import { i18n } from '@/i18n'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerSaleCategory',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: ''
  },
  props: ['value'],
  computed: {
    headerCol1() {
      return i18n.t('90951772.117bf1')
    },
    headerCol2() {
      return i18n.t('90951772.301d4d')
    },
    headerCol3() {
      return i18n.t('90951772.3ba8ac')
    }
  },
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
    this.$options.config.title = i18n.t('90951772.c50637')
    this.fetch()
  },
  methods: {
    async fetch() {
      const { data } = this.value || {}
      const res = await this.$api.goods.getCategory({
        is_main_category: true
      })
      this.options = Array.isArray(res) ? res : res?.data || res?.list || []
      this.localValue = this.findPathById(this.options, data) || []
    },
    findPathById(list, v, path) {
      if (!list || !Array.isArray(list) || v == null || v === '') return []
      if (typeof path === 'undefined') path = []
      for (let i = 0; i < list.length; i++) {
        const nodeId = list[i].category_id ?? list[i].id
        const tempPath = [...path, nodeId]
        if (nodeId == v) return tempPath
        const children = list[i].children
        if (children && Array.isArray(children)) {
          const result = this.findPathById(children, v, tempPath)
          if (result && result.length) return result
        }
      }
      return []
    },
    getNodeInfo(list, e, index) {
      const node = list.find((n) => (n.category_id ?? n.id) == e[index])
      if (!node) return null
      if (index < e.length - 1) {
        return this.getNodeInfo(node.children || [], e, ++index)
      }
      const id = node.category_id ?? node.id
      return {
        id,
        title: node.category_name ?? node.title,
        image_url: node.image_url || ''
      }
    },
    onChangeCascader(e) {
      const nodeInfo = this.getNodeInfo(this.options, e, 0)
      this.updateVal([nodeInfo])
    }
  }
}
</script>
