<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('6438e9ed.20def7') }}</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <SpImagePicker :value="value.image" @input="updateField('image', $event)" />
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('6438e9ed.d5bc35') }}</div>
      <el-radio-group
        :value="value.alignment || 'left'"
        size="small"
        @input="updateField('alignment', $event)"
      >
        <el-radio-button label="left">{{ $t('6438e9ed.d2aff1') }}</el-radio-button>
        <el-radio-button label="center">{{ $t('6438e9ed.aed1df') }}</el-radio-button>
        <el-radio-button label="right">{{ $t('6438e9ed.4d9c32') }}</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('6438e9ed.b676c9') }}</div>
      <el-radio-group
        :value="value.width || '100'"
        size="small"
        @input="updateField('width', $event)"
      >
        <el-radio-button label="25">25%</el-radio-button>
        <el-radio-button label="50">50%</el-radio-button>
        <el-radio-button label="75">75%</el-radio-button>
        <el-radio-button label="100">100%</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('6438e9ed.0103eb') }}</div>
      <el-radio-group
        :value="value.radius || 'medium'"
        size="small"
        @input="updateField('radius', $event)"
      >
        <el-radio-button label="none">{{ $t('6438e9ed.d81bb2') }}</el-radio-button>
        <el-radio-button label="small">{{ $t('6438e9ed.391b8f') }}</el-radio-button>
        <el-radio-button label="medium">{{ $t('6438e9ed.aed1df') }}</el-radio-button>
        <el-radio-button label="large">{{ $t('6438e9ed.ab18e3') }}</el-radio-button>
        <el-radio-button label="full">{{ $t('6438e9ed.2db0fc') }}</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('6438e9ed.3f7bf6') }}</div>
      <div class="flex items-center gap-3">
        <el-input-number
          :value="value.column_span || 4"
          :min="1"
          :max="12"
          size="small"
          controls-position="right"
          class="!w-[88px]"
          @change="updateField('column_span', $event)"
        />
        <el-slider
          :value="value.column_span || 4"
          :min="1"
          :max="12"
          :step="1"
          :show-tooltip="false"
          class="min-w-0 flex-1 pl-1"
          @input="updateField('column_span', $event)"
        />
      </div>
    </section>
  </div>
</template>

<script>
import SpImagePicker from '@/components/sp-image-picker/index.vue'

export default {
  name: 'FooterImageBlockPanel',
  components: { SpImagePicker },
  props: {
    value: {
      type: Object,
      default: () => ({})
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
