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
.slider-item {
  display: flex;
  .comp-picker-link {
    flex: 1;
  }
}
</style>
<template>
  <CompButton
    placeholder="选择店铺"
    format="{0}个店铺"
    :value="value.id ? 1 : 0"
    :view-btn="false"
    @click="handleClickAdd"
    @remove="onRemove"
  />
</template>

<script>
import Vue from 'vue'
import { isArray } from '@/utils'
import CompButton from '../../comps/comp-button'
import { cloneDeep } from 'lodash'
export default {
  name: 'AttrLabel',
  components: { CompButton },
  props: ['value'],
  data() {
    return {
      localValue: null
    }
  },
  watch: {
    localValue: function (nVal, oVal) {
      this.$emit('input', nVal)
      this.$emit('change')
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleClickAdd() {
      const { id } = this.value
      const {
        data: [shop]
      } = await this.$picker.shop({
        data: id ? [id] : [],
        multiple: false
      })
      if (shop) {
        const { distributor_id, logo, name } = shop
        this.localValue = {
          id: distributor_id,
          logo,
          name
        }
      } else {
        this.onRemove()
      }
    },
    onRemove() {
      this.localValue = {
        id: '',
        logo: '',
        name: ''
      }
    }
  }
}
</script>
