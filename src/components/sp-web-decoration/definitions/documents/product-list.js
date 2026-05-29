import { createTypedSection } from '../factory.js'

const productListDocument = {
  type: 'product_list',
  sections: [
    {
      type: 'image-hotspot'
    },
    {
      id: 'product_list',
      fixedId: 'product_list',
      type: 'native-product-list',
      locked: true,
      settings: {
        locked: true
      }
    }
  ]
}

export function createProductListDocumentDsl({ pageId = '', scene = '1001' } = {}) {
  const sections = {}
  const order = []

  ;(productListDocument.sections || []).forEach((item) => {
    if (!item?.type) return
    const section = createTypedSection(item.type, {
      fixedId: item.fixedId,
      settings: item.settings,
      blocks: item.blocks
    })
    if (item.locked) {
      section.locked = true
      section.settings = {
        ...(section.settings || {}),
        locked: true
      }
    }
    sections[section.id] = section
    order.push(section.id)
  })

  return {
    pageType: 'product_list',
    pageId: String(pageId || 'product_list'),
    sections,
    order,
    meta: {
      version: 1,
      scene
    }
  }
}

export default productListDocument
