<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-date-picker
      v-model="localValue.date"
      :disabled="localValue.is_forever"
      type="daterange"
      :range-separator="$t('5629ff10.981cbe')"
      :start-placeholder="$t('5629ff10.b44c0f')"
      :end-placeholder="$t('5629ff10.1d468b')"
    />
    <el-checkbox v-model="localValue.is_forever" class="ml-4">
      {{ $t('5629ff10.9eb15d') }}
    </el-checkbox>
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

<style lang="scss" scoped></style>
