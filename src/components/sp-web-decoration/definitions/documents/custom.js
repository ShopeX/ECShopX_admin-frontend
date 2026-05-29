import { createTypedSection } from '../factory.js'

const customDocument = {
  type: 'custom',
  sections: [
    {
      type: 'image-hotspot'
    }
  ]
}

export function createCustomDocumentDsl({ pageId = '', scene = '1001' } = {}) {
  const sections = {}
  const order = []

  ;(customDocument.sections || []).forEach((item) => {
    if (!item?.type) return
    const section = createTypedSection(item.type, {
      fixedId: item.fixedId,
      settings: item.settings,
      blocks: item.blocks
    })
    sections[section.id] = section
    order.push(section.id)
  })

  return {
    pageType: 'custom',
    pageId: String(pageId || ''),
    sections,
    order,
    meta: {
      version: 1,
      scene
    }
  }
}

export default customDocument
