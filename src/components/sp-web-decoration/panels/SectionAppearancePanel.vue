<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">颜色模式</div>
      <el-radio-group :value="value.color_mode" size="small" @input="updateColorMode">
        <el-radio-button label="light">浅色</el-radio-button>
        <el-radio-button label="dark">深色</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">背景颜色</div>
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="scheme in colorSchemes"
          :key="scheme.value"
          type="button"
          :class="[
            'flex h-12 flex-col items-center justify-center rounded-lg border text-xs transition',
            currentColorScheme === scheme.value
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border'
          ]"
          :style="{ background: scheme.background, color: scheme.foreground }"
          @click="updateField('color_scheme', scheme.value)"
        >
          <span>A</span>
          <span>{{ scheme.label }}</span>
        </button>
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">顶部间距</div>
      <el-select
        :value="value.padding_top"
        size="small"
        class="w-full"
        @change="updateField('padding_top', $event)"
      >
        <el-option
          v-for="option in paddingOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">底部间距</div>
      <el-select
        :value="value.padding_bottom"
        size="small"
        class="w-full"
        @change="updateField('padding_bottom', $event)"
      >
        <el-option
          v-for="option in paddingOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </section>

    <section v-if="showFullWidth" class="flex items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">全屏</span>
      <el-switch :value="value.full_width" @input="updateField('full_width', $event)" />
    </section>
  </div>
</template>

<script>
import { SECTION_COLOR_SCHEMES, SECTION_PADDING_OPTIONS } from '../utils/sectionAppearance.js'

export default {
  name: 'SectionAppearancePanel',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    showFullWidth: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    paddingOptions() {
      return SECTION_PADDING_OPTIONS
    },
    colorSchemes() {
      return SECTION_COLOR_SCHEMES
    },
    currentColorScheme() {
      return this.value.color_scheme || (this.value.color_mode === 'dark' ? 'scheme-3' : 'scheme-1')
    }
  },
  methods: {
    updateColorMode(fieldValue) {
      this.$emit('change', 'color_mode', fieldValue)
      this.$emit('change', 'color_scheme', fieldValue === 'dark' ? 'scheme-3' : 'scheme-1')
    },
    updateField(field, fieldValue) {
      this.$emit('change', field, fieldValue)
    }
  }
}
</script>
