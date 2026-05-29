<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('e02c8a16.14d342')">
      <el-input :value="value.label" @input="updateField('label', $event)" />
    </el-form-item>

    <div class="grid grid-cols-2 gap-3">
      <el-form-item :label="$t('e02c8a16.488d54')">
        <el-input-number
          :value="value.x"
          :min="0"
          :max="100"
          controls-position="right"
          @change="updateField('x', $event)"
        />
      </el-form-item>

      <el-form-item :label="$t('e02c8a16.4d7b6d')">
        <el-input-number
          :value="value.y"
          :min="0"
          :max="100"
          controls-position="right"
          @change="updateField('y', $event)"
        />
      </el-form-item>
    </div>

    <el-form-item :label="$t('e02c8a16.dec2eb')">
      <el-input :value="value.link" @input="updateField('link', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'HotspotBlockPanel',
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
