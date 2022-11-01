<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label=""
      name="weburl"
    >
      <el-form
        ref="form"
        label-width="100px"
      >
        <el-form-item label="在线私教">
          <el-input v-model="form.mycoach" />
        </el-form-item>
        <el-form-item label="售后申请">
          <el-input v-model="form.aftersales" />
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
import { getWebUrlSetting, saveWebUrlSetting } from '@/api/company'
export default {
  data () {
    return {
      activeName: 'weburl',
      loading: false,
      form: {
        mycoach: '',
        aftersales: ''
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
      getWebUrlSetting().then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit () {
      this.loading = true
      saveWebUrlSetting(this.form)
        .then((response) => {
          this.$message({
            type: 'success',
            message: '配置成功'
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
