import { createHeaderDocumentDsl } from './header.js'
import { createFooterDocumentDsl } from './footer.js'

export function createGlobalSections() {
  const headerDsl = createHeaderDocumentDsl()
  const footerDsl = createFooterDocumentDsl()
  return {
    header: headerDsl.sections.header,
    footer: footerDsl.sections.footer
  }
}

export default {
  createGlobalSections
}
