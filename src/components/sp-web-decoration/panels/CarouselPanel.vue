<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">图片高度</div>
      <el-radio-group
        :value="settings.image_height"
        size="small"
        @input="updateField('image_height', $event)"
      >
        <el-radio-button label="small">小</el-radio-button>
        <el-radio-button label="medium">中</el-radio-button>
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="adapt">适配屏幕</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">分页样式</div>
      <el-radio-group
        :value="settings.paginate_type"
        size="small"
        @input="updateField('paginate_type', $event)"
      >
        <el-radio-button label="point">轮播点</el-radio-button>
        <el-radio-button label="counter">计数器</el-radio-button>
        <el-radio-button label="number">页码</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">分页规格</div>
      <el-radio-group
        :value="settings.paginate_size"
        size="small"
        @input="updateField('paginate_size', $event)"
      >
        <el-radio-button label="small">小</el-radio-button>
        <el-radio-button label="medium">中</el-radio-button>
        <el-radio-button label="large">大</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-3">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-muted-foreground">自动轮播</span>
        <el-switch
          :value="settings.enable_auto_play"
          @input="updateField('enable_auto_play', $event)"
        />
      </div>

      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-muted-foreground">轮播翻页按钮</span>
        <el-switch :value="settings.enable_arrow" @input="updateField('enable_arrow', $event)" />
      </div>
    </section>

    <section v-if="settings.enable_auto_play" class="space-y-2">
      <div class="text-sm text-muted-foreground">幻灯片更换时间</div>
      <div class="flex items-center gap-3">
        <el-input-number
          class="!w-[88px]"
          :value="settings.interval"
          :min="3"
          :max="9"
          size="small"
          controls-position="right"
          @change="updateField('interval', $event)"
        />
        <span class="text-xs text-muted-foreground">秒</span>
        <el-slider
          class="min-w-0 flex-1 pl-1"
          :value="settings.interval"
          :min="3"
          :max="9"
          :step="1"
          :show-tooltip="false"
          @input="updateField('interval', $event)"
        />
      </div>
    </section>

    <SectionAppearancePanel :value="settings" @change="updateField" />
  </div>
</template>

<script>
import SectionAppearancePanel from './SectionAppearancePanel.vue'
import { normalizeTypedSectionSettings } from '../utils/panelState.js'

export default {
  name: 'CarouselPanel',
  components: {
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
      return normalizeTypedSectionSettings('main-carousel', this.value)
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
