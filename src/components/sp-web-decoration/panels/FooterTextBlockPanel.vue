<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">标题</div>
      <SpRichTextEditor
        :value="value.title"
        placeholder="请输入标题"
        @input="updateField('title', $event)"
      />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">标题规格</div>
      <el-select
        :value="value.title_size || 'medium'"
        size="small"
        class="w-full"
        @change="updateField('title_size', $event)"
      >
        <el-option value="xsmall" label="特小" />
        <el-option value="small" label="小" />
        <el-option value="medium" label="中" />
        <el-option value="large" label="大" />
        <el-option value="xlarge" label="特大" />
      </el-select>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">内容</div>
      <SpRichTextEditor
        :value="value.content"
        placeholder="请输入内容"
        @input="updateField('content', $event)"
      />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">内容规格</div>
      <el-select
        :value="value.content_size || 'small'"
        size="small"
        class="w-full"
        @change="updateField('content_size', $event)"
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
        :value="value.alignment || 'left'"
        size="small"
        @input="updateField('alignment', $event)"
      >
        <el-radio-button label="left">左</el-radio-button>
        <el-radio-button label="center">中</el-radio-button>
        <el-radio-button label="right">右</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">占列宽度</div>
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
