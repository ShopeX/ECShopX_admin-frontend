<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-form ref="form" :model="form" label-position="left" label-width="120px">
      <div class="section-body">
        <template>
          <el-form-item :label="$t('fc0ea1af.9adc99')">
            <el-input v-model="form.ad_title" required placeholder="" style="width: 100px" />
          </el-form-item>
        </template>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save">{{ $t('fc0ea1af.56df61') }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getCartMarketingAd, setCartMarketingAd } from '@/api/trade'
export default {
  data() {
    return {
      form: {
        ad_title: ''
      }
    }
  },
  mounted() {
    getCartMarketingAd().then((res) => {
      let setting = res.data.data
      if (setting.ad_title) {
        this.form.ad_title = setting.ad_title
      }
    })
  },
  methods: {
    save() {
      if (!this.form.ad_title) {
        this.$message({ message: this.$t('fc0ea1af.32c5ed'), type: 'error' })
        return
      }
      setCartMarketingAd(this.form).then((res) => {
        this.$message({ message: this.$t('fc0ea1af.3b1083'), type: 'success' })
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
