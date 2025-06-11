<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
    <el-tab-pane
      v-for="(item, index) in tabList"
      :key="index"
      :label="item.label"
      :name="item.name"
    />
  </el-tabs>
</template>

<script>
export default {
  name: 'SpTabbar',
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: this.value
    }
  },
  methods: {
    handleTabClick() {
      this.$emit('input', this.activeName)
      this.$emit('change', this.activeName)
    }
  }
}
</script>

<style lang="scss" scoped></style>
