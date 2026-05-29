const MENU_LABEL_MAP = {
  'main-menu': 'Company'
}

export function pickMenuValue(source) {
  if (!source || typeof source !== 'object') return source || null

  if (Object.prototype.hasOwnProperty.call(source, 'menu')) {
    return source.menu
  }

  return source.menu_id ?? source.menuId ?? null
}

export function normalizeSelectedMenu(menu) {
  if (!menu) return null

  if (typeof menu === 'object') {
    const id = menu.id ?? menu.menu_id ?? menu.menuId ?? ''
    const key = menu.key ?? ''
    const name = menu.name ?? menu.title ?? menu.label ?? ''

    if (id === '' && key === '' && name === '') return null

    return {
      ...menu,
      ...(id !== '' ? { id } : {}),
      ...(key !== '' ? { key } : {}),
      ...(name !== '' ? { name } : {})
    }
  }

  const key = String(menu).trim()
  if (!key) return null

  return {
    id: key,
    key,
    name: MENU_LABEL_MAP[key] || ''
  }
}
