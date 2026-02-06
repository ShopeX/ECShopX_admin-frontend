<template>
  <div class="comp-background-outer">
    <div class="background-type-selector">
      <el-radio-group v-model="backgroundType" size="mini" @change="handleTypeChange">
        <el-radio-button label="color">背景颜色1</el-radio-button>
        <el-radio-button label="image">背景图片</el-radio-button>
      </el-radio-group>
    </div>
    <div class="background-content">
      <div v-if="backgroundType === 'color'" class="color-section">
        <div class="color-picker-wrapper">
          <span class="color-code">{{ displayColor }}</span>
          <el-button type="text" size="mini" class="reset-btn" @click="handleResetColor"
            >重置</el-button
          >
          <div class="color-swatch" :style="{ backgroundColor: displayColor }">
            <el-color-picker v-model="localValue.color" size="small" @change="handleChange" />
          </div>
        </div>
      </div>
      <div v-if="backgroundType === 'image'" class="image-section">
        <sp-image-picker v-model="localValue.image" size="small" @onChange="handleChange" />
      </div>
    </div>
  </div>
</template>

<script>
// 默认值配置
const DEFAULT_VALUE = {
  color: '',
  image: ''
}

export default {
  name: 'AttrBackgroundOuter',
  props: {
    value: {
      type: Object,
      default: () => ({ ...DEFAULT_VALUE })
    },
    uuid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localValue: this.normalizeValue(this.value),
      backgroundType: this.getInitialType(this.value)
    }
  },
  computed: {
    defaultColor() {
      return '#fff'
    },
    displayColor() {
      return this.localValue.color || this.defaultColor
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
     * 获取初始类型（根据值判断是颜色还是图片）
     * @param {Object} val - 输入值
     * @returns {String} 'color' 或 'image'
     */
    getInitialType(val) {
      if (!val || typeof val !== 'object') {
        return 'color'
      }
      // 如果有图片，优先显示图片
      if (val.image && val.image.trim() !== '') {
        return 'image'
      }
      // 如果有颜色，显示颜色
      if (val.color && val.color.trim() !== '') {
        return 'color'
      }
      // 默认显示颜色
      return 'color'
    },
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
        color: val.color || DEFAULT_VALUE.color,
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
      return newVal.color !== oldVal.color || newVal.image !== oldVal.image
    },
    /**
     * 处理类型变化
     */
    handleTypeChange(type) {
      // 类型变化时不需要清空值，只是切换显示
    },
    /**
     * 重置颜色
     */
    handleResetColor() {
      this.localValue.color = this.defaultColor
      this.handleChange()
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
.comp-background-outer {
  margin-bottom: 15px;

  .background-type-selector {
    margin-bottom: 12px;
    display: flex;
    justify-content: flex-start;

    .el-radio-group {
      display: flex;
      width: 100%;

      .el-radio-button {
        flex: 1;

        &:first-child {
          .el-radio-button__inner {
            border-radius: 4px 0 0 4px;
            border-right: none;
          }
        }

        &:last-child {
          .el-radio-button__inner {
            border-radius: 0 4px 4px 0;
          }
        }

        .el-radio-button__inner {
          width: 100%;
          padding: 8px 16px;
          font-size: 12px;
          color: #595961;
          background-color: #fff;
          border: 1px solid #e0e0e0;
          transition: all 0.3s;

          &:hover {
            color: #155bd4;
          }
        }

        &.is-active {
          .el-radio-button__inner {
            color: #fff;
            background-color: #155bd4;
            border-color: #155bd4;
            box-shadow: none;
          }
        }
      }
    }
  }

  .background-content {
    .color-section {
      .color-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;

        .color-code {
          font-size: 12px;
          color: #595961;
          min-width: 60px;
        }

        .reset-btn {
          padding: 0;
          font-size: 12px;
          color: #155bd4;
          height: auto;
          line-height: 1;
          margin-left: auto;
        }

        .color-swatch {
          width: 32px;
          height: 32px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;

          .el-color-picker {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;

            ::v-deep .el-color-picker__trigger {
              width: 100%;
              height: 100%;
              border: none;
              padding: 0;
            }
          }
        }
      }
    }

    .image-section {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
.comp-background-outer {
  .sp-image-picker {
    .image-item {
      margin: 0px !important;
    }
  }
}
</style>
