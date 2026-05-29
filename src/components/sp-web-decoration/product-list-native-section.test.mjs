import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (filePath) => readFileSync(path.resolve(root, filePath), 'utf8')

test('product_list document defaults include a locked native product list section', () => {
  const dsl = read('src/components/sp-web-decoration/utils/dsl.js')
  const document = read('src/components/sp-web-decoration/definitions/documents/product-list.js')
  const registry = read('src/components/sp-web-decoration/definitions/registry.js')
  const areas = read('src/components/sp-web-decoration/definitions/areas.js')
  const persistence = read('src/components/sp-web-decoration/adapters/apiPersistence.js')

  assert.match(dsl, /createProductListDsl/)
  assert.match(document, /pageType:\s*'product_list'/)
  assert.match(document, /type:\s*'image-hotspot'/)
  assert.match(document, /id:\s*'product_list'/)
  assert.match(document, /type:\s*'native-product-list'/)
  assert.match(document, /locked:\s*true/)
  assert.match(registry, /nativeProductListSection/)
  assert.match(registry, /addable !== false/)
  assert.match(persistence, /pageType === 'product_list'/)
  assert.doesNotMatch(document, /placement:\s*'top'/)
  assert.doesNotMatch(document, /placement:\s*'bottom'/)
  assert.doesNotMatch(document, /type:\s*'main-carousel'/)
  assert.doesNotMatch(document, /type:\s*'product-tab-shelf'/)
  assert.doesNotMatch(areas, /'template-top'/)
  assert.doesNotMatch(areas, /'template-bottom'/)
})

test('locked native product list section cannot be edited like ordinary sections', () => {
  const store = read('src/store/modules/decoration.js')
  const structurePanel = read('src/components/sp-web-decoration/components/StructurePanel.vue')
  const configPanel = read('src/components/sp-web-decoration/components/ConfigPanel.vue')

  assert.match(store, /function isLockedSection/)
  assert.match(store, /duplicateSection\(state, sectionId\)[\s\S]*isLockedSection/)
  assert.match(store, /removeSection\(state, sectionId\)[\s\S]*isLockedSection/)
  assert.match(store, /setSectionDisabled\(state, \{ sectionId, disabled \}\)[\s\S]*isLockedSection/)
  assert.match(structurePanel, /canDeletePageSection/)
  assert.match(structurePanel, /canTogglePageSection/)
  assert.match(configPanel, /showLockedSectionNotice/)
  assert.doesNotMatch(configPanel, /showPlacementControl/)
  assert.doesNotMatch(configPanel, /updatePlacement/)
})

test('decoration editor title follows current page type', () => {
  const editor = read('src/components/sp-web-decoration/index.vue')
  const route = read('src/views/decoration/web-template/index.vue')

  assert.match(editor, /PAGE_TYPE_LABEL_MAP/)
  assert.match(editor, /product_list:\s*'商品列表模板'/)
  assert.match(editor, /titleText\(\)[\s\S]*this\.title \|\| `\$\{this\.pageTypeLabel\}装修`/)
  assert.match(editor, /subtitleText\(\)[\s\S]*`\$\{this\.pageTypeLabel\}编辑`/)
  assert.match(route, /:title="decorationTitle"/)
  assert.match(route, /decorationTitle\(\)[\s\S]*routePageType[\s\S]*装修/)
  assert.doesNotMatch(route, /:title="\$t\('f9eb643d\.6741a0'\)"/)
})
