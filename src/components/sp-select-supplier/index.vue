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
.sp-select-input {
  display: inline-block;
  width: 100%;
  .el-icon-arrow-down {
    &.is-reverse {
      transition: transform 0.3s;
      font-size: 14px;
      transform: rotateZ(180deg);
    }
  }
}
</style>

<template>
  <div ref="reference" class="sp-select-input" @click="onSelectSupplier(true)">
    <el-input readonly :value="selectValue" :placeholder="placeholder">
      <template slot="suffix">
        <i
          v-if="clearBtnVisible"
          key="clear"
          class="el-input__icon el-icon-circle-close"
          @click.stop="handleClear"
        />
        <i v-else key="arrow-down" :class="['el-input__icon', 'el-icon-arrow-down']" />
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'SpSelectSupplier',
  props: {
    value: [Number, String],
    placeholder: String,
    clearable: Boolean
  },
  provide() {
    return {
      selectSupplier: this
    }
  },
  data() {
    return {
      dropDownVisible: false,
      selectValue: '',
      initialValue: this.value
    }
  },
  computed: {
    clearBtnVisible() {
      if (!this.clearable || !this.selectValue) {
        return false
      }
      return true
    }
  },
  watch: {
    value(newVal, oldVal) {
      // 重置
      if (newVal == this.initialValue) {
        this.selectValue = ''
      }
    }
  },
  created() {},
  methods: {
    async onSelectSupplier() {
      const { data } = await this.$picker.supplier({
        data: this.value ? [this.value] : [],
        multiple: false
      })
      if (data) {
        const [{ id, supplier_name }] = data
        this.onChange({
          name: supplier_name,
          value: id
        })
      } else {
        this.onChange({
          name: '',
          value: ''
        })
      }
    },
    onChange({ name, value }) {
      this.selectValue = name
      this.$emit('input', value)
      this.$emit('change')
    },
    handleClear() {
      this.onChange({
        name: '',
        value: ''
      })
    }
  }
}
</script>
