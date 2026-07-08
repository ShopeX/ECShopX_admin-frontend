import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (filePath) => readFileSync(path.resolve(root, filePath), 'utf8')

function loadDecorationMessenger() {
  const pageTypesSource = read('src/components/sp-web-decoration/utils/pageTypes.js').replace(
    /export\s+/g,
    ''
  )
  const postMessageSource = read('src/components/sp-web-decoration/utils/postMessage.js')
    .replace(/import\s+\{[^}]+\}\s+from\s+'\.\/pageTypes'\n/, '')
    .replace(/export\s+default\s+\{[\s\S]*$/, '')
    .replace(/export\s+/g, '')

  return new Function(
    `${pageTypesSource}\n${postMessageSource}\nreturn { createDecorationMessenger }`
  )()
}

function setupWindow(lang) {
  globalThis.window = {
    location: { href: 'https://admin.example.test/admin/decoration' },
    localStorage: {
      getItem(key) {
        return key === 'lang' ? lang : null
      }
    },
    addEventListener() {},
    removeEventListener() {}
  }
}

test.afterEach(() => {
  delete globalThis.window
})

function previewUrlFor(lang, options = {}) {
  setupWindow(lang)
  const { createDecorationMessenger } = loadDecorationMessenger()
  const messenger = createDecorationMessenger('https://shop.example.test/store?foo=bar')
  return new URL(
    messenger.getPreviewUrl({
      pageType: 'home',
      templateId: undefined,
      ...options
    })
  )
}

test('preview url uses /en prefix for English admin locale', () => {
  const url = previewUrlFor('en')

  assert.equal(url.pathname, '/en')
})

test('preview url uses /ar prefix for Arabic admin locale', () => {
  const url = previewUrlFor('ar')

  assert.equal(url.pathname, '/ar')
})

test('preview url keeps root path for zhcn admin locale', () => {
  const url = previewUrlFor('zhcn')

  assert.equal(url.pathname, '/')
})

test('preview url preserves locale prefix for custom page', () => {
  const url = previewUrlFor('en', { pageType: 'custom', templateId: 'abc' })

  assert.equal(url.pathname, '/en/custom/abc')
})

test('preview url preserves query params', () => {
  const url = previewUrlFor('en', { pageType: 'product_list' })

  assert.equal(url.pathname, '/en/collections/all')
  assert.equal(url.searchParams.get('foo'), 'bar')
  assert.equal(url.searchParams.get('designMode'), '1')
  assert.equal(url.searchParams.get('pageType'), 'product_list')
  assert.equal(url.searchParams.get('pageId'), 'product_list')
})

test('locale path does not change postMessage payloads or target origin', () => {
  setupWindow('en')
  const { createDecorationMessenger } = loadDecorationMessenger()
  const messenger = createDecorationMessenger('https://shop.example.test/base')
  const calls = []
  const iframeWindow = {
    postMessage(message, targetOrigin) {
      calls.push({ message, targetOrigin })
    }
  }
  const initPayload = { sections: [{ id: 'hero' }] }
  const updatePayload = { selected: { sectionId: 'hero' } }

  messenger.sendInit(iframeWindow, initPayload)
  messenger.sendUpdate(iframeWindow, updatePayload)

  assert.deepEqual(calls, [
    {
      message: { type: 'DECORATION_INIT', payload: initPayload },
      targetOrigin: 'https://shop.example.test'
    },
    {
      message: { type: 'DECORATION_UPDATE', payload: updatePayload },
      targetOrigin: 'https://shop.example.test'
    }
  ])
})
