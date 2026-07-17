<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('5987e78b.b372fc') }}</div>
      <el-radio-group
        :value="settings.image_height"
        size="small"
        @input="updateField('image_height', $event)"
      >
        <el-radio-button label="small">{{ $t('5987e78b.391b8f') }}</el-radio-button>
        <el-radio-button label="medium">{{ $t('5987e78b.aed1df') }}</el-radio-button>
        <el-radio-button label="large">{{ $t('5987e78b.ab18e3') }}</el-radio-button>
        <el-radio-button label="adapt">{{ $t('5987e78b.328146') }}</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('5987e78b.4ccf55') }}</div>
      <el-radio-group
        :value="settings.paginate_type"
        size="small"
        @input="updateField('paginate_type', $event)"
      >
        <el-radio-button label="point">{{ $t('5987e78b.8d58d0') }}</el-radio-button>
        <el-radio-button label="counter">{{ $t('5987e78b.52f43c') }}</el-radio-button>
        <el-radio-button label="number">{{ $t('5987e78b.c06241') }}</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('5987e78b.570aeb') }}</div>
      <el-radio-group
        :value="settings.paginate_size"
        size="small"
        @input="updateField('paginate_size', $event)"
      >
        <el-radio-button label="small">{{ $t('5987e78b.391b8f') }}</el-radio-button>
        <el-radio-button label="medium">{{ $t('5987e78b.aed1df') }}</el-radio-button>
        <el-radio-button label="large">{{ $t('5987e78b.ab18e3') }}</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-3">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-muted-foreground">{{ $t('5987e78b.97cc99') }}</span>
        <el-switch
          :value="settings.enable_auto_play"
          @input="updateField('enable_auto_play', $event)"
        />
      </div>

      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-muted-foreground">{{ $t('5987e78b.574f2f') }}</span>
        <el-switch :value="settings.enable_arrow" @input="updateField('enable_arrow', $event)" />
      </div>
    </section>

    <section v-if="settings.enable_auto_play" class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('5987e78b.71b67b') }}</div>
      <div class="flex items-center gap-3">
        <el-input-number
          class="!w-[88px]"
          :value="settings.interval"
          :min="3"
          :max="9"
          size="small"
          controls-position="right"
          @change="updateField('interval', $event)"
        />
        <span class="text-xs text-muted-foreground">{{ $t('5987e78b.0c1fec') }}</span>
        <el-slider
          class="min-w-0 flex-1 pl-1"
          :value="settings.interval"
          :min="3"
          :max="9"
          :step="1"
          :show-tooltip="false"
          @input="updateField('interval', $event)"
        />
      </div>
    </section>

    <SectionAppearancePanel :value="settings" @change="updateField" />
  </div>
</template>

<script>
import SectionAppearancePanel from './SectionAppearancePanel.vue'
import { normalizeTypedSectionSettings } from '../utils/panelState.js'

export default {
  name: 'CarouselPanel',
  components: {
    SectionAppearancePanel
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeTypedSectionSettings('main-carousel', this.value)
    }
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('change', {
        [field]: fieldValue
      })
    }
  }
}
</script>
