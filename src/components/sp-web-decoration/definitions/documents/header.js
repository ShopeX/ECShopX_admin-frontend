import { createTypedSection } from '../factory.js'

const headerDocument = {
  type: 'header',
  sections: [
    {
      type: 'header',
      fixedId: 'header',
      blocks: []
    }
  ]
}

export function createHeaderDocumentDsl() {
  const sections = {}
  const order = []

  ;(headerDocument.sections || []).forEach((item) => {
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
    pageType: 'header',
    pageId: 'header',
    sections,
    order
  }
}

export default headerDocument
