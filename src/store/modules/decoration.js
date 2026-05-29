import dslUtils from '../../components/sp-web-decoration/utils/dsl.js'
import {
  createTypedSection,
  createTypedBlock
} from '../../components/sp-web-decoration/definitions/factory.js'
import { getInitialEditorSelection } from '../../components/sp-web-decoration/definitions/selection.js'

const {
  createHomeDsl,
  createGlobalDsl,
  insertSection,
  updateSectionSettings,
  insertBlock,
  updateBlockSettings,
  removeBlock,
  duplicateBlock,
  replaceBlockOrder,
  removeSection,
  replaceSection,
  composePreviewDsl,
  splitGlobalDsl,
  createHeaderDsl,
  createFooterDsl,
  createProductListDsl
} = dslUtils

function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value))
}

function createState() {
  return {
    pageType: 'home',
    pageId: '',
    headerDsl: createHeaderDsl(),
    dsl: createHomeDsl(),
    footerDsl: createFooterDsl(),
    selectedSectionId: '',
    selectedBlockId: '',
    expandedSectionIds: [],
    editingScope: 'page',
    isPreviewReady: false,
    isSaving: false
  }
}

function isGlobalSection(state, sectionId) {
  return Boolean(
    sectionId && (state.headerDsl?.sections?.[sectionId] || state.footerDsl?.sections?.[sectionId])
  )
}

function resolveScopeKey(state, sectionId) {
  if (sectionId && state.headerDsl?.sections?.[sectionId]) return 'headerDsl'
  if (sectionId && state.footerDsl?.sections?.[sectionId]) return 'footerDsl'
  return 'dsl'
}

function createDuplicatedSection(sourceSection) {
  const duplicatedSection = createTypedSection(sourceSection.type)
  duplicatedSection.disabled = sourceSection.disabled
  duplicatedSection.settings = cloneDeep(sourceSection.settings || {})
  duplicatedSection.blocks = cloneDeep(sourceSection.blocks || {})
  duplicatedSection.blockOrder = cloneDeep(sourceSection.blockOrder || [])
  duplicatedSection.title = sourceSection.title
  duplicatedSection.titleKey = sourceSection.titleKey
  return duplicatedSection
}

function duplicateSectionInDsl(dsl, sectionId) {
  const sourceSection = dsl?.sections?.[sectionId]
  if (!sourceSection) return dsl
  const duplicatedSection = createDuplicatedSection(sourceSection)
  const nextDsl = cloneDeep(dsl)
  const sourceIndex = nextDsl.order.findIndex((id) => id === sectionId)
  const insertIndex = sourceIndex >= 0 ? sourceIndex + 1 : nextDsl.order.length
  nextDsl.sections[duplicatedSection.id] = duplicatedSection
  nextDsl.order.splice(insertIndex, 0, duplicatedSection.id)
  return nextDsl
}

function moveSectionInDsl(dsl, sectionId, targetIndex) {
  if (!dsl?.sections?.[sectionId]) return dsl
  const currentOrder = Array.isArray(dsl.order) ? dsl.order.slice() : []
  const currentIndex = currentOrder.indexOf(sectionId)
  if (currentIndex === -1) return dsl
  const normalizedTargetIndex = Math.max(0, Math.min(targetIndex, currentOrder.length - 1))
  if (currentIndex === normalizedTargetIndex) return dsl
  currentOrder.splice(currentIndex, 1)
  currentOrder.splice(normalizedTargetIndex, 0, sectionId)
  return {
    ...dsl,
    order: currentOrder
  }
}

function isLockedSection(section) {
  return Boolean(
    section?.locked === true ||
      section?.settings?.locked === true ||
      section?.type === 'native-product-list'
  )
}

const decorationStore = {
  namespaced: true,
  state: createState,
  getters: {
    currentSection(state) {
      if (!state.selectedSectionId) return null
      const scopeKey = resolveScopeKey(state, state.selectedSectionId)
      return state[scopeKey].sections[state.selectedSectionId] || null
    },
    currentBlock(state, getters) {
      if (!state.selectedBlockId || !getters.currentSection) return null
      return getters.currentSection.blocks?.[state.selectedBlockId] || null
    },
    activeDsl(state) {
      return composePreviewDsl({
        pageType: state.pageType,
        pageId: state.pageId,
        dsl: state.dsl,
        headerDsl: state.headerDsl,
        footerDsl: state.footerDsl
      })
    }
  },
  mutations: {
    initializeEditor(
      state,
      { pageType = 'home', pageId = '', dsl, legacyGlobalDsl, headerDsl, footerDsl }
    ) {
      state.pageType = pageType
      state.pageId = String(pageId || '')
      state.dsl =
        dsl ||
        (pageType === 'product_list'
          ? createProductListDsl({ pageId: state.pageId || 'product_list' })
          : createHomeDsl({ pageId: state.pageId }))
      if (headerDsl || footerDsl) {
        state.headerDsl = headerDsl || createHeaderDsl()
        state.footerDsl = footerDsl || createFooterDsl()
      } else if (legacyGlobalDsl) {
        const splitDsl = splitGlobalDsl(legacyGlobalDsl)
        state.headerDsl = splitDsl.headerDsl
        state.footerDsl = splitDsl.footerDsl
      } else {
        state.headerDsl = createHeaderDsl()
        state.footerDsl = createFooterDsl()
      }
      const initialSel = getInitialEditorSelection({
        dsl: state.dsl,
        headerDsl: state.headerDsl,
        footerDsl: state.footerDsl
      })
      state.selectedSectionId = initialSel.selectedSectionId
      state.selectedBlockId = initialSel.selectedBlockId
      state.expandedSectionIds = initialSel.expandedSectionIds
      state.editingScope = initialSel.editingScope
      state.isPreviewReady = false
    },
    setDsl(state, dsl) {
      state.dsl = dsl
    },
    setHeaderDsl(state, dsl) {
      state.headerDsl = dsl
    },
    setFooterDsl(state, dsl) {
      state.footerDsl = dsl
    },
    setSelectedSectionId(state, sectionId) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = ''
      state.editingScope = isGlobalSection(state, sectionId) ? 'global' : 'page'
    },
    selectSection(state, sectionId) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = ''
      if (sectionId && !state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
      }
      state.editingScope = isGlobalSection(state, sectionId) ? 'global' : 'page'
    },
    selectBlock(state, { sectionId, blockId }) {
      state.selectedSectionId = sectionId || ''
      state.selectedBlockId = blockId || ''
      if (sectionId && !state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
      }
      state.editingScope = isGlobalSection(state, sectionId) ? 'global' : 'page'
    },
    addSection(state, { type, index }) {
      const section = createTypedSection(type)
      state.dsl = insertSection(state.dsl, section, index)
      state.selectedSectionId = section.id
      state.selectedBlockId = ''
      state.expandedSectionIds = [...state.expandedSectionIds, section.id]
      state.editingScope = 'page'
    },
    addGlobalSection(state, payload) {
      const type = typeof payload === 'string' ? payload : payload?.type
      if (!type) return

      const requestedIndex =
        typeof payload === 'object' && payload !== null && typeof payload.index === 'number'
          ? payload.index
          : undefined

      if (payload?.area === 'footer') {
        const section = createTypedSection(type)
        const newId = section.id
        const currentOrder = Array.isArray(state.footerDsl.order)
          ? state.footerDsl.order.slice()
          : []
        const footerIndex = currentOrder.includes('footer')
          ? currentOrder.indexOf('footer')
          : currentOrder.length
        let insertAt = typeof requestedIndex === 'number' ? requestedIndex : footerIndex
        insertAt = Math.max(0, Math.min(insertAt, footerIndex))
        currentOrder.splice(insertAt, 0, newId)

        state.footerDsl = {
          ...state.footerDsl,
          sections: {
            ...(state.footerDsl.sections || {}),
            [newId]: section
          },
          order: currentOrder.includes('footer') ? currentOrder : [...currentOrder, 'footer']
        }
        state.selectedSectionId = newId
        state.selectedBlockId = ''
        if (!state.expandedSectionIds.includes(newId)) {
          state.expandedSectionIds = [...state.expandedSectionIds, newId]
        }
        state.editingScope = 'global'
        return
      }

      if (type === 'announcement-bar') {
        const section = createTypedSection('announcement-bar')
        const newId = section.id
        const currentOrder = Array.isArray(state.headerDsl.order)
          ? state.headerDsl.order.slice()
          : []
        let insertAt = typeof requestedIndex === 'number' ? requestedIndex : currentOrder.length
        insertAt = Math.max(0, Math.min(insertAt, currentOrder.length))
        currentOrder.splice(insertAt, 0, newId)

        state.headerDsl = {
          ...state.headerDsl,
          sections: {
            ...(state.headerDsl.sections || {}),
            [newId]: section
          },
          order: currentOrder
        }
        state.selectedSectionId = newId
        state.selectedBlockId = ''
        if (!state.expandedSectionIds.includes(newId)) {
          state.expandedSectionIds = [...state.expandedSectionIds, newId]
        }
        state.editingScope = 'global'
        return
      }

      if (state.headerDsl.sections?.[type]) {
        state.selectedSectionId = type
        state.selectedBlockId = ''
        state.editingScope = 'global'
        return
      }
      const section = createTypedSection(type)
      section.id = type
      const currentOrder = Array.isArray(state.headerDsl.order) ? state.headerDsl.order.slice() : []
      const insertIndex = typeof requestedIndex === 'number' ? requestedIndex : currentOrder.length
      currentOrder.splice(Math.max(0, Math.min(insertIndex, currentOrder.length)), 0, type)
      state.headerDsl = {
        ...state.headerDsl,
        sections: {
          ...(state.headerDsl.sections || {}),
          [type]: section
        },
        order: currentOrder
      }
      state.selectedSectionId = type
      state.selectedBlockId = ''
      if (!state.expandedSectionIds.includes(type)) {
        state.expandedSectionIds = [...state.expandedSectionIds, type]
      }
      state.editingScope = 'global'
    },
    setSectionDisabled(state, { sectionId, disabled }) {
      if (!sectionId) return
      const scopeKey = resolveScopeKey(state, sectionId)
      const section = state[scopeKey]?.sections?.[sectionId]
      if (!section) return
      if (isLockedSection(section)) return
      section.disabled = Boolean(disabled)
    },
    updateSectionSettings(state, { sectionId, patch }) {
      const scopeKey = resolveScopeKey(state, sectionId)
      state[scopeKey] = updateSectionSettings(state[scopeKey], sectionId, patch)
    },
    updateSelectedSectionSettings(state, patch) {
      if (!state.selectedSectionId) return
      const scopeKey = resolveScopeKey(state, state.selectedSectionId)
      state[scopeKey] = updateSectionSettings(state[scopeKey], state.selectedSectionId, patch)
    },
    replaceSelectedSection(state, nextSection) {
      if (!state.selectedSectionId) return
      const scopeKey = resolveScopeKey(state, state.selectedSectionId)
      state[scopeKey] = replaceSection(state[scopeKey], state.selectedSectionId, nextSection)
    },
    removeSection(state, sectionId) {
      if (!sectionId) return
      if (sectionId === 'header' || sectionId === 'footer') return
      const scopeKey = resolveScopeKey(state, sectionId)
      const section = state[scopeKey]?.sections?.[sectionId]
      if (!section || isLockedSection(section)) return
      state[scopeKey] = removeSection(state[scopeKey], sectionId)
      state.expandedSectionIds = state.expandedSectionIds.filter((id) => id !== sectionId)
      if (state.selectedSectionId === sectionId) {
        const fallbackOrder = state[scopeKey]?.order || []
        state.selectedSectionId = fallbackOrder[0] || ''
        state.selectedBlockId = ''
        state.editingScope = scopeKey === 'dsl' ? 'page' : 'global'
      }
    },
    duplicateSection(state, sectionId) {
      if (!sectionId || sectionId === 'header' || sectionId === 'footer') return
      const scopeKey = resolveScopeKey(state, sectionId)
      const section = state[scopeKey]?.sections?.[sectionId]
      if (!section || isLockedSection(section)) return
      state[scopeKey] = duplicateSectionInDsl(state[scopeKey], sectionId)
      const order = state[scopeKey]?.order || []
      const sourceIndex = order.indexOf(sectionId)
      const duplicatedId = sourceIndex >= 0 ? order[sourceIndex + 1] : ''
      if (duplicatedId) {
        state.selectedSectionId = duplicatedId
        state.selectedBlockId = ''
        if (!state.expandedSectionIds.includes(duplicatedId)) {
          state.expandedSectionIds = [...state.expandedSectionIds, duplicatedId]
        }
        state.editingScope = scopeKey === 'dsl' ? 'page' : 'global'
      }
    },
    moveSection(state, { sectionId, targetIndex }) {
      if (!sectionId || sectionId === 'header' || sectionId === 'footer') return
      const scopeKey = resolveScopeKey(state, sectionId)
      const sourceDsl = state[scopeKey]
      if (scopeKey === 'footerDsl') {
        const footerIndex = Array.isArray(sourceDsl.order) ? sourceDsl.order.indexOf('footer') : -1
        const maxIndex = footerIndex >= 0 ? footerIndex - 1 : (sourceDsl.order || []).length - 1
        state[scopeKey] = moveSectionInDsl(sourceDsl, sectionId, Math.min(targetIndex, maxIndex))
      } else {
        state[scopeKey] = moveSectionInDsl(sourceDsl, sectionId, targetIndex)
      }
      state.selectedSectionId = sectionId
      state.selectedBlockId = ''
      state.editingScope = scopeKey === 'dsl' ? 'page' : 'global'
    },
    replaceSectionOrder(state, nextOrder) {
      state.dsl = {
        ...state.dsl,
        order: nextOrder.slice()
      }
    },
    addBlock(state, { sectionId, blockType, index }) {
      const scopeKey = resolveScopeKey(state, sectionId)
      const block = createTypedBlock(state[scopeKey].sections[sectionId].type, blockType)
      const insertAt = typeof index === 'number' && !Number.isNaN(index) ? index : undefined
      state[scopeKey] = insertBlock(state[scopeKey], sectionId, block, insertAt)
      state.selectedSectionId = sectionId
      state.selectedBlockId = block.id
      state.editingScope = scopeKey === 'dsl' ? 'page' : 'global'
    },
    removeBlock(state, { sectionId, blockId }) {
      const scopeKey = resolveScopeKey(state, sectionId)
      state[scopeKey] = removeBlock(state[scopeKey], sectionId, blockId)
      if (state.selectedBlockId === blockId) {
        state.selectedSectionId = sectionId
        state.selectedBlockId = ''
      }
    },
    duplicateBlock(state, { sectionId, blockId }) {
      const scopeKey = resolveScopeKey(state, sectionId)
      const beforeOrder = state[scopeKey]?.sections?.[sectionId]?.blockOrder || []
      state[scopeKey] = duplicateBlock(state[scopeKey], sectionId, blockId)
      const afterOrder = state[scopeKey]?.sections?.[sectionId]?.blockOrder || []
      const duplicatedBlockId = afterOrder.find((id) => !beforeOrder.includes(id))
      state.selectedSectionId = sectionId
      state.selectedBlockId = duplicatedBlockId || blockId
      state.editingScope = scopeKey === 'dsl' ? 'page' : 'global'
    },
    toggleBlockDisabled(state, { sectionId, blockId }) {
      if (!sectionId || !blockId) return
      const scopeKey = resolveScopeKey(state, sectionId)
      const block = state[scopeKey]?.sections?.[sectionId]?.blocks?.[blockId]
      if (!block) return
      block.disabled = !block.disabled
    },
    updateSelectedBlockSettings(state, patch) {
      if (!state.selectedSectionId || !state.selectedBlockId) return
      const scopeKey = resolveScopeKey(state, state.selectedSectionId)
      state[scopeKey] = updateBlockSettings(
        state[scopeKey],
        state.selectedSectionId,
        state.selectedBlockId,
        patch
      )
    },
    replaceBlockOrder(state, { sectionId, blockOrder }) {
      const scopeKey = resolveScopeKey(state, sectionId)
      state[scopeKey] = replaceBlockOrder(state[scopeKey], sectionId, blockOrder)
    },
    toggleSectionExpanded(state, sectionId) {
      if (!sectionId) return
      if (state.expandedSectionIds.includes(sectionId)) {
        state.expandedSectionIds = state.expandedSectionIds.filter((id) => id !== sectionId)
        return
      }
      state.expandedSectionIds = [...state.expandedSectionIds, sectionId]
    },
    setExpandedSections(state, sectionIds) {
      state.expandedSectionIds = Array.isArray(sectionIds) ? sectionIds.slice() : []
    },
    setGlobalOrder(state, nextOrder) {
      const incoming = Array.isArray(nextOrder) ? nextOrder.filter(Boolean) : []
      const headerSections = state.headerDsl?.sections || {}
      const footerSections = state.footerDsl?.sections || {}
      const seenHeader = new Set()
      const seenFooter = new Set()
      const headerOrder = []
      const footerOrder = []
      for (const id of incoming) {
        if (id === 'footer') continue
        if (headerSections[id] && !seenHeader.has(id)) {
          seenHeader.add(id)
          headerOrder.push(id)
          continue
        }
        if (footerSections[id] && !seenFooter.has(id)) {
          seenFooter.add(id)
          footerOrder.push(id)
        }
      }
      if (!seenHeader.has('header') && headerSections.header) {
        headerOrder.unshift('header')
      }
      Object.keys(footerSections).forEach((id) => {
        if (id !== 'footer' && !seenFooter.has(id)) footerOrder.push(id)
      })
      state.headerDsl = {
        ...state.headerDsl,
        order: headerOrder
      }
      state.footerDsl = {
        ...state.footerDsl,
        order: [...footerOrder, 'footer']
      }
    },
    setPreviewReady(state, value) {
      state.isPreviewReady = Boolean(value)
    },
    setSaving(state, value) {
      state.isSaving = Boolean(value)
    },
    resetState(state) {
      Object.assign(state, createState())
    }
  }
}

export default decorationStore
