<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane :label="$t('ef95ad08.6ca8b9')" name="shopexerp">
      <el-form ref="form" label-width="180px">
        <el-form-item :label="$t('ef95ad08.cdd576')">
          <el-input v-model="form.node_id" style="width: 300px" />
        </el-form-item>
        <el-form-item :label="$t('ef95ad08.53c3dd')">
          <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <div class="clearfix">
          <h2 class="f_l">
            <span>{{ $t('ef95ad08.2b0201') }}</span>
          </h2>
        </div>
        <el-form-item :label="$t('ef95ad08.d63013')">
          <el-input v-model="form.openapi_flag" style="width: 300px" />
        </el-form-item>
        <el-form-item :label="$t('ef95ad08.60aa47')">
          <el-input v-model="form.openapi_token" style="width: 300px" />
        </el-form-item>
        <el-form-item :label="$t('ef95ad08.2ca5da')">
          <el-switch
            v-model="form.is_openapi_open"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button v-loading="loading" type="primary" @click="onSubmit">
{{
            $t('ef95ad08.be5fbb')
          }}
</el-button>
        </div>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { setShopexErpSetting, getShopexErpSetting } from '../../../api/third'
export default {
  data() {
    return {
      activeName: 'shopexerp',
      loading: false,
      form: {
        node_id: '',
        is_open: false,
        openapi_flag: '',
        openapi_token: '',
        is_openapi_open: false
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
      getShopexErpSetting().then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      this.loading = true

      setShopexErpSetting(this.form)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('ef95ad08.3b1083')
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
  .frm-tips {
    color: #ff0000;
  }
}
</style>
