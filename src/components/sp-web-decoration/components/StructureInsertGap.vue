<template>
  <div
    :class="['sp-structure-insert-gap', { 'sp-structure-insert-gap--block': block }]"
    @click.stop="$emit('click', $event)"
  >
    <div class="sp-structure-insert-gap__line" aria-hidden="true" />
    <button
      type="button"
      :class="['sp-structure-insert-gap__btn', { 'sp-structure-insert-gap__btn--block': block }]"
    >
      <Plus :size="iconSize" class="shrink-0 text-white" :stroke-width="2.5" />
      <span>{{ label }}</span>
    </button>
  </div>
</template>

<script>
import { Plus } from 'lucide-vue'

export default {
  name: 'StructureInsertGap',
  components: {
    Plus
  },
  props: {
    label: {
      type: String,
      required: true
    },
    block: {
      type: Boolean,
      default: false
    },
    iconSize: {
      type: Number,
      default: 12
    }
  }
}
</script>

<style scoped>
.sp-structure-insert-gap {
  position: relative;
  display: flex;
  height: 6px;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.sp-structure-insert-gap__line {
  position: absolute;
  left: 10px;
  right: 10px;
  top: 50%;
  margin-top: -1px;
  border-top: 1px dashed #2563eb;
  opacity: 0;
  transition: opacity 0.12s ease;
  pointer-events: none;
}

.sp-structure-insert-gap:hover .sp-structure-insert-gap__line {
  opacity: 1;
}

.sp-structure-insert-gap__btn {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  padding: 4px 12px;
  border: 0;
  border-radius: 9999px;
  background: #2563eb;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.28);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
}

.sp-structure-insert-gap:hover .sp-structure-insert-gap__btn {
  opacity: 1;
  pointer-events: auto;
}

.sp-structure-insert-gap__btn--block {
  font-size: 12px;
  padding: 4px 12px;
}
</style>
