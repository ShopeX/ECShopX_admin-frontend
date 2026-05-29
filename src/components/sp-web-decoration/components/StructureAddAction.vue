<template>
  <div :class="containerClass">
    <StructureAddButton
      v-if="visible"
      :label="label"
      :align="align"
      :flush-start="flushStart"
      :top-spacing="topSpacing"
      :relaxed="relaxed"
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
import StructureAddButton from './StructureAddButton.vue'
import StructureInsertMenu from './StructureInsertMenu.vue'

export default {
  name: 'StructureAddAction',
  components: {
    StructureAddButton,
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
    visible: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: 'start',
      validator: (value) => ['start', 'center'].includes(value)
    },
    flushStart: {
      type: Boolean,
      default: false
    },
    topSpacing: {
      type: Boolean,
      default: false
    },
    relaxed: {
      type: Boolean,
      default: false
    },
    iconSize: {
      type: Number,
      default: 14
    },
    container: {
      type: String,
      default: '',
      validator: (value) => ['', 'block', 'section', 'empty'].includes(value)
    }
  },
  computed: {
    iconType() {
      return this.container === 'block' ? 'block' : 'section'
    },
    containerClass() {
      if (this.container === 'block') {
        return 'relative pl-[52px]'
      }
      if (this.container === 'section') {
        return 'relative mt-1 px-2 pb-0.5 pl-[34px]'
      }
      if (this.container === 'empty') {
        return 'relative w-full max-w-[240px]'
      }
      return 'relative'
    }
  }
}
</script>
