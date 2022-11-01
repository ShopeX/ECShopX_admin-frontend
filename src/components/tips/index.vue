<template>
  <div
    class="tips"
    :style="{ 'background': bgColor }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    bgColor: {
      default: '#eef8fd'
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  width: 100%;
  padding: 13px 10px;
}
</style>
