<template>
  <div class="space-y-4 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">PC图片</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <SpImagePicker :value="settings.pc_image" @input="updateField('pc_image', $event)" />
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">移动图片</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <SpImagePicker
          :value="settings.mobile_image"
          @input="updateField('mobile_image', $event)"
        />
      </div>
    </section>

    <section class="space-y-2">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-muted-foreground">热区配置</span>
        <el-button type="primary" size="small" @click="openHotspotEditor">编辑热区</el-button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
          PC热区 {{ pcHotspotCount }} 个
        </div>
        <div class="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
          移动热区 {{ mobileHotspotCount }} 个
        </div>
      </div>
    </section>

    <SectionAppearancePanel :value="settings" @change="updateField" />
  </div>
</template>

<script>
import SpImagePicker from '@/components/sp-image-picker/index.vue'
import ImageHotspotEditorDialog from './ImageHotspotEditorDialog.vue'
import SectionAppearancePanel from './SectionAppearancePanel.vue'
import { normalizeTypedSectionSettings } from '../utils/panelState.js'

export default {
  name: 'ImageHotspotPanel',
  components: {
    SpImagePicker,
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
      return normalizeTypedSectionSettings('image-hotspot', this.value)
    },
    pcHotspotCount() {
      return Array.isArray(this.settings.pc_hotspots) ? this.settings.pc_hotspots.length : 0
    },
    mobileHotspotCount() {
      return Array.isArray(this.settings.mobile_hotspots) ? this.settings.mobile_hotspots.length : 0
    }
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('change', {
        ...this.cleanSettings(this.settings),
        [field]: fieldValue
      })
    },
    cleanSettings(settings) {
      const next = { ...settings }
      delete next.enable_link
      delete next.link
      return next
    },
    async openHotspotEditor() {
      const result = await this.$dialog.open(ImageHotspotEditorDialog, {
        title: '编辑热区',
        props: {
          settings: this.settings,
          initialDevice: 'pc'
        },
        size: 'large'
      })
      if (!result) return
      this.$emit('change', {
        ...this.cleanSettings(this.settings),
        ...result
      })
    }
  }
}
</script>
