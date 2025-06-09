<template>
  <div class="sp-page-header">
    <div class="sp-page-header__content">
      <el-page-header :content="title" @back="goBack" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpPageHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
      this.$emit('onBack')
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-page-header {
  &__content {
    padding-top: 10px;
    padding-bottom: 32px;
  }
}
</style>
