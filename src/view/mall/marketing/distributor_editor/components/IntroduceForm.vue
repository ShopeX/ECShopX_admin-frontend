<style lang="scss">
.introduce-form {
  .el-form-item__content {
    width: auto !important;
  }
}
</style>

<template>
  <el-card class="el-card--normal" header="店铺介绍">
    <el-form class="introduce-form" label-width="120px">
      <el-form-item label="店铺介绍">
        <el-input
          v-model="content.baseForm.introduce"
          style="width: 100%"
          type="textarea"
          :rows="8"
          placeholder="请输入内容"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  inject: ['content'],
  data() {
    return {}
  }
}
</script>
