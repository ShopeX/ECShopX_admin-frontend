import headerArea from './areas/header.js'
import templateArea from './areas/template.js'
import footerArea from './areas/footer.js'

const areaDefinitions = {
  header: headerArea,
  template: templateArea,
  'template-empty': templateArea,
  footer: footerArea
}

export function getAreaDefinition(areaType) {
  return areaDefinitions[areaType] || null
}

export function getAreaSectionInsertPolicy(areaType) {
  const definition = getAreaDefinition(areaType)
  if (!definition) {
    return {
      types: [],
      mutation: 'page'
    }
  }
  return {
    types: definition.allowedSections.slice(),
    mutation: definition.mutation
  }
}

export function getAreaDefinitions() {
  return { ...areaDefinitions }
}

export default {
  getAreaDefinition,
  getAreaSectionInsertPolicy,
  getAreaDefinitions
}
