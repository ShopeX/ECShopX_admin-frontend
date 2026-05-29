<template>
  <div :class="containerClass">
    <StructureInsertGap
      :label="label"
      :block="block"
      :icon-size="iconSize"
      @click="$emit('open', $event)"
    />
    <StructureInsertMenu
      v-if="open"
      :items="items"
      :dock-style="dockStyle"
      :show-icons="showIcons"
      :icon-type="iconType"
      @select="$emit('select', $event)"
    />
  </div>
</template>

<script>
import StructureInsertGap from './StructureInsertGap.vue'
import StructureInsertMenu from './StructureInsertMenu.vue'

export default {
  name: 'StructureInsertPoint',
  components: {
    StructureInsertGap,
    StructureInsertMenu
  },
  props: {
    label: {
      type: String,
      required: true
    },
    open: {
      type: Boolean,
      default: false
    },
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
    block: {
      type: Boolean,
      default: false
    },
    iconSize: {
      type: Number,
      default: 12
    },
    indent: {
      type: String,
      default: '',
      validator: (value) => ['', 'block'].includes(value)
    },
    layer: {
      type: String,
      default: 'section',
      validator: (value) => ['section', 'block'].includes(value)
    }
  },
  computed: {
    iconType() {
      return this.layer === 'block' || this.block ? 'block' : 'section'
    },
    containerClass() {
      return [
        'relative py-0',
        this.layer === 'section' ? 'z-[3]' : 'z-[2]',
        this.indent === 'block' ? 'pl-[50px]' : ''
      ]
    }
  }
}
</script>
