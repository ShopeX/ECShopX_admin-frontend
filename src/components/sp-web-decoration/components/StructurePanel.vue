<template>
  <div class="h-full flex min-h-0 flex-col border-r border-[#e6e9ef] bg-white">
    <div
      class="flex min-h-[44px] items-center justify-between gap-2.5 border-b border-[#e6e9ef] px-[14px] py-[8px]"
    >
      <div class="text-[14px] font-semibold text-[#18222f]">
        {{ $t('54e3d97e.768f6f') }}
      </div>
    </div>

    <div class="h-full min-h-0 overflow-hidden px-3 pb-4 pt-2.5">
      <div class="sp-structure-scroll h-full overflow-y-auto overflow-x-visible pr-1">
        <div>
          <div
            class="mb-2 px-2 text-[11px] font-semibold leading-4 tracking-[0.06em] text-[#7c8798]"
          >
            <span>{{ $t('54e3d97e.917f14') }}</span>
          </div>
          <div class="space-y-1">
            <draggable
              v-model="localHeaderZoneOrder"
              handle="[data-drag-handle='header-zone-section']"
              class="flex flex-col gap-0"
              :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
              @change="handleHeaderZoneOrderChange"
            >
              <div
                v-for="(sectionId, sIdx) in localHeaderZoneOrder"
                :key="sectionId"
                class="flex flex-col gap-0"
              >
                <div class="space-y-0.5">
                  <StructureSectionRow
                    :section-id="sectionId"
                    :label="getSectionDisplayLabel(sectionId)"
                    :selected="sectionId === selectedSectionId"
                    :expanded="isExpanded(sectionId)"
                    :show-expand-icon="canSectionContainBlocks(sectionId)"
                    drag-handle="header-zone-section"
                    :disabled="isSectionDisabled(sectionId)"
                    :can-delete="canDeleteHeaderZoneSection(sectionId)"
                    :can-toggle-disabled="
                      isHeaderZoneFixedSection(sectionId) || canDeleteHeaderZoneSection(sectionId)
                    "
                    :remove-title="$t('54e3d97e.8e22a6')"
                    :toggle-title="$t('54e3d97e.b11041')"
                    @select="$emit('select-section', $event)"
                    @toggle="$emit('toggle-section', $event)"
                    @remove="$emit('remove-section', $event)"
                    @toggle-disabled="$emit('toggle-section-disabled', $event)"
                  />

                  <draggable
                    v-if="isExpanded(sectionId) && getBlockOrder(sectionId).length"
                    v-model="localBlockOrders[sectionId]"
                    handle="[data-drag-handle='block']"
                    :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
                    @change="handleBlockOrderChange(sectionId)"
                  >
                    <div
                      v-for="(blockId, bIdx) in getBlockOrder(sectionId)"
                      :key="blockId"
                      class="flex flex-col gap-0"
                    >
                      <StructureInsertPoint
                        :label="$t('54e3d97e.fc318c')"
                        :open="isInsertMenuOpen('block', sectionId, bIdx)"
                        :items="getBlockPickerItems(getSectionType(sectionId))"
                        :dock-style="insertMenuDockStyle"
                        block
                        indent="block"
                        layer="block"
                        @open="toggleInsertMenu('block', sectionId, bIdx, $event)"
                        @select="selectBlockType(sectionId, $event.type)"
                      />
                      <StructureBlockRow
                        :section-id="sectionId"
                        :block-id="blockId"
                        :label="getBlockLabel(getSection(sectionId), blockId)"
                        :selected="sectionId === selectedSectionId && selectedBlockId === blockId"
                        :disabled="isBlockDisabled(sectionId, blockId)"
                        :can-delete="canDeleteBlock(sectionId)"
                        :remove-title="$t('54e3d97e.8e22a6')"
                        :toggle-title="$t('54e3d97e.b11041')"
                        @select="$emit('select-block', $event)"
                        @remove="$emit('remove-block', $event)"
                        @toggle-disabled="$emit('toggle-block-disabled', $event)"
                      />
                    </div>
                  </draggable>

                  <div v-if="isExpanded(sectionId)">
                    <StructureAddAction
                      :visible="getBlockPickerItems(getSectionType(sectionId)).length > 0"
                      :label="$t('54e3d97e.fc318c')"
                      :open="isInsertMenuOpen('block', sectionId, getBlockOrder(sectionId).length)"
                      :items="getBlockPickerItems(getSectionType(sectionId))"
                      :dock-style="insertMenuDockStyle"
                      container="block"
                      flush-start
                      top-spacing
                      @open="
                        toggleInsertMenu(
                          'block',
                          sectionId,
                          getBlockOrder(sectionId).length,
                          $event
                        )
                      "
                      @select="selectBlockType(sectionId, $event.type)"
                    />
                  </div>
                </div>
              </div>
            </draggable>

            <StructureInsertPoint
              v-show="showHeaderFooterSectionInsertControls"
              :label="$t('54e3d97e.2e2d33')"
              :open="isInsertMenuOpen('section', 'header', localHeaderZoneOrder.length)"
              :items="sectionPickerItemsFor('header')"
              :dock-style="insertMenuDockStyle"
              :icon-size="13"
              show-icons
              @open="toggleInsertMenu('section', 'header', localHeaderZoneOrder.length, $event)"
              @select="selectSectionType($event.type)"
            />
          </div>
        </div>

        <div class="mt-3.5 border-t border-[#eef1f5] pt-3.5">
          <div
            class="mb-2 px-2 text-[11px] font-semibold leading-4 tracking-[0.06em] text-[#7c8798]"
          >
            <span>{{ $t('54e3d97e.cdb7d0') }}</span>
          </div>

          <draggable
            v-model="localOrder"
            handle="[data-drag-handle='section']"
            class="flex flex-col gap-0"
            :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
            @change="handleOrderChange"
          >
            <div
              v-for="(sectionId, sIdx) in localOrder"
              :key="sectionId"
              class="flex flex-col gap-0"
            >
              <StructureInsertPoint
                :label="$t('54e3d97e.2e2d33')"
                :open="isInsertMenuOpen('section', 'template', sIdx)"
                :items="sectionPickerItemsFor('template')"
                :dock-style="insertMenuDockStyle"
                show-icons
                @open="toggleInsertMenu('section', 'template', sIdx, $event)"
                @select="selectSectionType($event.type)"
              />
              <div class="space-y-1">
                <StructureSectionRow
                  :section-id="sectionId"
                  :label="getSectionLabel(sectionId)"
                  :selected="sectionId === selectedSectionId"
                  :expanded="isExpanded(sectionId)"
                  :show-expand-icon="canSectionContainBlocks(sectionId)"
                  drag-handle="section"
                  :disabled="isSectionDisabled(sectionId)"
                  :can-delete="canDeletePageSection(sectionId)"
                  :can-toggle-disabled="canTogglePageSection(sectionId)"
                  :remove-title="$t('54e3d97e.8e22a6')"
                  :toggle-title="$t('54e3d97e.b11041')"
                  @select="$emit('select-section', $event)"
                  @toggle="$emit('toggle-section', $event)"
                  @remove="$emit('remove-section', $event)"
                  @toggle-disabled="$emit('toggle-section-disabled', $event)"
                />

                <draggable
                  v-if="isExpanded(sectionId) && getBlockOrder(sectionId).length"
                  v-model="localBlockOrders[sectionId]"
                  handle="[data-drag-handle='block']"
                  :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
                  @change="handleBlockOrderChange(sectionId)"
                >
                  <div
                    v-for="(blockId, bIdx) in getBlockOrder(sectionId)"
                    :key="blockId"
                    class="flex flex-col gap-0"
                  >
                    <StructureInsertPoint
                      :label="$t('54e3d97e.fc318c')"
                      :open="isInsertMenuOpen('block', sectionId, bIdx)"
                      :items="getBlockPickerItems(getSectionType(sectionId))"
                      :dock-style="insertMenuDockStyle"
                      block
                      indent="block"
                      layer="block"
                      @open="toggleInsertMenu('block', sectionId, bIdx, $event)"
                      @select="selectBlockType(sectionId, $event.type)"
                    />
                    <StructureBlockRow
                      :section-id="sectionId"
                      :block-id="blockId"
                      :label="getBlockLabel(dsl.sections[sectionId], blockId)"
                      :selected="sectionId === selectedSectionId && selectedBlockId === blockId"
                      :disabled="isBlockDisabled(sectionId, blockId)"
                      :can-delete="canDeleteBlock(sectionId)"
                      :remove-title="$t('54e3d97e.8e22a6')"
                      :toggle-title="$t('54e3d97e.b11041')"
                      @select="$emit('select-block', $event)"
                      @remove="$emit('remove-block', $event)"
                      @toggle-disabled="$emit('toggle-block-disabled', $event)"
                    />
                  </div>
                </draggable>

                <div v-if="isExpanded(sectionId)">
                  <StructureAddAction
                    :visible="getBlockPickerItems(getSectionType(sectionId)).length > 0"
                    :label="$t('54e3d97e.fc318c')"
                    :open="isInsertMenuOpen('block', sectionId, getBlockOrder(sectionId).length)"
                    :items="getBlockPickerItems(getSectionType(sectionId))"
                    :dock-style="insertMenuDockStyle"
                    container="block"
                    flush-start
                    top-spacing
                    @open="
                      toggleInsertMenu('block', sectionId, getBlockOrder(sectionId).length, $event)
                    "
                    @select="selectBlockType(sectionId, $event.type)"
                  />
                </div>
              </div>
            </div>
          </draggable>

          <StructureInsertPoint
            v-if="localOrder.length"
            :label="$t('54e3d97e.2e2d33')"
            :open="isInsertMenuOpen('section', 'template', localOrder.length)"
            :items="sectionPickerItemsFor('template')"
            :dock-style="insertMenuDockStyle"
            :icon-size="13"
            show-icons
            @open="toggleInsertMenu('section', 'template', localOrder.length, $event)"
            @select="selectSectionType($event.type)"
          />

          <StructureAddAction
            v-if="localOrder.length"
            :label="$t('54e3d97e.2e2d33')"
            :open="isInsertMenuOpen('section', 'template', localOrder.length)"
            :items="sectionPickerItemsFor('template')"
            :dock-style="insertMenuDockStyle"
            container="section"
            show-icons
            @open="toggleInsertMenu('section', 'template', localOrder.length, $event)"
            @select="selectSectionType($event.type)"
          />

          <div
            v-if="!localOrder.length"
            class="flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#d7dde7] bg-[#fbfbfc] p-6 text-center text-[#6b7785]"
          >
            <span>{{ $t('54e3d97e.bdf5be') }}</span>
            <StructureAddAction
              :label="$t('54e3d97e.2e2d33')"
              :open="isInsertMenuOpen('section', 'template-empty', 0)"
              :items="sectionPickerItemsFor('template-empty')"
              :dock-style="insertMenuDockStyle"
              align="center"
              container="empty"
              relaxed
              show-icons
              @open="toggleInsertMenu('section', 'template-empty', 0, $event)"
              @select="selectSectionType($event.type)"
            />
          </div>
        </div>

        <div class="mt-3.5 border-t border-[#eef1f5] pt-3.5">
          <div
            class="mb-2 px-2 text-[11px] font-semibold leading-4 tracking-[0.06em] text-[#7c8798]"
          >
            <span>{{ $t('54e3d97e.4eb88f') }}</span>
          </div>
          <div class="space-y-1">
            <draggable
              v-if="localFooterZoneOrder.length"
              v-model="localFooterZoneOrder"
              handle="[data-drag-handle='footer-zone-section']"
              class="flex flex-col gap-0"
              :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
              @change="handleFooterZoneOrderChange"
            >
              <div
                v-for="(sectionId, sIdx) in localFooterZoneOrder"
                :key="sectionId"
                class="flex flex-col gap-0"
              >
                <StructureInsertPoint
                  v-show="showHeaderFooterSectionInsertControls"
                  :label="$t('54e3d97e.2e2d33')"
                  :open="isInsertMenuOpen('section', 'footer', sIdx)"
                  :items="sectionPickerItemsFor('footer')"
                  :dock-style="insertMenuDockStyle"
                  show-icons
                  @open="toggleInsertMenu('section', 'footer', sIdx, $event)"
                  @select="selectSectionType($event.type)"
                />

                <StructureSectionRow
                  :section-id="sectionId"
                  :label="getSectionDisplayLabel(sectionId)"
                  :selected="selectedSectionId === sectionId"
                  :expanded="isExpanded(sectionId)"
                  drag-handle="footer-zone-section"
                  :disabled="isSectionDisabled(sectionId)"
                  :can-toggle-disabled="false"
                  @select="$emit('select-section', $event)"
                  @toggle="$emit('toggle-section', $event)"
                />

                <draggable
                  v-if="isExpanded(sectionId) && getBlockOrder(sectionId).length"
                  v-model="localBlockOrders[sectionId]"
                  handle="[data-drag-handle='block']"
                  :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
                  @change="handleBlockOrderChange(sectionId)"
                >
                  <div
                    v-for="(blockId, bIdx) in getBlockOrder(sectionId)"
                    :key="blockId"
                    class="flex flex-col gap-0"
                  >
                    <StructureInsertPoint
                      :label="$t('54e3d97e.fc318c')"
                      :open="isInsertMenuOpen('block', sectionId, bIdx)"
                      :items="getBlockPickerItems(getSectionType(sectionId))"
                      :dock-style="insertMenuDockStyle"
                      block
                      indent="block"
                      layer="block"
                      @open="toggleInsertMenu('block', sectionId, bIdx, $event)"
                      @select="selectBlockType(sectionId, $event.type)"
                    />
                    <StructureBlockRow
                      :section-id="sectionId"
                      :block-id="blockId"
                      :label="getBlockLabel(getSection(sectionId), blockId)"
                      :selected="selectedSectionId === sectionId && selectedBlockId === blockId"
                      :disabled="isBlockDisabled(sectionId, blockId)"
                      :can-delete="false"
                      :toggle-title="$t('54e3d97e.b11041')"
                      @select="$emit('select-block', $event)"
                      @toggle-disabled="$emit('toggle-block-disabled', $event)"
                    />
                  </div>
                </draggable>

                <div v-if="isExpanded(sectionId)">
                  <StructureAddAction
                    :visible="getBlockPickerItems(getSectionType(sectionId)).length > 0"
                    :label="$t('54e3d97e.fc318c')"
                    :open="isInsertMenuOpen('block', sectionId, getBlockOrder(sectionId).length)"
                    :items="getBlockPickerItems(getSectionType(sectionId))"
                    :dock-style="insertMenuDockStyle"
                    container="block"
                    top-spacing
                    @open="
                      toggleInsertMenu('block', sectionId, getBlockOrder(sectionId).length, $event)
                    "
                    @select="selectBlockType(sectionId, $event.type)"
                  />
                </div>
              </div>
            </draggable>

            <StructureSectionRow
              section-id="footer"
              :label="$t('54e3d97e.4eb88f')"
              :selected="selectedSectionId === 'footer'"
              :expanded="isExpanded('footer')"
              :show-expand-icon="canSectionContainBlocks('footer')"
              :disabled="isSectionDisabled('footer')"
              :toggle-title="$t('54e3d97e.b11041')"
              @select="$emit('select-section', $event)"
              @toggle="$emit('toggle-section', $event)"
              @toggle-disabled="$emit('toggle-section-disabled', $event)"
            />

            <draggable
              v-if="isExpanded('footer') && footerBlockOrder.length"
              v-model="localBlockOrders.footer"
              handle="[data-drag-handle='block']"
              :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
              @change="handleBlockOrderChange('footer')"
            >
              <div
                v-for="(blockId, bIdx) in footerBlockOrder"
                :key="blockId"
                class="flex flex-col gap-0"
              >
                <StructureInsertPoint
                  :label="$t('54e3d97e.fc318c')"
                  :open="isInsertMenuOpen('block', 'footer', bIdx)"
                  :items="footerBlockPickerItems"
                  :dock-style="insertMenuDockStyle"
                  block
                  indent="block"
                  layer="block"
                  @open="toggleInsertMenu('block', 'footer', bIdx, $event)"
                  @select="selectBlockType('footer', $event.type)"
                />
                <StructureBlockRow
                  section-id="footer"
                  :block-id="blockId"
                  :label="getBlockLabel(footerSection, blockId)"
                  :selected="selectedSectionId === 'footer' && selectedBlockId === blockId"
                  :disabled="isBlockDisabled('footer', blockId)"
                  :can-delete="canDeleteBlock('footer')"
                  :remove-title="$t('54e3d97e.8e22a6')"
                  :toggle-title="$t('54e3d97e.b11041')"
                  @select="$emit('select-block', $event)"
                  @remove="$emit('remove-block', $event)"
                  @toggle-disabled="$emit('toggle-block-disabled', $event)"
                />
              </div>
            </draggable>

            <div v-if="isExpanded('footer')">
              <StructureAddAction
                :visible="footerBlockPickerItems.length > 0"
                :label="$t('54e3d97e.fc318c')"
                :open="isInsertMenuOpen('block', 'footer', footerBlockOrder.length)"
                :items="footerBlockPickerItems"
                :dock-style="insertMenuDockStyle"
                container="block"
                top-spacing
                @open="toggleInsertMenu('block', 'footer', footerBlockOrder.length, $event)"
                @select="selectBlockType('footer', $event.type)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import StructureInsertPoint from './StructureInsertPoint.vue'
import StructureBlockRow from './StructureBlockRow.vue'
import StructureSectionRow from './StructureSectionRow.vue'
import StructureAddAction from './StructureAddAction.vue'

import {
  getTypedSectionDefinition as getSectionDefinition,
  getTypedBlockDefinition as getBlockDefinition
} from '../definitions/registry.js'
import {
  createSectionPickerItems,
  createSectionPickerItemsForTypes,
  createBlockPickerItems
} from '../utils/insertPicker.js'
import { getAreaSectionInsertPolicy } from '../definitions/areas.js'
import { LANGUAGES } from '@/i18n'
import { resolveDecorationI18nValue } from '../utils/i18n.js'

function normalizeDisplayTitle(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function getDefinitionDefaultTitleCandidates(definition, languages = LANGUAGES) {
  const name = definition?.name
  if (!name) return []

  const candidates = []
  if (typeof name === 'string') {
    candidates.push(name)
  } else if (name && typeof name === 'object' && name.__decorationI18n === true) {
    candidates.push(name.fallback)
    Object.values(languages || {}).forEach((config) => {
      candidates.push(config?.messages?.[name.key])
    })
  }

  return Array.from(
    new Set(candidates.map((value) => normalizeDisplayTitle(value)).filter(Boolean))
  )
}

export function resolveStructureDisplayTitle(title, definition, fallback = '') {
  const rawTitle = typeof title === 'string' ? title : ''
  const normalizedTitle = normalizeDisplayTitle(rawTitle)
  const localizedTitle = resolveDecorationI18nValue(definition?.name || '') || ''
  if (!normalizedTitle) {
    return localizedTitle || fallback || ''
  }

  const defaultTitleCandidates = getDefinitionDefaultTitleCandidates(definition)
  if (localizedTitle) {
    defaultTitleCandidates.push(normalizeDisplayTitle(localizedTitle))
  }

  return defaultTitleCandidates.includes(normalizedTitle) ? localizedTitle || rawTitle : rawTitle
}

export default {
  name: 'StructurePanel',
  components: {
    draggable,
    StructureInsertPoint,
    StructureBlockRow,
    StructureSectionRow,
    StructureAddAction
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
    sectionDefinitions: {
      type: Array,
      default: () => []
    },
    expandedSectionIds: {
      type: Array,
      default: () => []
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
      localOrder: [],
      /** 全局标头区顺序，与 headerDsl.order 同步，可拖拽 */
      localHeaderZoneOrder: [],
      /** 全局页脚区附加分区顺序，不含固定 footer */
      localFooterZoneOrder: [],
      localBlockOrders: {
        header: [],
        footer: []
      },
      openInsertMenu: {
        kind: '',
        sectionId: '',
        insertIndex: null
      },
      /** 插入菜单：fixed 定位（结构树右侧），由锚点 getBoundingClientRect 计算 */
      insertMenuAnchorEl: null,
      insertMenuDockStyle: {},
      /** MVP 阶段隐藏标头/页脚区域添加分区入口，后续需要时可切回 true */
      showHeaderFooterSectionInsertControls: false
    }
  },
  computed: {
    footerSection() {
      return this.footerDsl.sections?.footer || null
    },
    footerBlockOrder() {
      return this.localBlockOrders.footer || []
    },
    footerBlockPickerItems() {
      return createBlockPickerItems('footer')
    }
  },
  watch: {
    'dsl.order': {
      immediate: true,
      deep: true,
      handler(value) {
        this.localOrder = Array.isArray(value) ? value.slice() : []
      }
    },
    dsl: {
      immediate: true,
      deep: true,
      handler() {
        this.syncBlockOrders()
      }
    },
    headerDsl: {
      immediate: true,
      deep: true,
      handler() {
        this.syncHeaderZoneOrderFromHeader()
      }
    },
    footerDsl: {
      immediate: true,
      deep: true,
      handler() {
        this.syncFooterZoneOrderFromFooter()
      }
    }
  },
  beforeDestroy() {
    this.clearInsertMenuAnchor()
  },
  methods: {
    syncHeaderZoneOrderFromHeader() {
      const order = this.headerDsl?.order
      if (!Array.isArray(order) || !order.length) {
        this.localHeaderZoneOrder = ['header']
        return
      }
      this.localHeaderZoneOrder = order.filter((id) => id !== 'footer').slice()
    },
    syncFooterZoneOrderFromFooter() {
      const order = this.footerDsl?.order
      this.localFooterZoneOrder = Array.isArray(order)
        ? order.filter((id) => id !== 'footer').slice()
        : []
    },
    emitGlobalZoneOrder() {
      this.$emit('reorder-global-sections', [
        ...this.localHeaderZoneOrder.slice(),
        ...this.localFooterZoneOrder.slice(),
        'footer'
      ])
    },
    handleHeaderZoneOrderChange() {
      this.emitGlobalZoneOrder()
    },
    handleFooterZoneOrderChange() {
      this.emitGlobalZoneOrder()
    },
    isHeaderZoneFixedSection(sectionId) {
      return sectionId === 'header'
    },
    canDeleteHeaderZoneSection(sectionId) {
      if (sectionId === 'header' || sectionId === 'footer') return false
      return this.getSectionType(sectionId) === 'announcement-bar'
    },
    isLockedSection(sectionId) {
      const section = this.getSection(sectionId)
      return Boolean(
        section?.locked === true ||
          section?.settings?.locked === true ||
          section?.type === 'native-product-list'
      )
    },
    canDeletePageSection(sectionId) {
      return !this.isLockedSection(sectionId)
    },
    canTogglePageSection(sectionId) {
      return !this.isLockedSection(sectionId)
    },
    sectionPickerItemsFor(anchor) {
      const cfg = getAreaSectionInsertPolicy(anchor)
      if (cfg.types == null) {
        return createSectionPickerItems(this.sectionDefinitions)
      }
      return createSectionPickerItemsForTypes(cfg.types)
    },
    syncBlockOrders() {
      const nextBlockOrders = {}
      Object.keys(this.headerDsl.sections || {}).forEach((sectionId) => {
        nextBlockOrders[sectionId] = this.headerDsl.sections?.[sectionId]?.blockOrder?.slice() || []
      })
      Object.keys(this.footerDsl.sections || {}).forEach((sectionId) => {
        nextBlockOrders[sectionId] = this.footerDsl.sections?.[sectionId]?.blockOrder?.slice() || []
      })
      Object.keys(this.dsl.sections || {}).forEach((sectionId) => {
        nextBlockOrders[sectionId] = this.dsl.sections[sectionId].blockOrder?.slice() || []
      })
      this.localBlockOrders = nextBlockOrders
    },
    isExpanded(sectionId) {
      return this.expandedSectionIds.includes(sectionId)
    },
    isInsertMenuOpen(kind, sectionId = '', insertIndex = null) {
      if (this.openInsertMenu.kind !== kind) return false
      if (kind === 'block') {
        return (
          this.openInsertMenu.sectionId === sectionId &&
          this.openInsertMenu.insertIndex === insertIndex
        )
      }
      if (kind === 'section') {
        return (
          this.openInsertMenu.sectionId === sectionId &&
          this.openInsertMenu.insertIndex === insertIndex
        )
      }
      return false
    },
    toggleInsertMenu(kind, sectionId = '', insertIndexArg = undefined, event) {
      if (kind === 'block') {
        const idx =
          typeof insertIndexArg === 'number' && !Number.isNaN(insertIndexArg)
            ? insertIndexArg
            : null
        if (this.isInsertMenuOpen('block', sectionId, idx)) {
          this.closeInsertMenu()
          return
        }
        this.openInsertMenu = { kind: 'block', sectionId, insertIndex: idx }
        this.setInsertMenuAnchor(event)
        return
      }
      if (kind === 'section') {
        const anchor = sectionId || 'header'
        let idx
        if (typeof insertIndexArg === 'number' && !Number.isNaN(insertIndexArg)) {
          idx = insertIndexArg
        } else if (anchor === 'header') {
          idx = this.localHeaderZoneOrder.length
        } else if (anchor === 'template-empty') {
          idx = 0
        } else {
          idx = this.localOrder.length
        }
        if (this.isInsertMenuOpen('section', anchor, idx)) {
          this.closeInsertMenu()
          return
        }
        this.openInsertMenu = { kind: 'section', sectionId: anchor, insertIndex: idx }
        this.setInsertMenuAnchor(event)
      }
    },
    setInsertMenuAnchor(event) {
      const el = event && event.currentTarget
      this.insertMenuAnchorEl = el && el.nodeType === 1 ? el : null
      this.bindInsertMenuPositionListeners()
      this.bindInsertMenuClickOutside()
      this.$nextTick(() => this.updateInsertMenuPosition())
    },
    updateInsertMenuPosition() {
      const el = this.insertMenuAnchorEl
      if (!el || typeof el.getBoundingClientRect !== 'function') {
        this.insertMenuDockStyle = {}
        return
      }
      const r = el.getBoundingClientRect()
      const root = this.$el
      const rootRect =
        root && typeof root.getBoundingClientRect === 'function' ? root.getBoundingClientRect() : r
      const gap = 8
      const menuW = 208
      // 图2：面板左缘与结构侧栏右边界（分割线）对齐，整体落在预览区一侧
      let left = rootRect.right + gap
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800
      if (left + menuW > vw - gap) {
        left = Math.max(gap, vw - menuW - gap)
      }
      const pad = 8
      const minBottomReserve = 120
      let topPx = r.top
      topPx = Math.max(pad, Math.min(vh - pad - minBottomReserve, topPx))
      this.insertMenuDockStyle = {
        position: 'fixed',
        top: `${Math.round(topPx)}px`,
        left: `${Math.round(left)}px`,
        zIndex: 4000
      }
    },
    bindInsertMenuPositionListeners() {
      if (this._insertMenuListenersBound) return
      this._onInsertMenuViewport = () => {
        if (!this.openInsertMenu.kind) return
        this.updateInsertMenuPosition()
      }
      window.addEventListener('resize', this._onInsertMenuViewport)
      window.addEventListener('scroll', this._onInsertMenuViewport, true)
      this._insertMenuScrollEl = this.$el && this.$el.querySelector('.sp-structure-scroll')
      if (this._insertMenuScrollEl) {
        this._insertMenuScrollEl.addEventListener('scroll', this._onInsertMenuViewport, true)
      }
      this._insertMenuListenersBound = true
    },
    unbindInsertMenuPositionListeners() {
      if (!this._insertMenuListenersBound || !this._onInsertMenuViewport) return
      window.removeEventListener('resize', this._onInsertMenuViewport)
      window.removeEventListener('scroll', this._onInsertMenuViewport, true)
      if (this._insertMenuScrollEl) {
        this._insertMenuScrollEl.removeEventListener('scroll', this._onInsertMenuViewport, true)
        this._insertMenuScrollEl = null
      }
      this._onInsertMenuViewport = null
      this._insertMenuListenersBound = false
    },
    clearInsertMenuAnchor() {
      this.insertMenuAnchorEl = null
      this.insertMenuDockStyle = {}
      this.unbindInsertMenuPositionListeners()
      this.unbindInsertMenuClickOutside()
    },
    bindInsertMenuClickOutside() {
      if (this._insertMenuClickOutsideBound) return
      this._onInsertMenuClickOutside = (e) => {
        if (!this.openInsertMenu.kind) return
        const t = e.target
        const root = this.$el
        const panel = root && root.querySelector && root.querySelector('.sp-structure-insert-menu')
        if (panel && panel.contains(t)) return
        if (this.insertMenuAnchorEl && this.insertMenuAnchorEl.contains(t)) return
        this.closeInsertMenu()
      }
      document.addEventListener('click', this._onInsertMenuClickOutside, false)
      this._insertMenuClickOutsideBound = true
    },
    unbindInsertMenuClickOutside() {
      if (!this._insertMenuClickOutsideBound || !this._onInsertMenuClickOutside) return
      document.removeEventListener('click', this._onInsertMenuClickOutside, false)
      this._onInsertMenuClickOutside = null
      this._insertMenuClickOutsideBound = false
    },
    closeInsertMenu() {
      this.clearInsertMenuAnchor()
      this.openInsertMenu = { kind: '', sectionId: '', insertIndex: null }
    },
    selectSectionType(type) {
      const anchor = this.openInsertMenu.sectionId
      const idx = this.openInsertMenu.insertIndex
      const cfg = getAreaSectionInsertPolicy(anchor)
      if (cfg.mutation === 'global' || cfg.mutation === 'footer') {
        this.$emit('add-global-section', {
          type,
          area: cfg.mutation,
          index: typeof idx === 'number' ? idx : undefined
        })
      } else {
        this.$emit('add-section', {
          type,
          index: typeof idx === 'number' ? idx : undefined
        })
      }
      this.closeInsertMenu()
    },
    selectBlockType(sectionId, blockType) {
      const idx = this.openInsertMenu.insertIndex
      this.$emit('add-block', {
        sectionId,
        blockType,
        index: typeof idx === 'number' && !Number.isNaN(idx) ? idx : undefined
      })
      this.closeInsertMenu()
    },
    getSectionLabel(sectionId) {
      return this.getSectionDisplayLabel(sectionId)
    },
    getSectionType(sectionId) {
      return this.getSection(sectionId)?.type || ''
    },
    isSectionDisabled(sectionId) {
      return Boolean(this.getSection(sectionId)?.disabled)
    },
    canSectionContainBlocks(sectionId) {
      return this.getBlockPickerItems(this.getSectionType(sectionId)).length > 0
    },
    isBlockDisabled(sectionId, blockId) {
      const section = this.getSection(sectionId)
      return Boolean(section?.blocks?.[blockId]?.disabled)
    },
    canDeleteBlock(sectionId) {
      return (this.getBlockOrder(sectionId) || []).length > 1
    },
    getSection(sectionId) {
      return (
        this.headerDsl.sections?.[sectionId] ||
        this.footerDsl.sections?.[sectionId] ||
        this.dsl.sections?.[sectionId] ||
        null
      )
    },
    getSectionDisplayLabel(sectionId) {
      const section = this.getSection(sectionId)
      if (!section) return ''
      const definition = getSectionDefinition(section.type)
      return resolveStructureDisplayTitle(section.title, definition, section.type || '')
    },
    getBlockPickerItems(sectionType) {
      if (sectionType === 'footer') {
        return createBlockPickerItems(sectionType).filter((item) =>
          ['footer-menu', 'footer-image', 'footer-text'].includes(item.type)
        )
      }
      return createBlockPickerItems(sectionType)
    },
    getBlockOrder(sectionId) {
      return this.localBlockOrders[sectionId] || []
    },
    getBlockLabel(section, blockId) {
      const block = section?.blocks?.[blockId]
      if (!block) return ''
      const definition = getBlockDefinition(block.type)
      return resolveStructureDisplayTitle(block.title, definition, block.type || '')
    },
    handleOrderChange() {
      this.$emit('reorder-sections', this.localOrder.slice())
    },
    handleBlockOrderChange(sectionId) {
      this.$emit('reorder-blocks', {
        sectionId,
        blockOrder: this.getBlockOrder(sectionId).slice()
      })
    }
  }
}
</script>

<style scoped>
/* 结构树选中行：主题辅色（--secondary）半透明填充，圆角继承自 rounded-lg */
.sp-structure-row-selected {
  background-color: color-mix(in srgb, hsl(var(--secondary)) 16%, transparent);
}

.sp-structure-row-selected:hover {
  background-color: color-mix(in srgb, hsl(var(--secondary)) 22%, transparent);
}
</style>
