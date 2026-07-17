import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (filePath) => readFileSync(path.resolve(root, filePath), 'utf8')

test('product tab panel refreshes selected products from goods items list', () => {
  const panel = read('src/components/sp-web-decoration/panels/ProductTabBlockPanel.vue')
  const sync = read('src/components/sp-web-decoration/utils/productTabProducts.js')
  assert.match(sync, /\/goods\/items/)
  assert.match(sync, /item_id:\s*productIds/)
  assert.match(sync, /item_type:\s*'normal'/)
  assert.match(sync, /pageSize:\s*Math\.max\(50,\s*productIds\.length\)/)
  assert.match(sync, /showError:\s*false/)
  assert.doesNotMatch(sync, /skipAuthRedirect/)
  assert.match(sync, /latestProductMap/)
  assert.match(sync, /latestProducts[\s\S]*item_id/)
  assert.match(sync, /String\(product\.item_id\)/)
  assert.match(sync, /latestProductMap\.get\(String\(id\)\)/)
  assert.match(sync, /productIds\.map/)
  assert.match(sync, /latestProductMap\.get\(String\(id\)\)[\s\S]*snapshotMap\.get\(String\(id\)\)/)

  assert.match(panel, /fetchProductTabProducts/)
  assert.match(panel, /refreshProductItems/)
  assert.match(panel, /remoteProductItems/)
  assert.match(panel, /selectedProductKey/)
  const refreshMethod =
    panel.match(/async refreshProductItems\(\) \{[\s\S]*?\n    \},\n    clearProducts/)?.[0] || ''
  assert.doesNotMatch(refreshMethod, /this\.\$emit\('change'/)
  assert.match(panel, /updateProducts\(products\)[\s\S]*product_snapshots:/)
})
