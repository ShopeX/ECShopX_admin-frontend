<template>
  <div class="sp-path-selector">
    <el-select
      class="sp-path-selector__type"
      :value="selectedType"
      :disabled="disabled"
      :placeholder="typePlaceholder"
      @change="handleTypeChange"
    >
      <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      />
    </el-select>
    <el-input
      class="sp-path-selector__input"
      :value="inputValue"
      :placeholder="contentPlaceholder"
      :disabled="disabled || !selectedType"
      readonly
      suffix-icon="el-icon-arrow-down"
      @click.native="openSelector"
      @keydown.native.enter.prevent="openSelector"
    />
    <el-button v-if="hasValue" type="text" class="sp-path-selector__clear" @click="clearValue">
      {{ $t('eac538c8.288f0c') }}
    </el-button>
  </div>
</template>

<script>
import { LINK_PATH } from '@/consts'
import PickerDialog from './PickerDialog.vue'
import { getPathSelectorTypes } from './config'

export default {
  name: 'SpPathSelector',
  props: {
    value: {
      type: Object,
      default: () => null
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    platform: {
      type: String,
      default: ''
    }
  },
  computed: {
    pathTypes() {
      return getPathSelectorTypes(this.platform)
    },
    typeOptions() {
      const options = this.pathTypes.map((item) => ({
        value: item.name,
        label: this.$t(item.labelKey)
      }))
      if (this.selectedType && !options.some((item) => item.value === this.selectedType)) {
        options.push({
          value: this.selectedType,
          label: LINK_PATH[this.selectedType] || this.selectedType,
          disabled: true
        })
      }
      return options
    },
    selectedType() {
      return this.value?.linkPage || ''
    },
    hasValue() {
      return Boolean(this.value && (this.value.title || this.value.id || this.value.linkPage))
    },
    inputValue() {
      return this.hasValue ? this.value.title || this.displayText : ''
    },
    typePlaceholder() {
      return this.$t('4a0a5782.e3cf91')
    },
    contentPlaceholder() {
      if (!this.selectedType) return this.$t('7856f5b5.4ef9f6')
      return this.placeholder || this.$t('7856f5b5.4ef9f6')
    },
    displayText() {
      if (this.hasValue) {
        const typeLabel = LINK_PATH[this.value.linkPage] || this.value.linkPage || ''
        if (this.value.title && typeLabel) {
          return `${typeLabel}：${this.value.title}`
        }
        return this.value.title || `${this.value.linkPage || ''}：${this.value.id || ''}`
      }
      return ''
    }
  },
  methods: {
    async handleTypeChange(linkPage) {
      if (!linkPage || this.disabled) return

      const previousValue = this.value || null
      const nextValue = {
        linkPage,
        title: '',
        id: '',
        extra: {}
      }

      const result = await this.openSelector(nextValue)

      if (!result) {
        this.$emit('input', previousValue)
        this.$emit('change', previousValue)
        return
      }

      this.$emit('input', result)
      this.$emit('change', result)
    },
    async openSelector(overrideValue = null) {
      const currentValue = overrideValue || this.value || {}
      const currentType = currentValue.linkPage || this.selectedType

      if (this.disabled || !currentType) return null
      if (!this.pathTypes.some((item) => item.name === currentType)) return null

      const result = await this.$dialog.open(PickerDialog, {
        title: this.$t('4a0a5782.e3cf91'),
        props: {
          initialValue: currentValue,
          pathType: currentType,
          pathTypes: this.pathTypes,
          platform: this.platform
        }
      })
      return result || null
    },
    clearValue() {
      this.$emit('input', null)
      this.$emit('change', null)
    }
  }
}
</script>

<style scoped lang="scss">
.sp-path-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.sp-path-selector__type {
  width: 160px;
  flex-shrink: 0;
}

.sp-path-selector__input {
  flex: 1;
}

.sp-path-selector__clear {
  flex-shrink: 0;
  padding: 0 !important;
}

.sp-path-selector ::v-deep {
  .sp-path-selector__input .el-input__inner,
  .sp-path-selector__input .el-input__suffix {
    cursor: pointer;
  }

  .sp-path-selector__input.is-disabled .el-input__inner,
  .sp-path-selector__input.is-disabled .el-input__suffix {
    cursor: not-allowed;
  }
}
</style>
