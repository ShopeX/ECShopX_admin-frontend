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
  <div>
    <el-date-picker
      v-model="localValue.date"
      :disabled="localValue.is_forever"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    />
    <el-checkbox v-model="localValue.is_forever" class="ml-4">永久有效</el-checkbox>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        localValue: {
          date: this.value.date,
          is_forever: this.value.is_forever
        }
      }
    },
    watch: {
      localValue: {
        handler(val) {
          this.$emit('change', val)
        },
        deep: true,
        immediate: false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
