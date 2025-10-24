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
<style scoped lang="scss">
.wgt-page-attr-item {
  display: flex;
  margin-top: 7px;
  .attr-title {
    display: block;
    margin-bottom: 10px;
  }
}
</style>

<template>
  <div style="display: flex" class="wgt-page-attr-item">
    <div>
      <span class="attr-title">背景颜色</span>
      <el-color-picker v-model="localValue.color" size="small" />
      <el-button class="button-reset" type="text" @click="onClickReset"> 重置 </el-button>
    </div>
    <div style="margin-left: 20px">
      <span class="attr-title">背景图片</span>
      <SpImagePicker v-model="localValue.image" size="small" />
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import CompPickerLink from '../../comps/comp-pickerLink'
export default {
  name: 'AttrItem',
  components: {
    CompPickerLink
  },
  props: ['value'],
  data() {
    return {
      localValue: {
        color: '#333',
        image: ''
      }
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
    console.log('created', this.localValue, this.value)
  },
  watch: {
    localValue: function (nVal, oVal) {
      console.log('localValue', nVal, oVal)
      this.$emit('input', nVal)
    }
  },
  methods: {
    onClickReset() {
      this.localValue.color = '#333'
    }
    // onChangeLink(e, index) {
    //   const v = cloneDeep(this.value[index])
    //   Vue.set(this.value, index, {
    //     ...v,
    //     ...e
    //   })
    // }
  }
}
</script>
