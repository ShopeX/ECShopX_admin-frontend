<template>
  <div class="sp-rich-text-editor" :class="{ 'is-disabled': disabled }">
    <div class="sp-rte-toolbar">
      <button
        class="sp-rte-btn"
        :class="{ 'is-active': states.bold }"
        type="button"
        title="粗体"
        @mousedown.prevent
        @click="execCmd('bold')"
      >
        <Bold :size="14" :stroke-width="2.6" />
      </button>
      <button
        class="sp-rte-btn sp-rte-btn--italic"
        :class="{ 'is-active': states.italic }"
        type="button"
        title="斜体"
        @mousedown.prevent
        @click="execCmd('italic')"
      >
        <Italic :size="14" :stroke-width="2.6" />
      </button>
      <div class="sp-rte-color-wrap">
        <span
          class="sp-rte-color-label"
          :style="{ color: currentColor }"
          @mousedown.prevent="saveSelection"
          @click="openColorPicker"
        >
          <Palette :size="14" :stroke-width="2.2" />
        </span>
        <el-color-picker
          ref="colorPicker"
          v-model="currentColor"
          class="sp-rte-color-picker"
          size="mini"
          :predefine="predefineColors"
          @change="applyColor"
        />
      </div>
    </div>

    <div
      ref="editor"
      class="sp-rte-content"
      :contenteditable="String(!disabled)"
      :style="editorStyle"
      :data-placeholder="placeholder"
      @input="onInput"
      @keyup="updateStates"
      @mouseup="updateStates"
      @blur="onBlur"
      @focus="$emit('focus')"
    />
  </div>
</template>

<script>
import { Bold, Italic, Palette } from 'lucide-vue'

export default {
  name: 'SpRichTextEditor',
  components: {
    Bold,
    Italic,
    Palette
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      states: {
        bold: false,
        italic: false
      },
      currentColor: '#000000',
      savedRange: null,
      predefineColors: [
        '#000000',
        '#FFFFFF',
        '#9E9E9E',
        '#F44336',
        '#FF9800',
        '#FFEB3B',
        '#4CAF50',
        '#00BCD4',
        '#2196F3',
        '#9C27B0',
        '#795548',
        '#FF5722'
      ]
    }
  },
  computed: {
    editorStyle() {
      return this.height ? { minHeight: this.height } : null
    }
  },
  watch: {
    value(newVal) {
      if (this.$refs.editor && this.$refs.editor.innerHTML !== newVal) {
        this.$refs.editor.innerHTML = newVal || ''
      }
    }
  },
  mounted() {
    this.$refs.editor.innerHTML = this.value || ''
    document.addEventListener('selectionchange', this.saveSelection)
  },
  beforeDestroy() {
    document.removeEventListener('selectionchange', this.saveSelection)
  },
  methods: {
    execCmd(cmd) {
      if (this.disabled) return
      this.focusEditor()
      document.execCommand(cmd, false, null)
      this.updateStates()
      this.emitInput()
    },
    updateStates() {
      if (this.disabled) return
      this.states.bold = document.queryCommandState('bold')
      this.states.italic = document.queryCommandState('italic')
      const color = document.queryCommandValue('foreColor')
      if (color) this.currentColor = this.rgbToHex(color)
      this.saveSelection()
    },
    saveSelection() {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      if (!this.$refs.editor.contains(range.commonAncestorContainer)) return
      this.savedRange = range.cloneRange()
    },
    restoreSelection() {
      if (!this.savedRange) return
      const selection = window.getSelection()
      if (!selection) return
      selection.removeAllRanges()
      selection.addRange(this.savedRange)
    },
    focusEditor() {
      this.$refs.editor.focus()
      this.restoreSelection()
      document.execCommand('styleWithCSS', false, true)
    },
    applyColor(color) {
      if (this.disabled || !color) return
      this.focusEditor()
      document.execCommand('foreColor', false, color)
      this.currentColor = color
      this.emitInput()
      this.updateStates()
    },
    openColorPicker() {
      if (this.disabled) return
      this.saveSelection()
      this.$nextTick(() => {
        const trigger =
          this.$refs.colorPicker &&
          this.$refs.colorPicker.$el.querySelector('.el-color-picker__trigger')
        if (trigger) trigger.click()
      })
    },
    onInput() {
      this.saveSelection()
      this.emitInput()
    },
    onBlur() {
      this.saveSelection()
      this.$emit('blur')
      this.$emit('change', this.$refs.editor.innerHTML)
    },
    emitInput() {
      this.$emit('input', this.$refs.editor.innerHTML)
    },
    rgbToHex(color) {
      if (color.startsWith('#')) return color
      const match = color.match(/\d+/g)
      if (!match || match.length < 3) return '#000000'
      return `#${match
        .slice(0, 3)
        .map((value) => Number(value).toString(16).padStart(2, '0'))
        .join('')}`
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-rich-text-editor {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: var(--primary, #409eff);
    box-shadow: none;
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;

    .sp-rte-toolbar,
    .sp-rte-content {
      pointer-events: none;
    }
  }
}

.sp-rte-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 36px;
  padding: 4px 12px;
  border-bottom: 1px solid #edf0f5;
  background: #fff;
}

.sp-rte-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: #5f646d;
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  &:hover {
    background: #f4f6f9;
    border-color: transparent;
  }

  &.is-active {
    background: #f4f6f9;
    border-color: transparent;
    color: #191a1d;
  }
}

.sp-rte-color-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  color: #5f646d;

  &:hover {
    background: #f4f6f9;
  }

  .sp-rte-color-picker {
    width: 0;
    height: 0;
    overflow: hidden;
  }

  ::v-deep .el-color-picker__trigger {
    width: 0;
    height: 0;
    border: none;
    padding: 0;
    opacity: 0;
  }

  ::v-deep .el-color-picker__color {
    border-radius: 2px;
  }
}

.sp-rte-color-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  user-select: none;
}

.sp-rte-content {
  min-height: 36px;
  padding: 6px 12px;
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
  word-break: break-all;
  overflow: visible;

  &:empty::before {
    content: attr(data-placeholder);
    color: #b8c0cc;
    pointer-events: none;
  }
}
</style>
