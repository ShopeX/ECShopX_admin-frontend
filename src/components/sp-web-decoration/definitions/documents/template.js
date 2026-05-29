import { createTypedSection } from '../factory.js'

const templateDocument = {
  type: 'template',
  sections: [
    {
      type: 'main-carousel',
      blocks: [
        { type: 'image' },
        { type: 'image' },
        {
          type: 'image'
        }
      ]
    },
    {
      type: 'image-hotspot'
    },
    {
      type: 'product-tab-shelf'
    }
  ]
}

export function createTemplateDocumentDsl({ pageId = '', scene = '1001' } = {}) {
  const sections = {}
  const order = []

  ;(templateDocument.sections || []).forEach((item) => {
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
    pageType: 'home',
    pageId: String(pageId || ''),
    sections,
    order,
    meta: {
      version: 1,
      scene
    }
  }
}

export default templateDocument
