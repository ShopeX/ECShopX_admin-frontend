<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog class="model_zyk" :visible.sync="modelVisible" :before-close="handleClose" width="30%">
    <div slot="title">
      <i class="el-icon-warning" style="color: #faad14; font-size: 20px" />
    </div>
    <div v-for="(item, index) in modelInfo" :key="index" style="font-size: 14px; color: #999">
      <p>
        {{ $t('41fe0fdd.6cc7df')
        }}{{
          item.package_title +
          $t('41fe0fdd.15e61a') +
          item.title +
          $t('41fe0fdd.a9668d') +
          item.grade_name +
          $t('41fe0fdd.a3b5b0')
        }}
      </p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['modelVisible', 'modelInfo'],
  methods: {
    handleClose() {
      this.$emit('closeModel')
      this.$emit('closeCouponHandle')
    }
  }
}
</script>

<style lang="scss">
.model_zyk {
  .el-dialog__header,
  .el-dialog__body {
    background: #fffbe6;
  }
  .el-dialog__header {
    border-radius: 10px;
  }
  .el-dialog__body {
    padding: 0px 20px 16px 30px;
  }
}
</style>
