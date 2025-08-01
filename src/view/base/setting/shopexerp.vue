<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="商派ERP配置" name="shopexerp">
      <el-form ref="form" label-width="180px">
        <el-form-item label="节点号">
          <el-input v-model="form.node_id" style="width: 300px" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <div class="clearfix">
          <h2 class="f_l">
            <span>开放数据接口配置：</span>
          </h2>
        </div>
        <el-form-item label="访问来源标识">
          <el-input v-model="form.openapi_flag" style="width: 300px" />
        </el-form-item>
        <el-form-item label="接口调用私钥">
          <el-input v-model="form.openapi_token" style="width: 300px" />
        </el-form-item>
        <el-form-item label="是否启用开放数据接口">
          <el-switch
            v-model="form.is_openapi_open"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
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
      getShopexErpSetting().then(response => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      this.loading = true

      setShopexErpSetting(this.form)
        .then(response => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.loading = false
        })
        .catch(error => {
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
