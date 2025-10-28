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
  <el-dialog v-bind="$attrs" :visible.sync="dialogVisible" class="info-tip-modal-wrapper">
    <div class="top-info">请复制下方信息给商户，以登录商户后台继续操作。</div>
    <div class="tip-item">
      <span class="title">地址：</span>
      <span>{{ address }}</span>
    </div>
    <div class="tip-item">
      <span class="title">帐号：</span>
      <span>{{ username }}</span>
    </div>
    <div class="tip-item">
      <span class="title">密码：</span>
      <span class="password">{{ password }}</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="copyInfo">复制登录信息</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    password: String,
    username: String
  },
  data() {
    return {
      address: ''
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      }
    }
  },
  mounted() {
    this.getAddress()
  },
  methods: {
    getAddress() {
      let host = location.host
      this.address = `${host}/merchant/login`
    },
    copyInfo() {
      let textarea = document.createElement('textarea')
      textarea.value = `地址：${this.address}\n帐号：${this.username}\n密码：${this.password}`
      textarea.readOnly = 'readOnly'
      document.body.appendChild(textarea)
      textarea.select()
      let result = document.execCommand('copy')
      if (result) {
        this.$message({
          message: '复制信息成功',
          type: 'success'
        })
      }
      textarea.remove()
    }
  }
}
</script>

<style lang="scss">
.info-tip-modal-wrapper {
  .top-info {
    border: 1px solid #ebeef5;
    padding: 3px 5px;
    border-radius: 6px;
    margin-bottom: 10px;
  }
  .tip-item {
    line-height: 40px;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .password {
    margin-right: 20px;
  }
}
</style>
