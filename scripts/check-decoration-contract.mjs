import assert from 'node:assert/strict'
import { copyFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const tempDir = path.join(tmpdir(), 'ecx-decoration-contract')
const tempSchemaPath = path.join(tempDir, `schema-${process.pid}.mjs`)
mkdirSync(tempDir, { recursive: true })
copyFileSync(
  path.resolve(ROOT, 'src/components/sp-web-decoration/definitions/schema.js'),
  tempSchemaPath
)
const schemaUrl = pathToFileURL(tempSchemaPath).href

const {
  blockFields,
  blockTypeAliases,
  sectionFields,
  sectionTypeAliases,
  toDefaultSettings
} = await import(schemaUrl)
rmSync(tempSchemaPath, { force: true })

const EXPECTED_SECTIONS = [
  'header',
  'footer',
  'announcement-bar',
  'main-carousel',
  'image-hotspot',
  'product-shelf',
  'product-tab-shelf',
  'native-product-list'
]

const EXPECTED_BLOCKS = [
  'announcement',
  'header_product_list',
  'header_collection_product_list',
  'mega_menu',
  'image',
  'video',
  'hotspot',
  'product-tab',
  'footer-link',
  'footer-menu',
  'footer-image',
  'footer-text'
]

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key)
}

function assertFields(groupName, schemas, expectedTypes) {
  assert.deepEqual(
    Object.keys(schemas).sort(),
    expectedTypes.slice().sort(),
    `${groupName} schema type list drifted`
  )

  expectedTypes.forEach((type) => {
    const fields = schemas[type]
    assert.ok(fields && typeof fields === 'object', `${groupName} ${type} missing fields`)
    Object.entries(fields).forEach(([name, spec]) => {
      assert.ok(spec && typeof spec === 'object', `${groupName} ${type}.${name} missing spec`)
      assert.ok(typeof spec.type === 'string', `${groupName} ${type}.${name} missing type`)
      assert.ok(hasOwn(spec, 'default'), `${groupName} ${type}.${name} missing default`)
      if (spec.type === 'enum') {
        assert.ok(Array.isArray(spec.values), `${groupName} ${type}.${name} enum missing values`)
        assert.ok(
          spec.values.includes(spec.default),
          `${groupName} ${type}.${name} default is not in enum values`
        )
      }
      ;(spec.aliases || []).forEach((alias) => {
        assert.notEqual(alias, name, `${groupName} ${type}.${name} has self alias`)
        assert.ok(
          !hasOwn(fields, alias),
          `${groupName} ${type}.${name} alias ${alias} is also a canonical field`
        )
      })
    })
  })
}

function assertNoAliasDefaults(groupName, schemas) {
  Object.entries(schemas).forEach(([type, fields]) => {
    const defaults = toDefaultSettings(fields)
    Object.entries(fields).forEach(([name, spec]) => {
      assert.ok(hasOwn(defaults, name), `${groupName} ${type}.${name} missing default output`)
      ;(spec.aliases || []).forEach((alias) => {
        assert.ok(
          !hasOwn(defaults, alias),
          `${groupName} ${type} defaultSettings contains alias ${alias}`
        )
      })
    })
  })
}

assertFields('section', sectionFields, EXPECTED_SECTIONS)
assertFields('block', blockFields, EXPECTED_BLOCKS)
assertNoAliasDefaults('section', sectionFields)
assertNoAliasDefaults('block', blockFields)

assert.deepEqual(sectionTypeAliases, { carousel: 'main-carousel' })
assert.deepEqual(blockTypeAliases, {})
assert.deepEqual(sectionFields['product-shelf'].displayMode.aliases, ['sourceMode'])
assert.deepEqual(blockFields.image.pc_image.aliases, ['imageUrl'])
assert.deepEqual(blockFields.image.mobile_image.aliases, ['imageUrl'])
assert.ok(blockFields['footer-menu'].menu)
assert.ok(blockFields['footer-menu'].menu_items)
assert.equal(blockFields['footer-menu'].menu.aliases, undefined)
assert.ok(!blockFields['footer-link'].url.aliases?.includes('link'))

console.log('Decoration contract checks passed')
