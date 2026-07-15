<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">图片</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <SpImagePicker :value="settings.image" @input="updateField('image', $event)" />
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">对齐方式</div>
      <el-radio-group
        :value="settings.alignment"
        size="small"
        @input="updateField('alignment', $event)"
      >
        <el-radio-button label="left">左</el-radio-button>
        <el-radio-button label="center">中</el-radio-button>
        <el-radio-button label="right">右</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">图片宽度</div>
      <el-radio-group :value="settings.width" size="small" @input="updateField('width', $event)">
        <el-radio-button label="25">25%</el-radio-button>
        <el-radio-button label="50">50%</el-radio-button>
        <el-radio-button label="75">75%</el-radio-button>
        <el-radio-button label="100">100%</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">圆角</div>
      <el-radio-group :value="settings.radius" size="small" @input="updateField('radius', $event)">
        <el-radio-button label="none">无</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
        <el-radio-button label="medium">中</el-radio-button>
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="full">圆形</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">占列宽度</div>
      <div class="flex items-center gap-3">
        <el-input-number
          :value="settings.column_span"
          :min="1"
          :max="12"
          size="small"
          controls-position="right"
          class="!w-[88px]"
          @change="updateField('column_span', $event)"
        />
        <el-slider
          :value="settings.column_span"
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
import { normalizeTypedBlockSettings } from '../utils/panelState.js'

export default {
  name: 'FooterImageBlockPanel',
  components: { SpImagePicker },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeTypedBlockSettings('footer-image', this.value)
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
