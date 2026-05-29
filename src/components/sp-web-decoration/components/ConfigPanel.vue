<template>
  <div class="h-full flex min-h-0 flex-col border-l border-border bg-card">
    <div
      class="flex min-h-[44px] items-center justify-between gap-2.5 border-b border-border px-[14px] py-[8px]"
    >
      <div class="text-[14px] font-semibold text-foreground">
        {{ panelTitle }}
      </div>
    </div>

    <div class="flex-1 overflow-auto px-[14px] pb-[18px] pt-3">
      <div
        v-if="!section"
        class="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-border bg-background-deep p-6 text-center text-muted-foreground"
      >
        {{ $t('250dc970.b2fac9') }}
      </div>

      <template v-else>
        <div
          v-if="showLockedSectionNotice"
          class="rounded-lg border border-dashed border-[#d7dde7] bg-[#fbfbfc] p-4 text-sm leading-6 text-[#6b7785]"
        >
          这是页面固定业务组件，会在前台渲染原有商品列表逻辑。可在结构树中调整它与其他装修组件的顺序，但不能编辑、隐藏、复制或删除。
        </div>

        <component
          :is="currentPanel"
          v-else-if="currentPanel"
          :section="section"
          :block="block"
          :value="currentValue"
          @change="handleChange"
          @change-section="$emit('update-section', $event)"
          @select-block="$emit('select-block', $event)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import CarouselPanel from '../panels/CarouselPanel.vue'
import ImageHotspotPanel from '../panels/ImageHotspotPanel.vue'
import ProductShelfPanel from '../panels/ProductShelfPanel.vue'
import ProductTabShelfPanel from '../panels/ProductTabShelfPanel.vue'
import HeaderPanel from '../panels/HeaderPanel.vue'
import FooterPanel from '../panels/FooterPanel.vue'
import AnnouncementBarPanel from '../panels/AnnouncementBarPanel.vue'
import ImageBlockPanel from '../panels/ImageBlockPanel.vue'
import VideoBlockPanel from '../panels/VideoBlockPanel.vue'
import HotspotBlockPanel from '../panels/HotspotBlockPanel.vue'
import NavItemBlockPanel from '../panels/NavItemBlockPanel.vue'
import FooterLinkBlockPanel from '../panels/FooterLinkBlockPanel.vue'
import FooterMenuBlockPanel from '../panels/FooterMenuBlockPanel.vue'
import FooterImageBlockPanel from '../panels/FooterImageBlockPanel.vue'
import FooterTextBlockPanel from '../panels/FooterTextBlockPanel.vue'
import AnnouncementBlockPanel from '../panels/AnnouncementBlockPanel.vue'
import ProductTabBlockPanel from '../panels/ProductTabBlockPanel.vue'

import {
  getTypedSectionDefinition as getSectionDefinition,
  getTypedBlockDefinition as getBlockDefinition
} from '../definitions/registry.js'

const sectionPanelMap = {
  'announcement-bar': AnnouncementBarPanel,
  header: HeaderPanel,
  footer: FooterPanel,
  'main-carousel': CarouselPanel,
  carousel: CarouselPanel,
  'image-hotspot': ImageHotspotPanel,
  'product-shelf': ProductShelfPanel,
  'product-tab-shelf': ProductTabShelfPanel
}

const blockPanelMap = {
  announcement: AnnouncementBlockPanel,
  image: ImageBlockPanel,
  video: VideoBlockPanel,
  hotspot: HotspotBlockPanel,
  'nav-item': NavItemBlockPanel,
  'footer-link': FooterLinkBlockPanel,
  'footer-menu': FooterMenuBlockPanel,
  'footer-image': FooterImageBlockPanel,
  'footer-text': FooterTextBlockPanel,
  'product-tab': ProductTabBlockPanel
}

export default {
  name: 'ConfigPanel',
  components: {
    CarouselPanel,
    ImageHotspotPanel,
    ProductShelfPanel,
    ProductTabShelfPanel,
    HeaderPanel,
    FooterPanel,
    AnnouncementBarPanel,
    ImageBlockPanel,
    VideoBlockPanel,
    HotspotBlockPanel,
    NavItemBlockPanel,
    FooterLinkBlockPanel,
    FooterMenuBlockPanel,
    FooterImageBlockPanel,
    FooterTextBlockPanel,
    AnnouncementBlockPanel,
    ProductTabBlockPanel
  },
  props: {
    section: {
      type: Object,
      default: null
    },
    block: {
      type: Object,
      default: null
    }
  },
  computed: {
    currentPanel() {
      if (this.block) {
        return blockPanelMap[this.block.type] || null
      }
      return this.section ? sectionPanelMap[this.section.type] || null : null
    },
    currentValue() {
      if (this.block) return this.block.settings
      return this.section ? this.section.settings : null
    },
    showLockedSectionNotice() {
      return (
        !this.block &&
        this.section &&
        (this.section.locked === true ||
          this.section.settings?.locked === true ||
          this.section.type === 'native-product-list')
      )
    },
    sectionTitle() {
      if (!this.section) return ''
      const definition = getSectionDefinition(this.section.type)
      return this.section.settings?.title || definition?.name || this.$t(this.section.titleKey)
    },
    blockTitle() {
      if (!this.block) return ''
      const definition = getBlockDefinition(this.block.type)
      return (
        this.block.settings?.label ||
        definition?.name ||
        this.$t(definition?.titleKey || '250dc970.7f56ad')
      )
    },
    panelTitle() {
      if (this.block && this.section) {
        return `${this.sectionTitle}-${this.blockTitle}`
      }
      if (this.section) {
        return this.sectionTitle
      }
      return this.$t('250dc970.6aab38')
    }
  },
  methods: {
    handleChange(payload) {
      if (this.block) {
        this.$emit('update-block', payload)
        return
      }
      this.$emit('update-settings', payload)
    }
  }
}
</script>
