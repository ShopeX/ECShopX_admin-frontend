<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.introduce-form {
  .el-form-item__content {
    width: auto !important;
  }
}
</style>

<template>
  <el-card class="el-card--normal" :header="$t('67c4cf43.fb0e24')">
    <el-form class="introduce-form" label-width="120px">
      <el-form-item :label="$t('67c4cf43.fb0e24')">
        <el-input
          v-model="content.baseForm.introduce"
          style="width: 100%"
          type="textarea"
          :rows="8"
          :placeholder="$t('67c4cf43.a11cc7')"
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
