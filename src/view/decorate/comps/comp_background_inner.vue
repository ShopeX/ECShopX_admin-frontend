<template>
  <div class="comp-background-inner">
    <div class="background-type">
      <el-radio v-model="currentType" :label="TYPE_SOLID" @change="handleTypeChange">
        <span class="type-label">{{ $t('2024e8cf.c7af92') }}</span>
      </el-radio>
      <el-radio v-model="currentType" :label="TYPE_GRADIENT" @change="handleTypeChange">
        <span class="type-label">{{ $t('2024e8cf.87c111') }}</span>
      </el-radio>
      <el-radio
        v-if="showImage"
        v-model="currentType"
        :label="TYPE_IMAGE"
        @change="handleTypeChange"
      >
        <span class="type-label">{{ $t('2024e8cf.20def7') }}</span>
      </el-radio>
    </div>
    <div class="color-pickers">
      <template v-if="currentType === TYPE_SOLID">
        <div class="color-item">
          <el-color-picker v-model="localValue.color" size="small" @change="handleChange" />
        </div>
      </template>
      <template v-else-if="currentType === TYPE_GRADIENT">
        <div class="color-item">
          <el-color-picker v-model="localValue.startColor" size="small" @change="handleChange" />
        </div>
        <div class="color-item">
          <el-color-picker v-model="localValue.endColor" size="small" @change="handleChange" />
        </div>
      </template>
      <template v-else-if="currentType === TYPE_IMAGE">
        <div class="color-item">
          <sp-image-picker v-model="localValue.image" size="small" @onChange="handleChange" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// 背景类型常量
const TYPE_SOLID = 'solid'
const TYPE_GRADIENT = 'gradient'
const TYPE_IMAGE = 'image'

// 默认值配置
const DEFAULT_VALUE = {
  type: TYPE_SOLID,
  color: '#ffffff',
  startColor: '#ffffff',
  endColor: '#ffffff',
  image: ''
}

export default {
  name: 'AttrBackgroundInner',
  props: {
    value: {
      type: Object,
      default: () => ({ ...DEFAULT_VALUE })
    },
    showImage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      TYPE_SOLID,
      TYPE_GRADIENT,
      TYPE_IMAGE,
      localValue: this.normalizeValue(this.value)
    }
  },
  computed: {
    // 当前类型，与 localValue.type 保持同步
    currentType: {
      get() {
        return this.localValue.type || TYPE_SOLID
      },
      set(val) {
        if (this.localValue.type !== val) {
          this.localValue.type = val
          this.handleChange()
        }
      }
    }
  },
  watch: {
    // 优化：监听 value 对象变化，使用浅层比较避免深度监听性能问题
    value: {
      handler(newVal) {
        // 只在值真正变化时更新，避免循环更新
        if (this.isValueChanged(newVal, this.localValue)) {
          this.updateLocalValue(newVal)
        }
      },
      immediate: true,
      deep: false // 使用浅层监听，通过 isValueChanged 方法手动比较
    }
  },
  methods: {
    /**
     * 规范化值，确保所有必需字段存在
     * @param {Object} val - 输入值
     * @returns {Object} 规范化后的值
     */
    normalizeValue(val) {
      if (!val || typeof val !== 'object') {
        return { ...DEFAULT_VALUE }
      }
      return {
        type: val.type || TYPE_SOLID,
        color: val.color || DEFAULT_VALUE.color,
        startColor: val.startColor || DEFAULT_VALUE.startColor,
        endColor: val.endColor || DEFAULT_VALUE.endColor,
        image: val.image || DEFAULT_VALUE.image
      }
    },
    /**
     * 更新本地值
     * @param {Object} newVal - 新值
     */
    updateLocalValue(newVal) {
      const normalized = this.normalizeValue(newVal)
      // 只更新变化的字段，避免不必要的响应式更新
      Object.keys(normalized).forEach((key) => {
        if (this.localValue[key] !== normalized[key]) {
          this.$set(this.localValue, key, normalized[key])
        }
      })
    },
    /**
     * 检查值是否发生变化
     * @param {Object} newVal - 新值
     * @param {Object} oldVal - 旧值
     * @returns {Boolean} 是否变化
     */
    isValueChanged(newVal, oldVal) {
      if (!newVal || !oldVal) return true
      const keys = ['type', 'color', 'startColor', 'endColor', 'image']
      return keys.some((key) => newVal[key] !== oldVal[key])
    },
    /**
     * 处理类型变化
     * @param {String} type - 新的类型值
     */
    handleTypeChange(type) {
      // el-radio 的 change 事件直接传递值，不是事件对象
      // 通过计算属性的 setter 更新，避免重复调用 handleChange
      if (type && type !== this.localValue.type) {
        this.currentType = type
      }
    },
    /**
     * 处理值变化，触发事件
     */
    handleChange() {
      // 创建新对象引用，确保父组件能检测到变化
      const emitValue = { ...this.localValue }
      this.$emit('input', emitValue)
      this.$emit('change', emitValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-background-inner {
  margin-bottom: 15px;

  .background-type {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .type-label {
      font-size: 14px;
      color: #606266;
      margin-right: 5px;
    }

    .el-radio {
      margin-right: 15px;
    }
  }

  .color-pickers {
    display: flex;

    .color-item {
      margin-right: 10px;
    }
  }
}
</style>
