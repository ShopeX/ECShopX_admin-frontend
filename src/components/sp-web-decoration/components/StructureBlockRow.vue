<template>
  <div
    :class="[
      'group mt-0 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-[50px] pr-2 text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
      {
        'sp-structure-row-selected': selected
      }
    ]"
    @click="$emit('select', { sectionId, blockId })"
  >
    <div class="min-w-0 flex-1 flex items-center">
      <div
        :class="[
          'inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold transition-colors duration-150',
          disabled ? 'text-[#98a2b3]' : 'text-[#18222f]'
        ]"
      >
        <span class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center">
          <Diamond
            :size="16"
            :class="[
              'shrink-0 opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0',
              disabled ? 'text-[#98a2b3]' : 'text-[#475467]'
            ]"
            :stroke-width="2"
          />
          <span
            data-drag-handle="block"
            class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
          >
            <GripVertical :size="14" :stroke-width="2" />
          </span>
        </span>
        {{ label }}
      </div>
    </div>
    <div
      :class="[
        'flex shrink-0 items-center gap-0.5 transition-opacity duration-150',
        disabled
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
      ]"
    >
      <button
        v-if="canDelete"
        type="button"
        :class="[
          'inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#98a2b3] transition-colors duration-150 hover:bg-[#e8eef6]',
          disabled
            ? 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
            : ''
        ]"
        :title="removeTitle"
        @click.stop="$emit('remove', { sectionId, blockId })"
      >
        <Trash2 :size="16" :stroke-width="2" />
      </button>
      <button
        type="button"
        class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#6b7785] transition-colors duration-150 hover:bg-[#e8eef6]"
        :title="toggleTitle"
        @click.stop="$emit('toggle-disabled', { sectionId, blockId })"
      >
        <EyeOff v-if="disabled" :size="18" :stroke-width="2" />
        <Eye v-else :size="18" :stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<script>
import { Diamond, Eye, EyeOff, GripVertical, Trash2 } from 'lucide-vue'

export default {
  name: 'StructureBlockRow',
  components: {
    Diamond,
    Eye,
    EyeOff,
    GripVertical,
    Trash2
  },
  props: {
    sectionId: {
      type: String,
      required: true
    },
    blockId: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    removeTitle: {
      type: String,
      default: ''
    },
    toggleTitle: {
      type: String,
      default: ''
    }
  }
}
</script>
