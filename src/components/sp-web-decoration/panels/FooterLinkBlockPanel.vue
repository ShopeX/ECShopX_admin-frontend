<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('5702d2d6.14d342')">
      <el-input :value="settings.label" @input="updateField('label', $event)" />
    </el-form-item>

    <el-form-item :label="$t('5702d2d6.dec2eb')">
      <el-input :value="settings.url" @input="updateField('url', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
import { normalizeTypedBlockSettings } from '../utils/panelState.js'

export default {
  name: 'FooterLinkBlockPanel',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeTypedBlockSettings('footer-link', this.value)
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
