<style lang="scss"></style>
<template>
  <el-form inline label-width="100px">
    <el-form-item
      v-for="(item, index) in value"
      :key="`params-item__${index}`"
      :label="`${item.label}:`"
    >
      <el-select
        v-model="item.attr_id"
        clearable
        filterable
        allow-create
        default-first-option
        placeholder="请选择444"
        @change="handleChange(item)"
      >
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
  name: 'GoodsParams',
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
  methods: {
    async handleChange(item) {
      let paprms = []
      item.children.forEach((item1) => {
        paprms.push(item1.value)
      })
      if (paprms.indexOf(item.attr_id) == -1) {
        await this.$api.goods.getItemParams({
          attribute_id: item.id,
          attribute_value: item.attr_id
        })
        this.$emit('change', item)
      }
    }
  }
}
</script>
