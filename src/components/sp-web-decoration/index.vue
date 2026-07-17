<template>
  <div class="flex h-full min-h-screen flex-col bg-[#f3f4f7]">
    <div
      class="box-border flex min-h-14 items-center justify-between gap-3 border-b border-[#e6e9ef] bg-white/95 px-[14px] py-2 max-[1360px]:flex-wrap max-[1360px]:items-stretch"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <span
          class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef4ff] text-[#2563eb]"
          aria-hidden="true"
        >
          <LayoutTemplate :size="18" :stroke-width="2" />
        </span>
        <div class="flex min-w-0 flex-col items-start gap-0.5">
          <div class="text-sm font-semibold leading-5 text-[#18222f]">{{ titleText }}</div>
          <div class="flex items-center gap-2 whitespace-nowrap text-[11px] text-[#6b7785]">
            <span>{{ subtitleText }}</span>
            <span v-if="templateId">#{{ templateId }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="false"
        class="flex min-w-0 flex-1 items-center justify-center gap-2.5 max-[1180px]:order-3 max-[1180px]:w-full max-[1180px]:justify-start max-[1180px]:overflow-x-auto"
      >
        <div
          class="flex min-h-[34px] items-center gap-1.5 rounded-[10px] border border-[rgba(17,24,39,0.08)] bg-[rgba(250,251,253,0.95)] px-2 py-1"
        >
          <span class="whitespace-nowrap text-[11px] text-[#6b7785]">{{
            $t('30ac5b9e.59ceff')
          }}</span>
          <el-select class="w-[120px]" size="small" :value="pageType" disabled>
            <el-option :label="$t('30ac5b9e.db1c89')" value="home" />
          </el-select>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <el-button
          class="!min-w-20 !rounded-lg"
          type="primary"
          size="small"
          :loading="isSaving || loading"
          @click="handleSave"
        >
          {{ $t('30ac5b9e.be5fbb') }}
        </el-button>
      </div>
    </div>

    <div
      v-loading="loading"
      class="grid flex-1 min-h-0 grid-cols-[260px_minmax(0,1fr)_304px] grid-rows-[minmax(0,1fr)] p-0 max-[1360px]:grid-cols-[236px_minmax(0,1fr)_280px] max-[1180px]:grid-cols-1 max-[1180px]:grid-rows-none max-[1180px]:auto-rows-[minmax(260px,auto)]"
    >
      <div class="min-w-0 min-h-0 h-full">
        <StructurePanel
          :dsl="dsl"
          :header-dsl="headerDsl"
          :footer-dsl="footerDsl"
          :selected-section-id="selectedSectionId"
          :selected-block-id="selectedBlockId"
          :expanded-section-ids="expandedSectionIds"
          :section-definitions="sectionDefinitions"
          @add-section="handleAddSection"
          @select-section="handleSelectSection"
          @select-block="handleSelectBlock"
          @toggle-section="handleToggleSection"
          @duplicate-section="handleDuplicateSection"
          @remove-section="handleRemoveSection"
          @reorder-sections="handleReorderSections"
          @add-block="handleAddBlock"
          @remove-block="handleRemoveBlock"
          @toggle-block-disabled="handleToggleBlockDisabled"
          @reorder-blocks="handleReorderBlocks"
          @add-global-section="handleAddGlobalSection"
          @toggle-section-disabled="handleToggleSectionDisabled"
          @reorder-global-sections="handleReorderGlobalSections"
        />
      </div>

      <div class="min-w-0 min-h-0 h-full">
        <PreviewCanvas
          ref="previewCanvas"
          :dsl="dsl"
          :header-dsl="headerDsl"
          :footer-dsl="footerDsl"
          :page-type="pageType"
          :page-id="pageId"
          :template-id="templateId"
          :website-url="websiteUrl"
          :device="viewMode"
          :can-undo="canUndo"
          :can-redo="canRedo"
          :selected-section-id="selectedSectionId"
          :selected-block-id="selectedBlockId"
          @focus-section="handleSelectSection"
          @focus-block="handleSelectBlock"
          @add-block-requested="handlePreviewAddBlockRequested"
          @add-section-requested="handlePreviewAddSectionRequested"
          @move-section-requested="handlePreviewMoveSectionRequested"
          @duplicate-section-requested="handleDuplicateSection"
          @remove-section-requested="handleRemoveSection"
          @move-block-requested="handlePreviewMoveBlockRequested"
          @duplicate-block-requested="handlePreviewDuplicateBlockRequested"
          @remove-block-requested="handlePreviewRemoveBlockRequested"
          @preview-ready="handlePreviewReady"
          @select-device="viewMode = $event"
          @undo="handleUndo"
          @redo="handleRedo"
        />
      </div>

      <div class="min-w-0 min-h-0 h-full">
        <ConfigPanel
          :section="selectedSection"
          :block="selectedBlock"
          @update-settings="handleUpdateSettings"
          @update-section="handleUpdateSection"
          @update-block="handleUpdateBlock"
          @select-block="handleSelectBlock"
        />
      </div>
    </div>
    <StructureInsertMenu
      v-if="previewInsertMenu.kind && previewInsertMenuItems.length"
      :items="previewInsertMenuItems"
      :dock-style="previewInsertMenuDockStyle"
      show-icons
      :icon-type="previewInsertMenu.kind"
      @select="handlePreviewInsertMenuSelect"
    />
  </div>
</template>

<script>
import StructurePanel from './components/StructurePanel.vue'
import PreviewCanvas from './components/PreviewCanvas.vue'
import ConfigPanel from './components/ConfigPanel.vue'
import StructureInsertMenu from './components/StructureInsertMenu.vue'

import { getSectionTypesByScope, getTypedSectionDefinition } from './definitions/registry.js'
import { getAreaSectionInsertPolicy } from './definitions/areas.js'
import {
  createBlockPickerItems,
  createSectionPickerItems,
  createSectionPickerItemsForTypes
} from './utils/insertPicker.js'

const PAGE_TYPE_LABEL_MAP = {
  home: '30ac5b9e.3c92ff',
  index: '30ac5b9e.3c92ff',
  custom: '30ac5b9e.91ab06',
  list: '30ac5b9e.23b864',
  product_list: '30ac5b9e.0416ce',
  header: '30ac5b9e.9a8d77',
  footer: '30ac5b9e.97ef6e'
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

export default {
  name: 'SpWebDecoration',
  components: {
    StructurePanel,
    PreviewCanvas,
    ConfigPanel,
    StructureInsertMenu
  },
  props: {
    initialDsl: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    pageType: {
      type: String,
      default: 'home'
    },
    scene: {
      type: String,
      default: '1001'
    },
    templateId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    websiteUrl: {
      type: String,
      default: () => (process.env.VUE_APP_WEBSITE || '') + '?designMode=1'
    }
  },
  data() {
    return {
      viewMode: 'desktop',
      historyPast: [],
      historyFuture: [],
      isRestoringHistory: false,
      previewInsertMenu: {
        kind: '',
        sectionId: '',
        insertIndex: undefined,
        area: 'template'
      },
      previewInsertMenuAnchor: null,
      previewInsertMenuDockStyle: {}
    }
  },
  computed: {
    dsl() {
      return this.$store.state.decoration.dsl
    },
    headerDsl() {
      return this.$store.state.decoration.headerDsl
    },
    footerDsl() {
      return this.$store.state.decoration.footerDsl
    },
    pageId() {
      return this.$store.state.decoration.pageId
    },
    selectedSectionId() {
      return this.$store.state.decoration.selectedSectionId
    },
    selectedBlockId() {
      return this.$store.state.decoration.selectedBlockId
    },
    expandedSectionIds() {
      return this.$store.state.decoration.expandedSectionIds
    },
    isSaving() {
      return this.$store.state.decoration.isSaving
    },
    editingScope() {
      return this.$store.state.decoration.editingScope
    },
    selectedSection() {
      return this.selectedSectionId ? this.$store.getters['decoration/currentSection'] : null
    },
    selectedBlock() {
      return this.selectedBlockId ? this.$store.getters['decoration/currentBlock'] : null
    },
    sectionDefinitions() {
      return getSectionTypesByScope('template').map((type) => getTypedSectionDefinition(type))
    },
    pageTypeLabel() {
      return this.$t(PAGE_TYPE_LABEL_MAP[this.pageType] || PAGE_TYPE_LABEL_MAP.home)
    },
    titleText() {
      return this.title || `${this.pageTypeLabel}${this.$t('30ac5b9e.81b2cb')}`
    },
    subtitleText() {
      return `${this.pageTypeLabel}${this.$t('30ac5b9e.95b351')}`
    },
    canUndo() {
      return this.historyPast.length > 1
    },
    canRedo() {
      return this.historyFuture.length > 0
    },
    previewInsertMenuItems() {
      if (this.previewInsertMenu.kind === 'block') {
        const section = this.findSectionById(this.previewInsertMenu.sectionId)
        return section ? createBlockPickerItems(section.type) : []
      }
      if (this.previewInsertMenu.kind === 'section') {
        const policy = getAreaSectionInsertPolicy(this.previewInsertMenu.area)
        return policy.types === null
          ? createSectionPickerItems(this.sectionDefinitions)
          : createSectionPickerItemsForTypes(policy.types)
      }
      return []
    }
  },
  watch: {
    initialDsl: {
      immediate: true,
      handler(value) {
        if (!value) return
        const pageDsl = value.dsl || value
        const carouselSectionId = Object.keys(pageDsl?.sections || {}).find(
          (sectionId) => pageDsl?.sections?.[sectionId]?.type === 'main-carousel'
        )
        console.log('[sp-web-decoration] initialDsl before initializeEditor', {
          pageDsl,
          carouselSectionId,
          carouselSection: carouselSectionId ? pageDsl?.sections?.[carouselSectionId] : null
        })
        this.$store.commit('decoration/initializeEditor', {
          pageType: this.pageType,
          pageId: this.templateId,
          dsl: cloneValue(pageDsl),
          headerDsl: value.headerDsl ? cloneValue(value.headerDsl) : null,
          footerDsl: value.footerDsl ? cloneValue(value.footerDsl) : null,
          legacyGlobalDsl: value.globalDsl ? cloneValue(value.globalDsl) : null
        })
        this.$nextTick(() => {
          const currentDsl = this.$store.state.decoration.dsl
          const currentCarouselSectionId = Object.keys(currentDsl?.sections || {}).find(
            (sectionId) => currentDsl?.sections?.[sectionId]?.type === 'main-carousel'
          )
          console.log('[sp-web-decoration] store dsl after initializeEditor', {
            currentCarouselSectionId,
            carouselSection: currentCarouselSectionId
              ? currentDsl?.sections?.[currentCarouselSectionId]
              : null
          })
        })
        this.resetHistory()
      }
    }
  },
  beforeDestroy() {
    this.unbindPreviewInsertMenuEvents()
    this.$store.commit('decoration/resetState')
  },
  methods: {
    snapshotState() {
      return {
        headerDsl: cloneValue(this.headerDsl),
        dsl: cloneValue(this.dsl),
        footerDsl: cloneValue(this.footerDsl),
        selectedSectionId: this.selectedSectionId,
        selectedBlockId: this.selectedBlockId
      }
    },
    resetHistory() {
      this.historyPast = [this.snapshotState()]
      this.historyFuture = []
    },
    recordHistory() {
      if (this.isRestoringHistory) return
      const snapshot = this.snapshotState()
      const previousSnapshot = this.historyPast[this.historyPast.length - 1]
      if (JSON.stringify(previousSnapshot) === JSON.stringify(snapshot)) return
      this.historyPast = [...this.historyPast, snapshot]
      this.historyFuture = []
    },
    restoreSnapshot(snapshot) {
      this.isRestoringHistory = true
      this.$store.commit('decoration/setHeaderDsl', cloneValue(snapshot.headerDsl))
      this.$store.commit('decoration/setDsl', cloneValue(snapshot.dsl))
      this.$store.commit('decoration/setFooterDsl', cloneValue(snapshot.footerDsl))
      if (snapshot.selectedBlockId) {
        this.$store.commit('decoration/selectBlock', {
          sectionId: snapshot.selectedSectionId,
          blockId: snapshot.selectedBlockId
        })
      } else {
        this.$store.commit('decoration/selectSection', snapshot.selectedSectionId)
      }
      this.isRestoringHistory = false
    },
    handleAddSection(payload) {
      const type = typeof payload === 'string' ? payload : payload.type
      const index =
        typeof payload === 'object' && payload !== null && typeof payload.index === 'number'
          ? payload.index
          : undefined
      this.$store.commit('decoration/addSection', { type, index })
      this.recordHistory()
    },
    handleSelectSection(sectionId) {
      this.$store.commit('decoration/selectSection', sectionId)
      this.requestPreviewSelectionScroll()
    },
    handleSelectBlock(payload) {
      this.$store.commit('decoration/selectBlock', payload)
      this.requestPreviewSelectionScroll()
    },
    requestPreviewSelectionScroll() {
      this.$nextTick(() => {
        this.$refs.previewCanvas?.sendSelectionHighlight?.()
      })
    },
    handleToggleSection(sectionId) {
      this.$store.commit('decoration/toggleSectionExpanded', sectionId)
    },
    handleDuplicateSection(sectionId) {
      this.$store.commit('decoration/duplicateSection', sectionId)
      this.recordHistory()
    },
    handleRemoveSection(sectionId) {
      this.$store.commit('decoration/removeSection', sectionId)
      this.recordHistory()
    },
    handleReorderSections(nextOrder) {
      this.$store.commit('decoration/replaceSectionOrder', nextOrder)
      this.recordHistory()
    },
    handleAddBlock({ sectionId, blockType, index }) {
      this.$store.commit('decoration/addBlock', { sectionId, blockType, index })
      this.recordHistory()
    },
    findSectionById(sectionId) {
      return (
        this.dsl.sections?.[sectionId] ||
        this.headerDsl.sections?.[sectionId] ||
        this.footerDsl.sections?.[sectionId] ||
        null
      )
    },
    getSectionArea(sectionId) {
      if (this.headerDsl.sections?.[sectionId]) return 'header'
      if (this.footerDsl.sections?.[sectionId]) return 'footer'
      return 'template'
    },
    normalizePreviewArea(area, sectionId) {
      return ['header', 'template', 'footer'].includes(area) ? area : this.getSectionArea(sectionId)
    },
    normalizePreviewInsertIndex(insertIndex) {
      return typeof insertIndex === 'number' ? insertIndex : undefined
    },
    openPreviewInsertMenu({ kind, sectionId, insertIndex, anchor, area }) {
      this.previewInsertMenu = {
        kind,
        sectionId: sectionId || '',
        insertIndex: this.normalizePreviewInsertIndex(insertIndex),
        area: this.normalizePreviewArea(area, sectionId)
      }
      this.previewInsertMenuAnchor = anchor || null
      this.updatePreviewInsertMenuPosition()
      this.bindPreviewInsertMenuEvents()
      this.$nextTick(() => {
        if (this.previewInsertMenu.kind && !this.previewInsertMenuItems.length) {
          this.closePreviewInsertMenu()
        }
      })
    },
    closePreviewInsertMenu() {
      this.previewInsertMenu = {
        kind: '',
        sectionId: '',
        insertIndex: undefined,
        area: 'template'
      }
      this.previewInsertMenuAnchor = null
      this.previewInsertMenuDockStyle = {}
      this.unbindPreviewInsertMenuEvents()
    },
    bindPreviewInsertMenuEvents() {
      this.unbindPreviewInsertMenuEvents()
      window.addEventListener('resize', this.updatePreviewInsertMenuPosition)
      window.addEventListener('scroll', this.updatePreviewInsertMenuPosition, true)
      window.addEventListener('mousedown', this.handlePreviewInsertMenuOutside, true)
    },
    unbindPreviewInsertMenuEvents() {
      window.removeEventListener('resize', this.updatePreviewInsertMenuPosition)
      window.removeEventListener('scroll', this.updatePreviewInsertMenuPosition, true)
      window.removeEventListener('mousedown', this.handlePreviewInsertMenuOutside, true)
    },
    handlePreviewInsertMenuOutside(event) {
      if (event.target?.closest?.('.sp-structure-insert-menu')) return
      this.closePreviewInsertMenu()
    },
    updatePreviewInsertMenuPosition() {
      const anchor = this.previewInsertMenuAnchor
      if (!anchor) {
        this.previewInsertMenuDockStyle = { right: '320px', top: '96px' }
        return
      }
      const menuWidth = 208
      const gap = 8
      const x = Number(anchor.clientX)
      const y = Number(anchor.clientY)
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || menuWidth
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 420
      const left = Math.min(Math.max(gap, x - menuWidth / 2), viewportWidth - menuWidth - gap)
      const top = Math.min(Math.max(gap, y + gap), viewportHeight - 160)
      this.previewInsertMenuDockStyle = {
        left: `${Math.max(gap, left)}px`,
        top: `${Math.max(gap, top)}px`
      }
    },
    handlePreviewAddBlockRequested(payload) {
      if (!payload?.sectionId || !this.findSectionById(payload.sectionId)) return
      this.openPreviewInsertMenu({
        kind: 'block',
        sectionId: payload.sectionId,
        insertIndex: payload.insertIndex,
        anchor: payload.anchor,
        area: payload.area
      })
    },
    handlePreviewAddSectionRequested(payload) {
      if (!payload?.sectionId) return
      this.openPreviewInsertMenu({
        kind: 'section',
        sectionId: payload.sectionId,
        insertIndex: payload.insertIndex,
        anchor: payload.anchor,
        area: payload.area
      })
    },
    handlePreviewInsertMenuSelect(item) {
      const context = { ...this.previewInsertMenu }
      this.closePreviewInsertMenu()
      if (!item?.type) return
      if (context.kind === 'block') {
        this.handleAddBlock({
          sectionId: context.sectionId,
          blockType: item.type,
          index: context.insertIndex
        })
        return
      }
      const policy = getAreaSectionInsertPolicy(context.area)
      if (policy.mutation === 'page') {
        this.handleAddSection({ type: item.type, index: context.insertIndex, area: context.area })
        return
      }
      this.handleAddGlobalSection({
        type: item.type,
        area: policy.mutation,
        index: context.insertIndex
      })
    },
    getSectionScopeDsl(sectionId) {
      if (this.headerDsl.sections?.[sectionId]) return this.headerDsl
      if (this.footerDsl.sections?.[sectionId]) return this.footerDsl
      if (this.dsl.sections?.[sectionId]) return this.dsl
      return null
    },
    handlePreviewMoveSectionRequested({ sectionId, direction }) {
      const scopeDsl = this.getSectionScopeDsl(sectionId)
      const order = Array.isArray(scopeDsl?.order) ? scopeDsl.order : []
      const currentIndex = order.indexOf(sectionId)
      if (currentIndex < 0) return
      const offset = direction === 'up' ? -1 : 1
      const targetIndex = currentIndex + offset
      if (targetIndex < 0 || targetIndex >= order.length) return
      if (sectionId !== 'footer' && order[targetIndex] === 'footer') return
      this.$store.commit('decoration/moveSection', { sectionId, targetIndex })
      this.recordHistory()
    },
    handlePreviewMoveBlockRequested({ sectionId, blockId, direction }) {
      const section = this.findSectionById(sectionId)
      const order = Array.isArray(section?.blockOrder) ? section.blockOrder.slice() : []
      const currentIndex = order.indexOf(blockId)
      if (currentIndex < 0) return
      const targetIndex = currentIndex + (direction === 'up' ? -1 : 1)
      if (targetIndex < 0 || targetIndex >= order.length) return
      order.splice(currentIndex, 1)
      order.splice(targetIndex, 0, blockId)
      this.handleReorderBlocks({ sectionId, blockOrder: order })
    },
    handlePreviewDuplicateBlockRequested({ sectionId, blockId }) {
      if (!sectionId || !blockId) return
      this.$store.commit('decoration/duplicateBlock', { sectionId, blockId })
      this.recordHistory()
      this.requestPreviewSelectionScroll()
    },
    handlePreviewRemoveBlockRequested({ sectionId, blockId }) {
      const section = this.findSectionById(sectionId)
      const order = Array.isArray(section?.blockOrder) ? section.blockOrder : []
      if (order.length <= 1) return
      this.handleRemoveBlock({ sectionId, blockId })
    },
    handleAddGlobalSection(payload) {
      if (typeof payload === 'string') {
        this.$store.commit('decoration/addGlobalSection', payload)
      } else if (payload && typeof payload === 'object') {
        this.$store.commit('decoration/addGlobalSection', payload)
      }
      this.recordHistory()
    },
    handleToggleSectionDisabled(sectionId) {
      const section =
        this.headerDsl.sections?.[sectionId] ||
        this.footerDsl.sections?.[sectionId] ||
        this.dsl.sections?.[sectionId] ||
        null
      if (!section) return
      this.$store.commit('decoration/setSectionDisabled', {
        sectionId,
        disabled: !section.disabled
      })
      this.recordHistory()
    },
    handleReorderGlobalSections(nextOrder) {
      this.$store.commit('decoration/setGlobalOrder', nextOrder)
      this.recordHistory()
    },
    handleRemoveBlock(payload) {
      this.$store.commit('decoration/removeBlock', payload)
      this.recordHistory()
    },
    handleToggleBlockDisabled(payload) {
      this.$store.commit('decoration/toggleBlockDisabled', payload)
      this.recordHistory()
    },
    handleReorderBlocks(payload) {
      this.$store.commit('decoration/replaceBlockOrder', payload)
      this.recordHistory()
    },
    handleUpdateSettings(patch) {
      this.$store.commit('decoration/updateSelectedSectionSettings', patch)
      this.recordHistory()
    },
    handleUpdateSection(nextSection) {
      this.$store.commit('decoration/replaceSelectedSection', cloneValue(nextSection))
      this.recordHistory()
    },
    handleUpdateBlock(patch) {
      this.$store.commit('decoration/updateSelectedBlockSettings', patch)
      this.recordHistory()
    },
    handlePreviewReady(value) {
      this.$store.commit('decoration/setPreviewReady', value)
    },
    handleUndo() {
      if (!this.canUndo) return
      const currentSnapshot = this.historyPast[this.historyPast.length - 1]
      const previousSnapshot = this.historyPast[this.historyPast.length - 2]
      this.historyPast = this.historyPast.slice(0, -1)
      this.historyFuture = [currentSnapshot, ...this.historyFuture]
      this.restoreSnapshot(previousSnapshot)
    },
    handleRedo() {
      if (!this.canRedo) return
      const [nextSnapshot, ...rest] = this.historyFuture
      this.historyFuture = rest
      this.historyPast = [...this.historyPast, nextSnapshot]
      this.restoreSnapshot(nextSnapshot)
    },
    handleSave() {
      const payload = {
        dsl: cloneValue(this.dsl),
        headerDsl: cloneValue(this.headerDsl),
        footerDsl: cloneValue(this.footerDsl),
        editingScope: this.editingScope
      }
      console.log('[sp-web-decoration] save click payload', payload)
      this.$emit('save', payload)
    }
  }
}
</script>
