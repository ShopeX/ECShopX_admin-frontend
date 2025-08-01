<template>
  <el-cascader class="sp-region-select" :value="value" :options="options" @change="handleChange" />
</template>

<script>
import district from '@/common/district.json'
import { getRegionNameById, getRegionIdByName } from '@/utils'
export default {
  name: 'SpRegionSelect',
  props: {
    level: {
      type: Number, // 1: 省, 2: 市, 3: 区
      default: 3
    },

    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {
    options() {
      return this.filterDistrictByLevel(district, this.level)
    }
  },
  methods: {
    /**
     * 按层级递归筛选行政区划
     * @param {Array} data district.json解析出来的数组
     * @param {number} level 1=省，2=省+市，3=省+市+区
     * @returns {Array}
     */
    filterDistrictByLevel(data, level) {
      // 递归处理每一层
      function deepFilter(list, currentLevel) {
        return list.map(item => {
          const node = {
            value: item.value,
            label: item.label
          }
          // 只要还没到目标层级，并且有children，就递归
          if (item.children && currentLevel < level) {
            node.children = deepFilter(item.children, currentLevel + 1)
          }
          return node
        })
      }
      return deepFilter(data, 1)
    },
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change', {
        region_id: value,
        region_name: getRegionNameById(value, district)
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
