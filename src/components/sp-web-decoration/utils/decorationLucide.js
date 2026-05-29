/**
 * 装修器：分区插入下拉等用到的 Lucide 组件解析（白名单见 @/components/sp-icon/lucide-registry）。
 */
import { LUCIDE_ICONS } from '@/components/sp-icon/lucide-registry'

const { Image, MapPin, LayoutGrid, PanelTop, Home, PanelBottom } = LUCIDE_ICONS

/** 插入「模版分区」下拉：按 section type 选图标 */
const SECTION_INSERT_ICON = {
  'main-carousel': Image,
  carousel: Image,
  'image-hotspot': MapPin,
  'product-shelf': LayoutGrid,
  'announcement-bar': PanelTop,
  header: Home,
  footer: PanelBottom
}

export function getSectionInsertIconComponent(sectionType) {
  return SECTION_INSERT_ICON[sectionType] || LayoutGrid
}

export default {
  getSectionInsertIconComponent
}
