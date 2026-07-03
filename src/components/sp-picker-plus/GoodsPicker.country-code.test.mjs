import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./GoodsPicker.vue', import.meta.url), 'utf8')

test('GoodsPicker sends current country_code when searching goods', () => {
  assert.match(source, /import\s+\{\s*getCurrentCountryCode\s*\}\s+from\s+['"]@\/i18n['"]/)
  assert.match(source, /country_code:\s*getCurrentCountryCode\(\)/)
})
