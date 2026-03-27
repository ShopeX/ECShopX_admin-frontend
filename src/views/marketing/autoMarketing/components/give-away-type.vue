<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-radio-group v-model="localValue.type">
      <el-radio v-for="item in options" :key="item.value" :label="item.value">
        {{ item.label }}
      </el-radio>
    </el-radio-group>

    <div v-if="localValue.type === 'every_year'" class="every-year flex items-center">
      <el-select
        v-model="localValue.month"
        :placeholder="$t('93ec80b5.904393')"
        style="width: 160px; margin-right: 10px"
      >
        <el-option
          v-for="item in monthOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="localValue.day" :placeholder="$t('93ec80b5.aa2fb1')" style="width: 160px">
        <el-option
          v-for="item in dayOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div v-if="localValue.type === 'every_month'" class="every-month">
      <el-select v-model="localValue.day" :placeholder="$t('93ec80b5.aa2fb1')" style="width: 160px">
        <el-option
          v-for="item in dayOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div v-if="localValue.type === 'every_week'" class="every-week">
      <el-select
        v-model="localValue.week"
        :placeholder="$t('93ec80b5.2b40fa')"
        style="width: 160px"
      >
        <el-option
          v-for="item in weekOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localValue: {
        type: this.value?.type,
        month: this.value?.month,
        day: this.value?.day,
        week: this.value?.week
      },
      weekOptions: [],
      monthOptions: [],
      dayOptions: []
    }
  },
  created() {
    const t = this.$t.bind(this)
    this.weekOptions = [
      { value: 1, label: t('93ec80b5.5ce438') },
      { value: 2, label: t('93ec80b5.34e521') },
      { value: 3, label: t('93ec80b5.711d99') },
      { value: 4, label: t('93ec80b5.3df6af') },
      { value: 5, label: t('93ec80b5.450ea3') },
      { value: 6, label: t('93ec80b5.1ae72f') },
      { value: 7, label: t('93ec80b5.67b195') }
    ]
    this.monthOptions = []
    for (let i = 0; i < 12; i++) {
      this.monthOptions.push({ value: i + 1, label: t('93ec80b5.0bb91f', [i + 1]) })
    }
    this.dayOptions = []
    for (let i = 0; i < 31; i++) {
      this.dayOptions.push({ value: i + 1, label: t('93ec80b5.61de59', [i + 1]) })
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

<style lang="scss" scoped></style>
