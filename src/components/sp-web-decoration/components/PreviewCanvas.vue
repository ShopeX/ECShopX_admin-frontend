<template>
  <div class="h-full flex min-h-0 flex-col bg-[#eef1f5]">
    <div
      class="relative flex min-h-[42px] shrink-0 items-center gap-2 border-b border-[#e6e9ef] bg-white px-[14px] py-[7px]"
    >
      <div class="min-w-0 max-w-[38%] truncate text-[14px] font-semibold text-[#18222f]">
        {{ $t('01f158e9.2f586b') }}
      </div>
      <div
        class="absolute left-1/2 top-1/2 z-[1] flex -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 rounded-[10px] bg-[rgba(17,24,39,0.06)] p-0.5"
      >
        <button
          type="button"
          :class="deviceSwitchButtonClass('desktop')"
          :aria-label="$t('30ac5b9e.2828b7')"
          @click="$emit('select-device', 'desktop')"
        >
          <Monitor :size="15" class="text-current" :stroke-width="2" />
        </button>
        <button
          type="button"
          :class="deviceSwitchButtonClass('mobile')"
          :aria-label="$t('30ac5b9e.68d982')"
          @click="$emit('select-device', 'mobile')"
        >
          <Smartphone :size="15" class="text-current" :stroke-width="2" />
        </button>
      </div>
      <div class="relative z-[1] ml-auto flex shrink-0 items-center gap-1">
        <button
          type="button"
          :class="historyButtonClass(canUndo)"
          :disabled="!canUndo"
          :aria-label="$t('30ac5b9e.bd9fcf')"
          @click="$emit('undo')"
        >
          <Undo :size="17" class="text-current" :stroke-width="2" />
        </button>
        <button
          type="button"
          :class="historyButtonClass(canRedo)"
          :disabled="!canRedo"
          :aria-label="$t('30ac5b9e.c7db6d')"
          @click="$emit('redo')"
        >
          <Redo :size="17" class="text-current" :stroke-width="2" />
        </button>
        <div
          :class="
            iframeReady
              ? 'inline-flex h-6 items-center rounded-full bg-[rgba(15,157,88,0.12)] px-2.5 text-[11px] text-[#0f9d58]'
              : 'inline-flex h-6 items-center rounded-full bg-[rgba(17,24,39,0.06)] px-2.5 text-[11px] text-[#7d8796]'
          "
        >
          {{ iframeReady ? $t('01f158e9.6bef2d') : $t('01f158e9.3893c8') }}
        </div>
      </div>
    </div>

    <div ref="previewViewport" class="preview-canvas-scroll flex h-full flex-1 p-0">
      <div
        v-if="previewError || !websiteUrl"
        class="m-3 flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-[#d7dde7] bg-[#fbfbfc] p-6 text-center text-[#6b7785]"
      >
        {{ $t('01f158e9.a4a56e') }}
      </div>

      <div v-else :class="previewFrameContainerClass">
        <div :class="previewFrameShellClass" :style="previewFrameShellStyle">
          <iframe
            ref="previewFrame"
            class="h-full w-full border-0 bg-white"
            :src="previewUrl"
            @load="onPreviewIframeLoad"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Redo, Undo } from 'lucide-vue'
import { createDecorationMessenger } from '../utils/postMessage.js'
import { serializeDsl } from '../utils/dsl.js'

export default {
  name: 'PreviewCanvas',
  components: {
    Redo,
    Undo
  },
  props: {
    dsl: {
      type: Object,
      required: true
    },
    headerDsl: {
      type: Object,
      default: () => ({})
    },
    footerDsl: {
      type: Object,
      default: () => ({})
    },
    pageId: {
      type: String,
      default: ''
    },
    pageType: {
      type: String,
      default: 'home'
    },
    templateId: {
      type: String,
      default: ''
    },
    websiteUrl: {
      type: String,
      default: ''
    },
    device: {
      type: String,
      default: 'desktop'
    },
    canUndo: {
      type: Boolean,
      default: false
    },
    canRedo: {
      type: Boolean,
      default: false
    },
    selectedSectionId: {
      type: String,
      default: ''
    },
    selectedBlockId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iframeReady: false,
      messenger: null,
      previewError: false,
      updateTimer: null,
      initRetryTimer: null,
      previewViewportRaf: null,
      previewViewportHeight: 0,
      removeRawDebugListener: null,
      removeListener: null,
      previewViewportObserver: null
    }
  },
  computed: {
    previewUrl() {
      if (!this.messenger) return ''
      return this.messenger.getPreviewUrl({
        templateId: this.templateId,
        pageType: this.pageType
      })
    },
    previewFrameMinHeight() {
      return this.device === 'mobile' ? 720 : 0
    },
    previewFrameViewportHeight() {
      const height = Number(this.previewViewportHeight || 0)
      if (!Number.isFinite(height) || height <= 0) return 0
      const verticalPadding = this.device === 'mobile' ? 48 : 32
      return Math.max(0, Math.floor(height - verticalPadding))
    },
    previewFrameHeight() {
      return Math.max(this.previewFrameViewportHeight, this.previewFrameMinHeight)
    },
    previewFrameShellClass() {
      return this.device === 'mobile'
        ? 'relative mx-auto w-[420px] max-w-full overflow-hidden rounded-xl bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]'
        : 'relative w-full overflow-hidden bg-white'
    },
    previewFrameContainerClass() {
      return this.device === 'mobile'
        ? 'flex min-h-0 w-full items-start box-border px-4 py-6'
        : 'flex min-h-0 w-full items-start box-border p-4'
    },
    previewFrameShellStyle() {
      const height = this.previewFrameHeight
      return height ? { height: `${height}px`, minHeight: `${this.previewFrameMinHeight}px` } : {}
    }
  },
  watch: {
    dsl: {
      deep: true,
      handler() {
        this.scheduleUpdate()
      }
    },
    headerDsl: {
      deep: true,
      handler() {
        this.scheduleUpdate()
      }
    },
    footerDsl: {
      deep: true,
      handler() {
        this.scheduleUpdate()
      }
    },
    selectedSectionId() {
      this.scheduleUpdate()
      this.sendSelectionHighlight()
    },
    selectedBlockId() {
      this.scheduleUpdate()
      this.sendSelectionHighlight()
    }
  },
  mounted() {
    try {
      this.messenger = createDecorationMessenger(this.websiteUrl)
      console.log('[sp-web-decoration] PreviewCanvas mounted', {
        websiteUrl: this.websiteUrl,
        previewUrl: this.previewUrl,
        previewOrigin: this.messenger.previewOrigin
      })
      this.removeRawDebugListener = this.bindRawDebugListener()
      this.removeListener = this.messenger.onMessage(this.handleIncomingMessage)
      this.bindPreviewViewportObserver()
    } catch (error) {
      console.warn('[sp-web-decoration] PreviewCanvas init failed', error)
      this.previewError = true
    }
  },
  beforeDestroy() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
      this.updateTimer = null
    }
    if (this.initRetryTimer) {
      clearTimeout(this.initRetryTimer)
      this.initRetryTimer = null
    }
    if (this.removeListener) {
      this.removeListener()
    }
    if (this.removeRawDebugListener) {
      this.removeRawDebugListener()
      this.removeRawDebugListener = null
    }
    if (this.previewViewportObserver) {
      this.previewViewportObserver.disconnect()
      this.previewViewportObserver = null
    }
    if (this.previewViewportRaf) {
      cancelAnimationFrame(this.previewViewportRaf)
      this.previewViewportRaf = null
    }
    window.removeEventListener('resize', this.schedulePreviewViewportHeightUpdate)
  },
  methods: {
    deviceSwitchButtonClass(value) {
      const active = this.device === value
      return [
        'flex h-7 w-8 items-center justify-center rounded-[8px] border-0 transition-colors',
        active
          ? 'bg-white text-[#18222f] shadow-[0_6px_14px_rgba(15,23,42,0.12)]'
          : 'bg-transparent text-[#7d8796] hover:text-[#18222f]'
      ]
    },
    historyButtonClass(enabled) {
      return [
        'flex h-8 w-8 items-center justify-center rounded-md border-0 bg-transparent p-0 transition-colors',
        enabled
          ? 'cursor-pointer text-[#606266] hover:bg-[#f3f4f7] hover:text-[#18222f]'
          : 'cursor-not-allowed text-[#c0c4cc]'
      ]
    },
    updatePreviewViewportHeight() {
      const el = this.$refs.previewViewport
      if (!el) return
      const nextHeight = el.clientHeight || 0
      if (nextHeight === this.previewViewportHeight) return
      this.previewViewportHeight = nextHeight
    },
    schedulePreviewViewportHeightUpdate() {
      if (this.previewViewportRaf) return
      this.previewViewportRaf = requestAnimationFrame(() => {
        this.previewViewportRaf = null
        this.updatePreviewViewportHeight()
      })
    },
    bindPreviewViewportObserver() {
      this.$nextTick(() => {
        this.updatePreviewViewportHeight()
        const el = this.$refs.previewViewport
        if (!el || typeof ResizeObserver === 'undefined') return
        this.previewViewportObserver = new ResizeObserver(() =>
          this.schedulePreviewViewportHeightUpdate()
        )
        this.previewViewportObserver.observe(el)
        window.addEventListener('resize', this.schedulePreviewViewportHeightUpdate)
      })
    },
    bindRawDebugListener() {
      const listener = (event) => {
        if (!event.data || typeof event.data !== 'object') return
        console.log('[sp-web-decoration] raw message before filter', {
          origin: event.origin,
          expectedOrigin: this.messenger?.previewOrigin || '',
          type: event.data.type,
          data: event.data
        })
      }
      window.addEventListener('message', listener)
      return () => window.removeEventListener('message', listener)
    },
    /** 跨域 iframe 的 contentWindow 不能放进 data（Vue 响应式会访问 Window 属性触发 SecurityError） */
    getPreviewContentWindow() {
      const el = this.$refs.previewFrame
      return el && el.contentWindow ? el.contentWindow : null
    },
    normalizePreviewAnchor(anchor) {
      const x = Number(anchor?.clientX)
      const y = Number(anchor?.clientY)
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null
      const rect = this.$refs.previewFrame?.getBoundingClientRect?.()
      if (!rect) return { clientX: x, clientY: y }
      return {
        clientX: rect.left + x,
        clientY: rect.top + y
      }
    },
    handleIncomingMessage(event) {
      const { data } = event
      if (!data || !data.type) return

      if (process.env.NODE_ENV === 'development') {
        console.log('[sp-web-decoration] incoming message', {
          origin: event.origin,
          type: data.type,
          previewOrigin: this.messenger?.previewOrigin || ''
        })
      }

      if (data.type === 'PREVIEW_READY') {
        this.iframeReady = true
        this.sendPreviewReadyAck()
        this.$emit('preview-ready', true)
        this.flushInitToPreview()
        return
      }

      if (data.type === 'SECTION_FOCUSED' && data.payload?.sectionId) {
        this.$emit('focus-section', data.payload.sectionId)
        return
      }

      if (data.type === 'BLOCK_FOCUSED' && data.payload?.sectionId && data.payload?.blockId) {
        this.$emit('focus-block', {
          sectionId: data.payload.sectionId,
          blockId: data.payload.blockId
        })
        return
      }

      if (data.type === 'ADD_BLOCK_REQUESTED' && data.payload?.sectionId) {
        this.$emit('add-block-requested', {
          sectionId: data.payload.sectionId,
          insertIndex:
            typeof data.payload.insertIndex === 'number' ? data.payload.insertIndex : undefined,
          anchor: this.normalizePreviewAnchor(data.payload.anchor),
          area: data.payload.area || ''
        })
        return
      }

      if (data.type === 'ADD_SECTION_REQUESTED' && data.payload?.sectionId) {
        this.$emit('add-section-requested', {
          sectionId: data.payload.sectionId,
          insertIndex:
            typeof data.payload.insertIndex === 'number' ? data.payload.insertIndex : undefined,
          anchor: this.normalizePreviewAnchor(data.payload.anchor),
          area: data.payload.area || ''
        })
        return
      }

      if (data.type === 'MOVE_SECTION_REQUESTED' && data.payload?.sectionId) {
        this.$emit('move-section-requested', {
          sectionId: data.payload.sectionId,
          direction: data.payload.direction === 'up' ? 'up' : 'down'
        })
        return
      }

      if (data.type === 'DUPLICATE_SECTION_REQUESTED' && data.payload?.sectionId) {
        this.$emit('duplicate-section-requested', data.payload.sectionId)
        return
      }

      if (data.type === 'REMOVE_SECTION_REQUESTED' && data.payload?.sectionId) {
        this.$emit('remove-section-requested', data.payload.sectionId)
        return
      }

      if (
        data.type === 'MOVE_BLOCK_REQUESTED' &&
        data.payload?.sectionId &&
        data.payload?.blockId
      ) {
        this.$emit('move-block-requested', {
          sectionId: data.payload.sectionId,
          blockId: data.payload.blockId,
          direction: data.payload.direction === 'up' ? 'up' : 'down'
        })
        return
      }

      if (
        data.type === 'DUPLICATE_BLOCK_REQUESTED' &&
        data.payload?.sectionId &&
        data.payload?.blockId
      ) {
        this.$emit('duplicate-block-requested', {
          sectionId: data.payload.sectionId,
          blockId: data.payload.blockId
        })
        return
      }

      if (
        data.type === 'REMOVE_BLOCK_REQUESTED' &&
        data.payload?.sectionId &&
        data.payload?.blockId
      ) {
        this.$emit('remove-block-requested', {
          sectionId: data.payload.sectionId,
          blockId: data.payload.blockId
        })
      }
    },
    /** 子帧发出 PREVIEW_READY 时 ref/contentWindow 可能尚未就绪，需 nextTick + 短重试，避免 null.postMessage */
    onPreviewIframeLoad() {
      if (this.iframeReady) {
        this.flushInitToPreview()
      }
    },
    flushInitToPreview() {
      if (!this.iframeReady || !this.messenger) return
      if (process.env.NODE_ENV === 'development') {
        console.log('[sp-web-decoration] flush init', {
          iframeReady: this.iframeReady,
          previewOrigin: this.messenger.previewOrigin,
          previewUrl: this.previewUrl
        })
      }
      if (this.initRetryTimer) {
        clearTimeout(this.initRetryTimer)
        this.initRetryTimer = null
      }
      const payload = {
        pageType: this.pageType,
        pageId: this.pageId,
        pageDsl: serializeDsl(this.dsl),
        headerDsl: serializeDsl(this.headerDsl),
        footerDsl: serializeDsl(this.footerDsl),
        sections: {
          sectionId: this.selectedSectionId || '',
          blockId: this.selectedBlockId || ''
        }
      }
      const maxAttempts = 40
      const delayMs = 50
      const trySend = (attempt) => {
        const win = this.getPreviewContentWindow()
        if (win && this.messenger) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[sp-web-decoration] send init payload', payload)
          }
          this.messenger.sendInit(win, payload)
          return
        }
        if (attempt + 1 < maxAttempts) {
          this.initRetryTimer = setTimeout(() => trySend(attempt + 1), delayMs)
        }
      }
      this.$nextTick(() => trySend(0))
    },
    sendPreviewReadyAck() {
      const win = this.getPreviewContentWindow()
      if (!win || !this.messenger) return
      this.messenger.sendMessage(win, 'PREVIEW_READY_ACK', {
        pageType: this.pageType,
        pageId: this.pageId
      })
    },
    sendSelectionHighlight() {
      const win = this.getPreviewContentWindow()
      if (!this.iframeReady || !win || !this.messenger || !this.selectedSectionId) return
      this.messenger.sendMessage(win, 'BLOCK_HIGHLIGHT', {
        pageType: this.pageType,
        sectionId: this.selectedSectionId || '',
        blockId: this.selectedBlockId || ''
      })
    },
    scheduleUpdate() {
      const win = this.getPreviewContentWindow()
      if (!this.iframeReady || !win || !this.messenger) return
      if (this.updateTimer) {
        clearTimeout(this.updateTimer)
      }
      this.updateTimer = setTimeout(() => {
        const w = this.getPreviewContentWindow()
        if (!w) return
        this.messenger.sendUpdate(w, {
          pageType: this.pageType,
          pageId: this.pageId,
          pageDsl: serializeDsl(this.dsl),
          headerDsl: serializeDsl(this.headerDsl),
          footerDsl: serializeDsl(this.footerDsl),
          sections: {
            sectionId: this.selectedSectionId || '',
            blockId: this.selectedBlockId || ''
          }
        })
      }, 120)
    }
  }
}
</script>

<style scoped>
/* 保留滚动能力，仅隐藏滚动条，预览区更干净 */
.preview-canvas-scroll {
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.preview-canvas-scroll::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>
