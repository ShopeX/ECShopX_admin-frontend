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
.el-form-item {
  &.is-error {
    .form-sub-item {
      &.is-error {
        .el-input__inner {
          border-color: #f56c6c;
        }
      }
      .el-input__inner {
        border-color: #d9d9d9;
      }
    }
  }
}
.fi-connect-phone {
  .area-no {
    margin-right: 10px;
    width: 100px;
  }
  .phone {
    width: 500px;
    max-width: initial;
  }
}
</style>
<template>
  <div class="fi-connect-phone">
    <el-input
      v-model="data.areaNo"
      clearable
      type="text"
      placeholder="区号"
      :class="keyClass('areaNo')"
      @change="onChange"
    />
    <el-input
      v-model="data.phone"
      clearable
      type="text"
      placeholder="请填写准确的联系电话，便于买家联系（手机号时区号可留空）"
      :class="keyClass('phone')"
      @change="onChange"
    />
  </div>
</template>

<script>
import { camelToShortline } from '@/utils'
export default {
  name: 'FormItemConnectPhone',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      data: {
        areaNo: '',
        phone: ''
      },
      isErrorKey: ''
    }
  },
  watch: {
    value(val) {
      this.data = val
    }
  },
  created() {},
  methods: {
    keyClass(key) {
      return [
        camelToShortline(key),
        'form-sub-item',
        {
          'is-error': this.isErrorKey == key
        }
      ]
    },
    onChange() {
      this.$emit('input', this.data)
    },
    validator() {
      const { areaNo, phone } = this.data
      this.isErrorKey = ''
      if (areaNo && !phone) {
        this.isErrorKey = 'phone'
        throw new Error('请输入固定电话')
      } else if (!phone) {
        this.isErrorKey = 'phone'
        throw new Error('请输入联系电话')
      }
    }
  }
}
</script>
