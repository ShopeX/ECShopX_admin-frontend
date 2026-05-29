import {
  createHomeDsl,
  serializeDsl,
  deserializeDsl,
  createHeaderDsl,
  createFooterDsl,
  splitGlobalDsl
} from '../utils/dsl.js'

const STORAGE_PREFIX = 'decoration:home:'
const GLOBAL_STORAGE_KEY = 'decoration:global'
const HEADER_STORAGE_KEY = 'decoration:header'
const FOOTER_STORAGE_KEY = 'decoration:footer'

function getStorage() {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage
  }
  if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) {
    return globalThis.sessionStorage
  }
  return null
}

function getStorageKey(templateId) {
  return `${STORAGE_PREFIX}${templateId || 'draft'}`
}

export async function loadHomeDecoration({ templateId = '', scene = '1001' } = {}) {
  const fallbackDsl = createHomeDsl({
    pageId: String(templateId || ''),
    scene
  })
  const storage = getStorage()
  if (!storage) {
    return { dsl: fallbackDsl, source: 'default' }
  }

  const rawValue = storage.getItem(getStorageKey(templateId))
  if (!rawValue) {
    return { dsl: fallbackDsl, source: 'default' }
  }

  try {
    return {
      dsl: deserializeDsl(JSON.parse(rawValue)),
      source: 'session'
    }
  } catch (error) {
    return { dsl: fallbackDsl, source: 'default' }
  }
}

export async function saveHomeDecoration({ templateId = '', dsl }) {
  const storage = getStorage()

  if (storage) {
    storage.setItem(getStorageKey(templateId), JSON.stringify(serializeDsl(dsl)))
  }

  return {
    dsl,
    persisted: Boolean(storage),
    messageKey: '4c11e15d.ebf4e4'
  }
}

export async function loadHeaderFooterDecoration() {
  const fallbackHeaderDsl = createHeaderDsl()
  const fallbackFooterDsl = createFooterDsl()
  const storage = getStorage()
  if (!storage) {
    return {
      headerDsl: fallbackHeaderDsl,
      footerDsl: fallbackFooterDsl,
      source: 'default'
    }
  }

  const rawHeaderValue = storage.getItem(HEADER_STORAGE_KEY)
  const rawFooterValue = storage.getItem(FOOTER_STORAGE_KEY)
  if (rawHeaderValue || rawFooterValue) {
    try {
      const headerDsl = rawHeaderValue
        ? deserializeDsl(JSON.parse(rawHeaderValue))
        : fallbackHeaderDsl
      const footerDsl = rawFooterValue
        ? deserializeDsl(JSON.parse(rawFooterValue))
        : fallbackFooterDsl
      return { headerDsl, footerDsl, source: 'session' }
    } catch (error) {
      return {
        headerDsl: fallbackHeaderDsl,
        footerDsl: fallbackFooterDsl,
        source: 'default'
      }
    }
  }

  const rawValue = storage.getItem(GLOBAL_STORAGE_KEY)
  if (!rawValue) {
    return {
      headerDsl: fallbackHeaderDsl,
      footerDsl: fallbackFooterDsl,
      source: 'default'
    }
  }

  try {
    const { headerDsl, footerDsl } = splitGlobalDsl(deserializeDsl(JSON.parse(rawValue)))
    return {
      headerDsl,
      footerDsl,
      source: 'session'
    }
  } catch (error) {
    return {
      headerDsl: fallbackHeaderDsl,
      footerDsl: fallbackFooterDsl,
      source: 'default'
    }
  }
}

export async function saveHeaderFooterDecoration({ dsl, headerDsl, footerDsl }) {
  const storage = getStorage()
  const splitDsl = dsl ? splitGlobalDsl(dsl) : {}
  const nextHeaderDsl = headerDsl || splitDsl.headerDsl || createHeaderDsl()
  const nextFooterDsl = footerDsl || splitDsl.footerDsl || createFooterDsl()
  if (storage) {
    storage.setItem(HEADER_STORAGE_KEY, JSON.stringify(serializeDsl(nextHeaderDsl)))
    storage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(serializeDsl(nextFooterDsl)))
  }

  return {
    headerDsl: nextHeaderDsl,
    footerDsl: nextFooterDsl,
    persisted: Boolean(storage),
    messageKey: '4c11e15d.ebf4e4'
  }
}

export default {
  loadHomeDecoration,
  saveHomeDecoration,
  loadHeaderFooterDecoration,
  saveHeaderFooterDecoration
}
