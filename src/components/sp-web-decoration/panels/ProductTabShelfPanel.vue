<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">引言</div>
      <SpRichTextEditor
        :value="settings.intro"
        placeholder="请输入引言"
        @input="updateField('intro', $event)"
      />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">规格</div>
      <el-select
        :value="settings.size"
        size="small"
        class="w-full"
        @change="updateField('size', $event)"
      >
        <el-option value="xsmall" label="特小" />
        <el-option value="small" label="小" />
        <el-option value="medium" label="中" />
        <el-option value="large" label="大" />
        <el-option value="xlarge" label="特大" />
      </el-select>
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

    <div class="space-y-5 border-t border-border pt-5">
      <div class="text-sm font-semibold text-foreground">内容</div>

      <section class="space-y-2">
        <div class="text-sm text-muted-foreground">产品卡列数</div>
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
        <div class="text-sm text-muted-foreground">间距</div>
        <el-radio-group
          :value="settings.spacing"
          size="small"
          @input="updateField('spacing', $event)"
        >
          <el-radio-button label="none">无</el-radio-button>
          <el-radio-button label="small">小</el-radio-button>
          <el-radio-button label="medium">中</el-radio-button>
          <el-radio-button label="large">大</el-radio-button>
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
