<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('9fc805ea.32c65d') }}</div>
      <SpRichTextEditor
        :value="value.title"
        :placeholder="$t('9fc805ea.96641a')"
        @input="updateField('title', $event)"
      />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('9fc805ea.2eec6e') }}</div>
      <el-select
        :value="value.title_size || 'medium'"
        size="small"
        class="w-full"
        @change="updateField('title_size', $event)"
      >
        <el-option value="xsmall" :label="$t('9fc805ea.f72ce9')" />
        <el-option value="small" :label="$t('9fc805ea.391b8f')" />
        <el-option value="medium" :label="$t('9fc805ea.aed1df')" />
        <el-option value="large" :label="$t('9fc805ea.ab18e3')" />
        <el-option value="xlarge" :label="$t('9fc805ea.3386da')" />
      </el-select>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('9fc805ea.2d711b') }}</div>
      <SpRichTextEditor
        :value="value.content"
        :placeholder="$t('9fc805ea.a11cc7')"
        @input="updateField('content', $event)"
      />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('9fc805ea.fecac4') }}</div>
      <el-select
        :value="value.content_size || 'small'"
        size="small"
        class="w-full"
        @change="updateField('content_size', $event)"
      >
        <el-option value="xsmall" :label="$t('9fc805ea.f72ce9')" />
        <el-option value="small" :label="$t('9fc805ea.391b8f')" />
        <el-option value="medium" :label="$t('9fc805ea.aed1df')" />
        <el-option value="large" :label="$t('9fc805ea.ab18e3')" />
        <el-option value="xlarge" :label="$t('9fc805ea.3386da')" />
      </el-select>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('9fc805ea.d5bc35') }}</div>
      <el-radio-group
        :value="value.alignment || 'left'"
        size="small"
        @input="updateField('alignment', $event)"
      >
        <el-radio-button label="left">{{ $t('9fc805ea.d2aff1') }}</el-radio-button>
        <el-radio-button label="center">{{ $t('9fc805ea.aed1df') }}</el-radio-button>
        <el-radio-button label="right">{{ $t('9fc805ea.4d9c32') }}</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('9fc805ea.3f7bf6') }}</div>
      <div class="flex items-center gap-3">
        <el-input-number
          :value="value.column_span || 6"
          :min="1"
          :max="12"
          size="small"
          controls-position="right"
          class="!w-[88px]"
          @change="updateField('column_span', $event)"
        />
        <el-slider
          :value="value.column_span || 6"
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
import SpRichTextEditor from '@/components/sp-rich-text-editor/index.vue'

export default {
  name: 'FooterTextBlockPanel',
  components: { SpRichTextEditor },
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
