<template>
  <section class="section section-white">
    <div class="section-header with-border">
      微信开放平台管理
    </div>
    <div class="section-body">
      <el-alert
        title="开通微信开放平台管理并且绑定小程序/公众号"
        type="warning"
        description="为用户的公众号开通开放平台账号并且绑定小程序/公众号，用于打通用户的小程序和公众号用户和卡券等数据。如果未授权，
    请手动开通微信开放平台并且绑定。"
        show-icon
        :closable="false"
      />
      <div>
        <span
          class="frm-tips"
        >如果手动绑定绑定后一定要执行【微信-> 粉丝管理->
          同步微信粉丝】操作，不然会导致小程序用户和微信公众号用户不能打通</span>
        <el-form ref="form">
          <el-form-item>
            <el-button
              v-loading="loading"
              type="primary"
              @click="onSubmit"
            >
              开通微信开放平台绑定小程序
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>
<script>
import { openUserPlatform } from '../../../api/wechat'
export default {
  data () {
    return {
      activeName: 'first',
      loading: false
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      openUserPlatform()
        .then((response) => {
          this.$message({
            type: 'success',
            message: '开通并绑定成功'
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
