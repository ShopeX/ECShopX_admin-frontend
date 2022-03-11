<template>
  <div class="alert">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.alert {
  padding: 9px 10px;
  background: #fff2f4;
  color: #f562a9;
  font-size: 12px;
  line-height: 1;
  display: inline-block;
}
</style>
