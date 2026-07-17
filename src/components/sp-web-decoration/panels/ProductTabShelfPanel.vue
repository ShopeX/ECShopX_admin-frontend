<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('936301c9.e45688') }}</div>
      <SpRichTextEditor
        :value="settings.intro"
        :placeholder="$t('936301c9.5cae49')"
        @input="updateField('intro', $event)"
      />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('936301c9.ea887b') }}</div>
      <el-select
        :value="settings.size"
        size="small"
        class="w-full"
        @change="updateField('size', $event)"
      >
        <el-option value="xsmall" :label="$t('936301c9.f72ce9')" />
        <el-option value="small" :label="$t('936301c9.391b8f')" />
        <el-option value="medium" :label="$t('936301c9.aed1df')" />
        <el-option value="large" :label="$t('936301c9.ab18e3')" />
        <el-option value="xlarge" :label="$t('936301c9.3386da')" />
      </el-select>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('936301c9.d5bc35') }}</div>
      <el-radio-group
        :value="settings.alignment"
        size="small"
        @input="updateField('alignment', $event)"
      >
        <el-radio-button label="left">{{ $t('936301c9.d2aff1') }}</el-radio-button>
        <el-radio-button label="center">{{ $t('936301c9.aed1df') }}</el-radio-button>
        <el-radio-button label="right">{{ $t('936301c9.4d9c32') }}</el-radio-button>
      </el-radio-group>
    </section>

    <div class="space-y-5 border-t border-border pt-5">
      <div class="text-sm font-semibold text-foreground">{{ $t('936301c9.2d711b') }}</div>

      <section class="space-y-2">
        <div class="text-sm text-muted-foreground">{{ $t('936301c9.3bc17d') }}</div>
        <div class="flex items-center gap-3">
          <el-input-number
            :value="settings.columns"
            :min="1"
            :max="6"
            size="small"
            controls-position="right"
            class="!w-[88px]"
            @change="updateField('columns', $event)"
          />
          <el-slider
            :value="settings.columns"
            :min="1"
            :max="6"
            :step="1"
            :show-tooltip="false"
            class="min-w-0 flex-1 pl-1"
            @input="updateField('columns', $event)"
          />
        </div>
      </section>

      <section class="space-y-2">
        <div class="text-sm text-muted-foreground">{{ $t('936301c9.60bac4') }}</div>
        <el-radio-group
          :value="settings.spacing"
          size="small"
          @input="updateField('spacing', $event)"
        >
          <el-radio-button label="none">{{ $t('936301c9.d81bb2') }}</el-radio-button>
          <el-radio-button label="small">{{ $t('936301c9.391b8f') }}</el-radio-button>
          <el-radio-button label="medium">{{ $t('936301c9.aed1df') }}</el-radio-button>
          <el-radio-button label="large">{{ $t('936301c9.ab18e3') }}</el-radio-button>
        </el-radio-group>
      </section>
    </div>

    <SectionAppearancePanel :value="settings" @change="updateField" />
  </div>
</template>

<script>
import SectionAppearancePanel from './SectionAppearancePanel.vue'
import { normalizeProductTabShelfSettings } from '../utils/panelState.js'

export default {
  name: 'ProductTabShelfPanel',
  components: {
    SectionAppearancePanel
  },
  props: {
    section: { type: Object, default: null },
    value: { type: Object, default: () => ({}) }
  },
  computed: {
    settings() {
      return normalizeProductTabShelfSettings(this.value)
    }
  },
  methods: {
    updateField(field, value) {
      this.$emit('change', { [field]: value })
    }
  }
}
</script>
