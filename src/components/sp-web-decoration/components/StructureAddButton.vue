<template>
  <button type="button" :class="buttonClass" @click="$emit('click', $event)">
    <CirclePlus :size="iconSize" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
    <span>{{ label }}</span>
  </button>
</template>

<script>
import { CirclePlus } from 'lucide-vue'

export default {
  name: 'StructureAddButton',
  components: {
    CirclePlus
  },
  props: {
    label: {
      type: String,
      required: true
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
    }
  },
  computed: {
    buttonClass() {
      return [
        'flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent text-sm font-semibold text-[#2563eb] transition-colors duration-150',
        this.align === 'center' ? 'justify-center' : 'justify-start',
        this.relaxed ? 'py-2' : 'py-[7px]',
        this.topSpacing ? 'mt-0.5' : '',
        this.flushStart ? 'pl-0' : '',
        this.align === 'start' ? 'pr-2' : ''
      ]
    }
  }
}
</script>
