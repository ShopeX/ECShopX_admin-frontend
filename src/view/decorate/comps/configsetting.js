/**
 * 公共配置设置
 * 封装常用的组件配置，避免在每个组件中重复引用
 */
import CompStyle from './comp_style.vue'
import CrowdSelectV2 from '@/components/function/crowdSelectV2.vue'

// 导出转换工具函数，供其他挂件使用
export {
  transformInBase,
  transformOutBase,
  createTransformOutBase,
  convertRpxToPx,
  convertPxToRpx
} from './transform-utils'

/**
 * 处理配置对象，自动识别并转换 CompStyle 配置项
 * 自动为所有组件添加 outerMargin 等通用配置项
 * 自动识别包含 padding/margin 字段的配置项并转换为 CompStyle 组件
 */
function processConfig(config) {
  if (!config || !config.setting || !Array.isArray(config.setting)) {
    return config
  }

  // 检查 setting 中已有的 key
  const existingKeys = config.setting.map((item) => item.key).filter(Boolean)

  // 获取分组名称的函数
  const getGroup = () => {
    if (['contentPart', 'locationModule'].includes(config.name)) {
      return '导航栏样式'
    }
    return '组件样式'
  }

  // 创建 CompStyle 配置项的函数
  const createCompStyleItem = (
    key,
    label,
    defaultValue = { paddedt: 0, paddedb: 0, paddedl: 0, paddedr: 0 },
    group = null
  ) => ({
    group: group || getGroup(),
    label,
    key,
    component: function (h, { key }) {
      return (
        <CompStyle
          v-model={this.value[key]}
          uuid={this.value.uuid}
          showTop={true}
          showBottom={true}
          showLeft={true}
          showRight={true}
        />
      )
    },
    value: defaultValue
  })

  // 默认的通用配置项（所有组件都自动包含）- 组件上下左右边距默认 16
  const defaultCommonSettings = [
    createCompStyleItem('outerMargin', '边距', {
      paddedt: 16,
      paddedb: 16,
      paddedl: 16,
      paddedr: 16
    })
  ]

  // 针对特定挂件的额外配置项
  const widgetSpecificSettings = []
  if (
    [
      'speedkill',
      'group',
      'ranking',
      'hotranking',
      'goods',
      'shop',
      'couponCard',
      'classify',
      'storeAlphabet'
    ].includes(config.name)
  ) {
    // 商品挂件自动添加组件内样式
    widgetSpecificSettings.push({
      group: '组件内样式',
      label: '边距',
      key: 'innerPadding',
      component: function (h, { key }) {
        return (
          <CompStyle
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showTop={true}
            showBottom={true}
            showLeft={true}
            showRight={true}
          />
        )
      },
      value: {
        paddedt: 16,
        paddedb: 16,
        paddedl: 16,
        paddedr: 16
      }
    })
  }
  // 定位导航和内容部分自动添加组件样式
  if (['contentPart', 'locationModule'].includes(config.name)) {
    widgetSpecificSettings.push({
      group: '导航项区域设置',
      label: '边距',
      key: 'navitemarea',
      component: function (h, { key }) {
        return <CompStyle v-model={this.value[key]} uuid={this.value.uuid} />
      }
    })
  }

  // 处理现有的 setting，自动识别并转换 CompStyle 配置项
  const processedSetting = config.setting.map((item) => {
    // 自动判断是否需要使用 CompStyle：
    // 1. 如果 component 已经是 'compStyle'
    // 2. 如果 value 是一个包含 padding/margin 字段的对象（且没有指定其他 component）
    const hasCompStyleComponent = item.component === 'compStyle'
    const hasOtherComponent =
      item.component && item.component !== 'compStyle' && typeof item.component !== 'function'

    // 如果需要使用 CompStyle，且没有其他自定义组件，则自动转换
    const shouldUseCompStyle = hasCompStyleComponent && !hasOtherComponent

    if (shouldUseCompStyle) {
      const { component, ...rest } = item
      let group = rest.group || '组件样式'
      return {
        ...rest,
        group: group, // 如果没有 group，则设置为"组件样式"
        component: function (h, { key }) {
          return <CompStyle v-model={this.value[key]} uuid={this.value.uuid} />
        },
        value: item.value || {
          paddedt: 0,
          paddedb: 0,
          paddedl: 0,
          paddedr: 0
        }
      }
    }
    return item
  })

  // 自动添加缺失的通用配置项
  defaultCommonSettings.forEach((defaultItem) => {
    if (!existingKeys.includes(defaultItem.key)) {
      processedSetting.unshift(defaultItem)
    }
  })
  if (!existingKeys.includes('tags')) {
    processedSetting.unshift({
      label: '人群设置',
      key: 'tags',
      group: '基础设置',
      component: function (h, { key }) {
        return <CrowdSelectV2 v-model={this.value[key]} />
      },
      value: {
        type: '2',
        meber_tags: [],
        no_meber_tags: []
      }
    })
  }
  if (!existingKeys.includes('track')) {
    processedSetting.unshift({
      label: '埋点参数',
      key: 'track',
      group: '基础设置',
      component: 'input',
      value: ''
    })
  }

  // 自动添加挂件特定的配置项
  widgetSpecificSettings.forEach((specificItem) => {
    if (!existingKeys.includes(specificItem.key)) {
      processedSetting.push(specificItem)
    }
  })

  return {
    ...config,
    setting: processedSetting
  }
}

// 将处理函数挂载到全局，让所有 config.js 文件可以直接使用
if (typeof globalThis !== 'undefined') {
  globalThis.__processConfig__ = processConfig
}

export default processConfig
