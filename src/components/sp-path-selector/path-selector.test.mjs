import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (filePath) => readFileSync(path.resolve(root, filePath), 'utf8')

test('web path selector is limited to web-supported link types', () => {
  const config = read('src/components/sp-path-selector/config.js')
  const menuForm = read('src/views/decoration/web-menu/components/MenuItemForm.vue')

  assert.match(config, /web:\s*\['goods',\s*'sale_category',\s*'custom_page'\]/)
  assert.match(config, /function getPathSelectorTypes\(platform\)/)
  assert.match(menuForm, /<SpPathSelector[\s\S]*value=\{value\}[\s\S]*platform=['"]web['"][\s\S]*on-input=\{onInput\}/)
})

test('path selector passes filtered path types into picker dialog', () => {
  const selector = read('src/components/sp-path-selector/index.vue')
  const dialog = read('src/components/sp-path-selector/PickerDialog.vue')

  assert.match(selector, /pathTypes\(\)\s*\{\s*return getPathSelectorTypes\(this\.platform\)/)
  assert.match(selector, /pathTypes:\s*this\.pathTypes/)
  assert.match(selector, /platform:\s*this\.platform/)
  assert.match(selector, /!this\.pathTypes\.some\(\(item\) => item\.name === currentType\)/)
  assert.match(dialog, /pathTypes:\s*\{\s*type:\s*Array/)
  assert.match(dialog, /this\.pathTypes\.find\(\(item\) => item\.name === this\.pathType\)/)
})

test('web custom page path uses WebCustomPagePicker', () => {
  const dialog = read('src/components/sp-path-selector/PickerDialog.vue')

  assert.match(dialog, /import WebCustomPagePicker/)
  assert.match(dialog, /const PICKER_ADAPTERS =/)
  assert.match(dialog, /custom_page:\s*\{[\s\S]*platforms:\s*\{[\s\S]*web:\s*\{[\s\S]*component:\s*WebCustomPagePicker/)
  assert.match(dialog, /resolvePickerAdapter\(tabValue, platform\)/)
  assert.match(dialog, /handlePickerClose\(row\)/)
})
