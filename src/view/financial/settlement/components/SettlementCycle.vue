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
.comp-cycle {
  display: flex;
  .label {
    margin-right: 10px;
  }
  .cycle-input {
    margin-right: 10px;
    width: 160px;
  }
}
</style>
<template>
  <div class="comp-cycle">
    <span class="label">每</span>
    <el-input
      v-model="cycle"
      :class="cycleClass"
      type="text"
      clearable
      placeholder="请输入结算周期数"
      @change="onChange"
    />
    <el-select v-model="unit" clearable placeholder="请选择" @change="onChange">
      <el-option
        v-for="item in units"
        :key="item.value"
        size="mini"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SettlementCycle',
  props: ['value'],
  data() {
    const { cycle = '', unit = '' } = this.value
    return {
      units: [
        { label: '天', value: 'day' },
        { label: '周', value: 'week' },
        { label: '月', value: 'month' }
      ],
      cycle,
      unit
    }
  },
  computed: {
    // cycle-input
    cycleClass() {
      const { cycle } = this
      return [
        'cycle-input',
        {
          'is-error': !cycle
        }
      ]
    }
  },
  watch: {
    value(newVal, oldVal) {
      const { cycle = '', unit = '' } = newVal
      this.cycle = cycle
      this.unit = unit
    }
  },
  created() {},
  methods: {
    onChange(e) {
      this.$emit('input', {
        cycle: this.cycle,
        unit: this.unit
      })
    }
  }
}
</script>
