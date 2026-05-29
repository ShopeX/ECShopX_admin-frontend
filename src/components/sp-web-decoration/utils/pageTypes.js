const RUNTIME_PAGE_TYPE_MAP = {
  index: 'home',
  home: 'home',
  list: 'list',
  custom: 'custom',
  product_list: 'product_list'
}

const PREVIEW_ROUTE_MAP = {
  home: () => '/',
  list: () => '/collections/all',
  custom: ({ pageId }) => `/custom/${encodeURIComponent(String(pageId || ''))}`,
  product_list: () => '/collections/all'
}

export function normalizeDecorationPageType(pageType = 'home') {
  const key = String(pageType || 'home')
  return RUNTIME_PAGE_TYPE_MAP[key] || key
}

export function resolveDecorationPreviewPath(pageType, pageId) {
  const normalizedPageType = normalizeDecorationPageType(pageType)
  const createPath = PREVIEW_ROUTE_MAP[normalizedPageType]
  return createPath ? createPath({ pageId }) : '/'
}
