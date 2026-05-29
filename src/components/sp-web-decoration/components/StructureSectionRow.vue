<template>
  <div
    :class="[
      'group flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
      { 'sp-structure-row-selected': selected }
    ]"
    @click="$emit('select', sectionId)"
  >
    <button
      v-if="expandable && showExpandIcon"
      type="button"
      class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
      @click.stop="$emit('toggle', sectionId)"
    >
      <ChevronDown v-if="expanded" :size="14" :stroke-width="2" />
      <ChevronRight v-else :size="14" :stroke-width="2" />
    </button>

    <span
      v-else-if="expandable"
      class="flex h-[18px] w-[18px] shrink-0 items-center justify-center opacity-0"
      aria-hidden="true"
    />

    <span
      v-else-if="dragHandle"
      :data-drag-handle="dragHandle"
      class="inline-flex h-[18px] w-[18px] shrink-0 cursor-move items-center justify-center text-[#6b7785]"
    >
      <GripVertical :size="14" :stroke-width="2" />
    </span>

    <div class="min-w-0 flex-1 flex items-center">
      <div
        class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
      >
        <span class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center">
          <GalleryVertical
            :size="16"
            class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
            :stroke-width="2"
          />
          <span
            :data-drag-handle="dragHandle || null"
            class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
            aria-hidden="true"
          >
            <GripVertical :size="14" :stroke-width="2" />
          </span>
        </span>
        {{ label }}
      </div>
    </div>

    <div
      v-if="showActions"
      class="flex shrink-0 items-center gap-0.5 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
    >
      <button
        v-if="canDelete"
        type="button"
        class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#98a2b3] transition-colors duration-150 hover:bg-[#e8eef6]"
        :title="removeTitle"
        @click.stop="$emit('remove', sectionId)"
      >
        <Trash2 :size="16" :stroke-width="2" />
      </button>
      <button
        v-if="canToggleDisabled"
        type="button"
        class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#6b7785] transition-colors duration-150 hover:bg-[#e8eef6]"
        :title="toggleTitle"
        @click.stop="$emit('toggle-disabled', sectionId)"
      >
        <EyeOff v-if="disabled" :size="18" :stroke-width="2" />
        <Eye v-else :size="18" :stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<script>
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  GalleryVertical,
  GripVertical,
  Trash2
} from 'lucide-vue'

export default {
  name: 'StructureSectionRow',
  components: {
    ChevronDown,
    ChevronRight,
    Eye,
    EyeOff,
    GalleryVertical,
    GripVertical,
    Trash2
  },
  props: {
    sectionId: {
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
    expanded: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: true
    },
    showExpandIcon: {
      type: Boolean,
      default: true
    },
    dragHandle: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: false
    },
    canToggleDisabled: {
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
  },
  computed: {
    showActions() {
      return this.canDelete || this.canToggleDisabled
    }
  }
}
</script>
