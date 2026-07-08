import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const ROOT = process.cwd()

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function loadApiPersistence({ getDecorationContent, saveTemplateContent, saveHeaderOrFooter }) {
  const filename = path.resolve(ROOT, 'src/components/sp-web-decoration/adapters/apiPersistence.js')
  let source = readFileSync(filename, 'utf8')
  source = source
    .replace(/import[\s\S]*?from '\.\.\/definitions\/documents\/global\.js'\n/, '')
    .replace(/export default[\s\S]*$/, '')
    .replace(/\bexport\s+(async function|function|const)\s+/g, '$1 ')

  const exports = {}
  source += `
exports.DSL_ROW_TYPE = DSL_ROW_TYPE;
exports.DEFAULT_COUNTRY_CODE = typeof DEFAULT_COUNTRY_CODE === 'undefined' ? undefined : DEFAULT_COUNTRY_CODE;
exports.buildPageContentPayload = typeof buildPageContentPayload === 'undefined' ? undefined : buildPageContentPayload;
exports.parsePageDslRows = typeof parsePageDslRows === 'undefined' ? undefined : parsePageDslRows;
exports.getCurrentCountryCode = typeof getCurrentCountryCode === 'undefined' ? undefined : getCurrentCountryCode;
exports.savePageDslToApi = savePageDslToApi;
exports.saveHeaderDslToApi = saveHeaderDslToApi;
exports.saveFooterDslToApi = saveFooterDslToApi;
`

  const context = {
    exports,
    console,
    window: {
      localStorage: {
        getItem: (key) => (key === 'lang' ? 'en' : null)
      }
    },
    getDecorationContent,
    saveTemplateContent,
    saveHeaderOrFooter,
    createHomeDsl: ({ pageId = '', scene = '1001' } = {}) => ({
      pageType: 'home',
      pageId,
      scene,
      sections: {},
      order: []
    }),
    createCustomDsl: ({ pageId = '', scene = '1001' } = {}) => ({
      pageType: 'custom',
      pageId,
      scene,
      sections: {},
      order: []
    }),
    createProductListDsl: ({ pageId = '', scene = '1001' } = {}) => ({
      pageType: 'product_list',
      pageId,
      scene,
      sections: {},
      order: []
    }),
    createGlobalDsl: () => ({ pageType: 'global', pageId: 'global', sections: {}, order: [] }),
    createHeaderDsl: () => ({ pageType: 'header', pageId: 'header', sections: {}, order: [] }),
    createFooterDsl: () => ({ pageType: 'footer', pageId: 'footer', sections: {}, order: [] }),
    createGlobalSections: () => ({}),
    ensureGlobalDslDefaults: (dsl) => dsl,
    splitGlobalDsl: (dsl) => ({ headerDsl: dsl, footerDsl: dsl }),
    serializeDsl: cloneValue,
    deserializeDsl: cloneValue
  }
  vm.createContext(context)
  vm.runInContext(source, context, { filename })
  return exports
}

function loadRequestClient() {
  const filename = path.resolve(ROOT, 'src/api/request/request.js')
  let source = readFileSync(filename, 'utf8')
  source = source
    .replace(/import axios from 'axios'\n/, '')
    .replace(/import \{ merge, bindMethods \} from '@\/utils'\n/, '')
    .replace(/import \{ InterceptorManager \} from '\.\/interceptor'\n/, '')
    .replace(/export \{ RequestClient \ }/, 'exports.RequestClient = RequestClient')
    .replace(/export \{ RequestClient \}/, 'exports.RequestClient = RequestClient')

  const exports = {}
  let lastRequest = null
  const context = {
    exports,
    window: {
      localStorage: {
        getItem: (key) => (key === 'lang' ? 'en' : null)
      }
    },
    axios: {
      create: () => ({
        request: async (config) => {
          lastRequest = config
          return { data: {}, config }
        }
      })
    },
    InterceptorManager: class {
      constructor(instance) {
        this.instance = instance
      }
      addRequestInterceptor() {}
      addResponseInterceptor() {}
    }
  }
  vm.createContext(context)
  vm.runInContext(source, context, { filename })
  return {
    RequestClient: exports.RequestClient,
    getLastRequest: () => lastRequest
  }
}

const sampleDsl = {
  pageType: 'home',
  pageId: '140',
  sections: {
    hero: {
      id: 'hero',
      type: 'main-carousel',
      settings: {},
      blocks: {},
      blockOrder: []
    }
  },
  order: ['hero']
}

{
  const api = loadApiPersistence({
    getDecorationContent: async () => [],
    saveTemplateContent: async () => {},
    saveHeaderOrFooter: async () => {}
  })

  assert.equal(typeof api.buildPageContentPayload, 'function')
  const payload = api.buildPageContentPayload({
    normalizedDsl: sampleDsl,
    contentRowId: 7084
  })
  assert.equal(payload.id, 7084)
  assert.equal(payload.type, api.DSL_ROW_TYPE)
  assert.equal(payload.pageType, 'home')
  assert.equal(payload.pageId, '140')
  assert.deepEqual(payload.order, ['hero'])
  assert.ok(payload.sections.hero)
  assert.equal(Object.hasOwn(payload, 'dsl'), false)
}

{
  const api = loadApiPersistence({
    getDecorationContent: async () => [],
    saveTemplateContent: async () => {},
    saveHeaderOrFooter: async () => {}
  })

  assert.equal(typeof api.parsePageDslRows, 'function')
  const result = api.parsePageDslRows(
    [
      {
        id: 7084,
        config: JSON.stringify([
          {
            type: api.DSL_ROW_TYPE,
            ...sampleDsl
          }
        ])
      }
    ],
    140,
    '1001',
    'home'
  )
  assert.equal(result.contentRowId, 7084)
  assert.equal(result.dsl.pageType, 'home')
  assert.equal(result.dsl.pageId, '140')
  assert.deepEqual(result.dsl.order, ['hero'])
}

{
  const saves = []
  let defaultLoads = 0
  const api = loadApiPersistence({
    getDecorationContent: async (params) => {
      if (params.country_code === 'zh-CN') {
        defaultLoads += 1
        return defaultLoads === 1
          ? []
          : [
              {
                id: 9001,
                config: JSON.stringify([{ type: api.DSL_ROW_TYPE, ...sampleDsl }])
              }
            ]
      }
      return [
        {
          id: 9001,
          config: JSON.stringify([{ type: api.DSL_ROW_TYPE, ...sampleDsl }])
        }
      ]
    },
    saveTemplateContent: async (body) => {
      saves.push(body)
    },
    saveHeaderOrFooter: async () => {}
  })

  const result = await api.savePageDslToApi({
    templateId: 140,
    contentRowId: 0,
    dsl: sampleDsl,
    scene: '1001',
    pageType: 'home'
  })

  assert.equal(saves.length, 2)
  assert.equal(saves[0].country_code, 'zh-CN')
  const defaultConfig = JSON.parse(saves[0].config)
  assert.equal(defaultConfig[0].pageType, 'home')
  assert.equal(Object.hasOwn(defaultConfig[0], 'dsl'), false)
  const currentConfig = JSON.parse(saves[1].config)
  assert.equal(currentConfig[0].id, 9001)
  assert.equal(currentConfig[0].pageType, 'home')
  assert.equal(result.contentRowId, 9001)
}

{
  const saves = []
  const api = loadApiPersistence({
    getDecorationContent: async (params) => {
      if (params.country_code === 'zh-CN') {
        return { id: 1, config: JSON.stringify({ pageType: params.page_name }) }
      }
      return null
    },
    saveTemplateContent: async () => {},
    saveHeaderOrFooter: async (body) => {
      saves.push(body)
    }
  })

  await api.saveHeaderDslToApi({
    dsl: { pageType: 'header', pageId: 'header', sections: {}, order: [] }
  })
  assert.equal(saves.length, 1)
  assert.equal(saves[0].page_name, 'header')
  assert.equal(saves[0].country_code, undefined)
  assert.equal(Array.isArray(JSON.parse(saves[0].config)), false)
}

{
  const { RequestClient, getLastRequest } = loadRequestClient()
  const client = new RequestClient()
  await client.post('/example', { country_code: 'zh-CN', name: 'x' })
  assert.equal(getLastRequest().data.country_code, 'zh-CN')

  await client.post('/example', 'name=x&country_code=zh-CN')
  assert.equal(getLastRequest().data, 'name=x&country_code=zh-CN')

  await client.post('/example', { name: 'x' }, { skipCountryCode: true })
  assert.equal(getLastRequest().data.country_code, undefined)
}

console.log('Template i18n save payload checks passed')
