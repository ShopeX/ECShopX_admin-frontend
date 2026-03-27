<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog v-bind="$attrs" :visible.sync="dialogVisible" class="info-tip-modal-wrapper">
    <div class="top-info">{{ $t('7f8f7c71.3ec8b0') }}</div>
    <div class="tip-item">
      <span class="title">{{ $t('7f8f7c71.df3833') }}</span>
      <span>{{ address }}</span>
    </div>
    <div class="tip-item">
      <span class="title">{{ $t('7f8f7c71.ddf8fc') }}</span>
      <span>{{ username }}</span>
    </div>
    <div class="tip-item">
      <span class="title">{{ $t('7f8f7c71.9b55a2') }}</span>
      <span class="password">{{ password }}</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="copyInfo">{{ $t('7f8f7c71.1c2fd6') }}</el-button>
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
      textarea.value = `${this.$t('7f8f7c71.df3833')}${this.address}\n${this.$t(
        '7f8f7c71.ddf8fc'
      )}${this.username}\n${this.$t('7f8f7c71.9b55a2')}${this.password}`
      textarea.readOnly = 'readOnly'
      document.body.appendChild(textarea)
      textarea.select()
      let result = document.execCommand('copy')
      if (result) {
        this.$message({
          message: this.$t('7f8f7c71.575ada'),
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
