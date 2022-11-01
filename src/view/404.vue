<style lang="scss">
.page-404 {
  text-align: center;
  .context-404 {
    margin-top: 100px;
    font-size: 50px;
  }
}
</style>
<template>
  <div class="page-404">
    <div class="context-404">
      404
    </div>
    <el-button @click="goBack">
      返回
    </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
