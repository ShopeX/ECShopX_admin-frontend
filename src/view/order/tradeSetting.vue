<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('cce7f45b.b6453a')">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-form ref="form" label-width="200px">
      <el-form-item :label="$t('cce7f45b.eaca25')">
        <el-switch v-model="form.config.is_open" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
      <el-form-item :label="$t('cce7f45b.fb9895')">
        <el-input v-model="form.config.packName" style="width: 300px" />
      </el-form-item>
      <el-form-item :label="$t('cce7f45b.66d5ec')">
        <el-input v-model="form.config.packDes" type="textarea" style="width: 300px" />
      </el-form-item>
    </el-form>
    <div slot="page-footer" class="section-footer with-border text-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit">
{{
        $t('cce7f45b.be5fbb')
      }}
</el-button>
    </div>
    <!-- <SpPlatformTip h5 app alipay />
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基础配置" name="base">
        <el-form ref="form" label-width="200px">
          <el-form-item :label="$t('cce7f45b.eaca25')">
            <el-switch
              v-model="form.config.is_open"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item :label="$t('cce7f45b.fb9895')">
            <el-input v-model="form.config.packName" style="width: 300px" />
          </el-form-item>
          <el-form-item :label="$t('cce7f45b.66d5ec')">
            <el-input v-model="form.config.packDes" type="textarea" style="width: 300px" />
          </el-form-item>
          <div class="section-footer with-border content-center">
            <el-button v-loading="loading" type="primary" @click="onSubmit">{{ $t('cce7f45b.be5fbb') }}</el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs> -->
  </SpPage>
</template>
<script>
import { getTeadeSetting, setTradeSetting } from '@/api/trade'
export default {
  data() {
    return {
      activeName: 'base',
      loading: false,
      form: {
        config: {
          packName: '',
          packDes: '',
          is_open: false
        }
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
      getTeadeSetting().then((response) => {
        this.form.config = response.data.data
      })
    },
    onSubmit() {
      this.loading = true
      setTradeSetting(this.form)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('cce7f45b.3b1083')
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
