<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
    <span class="label">{{ $t('fd0c789f.a7e221') }}</span>
    <el-input
      v-model="cycle"
      :class="cycleClass"
      type="text"
      clearable
      :placeholder="$t('fd0c789f.9e91bf')"
      @change="onChange"
    />
    <el-select v-model="unit" clearable :placeholder="$t('fd0c789f.708c9d')" @change="onChange">
      <el-option
        v-for="item in units"
        :key="item.value"
        size="mini"
        :label="$t(item.labelKey)"
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
    const { cycle = '', unit = '' } = this.value || {}
    return {
      cycle,
      unit
    }
  },
  computed: {
    units() {
      return [
        { labelKey: 'fd0c789f.249aba', value: 'day' },
        { labelKey: 'fd0c789f.a657f4', value: 'week' },
        { labelKey: 'fd0c789f.e42b99', value: 'month' }
      ]
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
    value(newVal) {
      const { cycle = '', unit = '' } = newVal || {}
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
