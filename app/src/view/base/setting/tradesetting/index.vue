<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="基础配置" name="base">
      <el-form ref="form" label-width="200px">
        <el-form-item label="是否开启交易包装选项：">
          <el-switch
            v-model="form.config.is_open"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="包装名称：">
          <el-input v-model="form.config.packName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="包装说明：">
          <el-input type="textarea" v-model="form.config.packDes" style="width:300px"></el-input>
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button type="primary" v-loading="loading" @click="onSubmit">保存</el-button>
        </div>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { getTeadeSetting, setTradeSetting } from '../../../../api/trade'
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
            message: '保存成功'
          })
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.getConfig()
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
