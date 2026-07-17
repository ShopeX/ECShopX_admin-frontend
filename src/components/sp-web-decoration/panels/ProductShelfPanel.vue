<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('6c727f2c.5a02fa') }}</div>
      <el-input :value="value.title" size="small" @input="updateField('title', $event)" />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('6c727f2c.f0c7e9') }}</div>
      <el-select
        :value="value.sourceMode"
        size="small"
        class="w-full"
        @input="updateField('sourceMode', $event)"
      >
        <el-option :label="$t('6c727f2c.68924b')" value="manual" />
        <el-option :label="$t('6c727f2c.d282eb')" value="category" />
      </el-select>
    </section>

    <section v-if="value.sourceMode === 'category'" class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('6c727f2c.ae8c70') }}</div>
      <el-input :value="value.categoryId" size="small" @input="updateField('categoryId', $event)" />
    </section>

    <section v-else class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('6c727f2c.9a6484') }}</div>
      <el-input
        type="textarea"
        :rows="4"
        :value="itemIdsText"
        :placeholder="$t('6c727f2c.d08db5')"
        @input="updateItemIds"
      />
    </section>

    <div class="grid grid-cols-2 gap-3">
      <section class="space-y-2">
        <div class="text-sm text-muted-foreground">{{ $t('6c727f2c.eb22d4') }}</div>
        <el-input-number
          :value="value.columns"
          :min="2"
          :max="6"
          size="small"
          controls-position="right"
          class="!w-full"
          @change="updateField('columns', $event)"
        />
      </section>

      <section class="space-y-2">
        <div class="text-sm text-muted-foreground">{{ $t('6c727f2c.d57936') }}</div>
        <el-input-number
          :value="value.limit"
          :min="1"
          :max="50"
          size="small"
          controls-position="right"
          class="!w-full"
          @change="updateField('limit', $event)"
        />
      </section>
    </div>

    <SectionAppearancePanel :value="value" @change="updateField" />
  </div>
</template>

<script>
import SectionAppearancePanel from './SectionAppearancePanel.vue'

export default {
  name: 'ProductShelfPanel',
  components: { SectionAppearancePanel },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    itemIdsText() {
      return Array.isArray(this.value.itemIds) ? this.value.itemIds.join(',') : ''
    }
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('change', {
        [field]: fieldValue
      })
    },
    updateItemIds(fieldValue) {
      const itemIds = fieldValue
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      this.updateField('itemIds', itemIds)
    }
  }
}
</script>
