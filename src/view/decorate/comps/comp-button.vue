<style lang="scss">
.comp-button {
  padding: 8px !important;
  .icon-times-circle1 {
    position: relative;
    top: 1px;
    left: 2px;
    cursor: default;
  }
}
</style>
<template>
  <el-button class="comp-button" :disabled="disabled" size="small" plain @click="handleClick">
    <slot />
    <i v-if="clearable" class="iconfont icon-times-circle1" @click.stop="handleRemove" />
  </el-button>
</template>

<script>
export default {
  name: 'CompButton',
  props: {
    clearable: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
    handleRemove() {
      this.$emit('remove')
    }
  }
}
</script>
