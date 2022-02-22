<style lang="scss">
.sp-select-shop-panel {
  .filter-tools {
    display: flex;
    align-items: center;
    padding: 8px;
  }
  .el-cascader,
  .el-input {
    width: 180px;
    margin-right: 8px;
  }
  .el-button--text {
    font-size: 13px;
  }
}
</style>

<template>
  <div class="sp-select-shop-panel">
    <div class='filter-tools'>
      <el-cascader
        filterable
        clearable
        placeholder="选择地区筛选店铺"
        v-model="region"
        :options="district"
        :props="{ checkStrictly: true }"
        @blur="onBlurCascader"
        @visible-change="visibleChange"
      >
      </el-cascader>
      <el-input placeholder="请输入店铺名称搜索"></el-input>
      <el-button type="text">重置</el-button>
    </div>
    <el-table></el-table>
  </div>
</template>

<script>
import district from '@/common/district.json'
export default {
  name: 'SpSelectShopPanel',
  props: {
  },
  data() {
    return {
      district,
      region: []
    }
  },
  created() {},
  methods: {
    async onBlurCascader() {
      const { list } = await this.$api.marketing.getDistributorList()
      
    },
    visibleChange(visible) {
      this.$emit('visible-change', visible)
    }
  }
}
</script>

