import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import Attrdata from './attr_data.vue'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'classify',
  setting: [
    {
      label: i18n.t('d1229860.1e409f'),
      key: 'animate',
      component: 'radiobutton',
      options: [
        { name: i18n.t('d1229860.4f9974'), label: 'horizontal' },
        { name: i18n.t('d1229860.6875b7'), label: 'vertical' }
      ],
      value: 'vertical',
      module: ''
    },
    {
      label: i18n.t('d1229860.185f7b'),
      key: 'dataType',
      component: 'select',
      options: [
        { label: i18n.t('d1229860.64423b'), value: 'manage' },
        { label: i18n.t('d1229860.2fcd53'), value: 'sales' }
      ],
      value: 'manage',
      onchange: function (v, self) {
        self.value.data = null
      }
    },
    {
      label: i18n.t('d1229860.e7af71'),
      key: 'data',
      component: function (h, { key }) {
        return <Attrdata v-model={this.value[key]} dataType={this.value.dataType} />
      },
      value: {
        type: 'select',
        category: {
          category_id: ''
        },
        data: []
      }
    }
  ],
  transformIn: (v) => {
    const { base, ...rest } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
    return {
      id: v?.id,
      name: v.name,
      ...transformedBase,
      data: v.data,
      track: v.track,
      tags: {
        type: v.tagsType || '2',
        meber_tags: v.meber_tags || [],
        no_meber_tags: v.no_meber_tags || []
      }
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: (v) => {
        // 使用公共函数处理 base 中的样式数据转换
        const baseData = createTransformOutBase(
          ['outerMargin', 'innerPadding', 'outerBackground', 'innerBackground'],
          ['outerMargin', 'innerPadding']
        )(v)

        // 添加其他字段
        const otherBaseData = pickBy(v, {
          animate: 'animate',
          dataType: 'dataType'
        })
        return {
          ...baseData,
          ...otherBaseData
        }
      },
      data: 'data',
      track: 'track',
      tags: 'tags',
      tagsType: 'tags.type',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags'
    })
  }
}

// 自动处理 compStyle 配置（初始化全局处理函数）
import '../../comps/configsetting'
export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
