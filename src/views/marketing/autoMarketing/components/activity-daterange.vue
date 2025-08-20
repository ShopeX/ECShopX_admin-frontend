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
