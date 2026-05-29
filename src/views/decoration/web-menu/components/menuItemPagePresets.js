/**
 * 站内页面预设（link_type=url 时写入 link_value，与 ecshopx-web 路由对齐）
 * 可按项目实际路由增删
 */
/** labelKey：与 generate_i18n_key 一致，文案在 locales 中维护 */
export const MENU_ITEM_PAGE_PRESETS = [
  { labelKey: 'fc8ead3c.fa5612', value: '/collections/1' },
  { labelKey: 'fc8ead3c.c4186b', value: '/article/1' },
  { labelKey: 'fc8ead3c.c017be', value: '/cart' },
  { labelKey: 'fc8ead3c.12688a', value: '/account' }
]

export function defaultPresetPath() {
  return MENU_ITEM_PAGE_PRESETS[0]?.value ?? '/cart'
}
