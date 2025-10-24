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
<style lang="scss">
.sp-input {
  display: inline-flex;
  align-items: center;
  width: 100%;
  .el-input {
    margin: 0 8px;
  }
}
</style>
<template>
  <div class="sp-input">
    <span v-if="prefix" class="prefix">{{ prefix }}</span>
    <el-input
      v-model="val"
      :placeholder="placeHolder"
      :style="styleName"
      :disabled="disabled"
      type="text"
      @change="onChangeInput"
    />
    <span v-if="suffix" class="suffix">{{ suffix }}</span>
  </div>
</template>

<script>
export default {
  name: 'SpInput',
  props: {
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      val: ''
    }
  },
  computed: {
    styleName() {
      return {
        width: this.width
      }
    },
    placeHolder() {
      return this.placeholder
    }
  },
  watch: {
    value: function (val) {
      this.val = val
    }
  },
  created() {
    this.val = this.value
  },

  methods: {
    onChangeInput() {
      this.$emit('input', this.val)
    }
  }
}
</script>
