<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="基础配置"
      name="base"
    >
      <el-form
        ref="form"
        label-width="200px"
      >
        <el-form-item label="是否开启交易包装选项：">
          <el-switch
            v-model="form.config.is_open"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="包装名称：">
          <el-input
            v-model="form.config.packName"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="包装说明：">
          <el-input
            v-model="form.config.packDes"
            type="textarea"
            style="width: 300px"
          />
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button
            v-loading="loading"
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
        </div>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { getTeadeSetting, setTradeSetting } from '../../../../api/trade'
export default {
  data () {
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
  mounted () {
    this.getConfig()
  },
  methods: {
    handleClick () {
      this.getConfig()
    },
    getConfig () {
      getTeadeSetting().then((response) => {
        this.form.config = response.data.data
      })
    },
    onSubmit () {
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
