import { pickBy } from '@/utils'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'storeAlphabet',
  setting: [
    {
      label: '数据类型',
      key: 'dataType',
      component: 'select',
      options: [
        { label: '所有店铺', value: 'all' },
        { label: '指定店铺', value: 'specify' }
      ],
      value: 'all',
      onchange: function (e, vm) {
        vm.value.data = []
      }
    }
  ],
  transformIn: (v) => {
    const { name, base, data, track, tagsType, meber_tags, no_meber_tags } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
    return {
      name,
      ...transformedBase,
      data: data,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      }
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        // 使用公共函数处理 outerMargin 和 innerPadding 转换，同时保留其他字段
        const baseData = createTransformOutBase(
          [
            'dataType',
            'outerMargin',
            'innerPadding',
            'outerBackground',
            'innerBackground',
            'track'
          ],
          ['outerMargin', 'innerPadding']
        )(v)
        return baseData
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
