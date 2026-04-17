<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div class="flex items-center flex-wrap leading-[22px]">
    <div v-if="!readonly && !selectOnly" class="mr-2.5 mb-2.5">
      <el-input
        v-if="showInput"
        v-model="value"
        :placeholder="$t('93ba5178.a11cc7')"
        size="mini"
        maxlength="10"
        show-word-limit
        @change="changeInput"
      />
      <el-button v-else size="mini" type="info" plain @click="addLabel">
        {{ $t('93ba5178.ed7823') }}
      </el-button>
    </div>
    <div
      v-for="(item, index) in list"
      :key="index"
      class="mr-2.5 mb-2.5 cursor-pointer select-none"
      @click="selectLabel(item, index)"
    >
      <el-tag
        :effect="item.selected ? 'light' : 'plain'"
        :size="tagSize"
        :color="noBackground ? '' : item.tag_color"
        :style="{ color: noBackground ? '' : item.font_color }"
      >
        {{ item.tag_name }}
      </el-tag>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompTagList',
  props: {
    list: {
      type: Array
    },
    selectionBabel: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    tagSize: {
      type: String,
      default: 'medium'
    },
    noBackground: {
      type: Boolean,
      default: false
    },
    /** 仅选择：不显示「+ 添加」，只能从已有标签中勾选 */
    selectOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showInput: false,
      value: ''
    }
  },
  methods: {
    addLabel() {
      this.value = ''
      this.showInput = true
    },
    async changeInput(value) {
      this.showInput = false
      this.$emit('add-tag', value)
    },
    selectLabel(item, index) {
      if (this.selectionBabel) {
        const newItem = {
          ...item,
          selected: !item.selected
        }
        this.$set(this.list, index, newItem)
        // 触发选择事件
        this.$emit('tag-select', newItem, index)
      }
    }
  }
}
</script>
