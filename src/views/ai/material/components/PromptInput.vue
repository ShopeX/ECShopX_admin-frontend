<template>
  <div class="prompt-input-wrap" :class="{ 'is-disabled': disabled }">
    <div
      ref="editor"
      class="prompt-editor"
      :class="{ 'is-empty': isEmpty }"
      :contenteditable="!disabled"
      :data-placeholder="placeholder"
      :style="rootStyle"
      @input="onInput"
      @keydown="onKeyDown"
      @paste="onPaste"
      @compositionstart="composing = true"
      @compositionend="onComposeEnd"
      @blur="onBlur"
    />

    <!-- @ 候选弹窗：mounted 时被搬到 body，避免父级 transform/overflow 影响 fixed 定位 -->
    <div ref="popHost" class="prompt-mention-host">
      <div
        v-if="mentionOpen && mentionFiltered.length > 0"
        class="prompt-mention-pop"
        :style="mentionStyle"
        @mousedown.prevent
      >
        <div
          v-for="(it, i) in mentionFiltered"
          :key="it.kind + '|' + it.url"
          class="mention-item"
          :class="{ active: i === mentionActive }"
          @mouseenter="mentionActive = i"
          @click="pickMention(i)"
        >
          <span class="m-thumb" :class="'k-' + it.kind">
            <img v-if="it.kind === 'image'" :src="it.url" alt="" />
            <video v-else-if="it.kind === 'video'" :src="it.url" muted preload="metadata" />
            <i v-else class="el-icon-headset"></i>
          </span>
          <span class="m-label">{{ it.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { atRefRegex, LABEL_KIND_MAP } from '../utils/refItems'

/**
 * 富文本提示词输入框：
 *   - 对外契约仍是字符串 v-model（兼容现有 form.prompt）
 *   - 内部使用 contenteditable，把 @视频1 / @图片2 / @音频3 这类引用渲染为不可拆分的 chip
 *   - chip 持久标识 = data-kind + data-url；显示标签按 props.items 实时重算
 *   - props.items 变更时，对应 URL 已不在列表的 chip 静默从 DOM 移除（同时 emit 新文本）
 *   - 回填字符串时，按 @(图片|视频|音频)\d+ 正则反向解析为 chip（命中 items 即 chip，否则保留字面量）
 *
 * 防回环：emit 之前记录 lastEmitted；watch(value) 收到与 lastEmitted 相同的文本时跳过整体重渲，
 * 避免抢光标。
 */
export default {
  name: 'PromptInput',
  props: {
    value: { type: String, default: '' },
    items: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    minRows: { type: Number, default: 2 },
    maxRows: { type: Number, default: 6 },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      composing: false,
      mentionOpen: false,
      mentionActive: 0,
      mentionFilter: '',
      mentionAnchorNode: null,
      mentionAnchorOffset: 0,
      mentionPos: { x: 0, y: 0 },
      isEmpty: !(this.value || '').trim().length,
      lastEmitted: this.value || '',
      syncing: false
    }
  },
  computed: {
    rootStyle() {
      const lh = 22
      return {
        minHeight: this.minRows * lh + 'px',
        maxHeight: this.maxRows * lh + 'px'
      }
    },
    mentionStyle() {
      return { left: this.mentionPos.x + 'px', top: this.mentionPos.y + 'px' }
    },
    mentionFiltered() {
      const q = (this.mentionFilter || '').trim().toLowerCase()
      if (!q) return this.items
      return this.items.filter((it) => it.label.toLowerCase().includes(q))
    }
  },
  watch: {
    value(v) {
      if (this.syncing) return
      const next = v || ''
      if (next === this.lastEmitted) return
      this.syncing = true
      this.renderFromText(next)
      this.$nextTick(() => {
        this.syncing = false
      })
    },
    items: {
      deep: true,
      handler() {
        this.syncChips()
      }
    }
  },
  mounted() {
    this.renderFromText(this.value || '')
    // 将候选弹窗挂到 body，避免父级 transform/sticky 让 position:fixed 失效（飘到顶部）
    if (this.$refs.popHost && this.$refs.popHost.parentNode !== document.body) {
      document.body.appendChild(this.$refs.popHost)
    }
    document.addEventListener('mousedown', this.onDocMouseDown, true)
    window.addEventListener('scroll', this.onWindowChange, true)
    window.addEventListener('resize', this.onWindowChange)
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.onDocMouseDown, true)
    window.removeEventListener('scroll', this.onWindowChange, true)
    window.removeEventListener('resize', this.onWindowChange)
    if (this.$refs.popHost && this.$refs.popHost.parentNode === document.body) {
      document.body.removeChild(this.$refs.popHost)
    }
  },
  methods: {
    /** 暴露给父组件的聚焦方法（与 el-input 对齐） */
    focus() {
      this.$nextTick(() => {
        if (this.$refs.editor) this.$refs.editor.focus()
      })
    },

    // ---------- 文本提取 ----------
    extractText(root) {
      let text = ''
      if (!root) return text
      root.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList && node.classList.contains('ref-chip')) {
            text += '@' + (node.getAttribute('data-label') || '')
          } else if (node.tagName === 'BR') {
            text += '\n'
          } else {
            text += this.extractText(node)
          }
        }
      })
      return text
    },
    emitText() {
      const t = this.extractText(this.$refs.editor)
      this.lastEmitted = t
      // 浏览器在清空 contenteditable 时常残留 <br> 等，导致 t === '\n'，所以用 trim 判空
      this.isEmpty = !t.trim().length
      this.$emit('input', t)
    },

    // ---------- chip DOM ----------
    createChipNode(item) {
      const chip = document.createElement('span')
      chip.className = 'ref-chip k-' + item.kind
      chip.contentEditable = 'false'
      chip.setAttribute('data-url', item.url)
      chip.setAttribute('data-kind', item.kind)
      chip.setAttribute('data-label', item.label)

      const thumb = document.createElement('span')
      thumb.className = 'chip-thumb'
      if (item.kind === 'image') {
        const img = document.createElement('img')
        img.src = item.url
        img.alt = ''
        thumb.appendChild(img)
      } else if (item.kind === 'video') {
        const v = document.createElement('video')
        v.src = item.url
        v.muted = true
        v.preload = 'metadata'
        thumb.appendChild(v)
      } else {
        const i = document.createElement('i')
        i.className = 'el-icon-headset chip-icon'
        thumb.appendChild(i)
      }
      chip.appendChild(thumb)

      const label = document.createElement('span')
      label.className = 'chip-text'
      label.textContent = '@' + item.label
      chip.appendChild(label)

      return chip
    },

    // ---------- 由字符串重建编辑器内容 ----------
    renderFromText(text) {
      const editor = this.$refs.editor
      if (!editor) return
      editor.innerHTML = ''
      const re = atRefRegex()
      let lastIdx = 0
      let m
      const t = text || ''
      while ((m = re.exec(t)) !== null) {
        const start = m.index
        if (start > lastIdx) {
          editor.appendChild(document.createTextNode(t.slice(lastIdx, start)))
        }
        const kind = LABEL_KIND_MAP[m[1]]
        const expectedLabel = m[1] + m[2]
        const item = this.items.find((it) => it.kind === kind && it.label === expectedLabel)
        if (item) {
          editor.appendChild(this.createChipNode(item))
        } else {
          editor.appendChild(document.createTextNode(m[0]))
        }
        lastIdx = re.lastIndex
      }
      if (lastIdx < t.length) {
        editor.appendChild(document.createTextNode(t.slice(lastIdx)))
      }
      this.lastEmitted = t
      this.isEmpty = !t.trim().length
    },

    // ---------- items 变更：刷新或剔除 chip ----------
    syncChips() {
      const editor = this.$refs.editor
      if (!editor) return
      const chips = editor.querySelectorAll('.ref-chip')
      if (!chips.length) return
      const itemsMap = new Map(this.items.map((it) => [it.kind + '|' + it.url, it]))
      let mutated = false
      chips.forEach((chip) => {
        const key =
          (chip.getAttribute('data-kind') || '') + '|' + (chip.getAttribute('data-url') || '')
        const item = itemsMap.get(key)
        if (!item) {
          chip.remove()
          mutated = true
          return
        }
        if (chip.getAttribute('data-label') !== item.label) {
          const text = chip.querySelector('.chip-text')
          if (text) text.textContent = '@' + item.label
          chip.setAttribute('data-label', item.label)
          mutated = true
        }
      })
      if (mutated) this.emitText()
    },

    // ---------- 输入事件 ----------
    onInput() {
      if (this.composing) return
      this.detectMentionContext()
      this.emitText()
    },
    onComposeEnd() {
      this.composing = false
      this.detectMentionContext()
      this.emitText()
    },
    onKeyDown(e) {
      if (this.mentionOpen && this.mentionFiltered.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          this.mentionActive = (this.mentionActive + 1) % this.mentionFiltered.length
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          this.mentionActive =
            (this.mentionActive - 1 + this.mentionFiltered.length) % this.mentionFiltered.length
          return
        }
        if (e.key === 'Enter' && !this.composing) {
          e.preventDefault()
          this.pickMention(this.mentionActive)
          return
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          this.closeMention()
          return
        }
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.$emit('enter')
      }
    },
    onPaste(e) {
      e.preventDefault()
      const cd = e.clipboardData || window.clipboardData
      if (!cd) return
      const text = cd.getData('text/plain')
      if (text) {
        document.execCommand('insertText', false, text)
      }
    },
    onBlur() {
      // 延迟关闭，留给候选项 click 事件抢先触发
      setTimeout(() => {
        this.closeMention()
      }, 150)
    },
    onDocMouseDown(e) {
      if (!this.mentionOpen) return
      // 弹窗已被搬到 body，所以从 popHost 取
      const host = this.$refs.popHost
      if (host && host.contains(e.target)) return
      if (this.$refs.editor && this.$refs.editor.contains(e.target)) return
      this.closeMention()
    },
    onWindowChange() {
      if (this.mentionOpen) this.updateMentionPos()
    },

    // ---------- mention 弹窗 ----------
    detectMentionContext() {
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return this.closeMention()
      const range = sel.getRangeAt(0)
      const node = range.startContainer
      if (!this.$refs.editor || !this.$refs.editor.contains(node)) return this.closeMention()
      // chip 内部不触发
      if (this.isInsideChip(node)) return this.closeMention()
      if (node.nodeType !== Node.TEXT_NODE) return this.closeMention()
      const text = node.textContent.slice(0, range.startOffset)
      const at = text.lastIndexOf('@')
      if (at < 0) return this.closeMention()
      const filter = text.slice(at + 1)
      if (/\s/.test(filter)) return this.closeMention()
      // 限制过滤词最多 16 个字符，避免无效大段匹配
      if (filter.length > 16) return this.closeMention()
      this.mentionAnchorNode = node
      this.mentionAnchorOffset = at
      this.mentionFilter = filter
      this.mentionActive = 0
      this.mentionOpen = true
      this.$nextTick(() => this.updateMentionPos())
    },
    isInsideChip(node) {
      let p = node
      while (p && p !== this.$refs.editor) {
        if (p.nodeType === Node.ELEMENT_NODE && p.classList && p.classList.contains('ref-chip')) {
          return true
        }
        p = p.parentNode
      }
      return false
    },
    updateMentionPos() {
      const editor = this.$refs.editor
      if (!editor) return
      const editorRect = editor.getBoundingClientRect()
      // 默认锚到编辑框（chat 风格上浮），caret rect 仅做"水平贴近"修正——
      // contenteditable 的 collapsed range 在不少浏览器上会返回 0×0，所以不能依赖它定 y 轴
      let caretLeft = editorRect.left
      try {
        const sel = window.getSelection()
        if (sel && sel.rangeCount) {
          const r = sel.getRangeAt(0).cloneRange()
          r.collapse(true)
          const cr = r.getBoundingClientRect()
          if (cr && (cr.left || cr.right)) caretLeft = cr.left
        }
      } catch (e) {
        /* ignore */
      }

      const itemH = 36
      const padding = 8
      const popH = Math.min(240, this.mentionFiltered.length * itemH + padding)
      const popW = 220

      // 优先放在输入框上方；上方放不下再放下方
      let top = editorRect.top - popH - 6
      if (top < 8) top = editorRect.bottom + 6

      let left = caretLeft
      if (left + popW > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - popW - 8)
      }
      if (left < 8) left = 8

      this.mentionPos = { x: left, y: top }
    },
    pickMention(i) {
      const item = this.mentionFiltered[i]
      if (!item) return this.closeMention()
      const node = this.mentionAnchorNode
      const at = this.mentionAnchorOffset
      if (!node || !node.parentNode) return this.closeMention()
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return this.closeMention()
      const range = sel.getRangeAt(0)
      const text = node.textContent
      const endOffset = range.startContainer === node ? range.startOffset : text.length
      const before = text.slice(0, at)
      const after = text.slice(endOffset)
      const parent = node.parentNode

      const frag = document.createDocumentFragment()
      if (before) frag.appendChild(document.createTextNode(before))
      const chip = this.createChipNode(item)
      frag.appendChild(chip)
      // 在 chip 后追加一个空格，保证插入符可继续编辑
      const tail = document.createTextNode(' ' + after)
      frag.appendChild(tail)
      parent.replaceChild(frag, node)

      const newRange = document.createRange()
      newRange.setStart(tail, 1)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)

      this.closeMention()
      this.emitText()
    },
    closeMention() {
      this.mentionOpen = false
      this.mentionAnchorNode = null
      this.mentionFilter = ''
    }
  }
}
</script>

<style scoped>
.prompt-input-wrap {
  position: relative;
  width: 100%;
}
.prompt-input-wrap.is-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.prompt-editor {
  width: 100%;
  padding: 6px 4px;
  font-size: 14px;
  line-height: 22px;
  color: #303133;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
.prompt-editor.is-empty:before {
  content: attr(data-placeholder);
  color: #c0c4cc;
  pointer-events: none;
  display: block;
}

/* —— chip：行内 inline 元素 —— */
.prompt-editor >>> .ref-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 6px 1px 2px;
  margin: 0 1px;
  background: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  vertical-align: middle;
  font-size: 13px;
  line-height: 18px;
  color: #409eff;
  user-select: none;
  cursor: default;
}
.prompt-editor >>> .ref-chip .chip-thumb {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  overflow: hidden;
  background: #f5f7fa;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.prompt-editor >>> .ref-chip .chip-thumb img,
.prompt-editor >>> .ref-chip .chip-thumb video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.prompt-editor >>> .ref-chip .chip-icon {
  font-size: 12px;
  color: #409eff;
}
.prompt-editor >>> .ref-chip .chip-text {
  font-size: 13px;
  color: #409eff;
  line-height: 1;
}

/* host 占位（无可视样式）：只是 mounted 后被搬到 body 的容器 */
.prompt-mention-host {
  position: absolute;
  width: 0;
  height: 0;
  overflow: visible;
}
</style>

<!-- 弹窗会被 mounted 时搬到 document.body，scoped 选择器不再生效，所以这里用非 scoped 全局样式 -->
<style>
.prompt-mention-pop {
  position: fixed;
  z-index: 3000;
  min-width: 180px;
  max-width: 260px;
  max-height: 240px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
}
.prompt-mention-pop .mention-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 13px;
  color: #303133;
}
.prompt-mention-pop .mention-item.active,
.prompt-mention-pop .mention-item:hover {
  background: #f5f7fa;
}
.prompt-mention-pop .mention-item .m-thumb {
  width: 22px;
  height: 22px;
  border-radius: 3px;
  overflow: hidden;
  background: #f5f7fa;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.prompt-mention-pop .mention-item .m-thumb img,
.prompt-mention-pop .mention-item .m-thumb video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.prompt-mention-pop .mention-item .m-thumb .el-icon-headset {
  font-size: 13px;
  color: #909399;
}
.prompt-mention-pop .mention-item .m-label {
  flex: 1;
}
</style>
