import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (filePath) => readFileSync(path.resolve(root, filePath), 'utf8')

test('web path selector is limited to web-supported link types', () => {
  const config = read('src/components/sp-path-selector/config.js')
  const menuForm = read('src/views/decoration/web-menu/components/MenuItemForm.vue')

  assert.match(
    config,
    /web:\s*\['goods',\s*'sale_category',\s*'category',\s*'custom_page',\s*'regactivity'\]/
  )
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

test('picker path distinguishes web vs mobile custom pages by platform', () => {
  const pickerPath = read('src/components/sp-picker/pickers/picker-path.vue')
  const pickerLink = read('src/view/decorate/comps/comp-pickerLink.vue')
  const imageBlock = read('src/components/sp-web-decoration/panels/ImageBlockPanel.vue')
  const hotspot = read('src/components/sp-web-decoration/panels/ImageHotspotEditorDialog.vue')
  const webCustomPage = read('src/components/sp-picker-plus/WebCustomPagePicker.vue')

  assert.match(pickerPath, /import WebCustomPagePicker/)
  assert.match(pickerPath, /isWebPlatform/)
  assert.match(pickerPath, /PATH_SELECTOR_PLATFORM_TYPES/)
  assert.match(pickerPath, /WebCustomPagePicker[\s\S]*isWebPlatform/)
  assert.match(pickerPath, /PickerPages[\s\S]*tabValue == 'custom_page'/)
  assert.match(pickerLink, /platform:\s*\{[\s\S]*default:\s*''/)
  assert.match(pickerLink, /platform:\s*this\.platform/)
  assert.match(imageBlock, /platform=["']web["']/)
  assert.match(hotspot, /platform=["']web["']/)
  assert.match(webCustomPage, /getVal\(\)\s*\{/)
  assert.match(webCustomPage, /page_name:\s*this\.selectedRow\.title/)
})
