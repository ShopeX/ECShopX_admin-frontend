<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('5702d2d6.14d342')">
      <el-input :value="value.label" @input="updateField('label', $event)" />
    </el-form-item>

    <el-form-item :label="$t('5702d2d6.dec2eb')">
      <el-input :value="value.url" @input="updateField('url', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FooterLinkBlockPanel',
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
