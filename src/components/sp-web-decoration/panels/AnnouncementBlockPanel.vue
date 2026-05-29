<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('ea424682.6eb9f2')">
      <el-input
        type="textarea"
        :rows="4"
        :value="settings.text"
        @input="updateField('text', $event)"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { normalizeTypedBlockSettings } from '../utils/panelState.js'

export default {
  name: 'AnnouncementBlockPanel',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeTypedBlockSettings('announcement', this.value)
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
