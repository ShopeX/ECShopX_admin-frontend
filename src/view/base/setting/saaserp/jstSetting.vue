<template>
  <SpPage>
  <el-form
    ref="form"
    label-width="100px"
  >
    <!-- <el-form-item label="AppKey">
      <el-input
        v-model="form.app_key"
        style="width: 300px"
      />
      <br>
    </el-form-item>
    <el-form-item label="AppSecret">
      <el-input
        v-model="form.app_secret"
        style="width: 300px"
      />
      <br>
    </el-form-item> -->
    <el-form-item label="店铺消息推送">
      {{form.shop_callback_url}}
      <el-tag
        v-clipboard:copy="form.shop_callback_url"
        v-clipboard:success="onCopy"
      >
        点我复制
      </el-tag>
    </el-form-item>
    <el-form-item label="店铺编号">
      <el-input
        v-model="form.shop_id"
        style="width: 300px"
      />
      <br>
    </el-form-item>
    <el-form-item v-if="form.oauth_url" label="accessToken">
      <el-button v-if="form.access_token" type="flex" @click="handleBind">
        更新授权
      </el-button>
      <el-button v-else type="flex" @click="handleBind">
        去授权
      </el-button>
    </el-form-item>
    <el-form-item label="是否启用">
      <el-switch
        v-model="form.is_open"
        active-color="#13ce66"
        inactive-color="#ff4949"
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
</SpPage>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      form: {
        app_key: '',
        app_secret: '',
        access_token: '',
        shop_id: '',
        is_open: true
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
      this.$api.third.getJstErpSetting().then((response) => {
        this.form = response
      })
    },
    onSubmit () {
      this.loading = true
      this.$api.third.setJstErpSetting(this.form)
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
    },
    handleBind() {
      if (this.form.oauth_url) {
        window.open(this.form.oauth_url, '_blank')
      }
    },
    onCopy () {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
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
