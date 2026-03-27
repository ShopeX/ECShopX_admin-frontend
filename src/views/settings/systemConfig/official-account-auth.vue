<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <section class="section section-white">
      <div class="section-header with-border mb-5">{{ $t('3a2597f3.778dc1') }}</div>
      <div class="section-body">
        <el-alert
          :title="$t('3a2597f3.1cd1ac')"
          type="warning"
          :description="$t('3a2597f3.81a169')"
          show-icon
          :closable="false"
          class="mb-5"
        />
        <div class="mt-5">
          <span class="frm-tips block leading-relaxed mb-4 text-red-500">{{
            $t('3a2597f3.1bb0a6')
          }}</span>
          <el-form ref="form" class="mt-5">
            <el-form-item>
              <el-button v-loading="loading" type="primary" @click="onSubmit">
                {{ $t('3a2597f3.867285') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>
  </SpPage>
</template>
<script>
import { openUserPlatform } from '../../../api/wechat'
export default {
  data() {
    return {
      activeName: 'first',
      loading: false
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      openUserPlatform()
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('3a2597f3.bd9c53')
          })
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
}
</style>
