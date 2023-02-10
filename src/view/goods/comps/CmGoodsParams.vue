<style lang="scss"></style>
<template>
  <el-form inline label-width="100px">
    <el-form-item
      v-for="(item, index) in value"
      :key="`params-item__${index}`"
      :label="`${item.label}:`"
    >
      <el-select v-model="item.attr_id" clearable placeholder="请选择">
        <el-option
          v-for="child in item.children"
          :key="child.value"
          :label="child.label"
          :value="child.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CmGoodsParams',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
