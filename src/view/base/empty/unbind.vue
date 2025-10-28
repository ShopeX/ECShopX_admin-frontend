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
  <div class="unbind-box section-white content-padded">
    <div class="content-center">
      <p>您尚未绑定认证服务号，无法使用该功能。</p>
      <el-button type="primary" @click="toBind"> 去绑定 </el-button>
    </div>
  </div>
</template>
<script>
import { getWechatPreAuthUrl } from '../../../api/wechat'
export default {
  data() {
    return {
      url: ''
    }
  },
  mounted() {
    let params = {
      callback_url: this.wxAuthCallbackUrl + 'auth/woa'
    }
    getWechatPreAuthUrl(params).then(response => {
      this.url = response.data.data.url
    })
  },
  methods: {
    toBind() {
      for (var i = 0; i < metadata.length; i++) {
        if (metadata[i]['name'] == 'referrer') {
          metadata[i]['content'] = 'default'
        }
      }
      window.open(this.url, '_blank')
    }
  }
}
</script>
<style scoped lang="scss">
.unbind-box {
  height: 600px;
  > div {
    margin-top: 220px;
    > p {
      margin-bottom: 10px;
    }
  }
}
</style>
