<template>
  <i class="iconfont" :class="`${name}`" :style="{ fontSize: `${size}px` }" />
</template>

<script>
export default {
  name: 'SpIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '16'
    }
  }
}
</script>

<style lang="scss" scoped></style>
