<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane :label="$t('c4d2ae9e.084d81')" name="cartremind">
      <el-form ref="form" label-width="180px">
        <el-form-item :label="$t('c4d2ae9e.d16a96')">
          <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item :label="$t('c4d2ae9e.59c952')">
          <el-input v-model="form.remind_content" style="width: 550px" />
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button v-loading="loading" type="primary" @click="onSubmit">
            {{ $t('c4d2ae9e.be5fbb') }}
          </el-button>
        </div>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { getCartremindSetting, setCartremindSetting } from '../../../api/wxa'
export default {
  data() {
    return {
      activeName: 'cartremind',
      loading: false,
      form: {
        is_open: false,
        remind_content: ''
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    handleClick() {
      this.getConfig()
    },
    getConfig() {
      getCartremindSetting().then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      this.loading = true

      setCartremindSetting(this.form)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('c4d2ae9e.3b1083')
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
