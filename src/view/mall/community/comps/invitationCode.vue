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
<style lang="scss" scoped>
.invitation-code {
  display: flex;
  align-items: flex-end;
  .download-link {
    line-height: 1;
    margin-left: 10px;
    cursor: default;
  }
}
</style>
<template>
  <div class="invitation-code">
    <SpImage :src="info" :width="120" />
    <a class="download-link text-blue-400" download="invitation_code.jpg" :href="info"
      >下载邀请码</a
    >
  </div>
</template>

<script>
export default {
  name: 'InvitationCode',
  props: {
    info: String
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    handleDownload() {
      console.log('handleDownload: ', this.info)
      window.open(this.info)
    }
  }
}
</script>
