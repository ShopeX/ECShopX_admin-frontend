<template>
  <div class="comp-btn">
    <div class="comp-btn-color">
      <div class="comp-btn-color-item">
        <span>{{ $t('1f99657e.351201') }}</span>
        <el-color-picker v-model="localValue.color" />
      </div>
      <div class="comp-btn-color-item">
        <span>{{ $t('1f99657e.7ec907') }}</span>
        <el-color-picker v-model="localValue.textColor" />
      </div>
    </div>
    <div v-if="showImage" class="comp-btn-style">
      <div class="comp-btn-style-item">
        <span>{{ $t('1f99657e.26dc77') }}</span>
        <sp-image-picker v-model="localValue.image" size="small" />
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  name: 'CompBtn',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    showImage: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      localValue: cloneDeep(this.value)
    }
  },
  watch: {
    localValue: {
      handler(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-btn {
  width: 100%;
  height: 100%;
  &-color {
    display: flex;
    gap: 10px;
    &-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}
</style>
