<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('146b63bc.5a02fa') }}</div>
      <el-input :value="value.title" size="small" @input="updateSetting('title', $event)" />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('146b63bc.ebc0c1') }}</div>
      <el-input :value="value.copyright" size="small" @input="updateSetting('copyright', $event)" />
    </section>

    <SectionAppearancePanel :value="value" @change="updateSetting" />
  </div>
</template>

<script>
import SectionAppearancePanel from './SectionAppearancePanel.vue'
export default {
  name: 'FooterPanel',
  components: {
    SectionAppearancePanel
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    updateSetting(field, value) {
      this.$emit('change', {
        [field]: value
      })
    }
  }
}
</script>
