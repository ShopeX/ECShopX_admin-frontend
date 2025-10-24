<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div v-loading="fullscreenLoading" element-loading-text="正在绑定授权信息" />
</template>
<script>
import { getWechatBind } from '../api/wechat'
export default {
  data() {
    return {
      fullscreenLoading: false
    }
  },
  mounted() {
    const homePath = '/'
    // 如果不是授权回调，则获取授权链接地址
    if (this.$route.query.auth_code) {
      this.fullscreenLoading = true
      var query = {
        auth_code: this.$route.query.auth_code,
        auth_type: this.$route.params.auth_type
      }
      const { template_name } = this.$route.query
      getWechatBind(query)
        .then(response => {
          console.log('--response--', response)
          this.$store.dispatch('setAuthorizer', true)
          this.fullscreenLoading = false
          this.$message({
            message: '绑定或更新授权信息成功',
            type: 'success',
            duration: 5 * 1000
          })
          if (query.auth_type == 'woa') {
            this.$router.push({ path: homePath })
          } else {
            const { authorizer_appid, nick_name } = response.data.data
            this.uploadWeapp(authorizer_appid, nick_name, template_name)
            // this.$router.push({path: '/wxapp/manage/editauthorize', query: { newBind: true, wxapp_id: response.data.data.authorizer_appid, nick_name:response.data.data.nick_name}})
          }
        })
        .catch(error => {
          console.log(error)
          this.fullscreenLoading = false
          this.$message({
            type: 'error',
            message: '绑定失败'
          })
          if (query.auth_type == 'woa') {
            this.$router.push({ path: homePath, query: { isBindFail: true } })
          } else {
            this.$router.push({ path: '/site/wechat/wxaindex' })
          }
        })
    } else {
      this.$router.push({ path: homePath, query: { isBindFail: true } })
    }
  },
  methods: {
    async uploadWeapp(wxapp_id, nick_name, template_name) {
      const params = {
        wxaAppId: wxapp_id,
        wxa_name: nick_name,
        templateName: template_name
      }
      await this.$api.wxa.submitWxa(params)
      this.$message.success('上传代码成功')
      this.$router.push({ path: '/site/wechat/wxaindex' })
    }
  }
}
</script>
