import { pickBy } from '@/utils'
import Attrdata from './attr_data.vue'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'classify',
  setting: [
    {
      label: '展示形式',
      key: 'animate',
      component: 'radiobutton',
      options: [
        { name: '横向排列', label: 'horizontal' },
        { name: '纵向排列', label: 'vertical' }
      ],
      value: 'vertical',
      module: ''
    },
    {
      label: '数据类型',
      key: 'dataType',
      component: 'select',
      options: [
        { label: '按管理分类', value: 'manage' },
        { label: '按销售分类', value: 'sales' }
      ],
      value: 'manage',
      onchange: function (v, self) {
        self.value.data = null
      }
    },
    {
      label: '数据设置',
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
