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
        placeholder="请选择月份"
        style="width: 160px; margin-right: 10px"
      >
        <el-option
          v-for="item in monthOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="localValue.day" placeholder="请选择日期" style="width: 160px">
        <el-option
          v-for="item in dayOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div v-if="localValue.type === 'every_month'" class="every-month">
      <el-select v-model="localValue.day" placeholder="请选择日期" style="width: 160px">
        <el-option
          v-for="item in dayOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div v-if="localValue.type === 'every_week'" class="every-week">
      <el-select v-model="localValue.week" placeholder="请选择星期" style="width: 160px">
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
    const _monthOptions = [],
      _dayOptions = []
    for (let i = 0; i < 12; i++) {
      _monthOptions.push({ value: i + 1, label: `${i + 1}月` })
    }
    for (let i = 0; i < 31; i++) {
      _dayOptions.push({ value: i + 1, label: `${i + 1}日` })
    }
    return {
      localValue: {
        type: this.value?.type,
        month: this.value?.month,
        day: this.value?.day,
        week: this.value?.week
      },
      weekOptions: [
        { value: 1, label: '星期一' },
        { value: 2, label: '星期二' },
        { value: 3, label: '星期三' },
        { value: 4, label: '星期四' },
        { value: 5, label: '星期五' },
        { value: 6, label: '星期六' },
        { value: 7, label: '星期日' }
      ],
      monthOptions: _monthOptions,
      dayOptions: _dayOptions
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
