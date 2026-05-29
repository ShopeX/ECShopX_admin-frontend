<template>
  <div
    class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
    :style="dockStyle"
  >
    <button
      v-for="item in items"
      :key="item.key || item.type"
      type="button"
      class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
      @click="$emit('select', item)"
    >
      <component
        :is="menuIcon"
        v-if="shouldShowIcon"
        :size="14"
        class="shrink-0 text-[#475467]"
        :stroke-width="2"
      />
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>

<script>
import { Diamond, GalleryVertical } from 'lucide-vue'

export default {
  name: 'StructureInsertMenu',
  components: {
    Diamond,
    GalleryVertical
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    dockStyle: {
      type: Object,
      default: () => ({})
    },
    showIcons: {
      type: Boolean,
      default: false
    },
    iconType: {
      type: String,
      default: '',
      validator: (value) => ['', 'section', 'block'].includes(value)
    }
  },
  computed: {
    shouldShowIcon() {
      return this.showIcons || Boolean(this.iconType)
    },
    menuIcon() {
      if (this.iconType === 'block') return 'Diamond'
      return 'GalleryVertical'
    }
  }
}
</script>
