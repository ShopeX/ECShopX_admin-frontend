/**
 * Lucide 图标白名单（与 SpIcon 共用）
 *
 * - 在此按需 import 并加入 LUCIDE_ICONS；勿 `import * from 'lucide-vue'`。
 * - bootstrap 调用 installLucideGlobal(Vue)，模板可直写 `<Home :size="18" />`。
 * - SpIcon：name 转 PascalCase 后先查 LUCIDE_ICONS，未命中再回退 @icon-park/vue。
 */
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CirclePlus,
  Diamond,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  GalleryVertical,
  Home,
  Image,
  LayoutGrid,
  LayoutTemplate,
  MapPin,
  Monitor,
  PanelBottom,
  PanelTop,
  Plus,
  RotateCcw,
  RotateCw,
  Smartphone,
  Tag,
  Trash2
} from 'lucide-vue'

export const LUCIDE_ICONS = {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CirclePlus,
  Diamond,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  GalleryVertical,
  Home,
  Image,
  LayoutGrid,
  LayoutTemplate,
  MapPin,
  Monitor,
  PanelBottom,
  PanelTop,
  Plus,
  RotateCcw,
  RotateCw,
  Smartphone,
  Tag,
  Trash2
}

/**
 * @param {import('vue').default} Vue
 */
export function installLucideGlobal(Vue) {
  Object.keys(LUCIDE_ICONS).forEach((name) => {
    Vue.component(name, LUCIDE_ICONS[name])
  })
}
